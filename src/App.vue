<template>
  <div id="app">
    <network :nodeList="nodes" :linkList="links" @clickNode="clickNode"></network>
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
        { source: "Valjean", target: "Labarre", value: 1 },
        {"source": "Napoleon", "target": "Valjean", "value": 2}
      ]
    };
  },
  methods: {
    clickNode(e, node) {
      console.log(e)
      console.log(node)
    }
  }
};
</script>

<style>
body {
  margin: 0;
}
</style>
