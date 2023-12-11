<!-- OrgChart.vue -->

<template>
  <div id="app">
    <LoadingSpinner
      v-if="loadingSpinner"  
    />
    <LoadingBar
      v-if="loading"
      :total="totalPromise"
      :complete="finishedPromise"
    />
    <div v-if="errored">
      We're sorry, we're not able to retrieve this information at the moment.
    </div>
    <div v-else>
      <div class="title-bar">
        <SearchBar
          class="stack-top"
          :employee-list="Array.from(employeeMap.values())"
          :chart="chart"
          :set-selected-employee="setSelectedEmployee"
          :details-popup="detailsPopup"
        />
        <h1 v-if="filter">
          {{ filter }} Chart
        </h1>
        <h1 v-else>
          Org Chart
        </h1>
      </div>
      <Sidebar
        :chart="chart"
        :current-active-emp="currentActiveEmp"
        :reset-view="resetView"
        :del-trigger="delTrigger"
        :edit-add-trigger="editAddTrigger"
        :editing="editing"
        :editing-trigger="editingTrigger"
        :add-dep-trigger="addDepTrigger"
        :details-popup="detailsPopup"
        :locations="locations"
        :departments="departments"
        :token="token"
      />
      <div
        id="container"
        class="chart-container"
      >
        <PopupWindow
          v-if="detailTriggers.status"
          class="stack-top"
          :employee="currentActiveEmp"
          :manager="currentActiveEmpManager"
          :details-popup="detailsPopup"
          :edit-add-trigger="editAddTrigger"
          :editing-trigger="editingTrigger"
          :token="token"
        />
        <EditorAdder
          v-if="editAddWindowTriggers.status"
          class="stack-top"
          :post-change-employee="postChangeEmployee"
          :chart="chart"
          :current-active-emp="currentActiveEmp"
          :edit-add-trigger="editAddTrigger"
          :set-current-active-employee="setCurrentActiveEmployee"
          :details-popup="detailsPopup"
          :editing-trigger="editingTrigger"
          :editing="editing"
          :employee-map="employeeMap"
          :return-all-children="returnAllChildren"
          :control-error="controlError"
          :set-loading-spinner="setLoadingSpinner"
          :update-chart="updateChart"
        />
        <AddDepartment
          v-if="addDepWindowTriggers.status"
          class="stack-top"
          :data="Array.from(employeeMap.values())"
          :chart="chart"
          :details-popup="detailsPopup"
          :current-active-emp="currentActiveEmp"
          :add-dep-triggers="addDepTrigger"
          :departments="departments"
          :post-change-employee="postChangeEmployee"
          :employee-map="employeeMap"
          :set-current-active-employee="setCurrentActiveEmployee"
          :control-error="controlError"
          :set-loading-spinner="setLoadingSpinner"
        />
        <DeleteEmployee
          v-if="delWindowTriggers.status"
          class="stack-top"
          :data="Array.from(employeeMap.values())"
          :del-trigger="delTrigger"
          :current-active-emp="currentActiveEmp"
          :set-loading-spinner="setLoadingSpinner"
        />
        <ErrorPopup
          v-if="errorPopup"
          :message="errorMessage"
        />
        <div class="credentials">
          <p v-if="userName">
            Signed in: {{ userName }}
          </p>
          <p v-if="version">
            {{ version }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { OrgChart } from 'd3-org-chart'
import { ref } from 'vue'
import constants from '../constants'
import SearchBar from '../components/SearchBar.vue'
import PopupWindow from '../components/PopupWindow.vue'
import DeleteEmployee from '../components/DeleteEmployee.vue'
import Sidebar from '../components/Sidebar.vue'
import EditorAdder from '../components/EditorAdder.vue'
import AddDepartment from '../components/AddDepartment.vue'
import LoadingBar from '../components/LoadingBar.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorPopup from '../components/ErrorPopup.vue'
import { NODE_TYPE_EMPLOYEE, NODE_TYPE_DEPARTMENT, NODE_TYPE_WAREHOUSE, NODE_TYPE_MASTER } from '../constants'
import defaultImage from '../../assets/0.jpeg'
import defaultLogo from '../../assets/logo.png'
import database from '../../database.json'
import configuration from '../../configuration.json'

const detailTriggers = ref({ status: false })
const delWindowTriggers = ref({ status: false })
const editAddWindowTriggers = ref({ status: false })
const addDepWindowTriggers = ref({ status: false })
const editing = ref({ status: false })

const setTrigger = (triggerObj, val) => {
  setTimeout(()=> { //this is to allow the popups to re-generate
    if (val === 'close') {
      triggerObj.value.status = false
    } else if (val === 'open') {
      if (detailTriggers.value !== triggerObj.value) {
        delWindowTriggers.value.status = false
        editAddWindowTriggers.value.status = false
        addDepWindowTriggers.value.status = false
      }
      triggerObj.value.status = true
    }
  }, 1)
}

const detailsPopup = (val) => setTrigger(detailTriggers, val)
const delTrigger = (val) => setTrigger(delWindowTriggers, val)
const editAddTrigger = (val) => setTrigger(editAddWindowTriggers, val)
const addDepTrigger = (val) => setTrigger(addDepWindowTriggers, val)
const editingTrigger = (val) => setTrigger(editing, val)

export default {
  name: 'OrgChart',
  components: {
    SearchBar,
    PopupWindow,
    DeleteEmployee,
    Sidebar,
    EditorAdder,
    AddDepartment,
    LoadingBar,
    ErrorPopup,
    LoadingSpinner,
  },
  setup() {
    return {
      detailsPopup,
      delTrigger,
      editAddTrigger,
      addDepTrigger,
      editingTrigger,
      detailTriggers,
      delWindowTriggers,
      editAddWindowTriggers,
      addDepWindowTriggers,
      editing,
      setTrigger,
    }
  },
  data() {
    return {
      employeeMap: new Map(), // key: id, value: employee object
      chart: new Object(),
      pastCurrentActiveEmp: new Object(),
      currentActiveEmp: new Object(),
      currentActiveEmpManager: new Object(),
      manager: new Object(),
      errored: false,
      imageUrl: '',
      loading: true,
      loadingSpinner: false,
      filter: null,
      locations: [],
      departments: [],
      databaseRecords: [],
      errorPopup: false,
      errorMessage: '',

      totalPromise: 0,
      finishedPromise: 0,

      version: null,

      token: localStorage.getItem('token'),
      userName: localStorage.getItem('userName'),
    }
  },
  async created() {
    const filter = decodeURIComponent(this.$route.params.filter).replace(/\b\w/g, match => match.toUpperCase())
    this.version = await this.getVersion()

    if (filter === 'Undefined' || filter === ':Filter') {
      this.filter = null
      await this.$router.push('/:filter')
    } else {
      this.filter = filter
    }
  },
  async mounted() {
    console.log("locations", database.location)
    //Set all locations array
    for (const key in database.location) {
      this.locations.push(database.location[key].name)
    }

    //Set department array
    for (const key in database.department) {
      this.departments.push(database.department[key].name)
    }

    //setup employeeMap
    for (const key in database.employee) {
      const employee = database.employee[key]

      employee.imageUrl = employee.imageUrl ? employee.imageUrl : defaultImage
      employee.id = key

      if (employee.parentId === 0) {
        employee.key = ''
      }

      this.employeeMap.set(employee.id, employee)
    }

    try {
      this.databaseRecords = database
      console.log("Database Uploaded.", this.databaseRecords)
      const employees = this.databaseRecords.employee
      console.log("Employees Uploaded.", employees)

      this.chart = new OrgChart()
        .svgHeight(window.innerHeight)
        .svgWidth(window.innerWidth)
        .container('.chart-container')
        .data(Array.from(this.employeeMap.values()))
        /* eslint-disable no-unused-vars */
        .initialZoom(constants.INITIAL_ZOOM)
        .onNodeClick((d) => {
          detailsPopup('close')
          if (this.employeeMap.get(d).nodeType === NODE_TYPE_EMPLOYEE) {
            detailsPopup('open')
          }
          this.setSelectedEmployee(this.employeeMap.get(d))
          })
        .nodeHeight(_d => constants.NODE_HEIGHT)
        .nodeWidth(_d => constants.NODE_WIDTH)
        .childrenMargin(_d => constants.CHILDREN_MARGIN)
        .compactMarginPair(_d => constants.COMPACT_MARGIN)  // x-distance between nodes
        .nodeContent((d) => {
          const employee = this.employeeMap.get(d.data.id)
          if (employee.nodeType === NODE_TYPE_DEPARTMENT || employee.nodeType === NODE_TYPE_WAREHOUSE || employee.nodeType === NODE_TYPE_MASTER) {
            return `
              <div class="node-container">
                <div class=image-container>
                  <img class="image" src="${defaultLogo}">
                </div>
                <div class=content-container>
                  <div class="node-name">${employee.name}</div>
                </div>
              <style>

              .content-container {
                width: 51%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-left: 0.2rem;
              }

              .image-container {
                height: 100%;
                width: 44%;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .node-container {
                height: 112px;
                width: 100%;
                background-color: #227c9d;
                color: #227c9d;
                display: flex;
                border-radius: 1rem;
                border: 2px solid white;
              }

              .image {
                width: ${constants.IMAGE_WIDTH}px;
                height: ${constants.IMAGE_HEIGHT}px;
                object-fit: cover;
                border-radius: 50%;
                border: 4px solid white;
                background-color: #808080;
              }

              .node-name {
                color: white;
                font-size: 110%;
                font-weight: bold;
                max-height: 2.8rem;
                width: 100%;
                overflow: hidden;
              }
              </style>
              `
          }
        return `
          <div class="node-container">
            <div class=image-container>
              <img class="image" src="${employee.imageUrl}">
            </div>
            <div class=content-container>
              <div class="node-name">${employee.firstName} ${employee.lastName}</div>
              <div class="position">${employee.position}</div>
              ${employee.department ? `<div class="department">${employee.department}</div>` : ''}
            </div>
          <style>

          .content-container {
            width: 51%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-left: 0.2rem;
          }

          .position {
            margin-top: 0.3rem;
            margin-bottom: 0.1rem;
            max-height: 2rem;
            width: 100%;
            padding-bottom: 0.3rem;
            font-size: 0.7rem;
            color: white;
            overflow: hidden;
          }

          .department {
            max-height: 13%;
            padding-inline: 0.7rem;
            max-width: calc(100% - 0.7rem);
            background-color: #ffcb77;
            color: #227c9d;
            border-radius:1rem;
            text-align: center;
            font-size: 70%;
            font-weight: bold;
            overflow: hidden;
          }

          .image-container {
            height: 100%;
            width: 44%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .node-container {
            height: 112px;
            width: 100%;
            background-color: #227c9d;
            color: #227c9d;
            display: flex;
            border-radius: 1rem;
            border: 2px solid white;
          }

          .image {
            width: ${constants.IMAGE_WIDTH}px;
            height: ${constants.IMAGE_HEIGHT}px;
            object-fit: cover;
            border-radius: 50%;
            border: 4px solid white;
            background-color: #808080;
          }

          .node-name {
            color: white;
            font-size: 110%;
            font-weight: bold;
            max-height: 2.8rem;
            width: 100%;
            overflow: hidden;
          }
          </style>
        `
        })
        this.chart.render()
        console.log("OrgChart Uploaded.")

        window.addEventListener('resize', () => {
          this.chart
            .svgHeight(window.innerHeight)
            .svgWidth(window.innerWidth)
            .render()
        })
    } catch (err) {
      console.error('Error when rendering: ', err)
      if (err instanceof TypeError) {
        this.errorMessage = `Error: There is no data to display. Add a '${this.filter}' node to the organization.`
      } else {
        this.errorMessage = err
      }
      this.errorPopup = true
    }
    const empId = Number(localStorage.getItem('moveEmp'))

    if (empId) {
      this.chart.setCentered(empId).setHighlighted(empId).render()
      localStorage.removeItem('moveEmp')
    }
    this.loading = false
  },
  methods: {
    updateChart() {
      this.chart.update(Array.from(this.employeeMap.values()))
    },
    setLoadingSpinner (val) {
      this.loadingSpinner = val
    },
    async getVersion() {
      const result = await axios.get('/api/version')
      return result.data
    },
    controlError(val, msg) {
      this.errorPopup = val
      this.errorMessage = msg
    },
    returnAllChildren(idSet, queue) {
      const nodesByParent = {}
      this.databaseRecords.data.forEach(node => {
        if (nodesByParent[node.parent_rid]) {
          nodesByParent[node.parent_rid].push(node)
        } else {
          nodesByParent[node.parent_rid] = [node]
        }
      })

      const newTree = []

      while (queue.length > 0) {
        const currentNode = queue.shift()
        if (!idSet.has(currentNode.id)) {
          newTree.push(currentNode)
          idSet.add(currentNode.id)
          const children = nodesByParent[currentNode.id] ?? []
          queue.push(...children)
        }
      }

      return newTree
    },
    setCurrentActiveEmployee(employee) {
      this.currentActiveEmp = employee
    },
    setSelectedEmployee(employee) {
      try {
        this.currentActiveEmp = employee
        if (employee.nodeType === NODE_TYPE_DEPARTMENT) {
          detailsPopup('close')
        }
        if (employee.parentId) {
          this.currentActiveEmpManager = this.employeeMap.get(employee.parentId)
        } else {
          this.currentActiveEmpManager = ''
        }
        this.chart.setCentered(employee.id).render()
        if (this.pastCurrentActiveEmp.id){
          this.chart.clearHighlighting(this.pastCurrentActiveEmp.id)
        }
        this.chart.setHighlighted(employee.id).render()
        this.pastCurrentActiveEmp = this.currentActiveEmp
      } catch (err) {
        console.error("Error in setSelectedEmployee: ", err)
      }
    },
    resetView(id) {
      this.chart.fit().render()
    },
    postChangeEmployee(emp) {
      try {
          this.chart.addNode(emp)
          this.setSelectedEmployee(emp)
      } catch {
        console.error("Error in postChangeEmployee")
      }
    },
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  background-color: transparent;
}

#app {
  height: 100vh;
  width: 100vw;
}

.credentials { 
  position: absolute;  
  right: 10px; 
  bottom: 10px; 
  color: white;
}

.chart-container {
  top: 62px;
  height: calc(100vh - 62px);
  width: 100%;
  background-color: gray;
  position: relative;
}

.stack-top {
  position: absolute;
}

.select-btn {
  height: 60px;
  width: 60px;
  background-size: 80%;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
  display: block;
  margin-inline: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  background-color: white;
  background-position: center;
  background-repeat: no-repeat;
}

.collapse {
  background-size: 88%;
}

.center {
  background-size: 88%;
}

.title-bar {
  position: absolute;
  width: 100vw;
  height: 62px;
  align-items: center;
  color: white;
  background-color: #1e293b;
  font-weight: bold;
  font-size: 1.9rem;
  padding-top: 0.9rem;
}

.title-bar h1 {
  font-size: 1em;
}

</style>