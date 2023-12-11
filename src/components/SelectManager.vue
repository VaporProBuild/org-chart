<!-- SelectManager.vue -->

<template>
  <div class="add-card-item">
    <p class="add-item-label">
      <span
        v-if="managerMessage"
        class="error-text"
      >Select node from chart</span>
      <span
        v-else-if="attemptedNext && !currentActiveEmp.nodeType"
        class="error-text"
      >Node is required </span>
      <span
        v-else-if="currentActiveEmp.id === editEmp.id"
        class="error-text"
      >Node assigned to itself. Please assign to a different node. </span>
    </p>
    <div
      class="manager"
      type="text"
      @click="managerMessage=true"
    >
      <p v-if="currentActiveEmp.nodeType===NODE_TYPE_EMPLOYEE">
        {{currentActiveEmp.firstName}} {{currentActiveEmp.lastName}}
      </p>
      <p v-else-if="currentActiveEmp.nodeType===NODE_TYPE_DEPARTMENT | currentActiveEmp.nodeType === NODE_TYPE_WAREHOUSE | currentActiveEmp.nodeType===NODE_TYPE_MASTER">
        {{currentActiveEmp.name}}
      </p>
      <p 
        v-else
        style="font-weight: bold; color: rgba(128, 128, 128, 0.588);"
      >
        Select Node from Chart
      </p>
    </div>
  </div>
</template>

<script>
import { NODE_TYPE_EMPLOYEE, NODE_TYPE_DEPARTMENT, NODE_TYPE_MASTER, NODE_TYPE_WAREHOUSE } from '../constants'

export default {
  name: 'SelectManager',
  props: {
    editEmp: {
      required: false,
      type: Object,
      default: function() {
        return {
          id: 0,
          nodeType: false
        }
      }
    },
    currentActiveEmp: {
      required: false,
      type: Object,
      default: function() {
        return {
          id: 0,
          nodeType: false
        }
      }
    },
    attemptedNext: {
      required: false,
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      managerMessage: false,
      NODE_TYPE_EMPLOYEE,
      NODE_TYPE_DEPARTMENT,
      NODE_TYPE_MASTER,
      NODE_TYPE_WAREHOUSE
    }
  },
  watch: {
    currentActiveEmp: {
      handler(emp) {
        if (Object.keys(emp).length) {
          this.managerMessage = false
        }
      }
    }
  },
}
</script>


<style lang="scss" scoped>

.add-card-item {
  width: 100%;
  margin: 0.5rem 0;
  font-size: 1.2rem;
}


.add-item-label {
  font-weight: bold;
  font-size: 1em;
  text-align: left;
}


.manager {
  text-align: left;
  display: flex;
  align-items: center;
  padding: 10px;
  background: white;
  background-size: 15px 15px;
  border: none;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  width: 100%;
  height: 3rem;
  overflow-y: hidden;
  overflow-x: hidden;
  white-space: nowrap;
  resize: none;
}

.manager p {
  font-size: 1.2em;
}

.error-text {
  color: red;
}
</style>
