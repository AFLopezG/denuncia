import { createApp } from 'vue'
import VueGoogleMaps from '@fawmi/vue-google-maps'


const app = createApp(App);
app.use(VueGoogleMaps, {
  load: {
      key: 'AIzaSyCmOdLL-xpg_9JWBByO-KhaaK6WShc11LI',
      // language: 'de',
  },
}).mount('#app')
