<template>
  <div id="app">
    <network :nodeList="nodes" :linkList="links"></network>
  </div>
</template>

<script>
import Network from "./components/Network.vue";
import axios from "axios";

export default {
  name: "app",
  components: {
    Network
  },
  data() {
    return {
      nodes: [],
      links: []
    };
  },
  created() {
    let url = process.env.NODE_ENV === 'production'? '/vue-network-d3/example.json':'/example.json'
    axios
      .get(url)
      .then(response => {
        this.nodes = response.data.nodes;
        this.links = response.data.links;
      })
      .catch(err => console.log(err));
  }
};
</script>

<style>
body {
  margin: 0;
}
</style>
