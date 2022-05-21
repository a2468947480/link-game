<template>
  <div id="app">
    <nav>
    </nav>
    <router-view />
  </div>
</template>

<script>
import link from './components/link.vue'

export default {
  name: 'app',
  components: {
    link
  }
}
</script>

<style>
</style>
