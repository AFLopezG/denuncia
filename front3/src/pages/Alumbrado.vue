<template>
  <q-page>
    <!--<l-map style="height: 50vh" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker @click="frmmodalpunto(p)" v-for="p in postes" :lat-lng="[p.lat,p.lng]" :key="p.id" >
        <l-icon><q-badge dense color="red"   label="" />
       </l-icon>
      </l-marker>
    </l-map>-->
    <div class="row col-12">
      <div class="col-9 "><q-select dense v-model="distrito" :options="distritos" label="Distritos" ourlined /></div>
      <div class="col-3"><q-btn color="green" icon="search" @click="onClick" /></div>
    </div>
    <div>
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
    <!-- use the default slot to pass markers to it -->

    <gmap-marker
      v-for="m in datos" :key="m.id"
      :position="{'lat':m.lat,'lng':m.lng}"
      :clickable="true"
      :icon="'img/'+m.color"
      :draggable="false"
      :title="m.material"
      :optimized=true
      @click="center={'lat':m.lat,'lng':m.lng};punto=m;modalpunto=true "
    >
    </gmap-marker>
    </gmap-map>
  </div>
    <q-table :data="puntos" :columns="colums" :filter="filter">

      <template v-slot:body-cell-potencia="props">
        <q-td :props="props" @click="frmmodalpunto(props.row)">
          {{props.row.potencia}}
        </q-td>
      </template>
      <template v-slot:body-cell-nroposte="props">
        <q-td :props="props" @click="frmmodalpunto(props.row)">
          {{props.row.nroposte}}
        </q-td>
      </template>
      <template v-slot:body-cell-material="props">
        <q-td :props="props" @click="frmmodalpunto(props.row)">
           <div style="font-size: 0.8em;white-space: initial;" class="text-subtitle2">{{props.row.material}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-observacion="props">
        <q-td :props="props" @click="frmmodalpunto(props.row)">
           <div style="font-size: 0.8em;white-space: initial;" class="text-subtitle2">{{props.row.observacion}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-ubicacion="props">
        <q-td :props="props">
          <q-btn :color="props.row.estado=='ACTIVO'?'primary':'negative'" @click="clickclientes(props.row)"  icon="place" size="xs" />
        </q-td>
      </template>
      <template v-slot:top-right>
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <q-dialog v-model="modalpunto" full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Nro poste {{punto.nroposte}} latlng ({{punto.lat}},{{punto.lng}})</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form>
            <div class="row">

              <div class="col-4">
                <q-input dense outlined label="Nro Poste" v-model="punto.nroposte" readonly />
              </div>
              <div class="col-4">
                <q-input dense outlined label="Potencia" v-model="punto.potencia" readonly/>
              </div>
              <div class="col-4">
                <q-input dense outlined label="Material" v-model="punto.material" readonly/>
              </div>
              <div class="col-4">
                <q-input dense outlined label="Luminaria" v-model="punto.luminaria" readonly/>
              </div>
              <div class="col-4">
                <q-input dense outlined label="Cant Luminarias" v-model="punto.cantidad" readonly/>
              </div>

              <div class="col-12">
                <q-input dense outlined label="Observacion" v-model="punto.observacion" readonly/>
              </div>
              <div class="col-12">
                <q-input dense outlined  v-model="mantenimiento" type="text" label="Motivo Mantenimiento" />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Mantenimiento" color="accent" />
          <q-btn flat label="cerrar" color="green" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>



<script>
import { QBadge } from 'quasar';
import { components } from "gmap-vue";

export default {
  name: `Alumbrado`,
  data () {
    return {
      datos:[],
      mantenimiento:'',
        distritos:[
          {label:'Distrito 1',value:'D1'},
          {label:'Distrito 2',value:'D2'},
          {label:'Distrito 3',value:'D3'},
          {label:'Distrito 4',value:'D4'},
          {label:'Distrito 5',value:'D5'},
        ],
      distrito:{label:'Distrito 1',value:'D1'},
      modalpunto:false,

      estados:['ACTIVO','MANTENIMIENTO'],
      postes:[],
      d1:[],
      d1e:[],
      d2:[],
      d2e:[],
      d3:[],
      d3e:[],
      d4:[],
      d4e:[],
      d5:[],
      d5e:[],

      estado:'ACTIVO',
      filter:'',
      colums:[
        {name:"id",label:"id",field:"id"},
        {name:"nroposte",label:"nroposte",field:"nroposte"},
        {name:"potencia",label:"potencia",field:"potencia"},
        {name:"material",label:"material",field:"material"},
        {name:"observacion",label:"observacion",field:"observacion"},
        {name:"ubicacion",label:"ubicacion",field:"ubicacion"},
      ],
      puntos:[],
      map:null,
      punto:{},
      zoom: 16,
      center: {lat:-17.970310, lng:-67.111780},
      markerLatLng: [-17.970310, -67.111780]
    };
  },
  created() {

    this.mispuntos()
    this.cargar
  },
  methods:{

    onClick(){
      console.log(this.distrito.value)
      switch (this.distrito.value) {
        case 'D1': this.datos=this.d1;break;
        case 'D2': this.datos=this.d2;break;
        case 'D3': this.datos=this.d3;break;
        case 'D4': this.datos=this.d4;break;
        case 'D5': this.datos=this.d5;break;

        default:
          this.datos=[]
          break;
      }
    },
    cargar(){
  // The location of Uluru
  let uluru = { lat: -17.970310, lng: -67.111780 };
  // The map, centered at Uluru
  this.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: this.map,
  });

    },
    frmmodalpunto(p){
      // console.log('a')
      this.modalpunto=true
      this.punto=p
    },
    clickclientes(c){
      // console.log(c)
      this.center = {lat:c.lat, lng:c.lng}
      this.zoom= 18
    },
    cambioestado(){
      console.log(this.punto)
      this.$api.put('poste/'+this.punto.id,this.punto)
    },
    mispuntos(){
      this.postes=[]
      this.$q.loading.show()
      this.$api.get('poste').then(res=>{
        this.puntos=res.data
        res.data.forEach(r => {
          if(r.distrito=='D2') this.d2.push(r)
          if(r.distrito=='D2 EXT') this.d2.push(r)
          if(r.distrito=='D3') this.d3.push(r)
          if(r.distrito=='D4') this.d4.push(r)
          if(r.distrito=='D4 EXT') this.d4.push(r)
          if(r.distrito=='D5') this.d5.push(r)
          if(r.distrito=='D5 EXT') this.d5.push(r)
        });
        this.$q.loading.hide()
         console.log(this.puntos)
      })
    }
  },

}
</script>




