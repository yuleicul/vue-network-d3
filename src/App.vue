<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <Network msg="Welcome to Your Vue.js App"/> -->
    <div id="modeSwitch">
      <input type="checkbox" name v-model="mode" true-value="dark" false-value="light"> dark
    </div>
    <input type="text" v-model="queryWords">
    <button @click="startQuery(queryWords)">搜索</button>
    <network
      v-if="canRender"
      :nodeList="nodes"
      :linkList="links"
      :showLinkText="showLinkText"
      :mode="mode"
    ></network>
  </div>
</template>

<script>
import Network from "./components/Network.vue";
import jsonpFetch from "./lib/jsonpFetch.js";
import axios from "axios";

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
      nodeIds: [], // 用于判断重复节点
      canRender: false,
      mode: "light", // dark or light
      queryWords: ""
    };
  },
  created() {
    // this.getFirstLayerNode("阿里云").then(res => {
    //   let promiseList = [];
    //   res.forEach(node => {
    //     promiseList.push(this.getFirstLayerNode(node));
    //   });
    //   Promise.all(promiseList).then(values => {
    //     this.canRender = true;
    //     console.log(values);
    //   });
    // });
    // axios.get('/example.json')
    //   .then(response => {
    //     this.nodes = response.data.nodes
    //     this.links = response.data.links
    //     this.canRender = true
    //   }).catch(err=>console.log(err))
    //     // 尝试生成豆瓣节点
    // console.log("正在获取数据");
    // let nodeData = new Set();
    // let linkData = new Set();
    // // let flag = true // 请求数据中
    // axios
    //   .get("/douban-graph.json")
    //   .then(res => {
    //     console.log(res);
    //     res.data.forEach(movie => {
    //       // console.log(item.title)
    //       nodeData.add({
    //         name: movie.title,
    //         type: "movie",
    //         actors: movie.actor
    //       });
    //       let actors = movie.actor;
    //       for (let i in actors) {
    //         nodeData.add({
    //           name: actors[i],
    //           type: "actor"
    //         });
    //       }
    //     });
    //     console.log(nodeData);
    //     this.nodes = Array.from(nodeData);
    //     this.canRender = true
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  },
  methods: {
    startQuery(query) {
      this.getFirstLayerNode(query).then(res => {
        let promiseList = [];
        res.forEach(node => {
          promiseList.push(this.getFirstLayerNode(node));
        });
        Promise.all(promiseList).then(values => {
          this.canRender = true;
          console.log(values);
        });
      });
    },

    getFirstLayerNode(query) {
      return new Promise((resolve, reject) => {
        jsonpFetch(
          "//suggestqueries.google.com/complete/search?client=firefox&q=" +
            encodeURIComponent(query + "vs")
        )
          .then(response => {
            let linkedNodes = [];
            // let node1 = response[0].trim();
            let node1 = query.trim();
            if (this.nodeIds.indexOf(node1) === -1) {
              this.nodes.push({
                id: node1,
                name: node1
              });
              this.nodeIds.push(node1);
            }

            response[1].forEach(statement => {
              let node2 = "";
              // 注：splice 是返回删除的部分
              statement = statement.split("vs");
              console.log(statement);
              if (statement[1]) {
                node2 = statement[1].trim();
              }
              // 如果不为空字符串
              if (node2 && this.nodeIds.indexOf(node2) === -1) {
                linkedNodes.push(node2);
                this.nodes.push({
                  id: node2,
                  name: node2
                });
                this.nodeIds.push(node2);
                this.links.push({
                  source: node1,
                  target: node2,
                  value: 1
                });
              }
            });
            resolve(linkedNodes);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    }
  }
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
#modeSwitch {
  position: absolute;
  top: 20px;
}
</style>
