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

    this.$store.dispatch('toggle', 'isShowModal')
  }
}
</script>

<style>

</style>
