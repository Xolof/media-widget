<template>
  <div id="app">
    <Slider />
  </div>
</template>

<script>
import Slider from './components/Slider.vue'

export default {
  name: 'App',
  components: {
    Slider
  }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  overflow: scroll;
  background: ##f6f6f6;
}
</style>
