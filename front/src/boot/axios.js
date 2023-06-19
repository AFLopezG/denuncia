import Vue from "vue";
import * as VueGoogleMaps from '@coderstm/quasar-google-maps'
import GmapVue from 'gmap-vue'

Vue.use(GmapVue, {
  load: {
    // [REQUIRED] This is the unique required value by Google Maps API
    key: 'AIzaSyCmOdLL-xpg_9JWBByO-KhaaK6WShc11LI',
    // [OPTIONAL] This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
    libraries: 'places',

    // [OPTIONAL] If you want to set the version, you can do so:
    v: '3.26',

    // This option was added on v3.0.0 but will be removed in the next major release.
    // If you already have an script tag that loads Google Maps API and you want to use it set you callback
    // here and our callback `GoogleMapsCallback` will execute your custom callback at the end; it must attached
    // to the `window` object, is the only requirement.
    customCallback: 'MyCustomCallback',
  },

  // [OPTIONAL] If you intend to programmatically custom event listener code
  // (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  // instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  // you might need to turn this on.
  autoBindAllEvents: false,

  // [OPTIONAL] If you want to manually install components, e.g.
  // import {GmapMarker} from 'gmap-vue/src/components/marker'
  // Vue.component('GmapMarker', GmapMarker)
  // then set installComponents to 'false'.
  // If you want to automatically install all the components this property must be set to 'true':
  installComponents: true,

  // Load the Google Maps API dynamically, if you set this to `true` the plugin doesn't load the Google Maps API
  dynamicLoad: false,
})

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyBXoCUdCBDilSwYQ8ryGAJQagi49o4Fpn0',
      libraries: 'places', // This is required if you use the Autocomplete plugin
      // OR: libraries: 'places,drawing'
      // OR: libraries: 'places,drawing,visualization'
      // (as you require)

      //// If you want to set the version, you can do so:
      // v: '3.26',
    },

    //// If you intend to programmatically custom event listener code
    //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
    //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
    //// you might need to turn this on.
    // autobindAllEvents: false,

    //// If you want to manually install components, e.g.
    //// import {GmapMarker} from '@coderstm/quasar-google-maps/src/components/marker'
    //// Vue.component('GmapMarker', GmapMarker)
    //// then set installComponents to 'false'.
    //// If you want to automatically install all the components this property must be set to 'true':
    installComponents: true
  })
import axios from 'axios'
// import Vue from 'vue';
import { LMap, LTileLayer, LMarker,LIcon,LControl } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import store from "src/store";
// import store from './../store'
delete L.Icon.Default.prototype._getIconUrl;



L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-icon', LIcon);
Vue.component('l-control', LControl);


// const token = localStorage.getItem('tokenelec')
// // console.log(token)
// if (token) {
//   // console.log('a')
//   // api.defaults.headers.common['Authorization'] = 'Bearer '+token
//   // axios.defaults.headers.common['Authorization'] = 'Bearer '+token
//   // axios.post(process.env.API+'me').then(res=>{
//   //   // console.log(res.data);
//   //   // return false;
//   //   // store.state.user=res.data;
//   //   store.commit('login/auth_success', {token:token,user:res.data})
//   // })
//   // .catch(err=>{
//   //   // console.error('aas')
//   //   // Vue.prototype.$store.dispatch('login/salir')
//   //   localStorage.removeItem('tokenelec')
//   //
//   // })
// }
Vue.prototype.$axios = axios

Vue.prototype.$axios.defaults.baseURL = process.env.API
