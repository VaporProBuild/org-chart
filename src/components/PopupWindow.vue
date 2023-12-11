<!-- PopupWindow.vue -->

<template>
  <div id="card">
    <button
      v-if="token"
      class="popup-edit btn"
      style="left: 10px;"
      @click="() => {detailsPopup('close'); editAddTrigger('close'); editingTrigger('open'); editAddTrigger('open')}"
    >
      <span class="material-icons">edit</span>
    </button>
    <button
      class="close btn"
      @click="() => {additionalInfo = false; detailsPopup('close')}"
    >
      <span class="material-icons">close</span>
    </button>
    <img
      class="image"
      :src="employee.imageUrl"
    >
    <p class="name">
      {{ employee.firstName }} {{ employee.lastName }}
    </p>
    <div class="pos-name">
      {{ employee.position }}
    </div>
    <div class="card-body">
      <div
        v-if="manager.nodeType === NODE_TYPE_EMPLOYEE"
        class="card-item"
      >
        <p class="card-item-label">
          Manager:
        </p>
        <p class="card-item-value">
          {{ manager.firstName }} {{ manager.lastName }}
        </p>
      </div>
      <div
        v-if="employee.location"
        class="card-item"
      >
        <p class="card-item-label">
          Location:
        </p>
        <p class="card-item-value">
          {{ employee.location }}
        </p>
      </div>
      <div
        v-if="employee.phoneNumber"
        class="card-item"
      >
        <p class="card-item-label">
          Phone:
        </p>
        <div class="card-item-value">
          {{ employee.phoneNumber }}
          <span
            v-if="employee.extension"
            class="card-item-value"
          >
            ext({{ employee.extension }})
          </span>
        </div>
      </div>
      <div
        v-if="employee.email"
        class="card-item"
      >
        <p class="card-item-label">
          Email:
        </p>
        <p class="card-item-value">
          {{ employee.email }}@coldstorage.com
        </p>
      </div>
      <div
        v-if="employee.department"
        class="card-item"
      >
        <p class="card-item-label">
          Department:
        </p>
        <p class="card-item-value">
          {{ employee.department }}
        </p>
      </div>
      <div
        v-if="employee.additionalInfo"
        class="card-item"
      >
        <p class="card-item-label">
          Additional Info:
        </p>
        <span 
          v-if="!additionalInfo" 
          class="material-icons dots" 
          @click="additionalInfo = true"
        >more_horiz</span>
        <div
          v-if="additionalInfo" 
          class="material-icons dots" 
          @click="additionalInfo = false"
        >
          expand_less
        </div>
        <p 
          v-if="additionalInfo"
          style="width: 100%;"
          class="card-item-value des"
        >
          {{ employee.additionalInfo }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import setupDragAndDrop from './drag.js'
import constants from '../constants'
import { NODE_TYPE_EMPLOYEE } from '../constants'

export default {
  name: 'PopupWindow',
  props: {
    employee: {
      required: true,
      type: Object,
    },
    detailsPopup: {
      required: true,
      type: Function
    },
    manager: {
      required: true,
      validator: (value) => typeof value === 'object' || value === ''
    },
    editAddTrigger: {
      required: true,
      type: Function
    },
    editingTrigger: {
      required: true,
      type: Function
    },
    token: {
      required: false,
      type: String,
      default: null
    }
  },
  data() {
    return {
      constants,
      additionalInfo: false,
      NODE_TYPE_EMPLOYEE: NODE_TYPE_EMPLOYEE,
    }
  },
  mounted() {
    setupDragAndDrop("#card", "#container")
  },
}
</script>

<style lang="scss" scoped>
.dots {
  font-size: 2.2rem;
  margin-right: 0.5rem;
  transition: 0.3s ease-in-out;
}

.dots:hover {
  cursor: pointer;
  transition: 0.3s ease-in-out;
  color: #d3d3d3;
}

#card {
  position: absolute;
  top: 60px;
  right: 60px;
  width: 23%;
  max-width: 475px;
  min-width: 175px;
  max-height: calc(100vh - 200px);
  min-height: 260px;
  padding: 2rem;
  background-color: #fef9ef;
  border-radius: 1rem;
  border: 1px solid #d3d3d3;
  overflow-y: auto;
  overflow-x: auto;
}

#card::-webkit-scrollbar {
  width: 1em;
}

#card::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

#card::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 20px;
}

.image {
  width: 170px;
  height: 170px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgb(0, 0, 0);
  background-color: grey;
}

.card-body {
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
}

.card-item {
  width: 100%;
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border-top: 1px black solid;
}

.name {
  font-size: 2rem;
  font-weight: bold;
}

.pos-name {
  font-size: 1.9rem;
}

.card-item-label {
  margin: 0.5rem 0;
  font-weight: bold;
  font-size: 1.4rem;
}

.card-item-value {
  text-align: justify;
  font-size: 1.28rem;
}

.card-item-value.des {
  text-align: left;
}
</style>