<template>
  <div id = "SearchRoute" class="m-3 p-3 ">
    <div class="d-flex">
      <button class="btn btn-light" type="button" @click = 'onToggle'>
        <span class="icon-menu"></span>
      </button>
      <button class="btn ml-auto" type="button" @click = 'onToggle'>
        <span class="icon-close"></span>
      </button>
    </div>
    <div class="input-group mt-4">
      <div class="input-group-prepend">
        <button class="btn btn-outline" type="button">
          <span class="icon-adjust"></span>
        </button>
      </div>
      <vue-google-autocomplete
        ref="origin"
        id="origin"
        classname="form-control"
        placeholder="Bắt đầu gõ để tìm kiếm địa điểm đi"
        v-on:placechanged="onSearchOrigin"
      >
      </vue-google-autocomplete>
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
      <vue-google-autocomplete
        ref="destination"
        id="destination"
        classname="form-control"
        placeholder="Bắt đầu gõ để tìm kiếm địa điểm đến"
        v-on:placechanged="onSearchDestination"
      >
      </vue-google-autocomplete>
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
    onSearchOrigin (data) {
      if (deepEqual(data, this.DestinationLocation)) {
        this.$refs.error.open()
        return
      }

      this.isOriginNotEmpty = true
      this.OriginLocation = data
    },

    onSearchDestination (data) {
      if (deepEqual(data, this.OriginLocation)) {
        this.$refs.error.open()
        return
      }

      this.isDestinationNotEmpty = true
      this.DestinationLocation = data
    },

    onClearOrigin () {
      this.isOriginNotEmpty = false
      this.$refs.origin.clear()
    },

    onClearDestination () {
      this.isDestinationNotEmpty = false
      this.$refs.destination.clear()
    }
  },

  components: {
    VueGoogleAutocomplete,
    SweetModal
  },

  props: ['onToggle', 'onCancel', 'onFulfill']
}
</script>

<style>
  #SearchRoute {
    background: white;
    width: 500px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    position: absolute;
  }
</style>
