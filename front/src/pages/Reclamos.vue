<template>

      <q-page >
      <div class="row" :style="backgroundDiv">
        <div class="q-pa-md col-md-6 col-xs-12">
          <div  style="width:100%;" align="center">
          <!--q-banner rounded class="bg-green text-white text-h5" style="width:100%; text-align: center; ">-->
           <q-btn dense  class="text-h6" color='green' @click="$router.replace({ path: '/consulta' })">IR CONSULTA RECLAMOS</q-btn>

      </div>
          <div class="q-pa-xs"><q-input dense bg-color="blue-grey-1" outlined rounded v-model="persona.ci"
            label="Cedula de Identidad *" @change="buscar"/></div>
          <div class="q-pa-xs"><q-input dense bg-color="blue-grey-1" outlined rounded v-model="persona.nombre" type="text" label="Nombre Completo *" /></div>
          <div class="q-pa-xs"><q-input  dense  bg-color="blue-grey-1" outlined rounded v-model="persona.telefono" type="text" label="Celular *" /></div>
          <div class="q-pa-xs"><q-input dense bg-color="blue-grey-1" outlined rounded v-model="reclamo" type="textarea" label="Detalle de Reclamo *" /></div>
          <div class="q-pa-xs row"><div class="col-10"><q-input  bg-color="blue-grey-1" dense outlined rounded v-model="nposte" type="text" label="Nro Poste" /></div><div class="col-2"> <q-btn color="green"  icon="search" @click="buscarPoste" /></div></div>
          <div class="q-pa-xs"><q-btn  color="green-8" label="REGISTRAR" @click="registrarReclamo"/></div>
          <div style="color:white; font-weight: bold; background: gray; font-size: 10px;"> * Puede arrastrar su ubicacion o hacer click en cualquier parte del mapa</div>
          <div style="color:white; font-weight: bold; background: gray; font-size: 10px;" > * Hacer click al punto de su ubicacion para cargar los postes cercanos</div>
          <div style="color:white; font-weight: bold; background: gray; font-size: 10px;"> * Click sobre alguno de los postes para registrar su reclamo</div>
          <div style="color:white; font-weight: bold; background: gray; font-size: 10px;"> * Llamar a 52-76362 si no encuentra el poste</div>

        </div>

        <div class="q-pa-md   col-md-6 col-xs-12">

          <l-map style="height: 70vh" :zoom="zoom" :center="center" @click="cargarpunto ">
            <l-tile-layer :url="styleMap?`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`:`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`"
                        layer-type="base"
                        name="OpenStreetMap" :attribution="attribution"></l-tile-layer>
          <l-marker :lat-lng="[lat,lng]" draggable  @moveend="updateCoordinates" @click="cargarUbicacion" title="Usted esta Aqui"
          >
          <l-icon
            icon-url="http://maps.google.com/mapfiles/ms/icons/ylw-pushpin.png"
          />
        </l-marker>
          <l-marker v-for="m in datos" :key="m.id" :lat-lng="[m.lat,m.lng]" @click="center=[m.lat,m.lng];punto=m;seleccionar(); ">        <l-icon
            icon-url="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          /></l-marker>


      </l-map>
      </div>
      </div>
      <div class="col-12 q-pa-xs">
        <q-table
          :data="lista"
          :columns="colmlist"
          dense
          row-key="name"
        >
        <template v-slot:body-cell-opcion="props">
            <q-td key="opcion" :props="props">
              <q-btn color="red" icon="delete" size="xs" round @click="delreclamo(props)" />
            </q-td>

        </template>
        </q-table>
      </div>
      <q-dialog v-model="agregar" persistent>
        <q-card style="width: 300px">
          <q-card-section class="row items-center">
            <span class="q-ml-sm">AGREGAR A LISTA RECLAMO</span>
          </q-card-section>
          <q-card-section>
              <div class="col-md-3 col-xs-12"><b>MATERIAL :</b> {{punto.material}}</div>
              <div class="col-md-3 col-xs-12"><b>LUMINARIA :</b> {{punto.luminaria}}</div>
              <div class="col-md-3 col-xs-12"><b>ALTURA :</b> {{punto.altura}}</div>
              <div class="col-md-3 col-xs-12"><b>POTENCIA :</b> {{punto.potencia}}</div>
              <div class="col-12"><b>OBSERVACION : </b>{{punto.observacion}}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="CANCEL" color="red" v-close-popup />
            <q-btn flat label="AGREGAR" color="green" @click="addPunto" />
          </q-card-actions>
        </q-card>
      </q-dialog>

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
        styleMap:true,
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        colmlist:[
          {label:'OPC',field:'opcion',name:'opcion'},
          {label:'NRO',field:'nroposte',name:'nroposte'},
          {label:'LUMINARIA',field:'luminaria',name:'luminaria'},
          {label:'POTENCIA',field:'potencia',name:'potencia'},
          {label:'MATERIAL',field:'material',name:'material'},
        ],
        persona:{},
        agregar:false,
        punto:{},
        denuncia:{},
        reclamo:'',
        lista:[],
        nposte:'',
        dialogReclamo:false,
        zoom: 16,
        marker:{},
        postes:[],
        urlbase:'https://electrica.gamo.cf/#/consulta',
        lat:0,
        lng:0,
        datos:[],
        ubicacion:{lat:-17.970310, lng:-67.111780},
        center: {lat:-17.970310, lng:-67.111780},
        backgroundDiv : {
          backgroundImage : 'url(bg.jpg)',
          backgroundRepeat : 'no-repeat',
          backgroundSize : '100% 100%',
        },
        opts : {
          errorCorrectionLevel: 'M',
          type: 'png',
          quality: 0.95,
          width: 100,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFF',
          },
        },
        opts2 : {
          errorCorrectionLevel: 'M',
          type: 'png',
          quality: 0.95,
          width: 50,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFF',
          },
        }
      }
    },
    mounted(){
      this.geolocate()
      //this.mispuntos()
    },
    methods:{
      cargarpunto(value){
        console.log(value.latlng)
            //return false
            this.lat= value.latlng.lat
                this.lng= value.latlng.lng
              this.ubicacion = [this.lat,this.lng];
              this.center=this.ubicacion
      },
      delreclamo(indice){
        console.log(indice)
        this.lista.splice(indice.rowIndex,1)
      },
      addPunto(){
        if(!this.lista.find(x=> x.id==this.punto.id)){
        this.lista.push(this.punto)
       }
       this.agregar=false
      },
      handleMarkerDrag(e) {
        this.ubicacion = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      },
      cargarUbicacion(){
        this.$axios.post('calcularArea',{lat:this.lat,lng:this.lng,distancia:200}).then(res=>{
            console.log(res.data)
            this.datos=res.data
        })
      },
      updateCoordinates(l) {
                this.lat= l.target._latlng.lat
                this.lng= l.target._latlng.lng
              this.ubicacion = [this.lat,this.lng];
              this.center=this.ubicacion

          },
      registrarReclamo(){
        if(this.reclamo==undefined || this.reclamo==''){
          this.$q.notify({
            message: 'Ingrese su Reclamo',
            color: 'red',
            icon:'info'
          })
          return false
        }
        if(this.persona.ci==undefined || this.persona.ci=='' ||
           this.persona.nombre==undefined || this.persona.nombre=='' ||
           this.persona.telefono==undefined || this.persona.telefono==''
           ){
            this.$q.notify({
            message: 'Registre sus datos',
            color: 'red',
            icon:'info'
          })
          return false
           }
        if(this.persona.id==undefined) this.persona.id=''
        this.denuncia.persona=this.persona
        this.denuncia.fecha=date.formatDate(new Date(),'YYYY-MM-DD')
        this.denuncia.hora=date.formatDate(new Date(),'HH:mm')
        this.denuncia.listado=this.lista
        this.denuncia.reclamo=this.reclamo
        this.$axios.post('registroMultiple',this.denuncia).then(res=>{
          console.log(res.data)
          //this.printReclamo(res.data)
          this.dialogReclamo=false
          this.$q.notify({
            message: 'Su Reclamo fue Registrado',
            color: 'green',
            icon:'info'
          })
        })
        this.reclamo=''
        this.persona={}
        this.denuncia={}
        this.nposte=''
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
          this.agregar=true
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
      buscarPoste(){
        this.datos=[]
        this.$axios.get('buscarPoste/'+this.nposte).then(res=>{
          if(res.data.length>0){

            this.datos.push(res.data[0])
            this.ubicacion=[res.data[0].lat,res.data[0].lng]
            this.center=this.ubicacion
            this.zoom=18;
          }
        })

      },
      buscar(){
        let carnet=this.persona.ci
        this.$axios.post('buscarPersona/'+carnet).then(res=>{
          console.log(res.data)
          if(res.data){
            this.persona=res.data
          }
          else{
            this.persona={}
            this.persona.ci=carnet
          }

        })
      },

      async geolocate() {
        this.ubicacion= [0, 0]
        // check if API is supported

        if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position)

            this.lat= position.coords.latitude,
            this.lng= position.coords.longitude,
          this.ubicacion=[this.lat,this.lng];
          this.center=this.ubicacion
          this.zoom=18;
          this.$axios.post('calcularArea',{lat:this.lat,lng:this.lng,distancia:200}).then(res=>{
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
