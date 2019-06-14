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
      nodes: [
        { id: "Myriel", group: 1 },
        { id: "Napoleon", group: 1 },
        { id: "Labarre", group: 2 },
        { id: "Valjean", group: 2 }
      ],
      links: [
        { source: "Napoleon", target: "Myriel", value: 1 },
        { source: "Valjean", target: "Labarre", value: 1 }
      ]
    };
  },
  created() {
    // axios
    //   .get("/example.json")
    //   .then(response => {
    //     this.nodes = response.data.nodes;
    //     this.links = response.data.links;
    //   })
    //   .catch(err => console.log(err));
  }
};
</script>

<style>
body {
  margin: 0;
}
</style>
