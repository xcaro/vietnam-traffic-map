<template>
<transition name = 'slide-fade'>
  <div id = "SearchRoute" class="m-3 p-3 " v-show = '!$store.state.isShowSideBar'>
    <div class="d-flex">
      <button class="btn ml-auto" type="button" @click = 'onToggling'>
        <span class="icon-close"></span>
      </button>
    </div>
    <div class="input-group mt-4">
      <div class="input-group-prepend">
        <button class="btn btn-outline" type="button">
          <span class="icon-adjust"></span>
        </button>
      </div>
      <gmap-autocomplete
        ref="origin"
        placeholder="Bắt đầu gõ để tìm kiếm địa điểm đi"
        class="form-control"
        @place_changed="onSearchOrigin"/>

      <div class="input-group-append">
        <button class="btn btn-link" type="button" @click = 'onClearOrigin' v-if = 'isOriginNotEmpty'>
          <span class="icon-trash"></span>
        </button>
      </div>
    </div>
    <div class="input-group mt-3">
      <div class="input-group-prepend">
        <button class="btn btn-outline" type="button">
          <span class="icon-location"></span>
        </button>
      </div>
      <gmap-autocomplete
        ref="destination"
        placeholder="Bắt đầu gõ để tìm kiếm địa điểm đến"
        class="form-control"
        @place_changed="onSearchDestination"/>

      <div class="input-group-append">
        <button class="btn btn-link" type="button" @click = 'onClearDestination' v-if = 'isDestinationNotEmpty'>
          <span class="icon-trash"></span>
        </button>
      </div>
    </div>

    <sweet-modal ref = "error" icon="error" title="LỖI !!!">
      Điểm đi và điểm đến không được trùng nhau
    </sweet-modal>
  </div>
</transition>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import {
  SweetModal
} from 'sweet-modal-vue'
import deepEqual from 'deep-equal'

export default {
  data () {
    return {
      isOriginNotEmpty: false,
      isDestinationNotEmpty: false,
      OriginLocation: null,
      DestinationLocation: null
    }
  },

  methods: {
    onToggling () {
      this.onToggled()
      this.onCleared()
    },

    onSearchOrigin (data) {
      if (!this.DestinationLocation) {
        this.isOriginNotEmpty = true
        this.OriginLocation = data
      } else {
        if (deepEqual(data, this.DestinationLocation)) {
          this.$refs.error.open()
          return
        }

        this.isOriginNotEmpty = true
        this.OriginLocation = data

        /** Fulfilled */
        this.onFulfilled(this.OriginLocation, this.DestinationLocation)
      }
    },

    onSearchDestination (data) {
      if (!this.OriginLocation) {
        this.isOriginNotEmpty = true
        this.OriginLocation = data
      } else {
        if (deepEqual(data, this.OriginLocation)) {
          this.$refs.error.open()
          return
        }

        this.isDestinationNotEmpty = true
        this.DestinationLocation = data

        /** Fulfilled */
        this.onFulfilled(this.OriginLocation, this.DestinationLocation)
      }
    },

    onClearOrigin () {
      this.isOriginNotEmpty = false
      this.$refs.origin.$el.value = ''
      this.onCleared()
    },

    onClearDestination () {
      this.isDestinationNotEmpty = false
      this.$refs.destination.$el.value = ''
      this.onCleared()
    }
  },

  components: {
    VueGoogleAutocomplete,
    SweetModal
  },

  props: ['onToggled', 'onCleared', 'onFulfilled']
}
</script>

<style>
  #SearchRoute {
    background: white;
    width: 500px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    left: 60px;
  }
</style>
