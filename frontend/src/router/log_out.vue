<template>
  <div>
    Bạn có muốn đăng xuất không ?
    <button class="btn ml-2">Không</button>
    <button class="btn btn-primary ml-2" @click="logOut">Có</button>
  </div>
</template>

<script>
export default {
  methods: {
    logOut () {
      this.$store.dispatch('set', {
        'propertyName': 'idToken',
        'payload': null
      })

      this.$store.dispatch('toggle', 'isShowModal')
    }
  }
}
</script>

<style>

</style>
