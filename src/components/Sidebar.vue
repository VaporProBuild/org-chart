<!-- Sidebar.vue -->

<script setup>
const ToggleMenu = () => {
  menu_is_expanded.value = !menu_is_expanded.value
  localStorage.setItem("menu_is_expanded", menu_is_expanded.value)
  if (!menu_is_expanded.value && (loc_is_expanded.value || dep_is_expanded.value)) {
    loc_is_expanded.value = false
    localStorage.setItem("loc_is_expanded", false)
    dep_is_expanded.value = false
    localStorage.setItem("dep_is_expanded", false)
  }
}

const ToggleLocation = () => {
  if (!menu_is_expanded.value) {
    menu_is_expanded.value = true
    localStorage.setItem("menu_is_expanded", true)
  } else if (dep_is_expanded.value) {
    dep_is_expanded.value = false
    localStorage.setItem("dep_is_expanded", false)
  }

  loc_is_expanded.value = !loc_is_expanded.value
  localStorage.setItem("loc_is_expanded", loc_is_expanded.value)
}

const ToggleDepartment = () => {
  if (!menu_is_expanded.value) {
    menu_is_expanded.value = true
    localStorage.setItem("menu_is_expanded", true)
  } else if (loc_is_expanded.value) {
    loc_is_expanded.value = false
    localStorage.setItem("loc_is_expanded", false)
  }

  dep_is_expanded.value = !dep_is_expanded.value
  localStorage.setItem("dep_is_expanded", dep_is_expanded.value)
}
</script>

<template>
  <div class="sidebar">
    <aside :class="`${menu_is_expanded ? 'menu_is-expanded' : ''}`">
      <div class="logo">
        <img
          src="../../assets/logo.png"
          alt="CCS"
        > 
      </div>

      <div class="menu-toggle-wrap">
        <button
          class="menu-toggle"
          @click="ToggleMenu"
        >
          <span class="material-icons">keyboard_double_arrow_right</span>
        </button>
      </div>
      <h3>Menu</h3>
      <!-- Updates coming soon! -->
      <!-- <div class="menu">
        <button
          class="button"
          @click="updateMaster()"
        >
          <span class="material-icons">corporate_fare</span>
          <span class="text">Company Wide</span>
        </button>
      </div>
      <div class="menu">
        <button
          class="button"
          @click="ToggleLocation"
        >
          <span class="material-icons">location_on</span>
          <span class="text">Location</span>
        </button>
      </div>

      <div v-if="loc_is_expanded">
        <div
          v-for="loc in locations"
          id="locations"
          :key="loc"
          class="menu"
        >
          <button
            class="button here"
            @click="updateFilter(loc)"
          >
            <span class="text">{{ loc }}</span>
          </button>
        </div>
      </div>

      <div class="menu">
        <button
          class="button"
          @click="ToggleDepartment"
        >
          <span class="material-icons">groups</span>
          <span class="text">Department</span>
        </button>
      </div>

      <div v-if="dep_is_expanded">
        <div
          v-for="department in departments"
          id="locations"
          :key="department"
          class="menu"
        >
          <button
            class="button here"
            @click="updateFilter(department)"
          >
            <span class="text">{{ department }}</span>
          </button>
        </div>
      </div> -->

      <div class="menu">
        <button
          class="button"
          @click="chart.expandAll()"
        >
          <span class="material-icons">expand</span>
          <span class="text">Expand All</span>
        </button>
      </div>
      <div class="menu">
        <button
          class="button"
          @click="chart.collapseAll()"
        >
          <span class="material-icons">close_fullscreen</span>
          <span class="text">Collapse All</span>
        </button>
      </div>
      <div class="menu">
        <button
          class="button"
          @click="resetView(currentActiveEmp.id)"
        >
          <span class="material-icons">align_space_even</span>
          <span class="text">Position Chart</span>
        </button>
      </div>
      <div
        v-if="!departments.includes(URLToString(filter)) && token"
        class="menu"
      >
        <button
          class="button"
          @click="() => {editAddTrigger('close'); editingTrigger('close'); editAddTrigger('open')}"
        >
          <span class="material-icons">person_add</span>
          <span class="text">Add Employee</span>
        </button>
      </div>
      <div
        v-if="!departments.includes(URLToString(filter)) && token"
        class="menu"
      >
        <button
          class="button"
          @click="addDepTrigger('close'), addDepTrigger('open')"
        >
          <span class="material-icons">add_to_photos</span>
          <span class="text">Add Department</span>
        </button>
      </div>
      <div
        v-if="!departments.includes(URLToString(filter)) && token" 
        class="menu"
      >
        <button
          class="button"
          @click="delTrigger('open')"
        >
          <span class="material-icons">delete</span>
          <span class="text">Delete</span>
        </button>
      </div>
      <div class="menu">
        <button
          class="button"
          @click="chart.exportImg()"
        >
          <span class="material-icons">save</span>
          <span class="text">Save Image</span>
        </button>
      </div>
      <div class="flex" />
      <div 
        class="menu"
        @click="closeAll()"
      >
        <router-link
          to="/about"
          class="button"
        >
          <span class="material-icons">info</span>
          <span class="text">About</span>
        </router-link>
      </div>
      <div
        v-if="token"
        class="menu"
      >
        <button
          class="button"
          @click="() => {closeAll(); logOut()}"
        >
          <span class="material-icons">logout</span>
          <span class="text">Logout</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

const menu_is_expanded = ref(localStorage.getItem("menu_is_expanded") === "true")
const loc_is_expanded = ref(localStorage.getItem("loc_is_expanded") === "true")
const dep_is_expanded = ref(localStorage.getItem("dep_is_expanded") === "true")

export default {
  name: "VueSidebar",
  props: {
    chart: {
      required: true,
      type: Object
    },
    currentActiveEmp: {
      required: true,
      type: Object
    },
    resetView: {
      required: true,
      type: Function
    },
    delTrigger: {
      required: true,
      type: Function
    },
    editAddTrigger: {
      required: true,
      type: Function
    },
    editing: {
      required: true,
      type: Object
    },
    editingTrigger: {
      required: true,
      type: Function
    },
    addDepTrigger: {
      required: true,
      type: Function
    },
    detailsPopup: {
      required: true,
      type: Function
    },
    locations: {
      required: true,
      type: Array
    },
    departments: {
      required: true,
      type: Array
    },
    token: {
      required: false,
      type: String,
      default: null
    }
  },
  data() {
    return {
      filter: '',
    }
  },
  async created () {
    this.filter = this.$route.params.filter
  },
  methods: {
    closeAll() {
      this.editAddTrigger('close')
      this.delTrigger('close')
      this.editingTrigger('close')
      this.detailsPopup('close')
    },
    async updateMaster() {
      this.filter = ':filter'
      await this.$router.push('/:filter')
      location.reload()
    },
    async updateFilter(filter) {
      this.filter = this.stringToURL(filter)
      await this.$router.push(`/${this.filter}`)
      location.reload()
    },
    stringToURL(str) {
      return encodeURIComponent(str.toLowerCase())
    },
    URLToString(url) {
      return decodeURIComponent(url).replace(/\b\w/g, match => match.toUpperCase())
    },
    async logOut() {
      await axios.post('/api/logout')
      
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  z-index: 99;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background-color: transparent;
}

#locations {
  padding-inline-start: 20px;
  height: 40px;
  transition: height 0.2s;
}

#locations.loc_is-expanded {
  height: 40px;
}

aside::-webkit-scrollbar {
  width: 1em;
}

.material-icons {
  font-family: 'Material Icons';
}

aside::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 20px;
}

aside::-webkit-scrollbar-thumb {
  background-color: transparent;
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 20px;
}

aside {
  display: flex;
  flex-direction: column;

  background-color: #1e293b;
  color: #f1f5f9;

  width: 92px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100vh;
  padding: 1rem;

  transition: 0.2s ease-in-out;

  .flex {
    flex: 1 1;
  }

  .logo {
    margin-bottom: 1rem;

    img {
      width: 40px;
    }
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: center;
    position: relative;
    top: 0;
    transition: 0.2s ease-in-out;
    outline: none;

    .menu-toggle {
      cursor: pointer;
      appearance: none;
      border: none;
      outline: none;
      background: none;
      transition: 0.2s ease-in-out;
      .material-icons {
        font-size: 3rem;
        color: #f1f5f9;
        transition: 0.2s ease-out;
      }
      
      &:hover {
        .material-icons {
          color: #a3b7cd;
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3, .button .text {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  h3 {
    color: #64748b;
    font-size: 1.7rem;
    text-transform: uppercase;
  }

  .menu {
    margin: 0 -1rem;

    .button {
      cursor: pointer;
      appearance: none;
      border: none;
      outline: none;
      background: none;
      display: flex;
      align-items: center;
      text-decoration: none;
      margin-left: 4px;

      width: 100%;

      transition: 0.2s ease-in-out;
      padding: 0.5rem 1rem;

      .material-icons {
        font-size: 2.8rem;
        color: #f1f5f9;
        transition: 0.2s ease-in-out;
      }
      .text {
        color: #f1f5f9;
        transition: 0.2s ease-in-out;
        font-size: 1.5rem;
      }

      &:hover {
        background-color: #334155;

        .material-icons, .text {
          color: #a3b7cd;
        }
      }
      &:active {
        background-color: rgb(13, 16, 19);

        .material-icons, .text {
          color: #b7bec6;
        }
      }
    }
  }

  &.menu_is-expanded {
    width: 300px;

    .menu-toggle-wrap {
      top: -3rem;
      justify-content: flex-end;
      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3, .button .text {
      opacity: 1;
    }
  }

}
</style>