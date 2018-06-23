<template>
  <div>
    Đang đăng xuất, vui lòng đợi trong giây lát.
  </div>
</template>

<script>
import request from 'superagent'
export default {
  beforeCreate () {
    request.post('http://deltavn.net/api/logout').set({
      'Authorization': `Bearer ${this.$store.state.idToken}`
    }).then(() => {
      this.$store.dispatch('set', {
        'propertyName': 'idToken',
        'payload': null
      })
      this.$store.dispatch('set', {
        'propertyName': 'user',
        'payload': null
      })
      localStorage.removeItem('idToken')
      localStorage.removeItem('user')
      this.$store.dispatch('toggle', 'isShowModal')
    })
  }
}
</script>

<style>

</style>
