<template>
  <q-page >
    <div class="row" :style="backgroundDiv">
      <div class="q-pa-md col-md-6 col-xs-12">
        <div  style="width:100%;">
        <q-banner rounded class="bg-green text-white text-h5" style="width:100%; text-align: center; ">
         REGISTRO RECLAMOS
    </q-banner></div>
        <div class="q-pa-xs"><q-input bg-color="blue-grey-1" outlined rounded v-model="persona.ci"
          label="Cedula de Identidad" @keyup="buscar"/></div>
        <div class="q-pa-xs"><q-input bg-color="blue-grey-1" outlined rounded v-model="persona.nombre" type="text" label="Nombre Completo" /></div>
        <div class="q-pa-xs"><q-input bg-color="blue-grey-1" outlined rounded v-model="persona.telefono" type="text" label="Celular" /></div>
        <div class="q-pa-xs"><q-btn color="teal" icon="my_location"  @click="geolocate()" />{{ubicacion}}</div>
      </div>
      <div class="q-pa-md   col-md-6 col-xs-12">
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
  <gmap-marker
      :position="ubicacion"
      :draggable="true"
      :clickable="true"
      @drag="updateCoordinates"
      @click="cargarUbicacion"
      title="Usted esta Aqui"
      :optimized=true
      icon="http://maps.google.com/mapfiles/ms/icons/ylw-pushpin.png"
    >
    </gmap-marker>
    <gmap-marker
      v-for="m in datos" :key="m.id"
      :position="{'lat':m.lat,'lng':m.lng}"
      :clickable="true"
      :draggable="false"
      :title="m.material"
      :optimized=true
      @click="center={'lat':m.lat,'lng':m.lng};punto=m;seleccionar(); "
    >
    </gmap-marker>
</gmap-map>
      </div>
    </div>
    <q-dialog v-model="dialogReclamo" full-width>
      <q-card >
        <q-card-section>
          <div class="text-h6">Datos de Alumbrado {{punto.nroposte}}</div>

          <div class="row">
            <div class="col-md-3 col-xs-12"><b>MATERIAL :</b> {{punto.material}}</div>
            <div class="col-md-3 col-xs-12"><b>LUMINARIA :</b> {{punto.luminaria}}</div>
            <div class="col-md-3 col-xs-12"><b>ALTURA :</b> {{punto.altura}}</div>
            <div class="col-md-3 col-xs-12"><b>POTENCIA :</b> {{punto.potencia}}</div>
            <div class="col-12"><b>OBSERVACION : </b>{{punto.observacion}}</div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense outlined v-model="denuncia.reclamo" label="Detalle del reclamo" type="textarea"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" color="red" v-close-popup icon="cancel" />
          <q-btn flat label="Registrar" color="green" @click="registrarReclamo" icon="send" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {date} from "quasar";

export default {
  name: 'PageIndex',
  data(){
    return {
      persona:{},
      punto:{},
      denuncia:{},
      dialogReclamo:false,
      zoom: 16,
      marker:{},
      postes:[],
      datos:[],
      ubicacion:{lat:-17.970310, lng:-67.111780},
      center: {lat:-17.970310, lng:-67.111780},
      backgroundDiv : {
        backgroundImage : 'url(bg.jpg)',
        backgroundRepeat : 'no-repeat',
        backgroundSize : '100% 100%',
      },
    }
  },
  mounted(){
    this.geolocate()
    //this.mispuntos()
  },
  methods:{
    cargarUbicacion(){
      this.$axios.post('calcularArea',{lat:this.ubicacion.lat,lng:this.ubicacion.lng,distancia:200}).then(res=>{
          console.log(res.data)
          this.datos=res.data
      })
    },
    updateCoordinates(location) {
            this.ubicacion = {
                lat: location.latLng.lat(),
                lng: location.latLng.lng(),
            };

        },
    registrarReclamo(){
      if(this.denuncia.reclamo==undefined || this.denuncia.reclamo==''){
        this.$q.notify({
          message: 'Ingrese su Reclamo',
          color: 'red',
          icon:'info'
        })
        return false
      }
      if(this.persona.id==undefined) this.persona.id=''
      this.denuncia.persona=this.persona
      this.denuncia.fecha=date.formatDate(new Date(),'YYYY-MM-DD')
      this.denuncia.hora=date.formatDate(new Date(),'HH:mm')
      this.denuncia.punto=this.punto
      this.$axios.post('reclamo',this.denuncia).then(res=>{
        console.log(res.data)
      })

    },
    seleccionar(){
        if(this.persona.ci==undefined ||
           this.persona.nombre==undefined ||
           this.persona.telefono==undefined){

          this.$q.notify({
          message: 'Ingrese su Datos',
          color: 'red',
          icon:'info'
        })
        return false
        }
        this.zoom=19
        this.dialogReclamo=true
    },
    cargar(dist){

    this.$q.loading.show()

      switch (dist) {
        case 'D1': this.datos=this.d1;break;
        case 'D2': this.datos=this.d2;break;
        case 'D3': this.datos=this.d3;break;
        case 'D4': this.datos=this.d4;break;
        case 'D5': this.datos=this.d5;break;
        default:
          this.datos=[]
          break;
      }

    this.$q.loading.hide()

    },
    buscar(){
      let carnet=this.persona.ci
      this.$axios.post('buscarPersona/'+carnet).then(res=>{
        console.log(res.data)
        if(res.data){
          this.persona=res.data
        }
        else{
          this.persona.id=''
          this.persona.nombre=''
          this.persona.telefono=''
        }

      })
    },

    async geolocate() {
      this.ubicacion= {lat:0, lng:0}
      // check if API is supported

      if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)

        this.marker.position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.ubicacion=this.marker.position;
        this.center=this.ubicacion
        this.zoom=18;
        this.$axios.post('calcularArea',{lat:this.ubicacion.lat,lng:this.ubicacion.lng,distancia:900}).then(res=>{
          console.log(res.data)
          this.datos=res.data
      })

      },function(error){
// El segundo parámetro es la función de error
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("El usuario denegó el permiso para la Geolocalización")
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("La ubicación no está disponible.")
            break;
        case error.TIMEOUT:
            console.log("Se ha excedido el tiempo para obtener la ubicación")
            break;
        case error.UNKNOWN_ERROR:
            console.log(" Un error desconocido.")
            break;
    }
  });}

    },
  }
}
</script>
