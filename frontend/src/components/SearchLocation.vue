<template>
<transition name = 'slide-fade'>
  <div id = "SearchLocation" class="input-group m-3 p-2" v-show = '!$store.state.isShowSideBar'>
    <gmap-autocomplete
        ref="textinput"
        placeholder="Bắt đầu gõ để tìm kiếm địa điểm"
        class="form-control"
        @place_changed="onFulfilling">
    </gmap-autocomplete>
    <div class="input-group-append">
      <button class="btn btn-link" type="button" @click = 'onClearing' v-if = 'isNotEmpty'>
        <span class="icon-trash">
        </span>
      </button>
      <button class="btn btn-primary" type="button" @click = 'onToggled' v-else>
        <span class="icon-direction">
        </span>
      </button>
    </div>
  </div>
</transition>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'
export default {
  data () {
    return {
      isNotEmpty: false
    }
  },

  methods: {
    onFulfilling (data) {
      this.isNotEmpty = true
      this.onFulfilled(data)
    },

    onClearing () {
      this.isNotEmpty = false
      this.$refs.textinput.$el.value = ''
      this.onCleared()
    }
  },

  components: {
    VueGoogleAutocomplete
  },

  props: ['onToggled', 'onCleared', 'onFulfilled']
}
</script>

<style>
  #SearchLocation {
    background: white;
    width: 500px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    left: 60px;
    z-index: -1
  }

  @media (max-width: 640px) {
    #SearchRoute,
    #SearchLocation {
      width: 70% !important
    }
  }
</style>
