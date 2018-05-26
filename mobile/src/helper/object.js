export default {
  CloneAndSetPropOfObject (object, prop) {
    return Object.assign({}, object, prop)
  },

  addPropIfDefined (object, prop, propName) {
    if (prop) {
      object[propName] = prop
    }
  },

  addPropsIfDefined (object, arrayOfPropsAndPropsName) {
    arrayOfPropsAndPropsName.forEach(elem => {
      this.addPropIfDefined(object, elem.prop, elem.propName)
    })

    return object
  }
}
