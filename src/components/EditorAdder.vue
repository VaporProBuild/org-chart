<!-- AddEmployee.vue -->

<template>
  <div id="edit-card">
    <!-- Select Edit Employee -->
    <button
      class="close btn"
      @click="() => {editingTrigger('close'); editAddTrigger('close'); attemptedNext=false}"
    >
      <span class="material-icons">close</span>
    </button>
    <!-- Input Section -->
    <div v-if="inputBoxWindow === 'input'">
      <div
        v-if="editing.status"
        class="add-title"
      >
        Edit Employee Details:
      </div>
      <div
        v-else
        class="add-title"
      >
        Add Employee Details:
      </div>
      <div
        class="add-card-body"
        style="margin-bottom: 10px; padding-bottom: 10px;"
      >
        <div class="add-card-item center">
          <img 
            v-if="imageUrl"
            class="input-image" 
            :src="imageUrl"
          >
          <img 
            v-else-if="editEmp.imageUrl"
            class="input-image" 
            :src="editEmp.imageUrl"
          >
          <img 
            v-else-if="editEmp.rid"
            class="input-image" 
            :src="editEmp.imageUrl"
          >
          <button 
            class="image-upload btn"
            onclick="document.getElementById('file-upload').click()"
          >
            Add Photo
          </button>
          <input
            id="file-upload"
            style="display:none;"
            type="file"
            accept="image/png, image/jpeg, image/jpg" 
            @change="handleFileUpload"
          >
        </div>
        <p style="padding-top: 10px;">
          Fields marked with * are mandatory.
        </p>
        <p>
          Must use internal email and phone number.
        </p>
        <div v-if="copyEmp.parentId || !editing.status">
          <p class="add-item-label">
            Manager*
          </p>
          <SelectManager
            :current-active-emp="currentActiveEmp"
            :attempted-next="attemptedNext"
            :edit-emp="editEmp"
          />
        </div>
        <div class="add-card-item">
          <p class="add-item-label">
            First Name*
            <span
              v-if="!editEmp.firstName && attemptedNext"
              class="error-text"
            >First name is required </span>
          </p>
          <textarea
            id="firstName"
            v-model="editEmp.firstName"
            class="add-item-input"
            type="text"
          />
        </div>
        <div class="add-card-item">
          <p class="add-item-label">
            Last Name* 
            <span
              v-if="!editEmp.lastName && attemptedNext"
              class="error-text"
            >
              Last name is required
            </span>
          </p>
          <textarea
            id="lastName"
            v-model="editEmp.lastName"
            class="add-item-input"
            type="text"
          />
        </div>
        <div class="add-card-item">
          <p class="add-item-label">
            Position*
            <span
              v-if="!editEmp.position && attemptedNext"
              class="error-text"
            >Position is required</span>
          </p>
          <textarea
            id="position"
            v-model="editEmp.position"
            class="add-item-input"
            type="text"
          />
        </div>
        <div class="add-card-item">
          <p class="add-item-label">
            Phone Ext:
            <span
              v-if="!checkForInt(editEmp.extension) && attemptedNext"
              class="error-text"
            >Must only contain numbers</span>
          </p>
          <textarea
            id="phoneExt"
            v-model="editEmp.extension"
            class="add-item-input"
            type="text"
          />
        </div>
        <div class="add-card-item">
          <p class="add-item-label">
            Phone:
            <span
              v-if="!checkForInt(editEmp.phoneNumber) && attemptedNext"
              class="error-text"
            >Must only contain numbers</span>
          </p>
          <textarea
            id="phoneNumber"
            v-model="editEmp.phoneNumber"
            class="add-item-input"
            type="text"
          />
        </div>
        <div class="add-card-item">
          <p class="add-item-label">
            Email:
            <span
              v-if="editEmp.email && editEmp.email.includes('@') && attemptedNext"
              class="error-text"
            >Must only use @dundermifflin.com Email</span>
          </p>
          <div
            style="display: flex;
            align-items: center;
            font-size: 1em;"
          >
            <textarea
              id="email"
              v-model="editEmp.email"
              class="add-item-input"
              type="text"
            />
            <p style="margin-left: 0.5rem; font-size: 1em;">
              @dundermifflin.com
            </p>
          </div>
        </div>
        <div class="add-card-item">
          <p class="add-item-label">
            Department:
          </p>
          <textarea
            id="department"
            v-model="editEmp.department"
            class="add-item-input"
            type="text"
          />
        </div>
        <div class="add-card-item">
          <p class="add-item-label">
            Additional Info:
          </p>
          <textarea
            id="additionalInfo"
            v-model="editEmp.additionalInfo"
            class="add-item-input"
            type="text"
          />
        </div>
        <div
          v-if="!checkEditValid(editEmp, currentActiveEmp, Array.from(employeeMap.values()), copyEmp)"
          class="error-text"
          style="margin-top: 20px;"
        >
          Error above
        </div>
      </div>
      <div>
        <div class="add-save-btn-container">
          <button
            class="next btn"
            @click="next()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    <!-- Review Section -->
    <div v-if="inputBoxWindow === 'review'">
      <img 
        v-if="imageUrl"
        class="input-image" 
        :src="imageUrl"
      >
      <img 
        v-else-if="editEmp.imageUrl"
        class="input-image" 
        :src="editEmp.imageUrl"
      >
      <img 
        v-else
        class="input-image" 
        src="../../assets/0.jpeg"
      >
      <div class="review-name">
        {{ editEmp.firstName }} {{ editEmp.lastName }}
      </div>
      <div class="review-pos">
        {{ editEmp.position }}
      </div>
      <div class="review-body">
        <div
          v-if="copyEmp.parentId"
          class="review-item"
        >
          <p
            v-if="setManager.nodeType===NODE_TYPE_EMPLOYEE" 
            class="review-item-label"
          >
            Manager:
          </p>
          <p class="review-item-value">
            {{ setManager.firstName }} {{ setManager.lastName }}
          </p>
        </div>
        <div class="review-item">
          <p class="review-item-label">
            Position:
          </p>
          <p class="review-item-value">
            {{ editEmp.position }}
          </p>
        </div>
        <div class="review-item">
          <p class="review-item-label">
            Phone:
          </p>
          <p class="review-item-value">
            {{ editEmp.phoneNumber }} <span
              v-if="editEmp.extension"
              class="review-item-value"
            >ext({{ editEmp.extension }})</span>
          </p>
        </div>
        <div class="review-item">
          <p class="review-item-label">
            Email:
          </p>
          <p 
            v-if="editEmp.email" 
            class="review-item-value"
          >
            {{ editEmp.email }}@dundermifflin.com
          </p>
        </div>
        <div class="review-item">
          <p class="review-item-label">
            Department:
          </p>
          <p class="review-item-value">
            {{ editEmp.department }}
          </p>
        </div>
        <div class="review-item">
          <p class="review-item-label">
            Additional Info:
          </p>
          <p class="review-item-value">
            {{ editEmp.additionalInfo }}
          </p>
        </div>
      </div>
      <div class="add-save-btn-container">
        <button
          class="next btn"
          style="margin-left: 0; margin-left: 10px;"
          @click="inputBoxWindow = 'input'"
        >
          Back
        </button>
        <div style="width: 2rem;" />
        <button
          v-if="!editing.status"
          class="next btn"
          @click="saveNewEmployee()"
        >
          Save
        </button>
        <button
          v-else
          class="next btn"
          @click="saveEdit()"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import setupDragAndDrop from './drag.js'
import utils from './utils'
import SelectManager from './SelectManager.vue'
import constants, { NODE_TYPE_EMPLOYEE, NODE_TYPE_DEPARTMENT, NODE_TYPE_MASTER, NODE_TYPE_WAREHOUSE } from '../constants'

export default {
  name: 'EditorAdder',
  components: {
    SelectManager
  },
  props: {
    chart: {
      required: true,
      type: Object
    },
    editAddTrigger: {
      required: true,
      type: Function
    },
    setCurrentActiveEmployee: {
      required: true,
      type: Function
    },
    detailsPopup: {
      required: true,
      type: Function
    },
    currentActiveEmp: {
      required: true,
      type: Object
    },
    editing: {
      required: true,
      type: Object
    },
    postChangeEmployee: {
      required: true,
      type: Function
    },
    editingTrigger: {
      required: true,
      type: Function
    },
    employeeMap: {
      required: true,
      type: Object
    },
    returnAllChildren: {
      required: true,
      type: Function
    },
    controlError: {
      required: true,
      type: Function
    },
    setLoadingSpinner: {
      required: true,
      type: Function
    },
    updateChart: {
      required: true,
      type: Function
    },
  },
  data() {
    var inputBoxWindow = 'input'
    return {
      editEmp: utils.setupEmptyEmp(),
      setManager: null,
      inputBoxWindow,
      copyEmp: utils.setupEmptyEmp(),
      imageFile: null,
      imageUrl: null,
      maxSize: 1048576,
      constants,
      attemptedNext: false,
      inactiveManagerError: false,
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
          this.inactiveManagerError = false
          this.controlError(false, '')
        }
      }
    }
  },
  mounted() {
    setupDragAndDrop("#edit-card", "#container")
    if (this.editing.status) {
      this.editEmp = { ...this.currentActiveEmp }
      this.copyEmp = { ...this.currentActiveEmp }
      if (this.currentActiveEmp.parentId !== null) {
        this.setCurrentActiveEmployee(this.employeeMap.get(this.currentActiveEmp.parentId))
      }
    }
  },
  methods: {
    checkForInt: utils.checkForInt,
    checkValidInput: utils.checkValidInput,
    checkEditValid: utils.checkEditValid,
    next() {
      if (this.inputBoxWindow === 'input' && this.checkEditValid(this.editEmp, this.currentActiveEmp, Array.from(this.employeeMap.values()), this.copyEmp) && this.currentActiveEmp.id !== this.editEmp.id) {
        this.setManager = this.currentActiveEmp
        this.inputBoxWindow = 'review'
      } else {
        this.attemptedNext = true
      }
    },
    async saveNewEmployee() {
      this.setLoadingSpinner(true)
      var parentId
      try{
        //send the new employee to the database and return the id
        const { firstName, lastName, position, email, department, additionalInfo, phoneNumber, extension } = this.editEmp
        parentId = this.setManager.id
        const parentWarehouse = this.setManager.location

        var kind = 'jpeg'

        if (this.imageFile) kind = this.imageFile.type.split('/')[1]

        const newEmployee = await axios.post('/api/add_employee', {
          first_name: firstName,
          last_name: lastName,
          parent_id: parentId,
          position: position,
          email: email,
          location: parentWarehouse,
          department: department,
          additional_info: additionalInfo,
          phone_number: phoneNumber,
          extension: extension,
          kind: kind
        })

        if (!Object.hasOwnProperty.call(newEmployee.data, 'org_rid') || !Object.hasOwnProperty.call(newEmployee.data, 'emp_rid')) {
          throw new Error('Did not return the correct data')
        }

        //send the photo to minio using the returned id as the name
        if (this.imageFile) {
          await this.minioUploadImage(this.imageFile, newEmployee.data.org_rid)
        } else {  //if no image is uploaded, use the default image
          const imageReturn = await axios.get('../../assets/0.jpeg', {
            responseType: 'blob'
          })
          this.imageUrl = URL.createObjectURL(imageReturn.data)
        }

        const employeeData = {
          firstName: firstName,
          lastName: lastName,
          parentId: parentId,
          id: newEmployee.data.org_rid,
          position: position,
          department: department,
          additionalInfo: additionalInfo,
          email: email,
          extension: extension,
          employeeRid: newEmployee.data.emp_rid,
          phoneNumber: phoneNumber,
          location: parentWarehouse,
          kind: kind,
          imageUrl: this.imageUrl,
          nodeType: NODE_TYPE_EMPLOYEE,
        }
        this.editAddTrigger('close')
        this.employeeMap.set(newEmployee.data.org_rid, employeeData)
        this.postChangeEmployee(employeeData)
      } catch (error) {
        if (this.checkReturnValue(error.response, parentId))
        console.error("Error when adding Employee: ", error)
      }
      this.setLoadingSpinner(false)
    },
    async saveEdit() {
      this.setLoadingSpinner(true)
      var parentChanged = false
      try {
        var { firstName, lastName, position, email, department, additionalInfo, phoneNumber, extension, id, employeeRid, kind } = this.editEmp
        var parentLocation = null
        if (this.setManager.id !== this.editEmp.parentId) {
          parentChanged = true
          this.editEmp.parentId = this.setManager.id
          parentLocation = this.setManager.location
        }

        if (this.imageUrl) {
          this.editEmp.imageUrl = this.imageUrl
          kind = this.imageFile.type.split('/')[1]
          this.editEmp.kind = kind
        }

        const childrenIds = this.returnAllChildren(new Set(), [this.editEmp]).filter(emp => emp.id !== this.editEmp.id).map(emp => emp.id)

        // Cannot set child as parent since it causes a loop
        if (childrenIds.includes(this.editEmp.parentId)) {
          this.detailsPopup('close')
          this.setCurrentActiveEmployee({})
          this.inputBoxWindow = 'input'
          this.attemptedNext = true
          this.controlError(true, 'Error: Cannot set child as parent')
          this.setLoadingSpinner(false)
          return
        }

        const editEmployee = await axios.post('/api/edit_employee', {
          first_name: firstName,
          last_name: lastName,
          parent_id: this.editEmp.parentId ?? null,
          position: position,
          email: email,
          department: department,
          additional_info: additionalInfo,
          phone_number: phoneNumber,
          extension: extension,
          kind: kind,
          id: id,
          employee_rid: employeeRid,
          location_name: parentLocation ?? this.editEmp.location,
          children_ids: childrenIds
        })

        if (editEmployee.data !== 2 + childrenIds.length) {
          throw new Error('Incorrect number of rows updated')
        }
        if (this.imageUrl) {
          await this.minioUploadImage(this.imageFile, id)
        }

        this.editingTrigger('close')
        this.editAddTrigger('close')

        this.employeeMap.delete(id)
        this.employeeMap.set(id, this.editEmp)

      } catch (error) {
        if (this.checkReturnValue(error.response, this.editEmp.parentId))
        console.error("Error when Editing Employees: ", error)
      }
      if (!this.inactiveManagerError && parentChanged) {
        localStorage.setItem('moveEmp', this.editEmp.id)
        location.reload()
      }
      this.updateChart()
      this.setLoadingSpinner(false)
    },
    checkReturnValue(data, parentId) {
      if (data.status===422) {
        this.detailsPopup('close')
        this.setCurrentActiveEmployee({})
        this.inputBoxWindow = 'input'
        this.chart.removeNode(parentId)
        this.employeeMap.delete(parentId)
        this.inactiveManagerError = true
        this.attemptedNext = true
        this.controlError(true, data.data.detail)
        this.setLoadingSpinner(false)
        return true
      }
    },
    handleFileUpload(event) {
      const imageFile = event.target.files[0] // Check if user selected a file
      if (imageFile) {
        if (!imageFile.type.match('image.*')) {
          console.error('Please choose an image file')
        } else if (imageFile.size > this.maxSize) {
          console.error('Your file is too big! Please select an image under 1MB')
        } else {
          this.imageUrl = URL.createObjectURL(imageFile)
          this.imageFile = imageFile
        }
      }
    },
    async minioUploadImage (imageFile, imageName) {
      try {
        const file = new File([imageFile], imageName + '.' + imageFile.type.split('/')[1], {type: imageFile.type})
        const formData = new FormData()
        formData.append('image', file)  //image is the key for the file
        const uploadResponse = await axios.post('/api/upload_picture', formData, {
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': 'multipart/form-data',
          },
        })
        if (uploadResponse.status !== 200) {
          throw new Error('Error uploading image')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>


<style lang="scss" scoped>

#edit-card {
  position: absolute;
  left: 275px;
  width: 32vw;
  max-width: 670px;
  min-width: 370px;
  max-height: calc(100vh - 100px);
  min-height: 260px;
  padding: 2rem;
  margin: 2rem;
  background-color: #fef9ef;
  border-radius: 1rem;
  border: 1px solid #d3d3d3;
  overflow-y: auto;
  overflow-x: auto;
  padding-bottom: 30px;
}

#edit-card::-webkit-scrollbar {
  width: 1em;
}

#edit-card::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
}

#edit-card::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 20px;
}

.add-card-item {
  width: 100%;
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.add-title {
  font-size: 2rem;
  font-weight: bold;
}

.add-item-label {
  font-weight: bold;
  font-size: 1.2rem;
  text-align: left;
}

#email {
  width: 50%;
}

.add-item-input {
  font-size: 1em;
  text-align: left;
  display: block;
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

.boss-label {
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
  height: 44px;
  text-align: center;
}


.input-image {
  width: 7rem;
  height: 7rem;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgb(0, 0, 0);
  margin-left: auto;
  margin-right: auto;
}

.review-image {
  width: 170px;
  height: 170px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid white;
  background-color: grey;
}

.review-name {
  font-size: 2rem;
  font-weight: bold;
}

.review-pos {
  font-size: 1.9rem;
}

.review-body {
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
}

.review-item {
  width: 100%;
  margin: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.review-item-label {
  margin: 0.5rem 0;
  font-weight: bold;
  font-size: 1.5rem;
}

.review-item-value {
  text-align: justify;
  font-size: 1.5rem;
}

.add-save-btn-container {
  display: flex;
  justify-content: center;
  padding-bottom: 0.2rem;
}
.edit-manager-results {
  font-size: 1.5rem;
}

.error-text {
  color: red;
}
</style>