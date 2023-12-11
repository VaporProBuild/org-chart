export default {

  filterList(empList, input) {
    return empList.filter((node) => {
      const fullSearch = node.firstName + ' ' + node.lastName + ' - ' + node.position
      const startWithInput = (s) => s.trim().toLowerCase().startsWith(input?.toLowerCase())

      // check that felids exist before searching them
      const isNameValid = node.name && startWithInput(node.name)
      const isFirstNameValid = node.firstName && startWithInput(node.firstName)
      const isDepartmentValid = node.department && startWithInput(node.department)
      const isLastNameValid = node.lastName && startWithInput(node.lastName)
      const isPositionValid = node.position && startWithInput(node.position)
      const isFullSearchValid = fullSearch && startWithInput(fullSearch)

      return (
        isNameValid ||
        isFirstNameValid ||
        isDepartmentValid ||
        isLastNameValid ||
        isPositionValid ||
        isFullSearchValid
      )
    })
  },
  checkForInt(input) {
    if (input === null || input == '') {
      return true
    }
    return /^\d+$/.test(input)
  },
  checkValidInput(newEmp, currentActiveEmp, list) {
    if (!newEmp || !currentActiveEmp.nodeType || !list) {
      return false
    }
    return newEmp.firstName && newEmp.lastName && newEmp.position && newEmp && currentActiveEmp && this.checkForInt(newEmp.phoneNumber) && this.checkForInt(newEmp.extension)
  },
  checkEditValid(newEmp, currentActiveEmp, list) {
    if (!newEmp || !currentActiveEmp.nodeType || !list || (newEmp.email && newEmp.email.includes('@'))) {
      return false
    }
    return newEmp.firstName && newEmp.lastName && newEmp.position && this.checkForInt(newEmp.phoneNumber) && this.checkForInt(newEmp.extension)
  },
  setupEmptyEmp() {
    return {
      firstName: '',
      lastName: '',
      parentId: '',
      id: '',
      position: '',
      location: '',
      email: '',
      department: '',
      additionalInfo: '',
      phoneNumber: '',
      extension: '',
      version: '',
      employeeRid: '',
      kind: ''
    }
  },
}