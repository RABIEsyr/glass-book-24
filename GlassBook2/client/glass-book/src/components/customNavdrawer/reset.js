function initialState (){
    return {
      modalBodyDisplay: 'getUserInput', 
      submitButtonText: 'Lookup', 
      addressToConfirm: null,
      bestViewedByTheseBounds: null,
      location:{
        name: null,
        address: null,
        position: null
      }
    }
  }
  module.exports = initialState;