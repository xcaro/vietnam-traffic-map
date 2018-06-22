export class validateObject {
  constructor (name, rules, val) {
    this.val = val && ''
    this.error = ''
    this.name = name
  }

  startValidate () {
    this.error = ''
  }

  required () {
   if (!this.error.length) {
    if (this.val.length) {
       this.error = `${this.name} không được bỏ trống`
     }
   }

   return this
  }

  numeric () {
    if (!this.error.length) {
      if (/^\d+$/.test(this.val)) {
        this.error = `${this.name} phải là số`
      }
    }

    return this
  }

  isValid () {
    return this.error.length === 0 
  }

  email () {
    if (!this.error.length) {
      if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.val)) {
        this.error = `${this.name} phải là email`
      }
    }

    return this
  }
}