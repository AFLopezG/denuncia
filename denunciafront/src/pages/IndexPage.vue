<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <gmap-map
    :center="center"
    :zoom="zoom"
    style="width: 100%; height: 500px"
    :options="{
   zoomControl: true,
   mapTypeControl: true,
   scaleControl: false,
   streetViewControl: false,
   rotateControl: false,
   fullscreenControl: true,
   disableDefaultUi: false
 }"
  >

  </gmap-map>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { components } from "gmap-vue";

export default defineComponent({
  name: 'IndexPage',
  data(){

    return{

      zoom: 16,
      center: {lat:-17.970310, lng:-67.111780},
    }

  },

})
</script>
