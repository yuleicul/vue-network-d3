<template>
  <div id="app">
    <el-button class="setting-box-button" icon="el-icon-s-operation" circle @click="showSettingCard=!showSettingCard"></el-button>
    <a href="https://github.com/ChenCyl/vue-network-d3"><img class="github-button" src="/github.png" height="35px"></a> 
    <el-card class="setting-box-card" v-if="showSettingCard">
      <div slot="header" class="clearfix">
        <span>设置</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="showSettingCard=!showSettingCard"
        >关闭</el-button>
      </div>节点大小
      <el-slider v-model="nodeSize" show-input :max="50"></el-slider>连线宽度
      <el-slider v-model="linkWidth" show-input :max="20"></el-slider>连线长度
      <el-slider v-model="linkDistance" show-input :max="300" :step="50" show-stops></el-slider>作用力
      <el-slider v-model="bodyStrength" show-input :min="-1000" :max="0" :step="50" show-stops></el-slider>
      <br>
      <div>
        <el-switch v-model="svgTheme" active-text="黑暗模式" inactive-text="明亮模式"></el-switch>
      </div>
    </el-card>
    <network
      :nodeList="nodes"
      :linkList="links"
      :nodeSize="nodeSize"
      :linkWidth="linkWidth"
      :linkDistance="linkDistance"
      :svgTheme="svgTheme?'dark':'light'"
      :bodyStrength="bodyStrength"
    ></network>
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
      links: [],
      showSettingCard: false,
      nodeSize: 14,
      linkWidth: 2,
      linkDistance: 50,
      bodyStrength: -150,
      svgTheme: false, // light
    };
  },
  created() {
    let url =
      process.env.NODE_ENV === "production"
        ? "/vue-network-d3/example.json"
        : "/example.json";
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

.setting-box-button {
  position: fixed;
  overflow: auto;
  top: 20px;
  right: 40px;
  border: 2px solid rebeccapurple;
}

.setting-box-card {
  position: fixed;
  z-index: 10;
  overflow: auto;
  top: 15px;
  right: 15px;
  width: 500px;
  max-height: 700px;
}
.github-button {
  position: fixed;
  overflow: auto;
  top: 85px;
  right: 44px;
}
</style>
