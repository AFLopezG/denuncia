<template>
  <q-page class="flex flex-center">
    <div class="row">
      <div class="col-md-6 col-xs-12"></div>
      <div class="col-md-6 col-xs-12">
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
  ></gmap-map>
</div>
    </div>

  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data(){
    return {
      zoom: 16,
      center: {lat:-17.970310, lng:-67.111780},
    }
  }
}
</script>
