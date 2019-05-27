<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <Network msg="Welcome to Your Vue.js App"/> -->
    <network v-if="canRender" :nodes="nodes" :links="links" :showLinkText="showLinkText"
    :mode="mode"></network>
  </div>
</template>

<script>
import Network from "./components/Network.vue";
import axios from 'axios'

export default {
  name: "app",
  components: {
    Network
  },
  data() {
    return {
      showLinkText: false,
      nodes: [],
      links: [],
      canRender: false,
      mode: 'light' // dark or light
    };
  },
  created() {
    axios.get('/example.json')
      .then(response => {
        this.nodes = response.data.nodes
        this.links = response.data.links
        this.canRender = true
      }).catch(err=>console.log(err))
  },
};
</script>

<style>
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
}
#app {
  width: 100%;
  height: 100%;
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
