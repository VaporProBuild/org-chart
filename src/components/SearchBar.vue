<!-- SearchBar.vue -->

<template>
  <div id="search-bar">
    <div class="input-container">
      <input
        v-model="input"
        class="input"
        type="text"
        placeholder="Search by Name or Department"
      >
      <button
        v-if="input"
        class="clear-button"
        @click="input = ''"
      >
        <span class="material-icons">close</span>
      </button>
    </div>
    <div id="container-results">
      <div v-if="input != ''">
        <div
          v-for="employee in filteredList"
          :key="employee"
          class="search-results-employees"
          @click="selectedEmployee(employee)"
        >
          <div v-if="employee.nodeType === NODE_TYPE_EMPLOYEE">
            {{ employee.firstName }} {{ employee.lastName }} - {{ employee.position }}
            <span 
              class="material-icons details-icon" 
              @click.stop="detailsCard(employee)"
            >
              menu
            </span>
          </div>
          <div v-else>
            {{ employee.name }}
            <span 
              v-if="employee.location && employee.location != employee.name"
            >
              - {{ employee.location }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="input && !filteredList.length"
        class="search-results-employees error"
      >
        <p>No results found!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import utils from "./utils"
import { NODE_TYPE_EMPLOYEE } from "../constants"

export default {
  name: "SearchBar",
  props: {
    employeeList: {
      type: Array,
      required: true,
    },
    chart: {
      required: true,
      type: Object
    },
    detailsPopup: {
      required: true,
      type: Function
    },
    setSelectedEmployee: {
      required: true,
      type: Function
    },
  },
  data() {
    const input = ref("")
    return {
      input,
      NODE_TYPE_EMPLOYEE,
    }
  },
  computed: {
    filteredList() {
      return utils.filterList(this.employeeList, this.input)
    }
  },
  methods: {
    selectedEmployee(employee) {
      this.detailsPopup('close')
      this.setSelectedEmployee(employee)
    },
    detailsCard(employee) {
      this.setSelectedEmployee(employee)
      this.detailsPopup('open')
    }
  }
}
</script>

<style>
.material-icons {
  font-family: 'Material Icons';
  font-size: 1.9rem;
  text-align: justify;
}

.input-container {
  position: relative;
}

.clear-button {
  background-color: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1rem;
  vertical-align: middle;
  position: absolute;
  z-index: 1;
  top: 6px;
  right: 16px;
  font-weight: bolder;
  font-size: 1.4rem;
}

.clear-button:hover {
  color: #666;
}

#search-bar {
  position:absolute;
  top: 10px;
  width: 25vw;
  max-width: 350px;
  min-width: 150px;
  right: 10px;
  z-index: 99;
}

#container-results {
  background-color: transparent;
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
}

#container-results::-webkit-scrollbar {
  width: 1em;
}

#container-results::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}

#container-results::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 20px;
}

.input {
  width: 100%;
  display: block;
  margin: 1px auto;
  padding: 10px 45px;
  background: white;
  background-size: 15px 15px;
  border: none;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.search-results-employees {
  width: 100%;
  position: relative;
  margin: 0 auto auto auto;
  padding: 10px 20px;
  color: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  background-color: #227c9d;
  display: flex;
  padding-right: 50px;
  flex-wrap: wrap;
  justify-content: space-between;
  text-align: left;
  border: white 2px solid;
  max-height: 4.9rem;
  overflow: hidden;
}

.search-results-employees:hover {
  cursor: pointer;
  background-color: #1e6e8a;
}

.search-results-employees:active {
  cursor: pointer;
  background-color: #1b5e75;
}

.details-icon {
  position: absolute;
  height: 34px;
  width: 28px;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  justify-content: end;
}

.details-icon:hover {
  cursor: pointer;
  color: #d7d7d7;
}

.details-icon:active {
  cursor: pointer;
  color: #5d5d5d;
}

.error {
  background-color: tomato;
}
</style>