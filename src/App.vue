<template>
  <div id="app">
    <nav>
    </nav>
    <router-view />
  </div>
</template>

<script>
import linkgame from './components/linkgame.vue'

export default {
  name: 'app',
  components: {
    linkgame
  }
}
</script>

<style>
</style>
