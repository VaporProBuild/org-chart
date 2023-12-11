<template>
  <div 
    id="del-card"
    style="align-items: center; justify-content: center;"
  >
    <button
      class="close btn"
      @click="delTrigger('close')"
    >
      <span class="material-icons">close</span>
    </button>
    <h1 style="padding-inline: 1rem; font-size: 1.5rem;">
      Select the Node to Delete.
    </h1>
    <p style="padding-top: 1rem; padding-bottom: 1rem;">
      Note: Deleting a node is a permanent action. If you delete a node, all other nodes who reported to them will be reassigned to the deleted node's manager.
    </p>
    <h2
      v-if="error"
      style="color: red; padding-bottom: 1rem;"
    >
      Error: Must Select an Employee or Department
    </h2>
    <SelectManager 
      :current-active-emp="currentActiveEmp"
    />
    <button
      class="next btn"
      style="margin-top: 1rem;"
      @click="next()"
    >
      Delete
    </button>
  </div>
</template>

<script>
import setupDragAndDrop from './drag.js'
import axios from 'axios'
import { NODE_TYPE_DEPARTMENT, NODE_TYPE_EMPLOYEE, NODE_TYPE_MASTER, NODE_TYPE_WAREHOUSE } from '../constants'
import SelectManager from './SelectManager.vue'

export default {
  name: 'DeleteEmployee',
  components: {
    SelectManager
  },
  props: {
    data: {
      required: true,
      type: Array,
    },
    delTrigger: {
      required: true,
      type: Function
    },
    currentActiveEmp: {
      required: true,
      type: Object,
    },
    setLoadingSpinner: {
      required: true,
      type: Function
    }
  },
  data() {
    return {
      NODE_TYPE_DEPARTMENT, 
      NODE_TYPE_EMPLOYEE,
      error: false
    }
  },
  watch: {
    currentActiveEmp: {
      handler(emp){
        if (emp.nodeType === NODE_TYPE_EMPLOYEE || emp.nodeType === NODE_TYPE_DEPARTMENT) {
          this.error = false
        } else {
          this.error = true
        }
      }
    }
  },
  mounted() {
    setupDragAndDrop("#del-card", "#container")
  },
  methods: {
    async next() {
      try {
        if (!this.currentActiveEmp || !this.currentActiveEmp.parentId || this.currentActiveEmp.nodeType === NODE_TYPE_MASTER || this.currentActiveEmp.nodeType === NODE_TYPE_WAREHOUSE) {
          this.error = true
          return
        }
        this.setLoadingSpinner(true)
        const deleteReturnVal = await axios.post('/api/delete_node', {
          id: this.currentActiveEmp.id,
          parent_id: this.currentActiveEmp.parentId
        })

        if (deleteReturnVal.data === 0) {
          throw Error('Return value from delete_node was 0.')
        }
        location.reload()
      } catch (err) {
        console.error(err)
      }
      this.setLoadingSpinner(false)
    }
  }
}
</script>

<style>
#del-card {
  position: absolute;
  top: 60px;
  left: 275px;
  width: 32vw;
  max-width: 670px;
  min-width: 370px;
  max-height: calc(100vh - 200px);
  min-height: 260px;
  padding: 2rem;
  margin: 2rem;
  background-color: #fef9ef;
  border-radius: 1rem;
  border: 1px solid #d3d3d3;
  overflow-y: auto;
  overflow-x: auto;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
}

#del-card::-webkit-scrollbar {
  width: 1em;
}

#del-card::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
}

#del-card::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 20px;
}

.del-manager-results {
  font-size: 1.5rem;
}

.bold {
  font-weight: bold;
}

.error-text {
  color: red;
}
</style>