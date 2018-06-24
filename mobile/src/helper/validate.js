export class validateObject {
  constructor(name, val) {
    this.val = val || ''
    this.error = ''
    this.name = name
  }

  startValidate() {
    this.error = ''
    return this
  }

  required() {
    if (!this.error.length) {
      if (this.val.length === 0) {
        this.error = `${this.name} không được bỏ trống`
      }
    }

    return this
  }

  equal (validateObj) {
    if (!this.error.length) {
      if (this.val !== validateObj.val) {
        this.error = `${this.name} không có giá trị bằng ${validateObj.name}`
      }
    }

    return this
  }

  lengthMin(num) {
    if (!this.error.length) {
      if (this.val.length < num) {
        this.error = `${this.name} phải có độ dài tối thiểu ` + num
      }
    }

    return this
  }

  lengthBetween(min, max) {
    if (!this.error.length) {
      if (this.val.length < min || this.val.length > max) {
        this.error = `${this.name} phải có độ dài trong khoảng từ ` + min + ' cho tới ' + max
      }
    }

    return this
  }

  numeric() {
    if (!this.error.length) {
      if (!/^\d+$/.test(this.val)) {
        this.error = `${this.name} phải là số`
      }
    }

    return this
  }

  isValid() {
    return this.error.length === 0
  }

  email() {
    if (!this.error.length) {
      if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.val)) {
        this.error = `${this.name} phải là email`
      }
    }

    return this
  }
}