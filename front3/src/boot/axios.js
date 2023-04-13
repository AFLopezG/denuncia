import { boot } from 'quasar/wrappers'
import axios from 'axios'
import Vue from 'vue'
import * as VueGoogleMaps from '@coderstm/quasar-google-maps'
import GmapVue from 'gmap-vue'
import {useCounterStore} from "stores/example-store";

Vue.use(GmapVue, {
  load: {
    // [REQUIRED] This is the unique required value by Google Maps API
    key: 'AIzaSyCmOdLL-xpg_9JWBByO-KhaaK6WShc11LI',
    // [OPTIONAL] This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualpization'
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


// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.API })

export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
  const token = localStorage.getItem('tokenAlum')

  if (token) {
    app.config.globalProperties.$api.defaults.headers.common['Authorization'] = 'Bearer '+token
    app.config.globalProperties.$api.post('me').then(res=>{
      useCounterStore().user=res.data
      useCounterStore().isLoggedIn=true
    }).catch(err=>{
      app.config.globalProperties.$api.defaults.headers.common['Authorization']=''
      useCounterStore().user={}
      localStorage.removeItem('tokenAlum')
      useCounterStore().isLoggedIn=false
      router.push('/login')
    })
  }else{
    router.push('/login')
    useCounterStore().user={}
    localStorage.removeItem('tokenAlum')
    useCounterStore().isLoggedIn=false

  }
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})


export { api }
