# vue-network-d3

> D3 Force-Directed Graph as Vue Component.

## Demo

- [Simple Demo]()

  ![simple-demo](./doc-assets/simple-demo.gif)

- [Film Knowledge Graph]()

  ![]()

## Install

```
npm install vue-network-d3 --save
```

## Quick Start

```vue
<template>
  <div id="app">
    <network :nodeList="nodes" :linkList="links"></network>
  </div>
</template>

<script>
import Network from "vue-network-d3";

export default {
  name: "app",
  components: {
    Network
  },
  data() {
    return {
      nodes: [
      	{"id": "Myriel", "group": 1},
      	{"id": "Napoleon", "group": 1},
        {"id": "Labarre", "group": 2},
        {"id": "Valjean", "group": 2}
      ],
      links: [
        {"source": "Napoleon", "target": "Myriel", "value": 1},
        {"source": "Valjean", "target": "Labarre", "value": 1}
      ]
    };
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>

```

## Props


## Events

## TODO
- [ ] Travis CI



