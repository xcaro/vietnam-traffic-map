<template>
  <div>
  </div>
</template>

<script>
export default {
  beforeCreate () {
    this.$store.dispatch('set', {
      'propertyName': 'idToken',
      'payload': null
    })
    request.post('http://deltavn.net/api/logout').set({
      'Authorization': `Bearer ${this.$store.state.idToken}`
    }).then(() => {
      this.$store.dispatch('toggle', 'isShowModal')
    })
  }
}
</script>

<style>

</style>
