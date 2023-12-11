<template>
  <div id="add-dep">
    <button
      class="close btn"
      @click="addDepTriggers('close')"
    >
      <span class="material-icons">close</span>
    </button>
    <h1>Add Department</h1>
    <div>
      <div class="add-card-item">
        <h2 style="font-size: 1.4rem;">
          Select Node
          <span
            v-if="inactiveManagerError"
            class="error-text"
          >*Must Change </span>
          <span
            v-if="noManagerError && !currentActiveEmp.nodeType"
            class="error-text"
          >*Node Required</span>
        </h2>
        <SelectManager
          style="width: 20rem; text-align: center;"
          :current-active-emp="currentActiveEmp"
        />
      </div>
    </div>
    <h2>
      Select Department 
      <span
        v-if="noDepartError && department === 'Departments'"
        class="error-text"
      >*Department Required</span>
    </h2>
    <button
      v-for="option in departments"
      :key="option"
      :class="['department', { 'selected': selectedDepartment === option }]"
      @click="selectDepartment(option)"
    >
      {{ option }}
    </button>
    <div style="height: 2rem;" />
    <button
      class="next btn"
      @click="addDepartment"
    >
      Add
    </button>
  </div>
</template>

<script>
import axios from 'axios'
import setupDragAndDrop from './drag.js'
import { NODE_TYPE_DEPARTMENT } from '../constants'
import SelectManager from './SelectManager.vue'

export default {
  name: 'DepartmentAdder',
  components: {
    SelectManager,
  },
  props: {
    data: {
      required: true,
      type: Array,
    },
    chart: {
      required: true,
      type: Object,
    },
    detailsPopup: {
      required: true,
      type: Function,
    },
    currentActiveEmp: {
      required: true,
      type: Object,
    },
    departments: {
      required: true,
      type: Array,
    },
    addDepTriggers: {
      required: true,
      type: Function,
    },
    postChangeEmployee: {
      required: true,
      type: Function,
    },
    employeeMap: {
      required: true,
      type: Map,
    },
    setCurrentActiveEmployee: {
      required: true,
      type: Function,
    },
    controlError: {
      required: true,
      type: Function,
    },
    setLoadingSpinner: {
      required: true,
      type: Function,
    },
  },
  data() {
    var department = 'Departments'
    return {
      department: department,
      noDepartError: false,
      noManagerError: false,
      inactiveManagerError: false,
      managerMessage: false,
      selectedDepartment: null,
    }
  },
  watch: {
    currentActiveEmp: {
      handler(emp) {
        if (Object.keys(emp).length) {
          this.inactiveManagerError = false
          this.controlError(false, '')
        }
      }
    }
  },
  mounted() {
    setupDragAndDrop("#add-dep", "#container")
  },
  methods: {
    async addDepartment() {
      this.setLoadingSpinner(true)
      if (!this.currentActiveEmp.nodeType && this.department === 'Departments') {
        this.noDepartError = true
        this.noManagerError = true
        return
      } else if (!this.currentActiveEmp.nodeType) {
        this.noDepartError = false
        this.noManagerError = true
        return
      } else if (this.department === 'Departments') {
        this.noDepartError = true
        this.noManagerError = false
        return
      }

      var parentId
      try {
        parentId = this.currentActiveEmp.id
        var location = ''
        if (this.currentActiveEmp.location) {
          location = this.currentActiveEmp.location
        }
        const addResponse = await axios.post('/api/add_department', {
          department_name: this.department,
          parent_rid: this.currentActiveEmp.id,
          location_name: location,
        })

        const departmentData = {
          parentId,
          id: addResponse.data,
          name: this.department,
          location: location,
          nodeType: NODE_TYPE_DEPARTMENT,
        }

        this.employeeMap.set(addResponse.data, departmentData)
        this.addDepTriggers('close')
        this.postChangeEmployee(departmentData)
      } catch (error) {
        if (this.checkReturnValue(error.response, parentId))
        this.managerMessage = false
        console.error(error)
      }
      this.setLoadingSpinner(false)
    },
    checkReturnValue(data, parentId) {
      if (data.status===422) {
        this.setCurrentActiveEmployee({})
        this.detailsPopup('close')
        this.inputBoxWindow = 'input'
        this.chart.removeNode(parentId)
        this.employeeMap.delete(parentId)
        this.inactiveManagerError = true
        this.controlError(true, data.data.detail)
        this.addDepTriggers('close')
        this.addDepTriggers('open')
        return true
      }
    },
    selectDepartment(option) {
      this.department = option
      this.selectedDepartment = option
    }
  },
}
</script>

<style lang="scss" scoped>
.error-text {
  color: red;
}

h1 {
  font-size: 1.5rem;
  margin: 1rem;
}

h2 {
  margin: 0.5rem;
}

.department {
  height: 3rem;
  width: 20rem;
  border-radius: 0.5rem;
  margin: 0.3rem;
  font-size: 1.2rem;
  background: white;
  font-weight: bold;
  color: black;
}

.selected {
  background-color:rgb(34, 124, 157);
  color: white;
}

.department:hover {
  box-shadow: none;
  background: rgb(198, 198, 198);
  cursor: pointer;
}
.department:active {
  box-shadow: none;
  background: rgb(98, 98, 98);
  cursor: pointer;
}

#add-dep {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 275px;
  width: 32vw;
  max-width: 26rem;
  min-width: 370px;
  max-height: calc(100vh - 100px);
  margin: 2rem;
  background-color: #fef9ef;
  border-radius: 1rem;
  border: 1px solid #d3d3d3;
  overflow-y: auto;
  overflow-x: auto;
  padding-bottom: 30px;
}

</style>
