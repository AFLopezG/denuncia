<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="text-center">
        <!--        <q-btn-->
        <!--          flat-->
        <!--          dense-->
        <!--          round-->
        <!--          icon="menu"-->
        <!--          aria-label="Menu"-->
        <!--          @click="toggleLeftDrawer"-->
        <!--        />-->

        <!--        <q-toolbar-title>-->
        <!--          Quasar App-->
        <!--        </q-toolbar-title>-->

        <!--        <div>Quasar v{{ $q.version }}</div>-->
        <div class="text-center full-width text-h6 text-bold" style="font-size:15px">
          <q-img
            src="https://gamo.gob.bo/wp-content/uploads/elementor/thumbs/marca-institucional-2022-e1643873909890-pjyiv2fg12uw9v9urkdgy5u20guux11kopxuo3x9rk.png"
            spinner-color="white"
            style="height: 40px; max-width: 50px; "
          />
          Gobierno Autonomo Municipal de Oruro <br>(Unidad de Alumbrado Publico)
        </div>
      </q-toolbar>
    </q-header>

    <!--    <q-drawer-->
    <!--      v-model="leftDrawerOpen"-->
    <!--      show-if-above-->
    <!--      bordered-->
    <!--    >-->
    <!--      <q-list>-->
    <!--        <q-item-label-->
    <!--          header-->
    <!--        >-->
    <!--          Essential Links-->
    <!--        </q-item-label>-->

    <!--        <EssentialLink-->
    <!--          v-for="link in essentialLinks"-->
    <!--          :key="link.title"-->
    <!--          v-bind="link"-->
    <!--        />-->
    <!--      </q-list>-->
    <!--    </q-drawer>-->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen:false
    }
  },methods:{
    toggleLeftDrawer () {
      this.leftDrawerOpen.value = !this.leftDrawerOpen.value
    }
  }
}
</script>
