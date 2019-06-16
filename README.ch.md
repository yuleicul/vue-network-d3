# vue-network-d3

> D3 力导向图的 Vue 组件。

## Demo

- [简易的 Demo](https://chencyl.github.io/vue-network-d3/)

  <img src="./doc-assets/simple-demo.gif" width="500px" />

  

- [电影图谱]() (coming soon...)

  <img src="./doc-assets/film-kg.gif" width="500px" />

## 安装

```
npm install vue-network-d3 --save
```

## 快速开始

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
        {"source": "Valjean", "target": "Labarre", "value": 1},
        {"source": "Napoleon", "target": "Valjean", "value": 2},
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

### 总览

```js
props: {
    nodeList: Array,
    linkList: Array,
    // 节点相关：
    nodeSize: {
      type: Number,
      default: 14
    },
    nodeTextKey: {
      type: String,
      default: "id"
    },
    nodeTypeKey: {
      type: String,
      default: "group"
    },
    nodeTextFontSize: {
      type: Number,
      default: 14
    },
    bodyStrength: {
      type: Number,
      default: -150
    },
    // 连线相关：
    linkWidth: {
      type: Number,
      default: 2
    },
    showLinkText: {
      type: Boolean,
      default: false
    },
    linkTextKey: {
      type: String,
      default: "value"
    },
    linkTypeKey: {
      type: String,
      default: "type"
    },
    linkTextFrontSize: {
      type: Number,
      default: 10
    },
    linkDistance: {
      type: Number,
      default: 50
    },
    // svg 画布相关：
    svgSize: {
      type: Object,
      default: () => {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    },
    svgTheme: {
      type: String,
      default: "light" // dark or light
    },
    // 其他：
    highlightNodes: {
      type: Array,
      default: () => {
        return [];
      }
    }
}

```

### 详细说明

> 「:star:」​ 代表必要的。

- :star: ​**nodeList**: Array of **Node Object**. 节点对象数组，节点包含属性：

  - :star: **id**: Number or String. 节点 id，也是节点的 name。如果想让节点的名称是属性 name 的值，需要将 **nodeTextKey** 赋值为 name（详情见下）。
  - **group**: Number or String. 节点的分类 / 分组 / 类型，同样，如果想让节点的类型是属性 type 的值，需要将 **nodeTypeKey** 赋值为 type（详情见下）。

- :star: **linkList**: Array of **Link Object**. 连线 / 关系对象数组，连线包含属性：

  - :star: **source**: Number or String. Id of source node.
  - :star: **target**: Number or String. Id of target node.
  - **value**: Number or String. 连线的名称，同样，如果想让连线的名称是属性 name 的值，需要将 **linkTextKey** 赋值为 name（详情见下）。

- **nodeSize**: Number. 节点大小。

- **nodeTextKey**: String. 节点名称的 key，默认是 'id'，如果你的节点对象像下面这样，那么你需要把 **nodeTextKey** 设置为 'name'

  ```js
  {
    id: 1010,
    name: 'Myriel'
  }
  ```

- **nodeTypeKey**: String. 节点类型的 key，默认是 'group'，如果你的节点对象像下面这样，那么你需要把 **nodeTypeKey** 设置为 'type'

  ```js
  {
    id: 'Myriel',
    type: 1
  }
  ```

- **nodeTextFontSize**: Number. 节点名称文本字体大小。

- **linkWidth**: Number. 连线宽度。

- **showLinkText**: Boolean. 是否显示连线名称文本，建议不显示，因为名称默认会在鼠标 hover 到连线上的时候显示。

- **linkTextKey**: String. 连线名称的 key，默认是 'value'，如果你的节点对象像下面这样，那么你需要把 **linkTextKey** 设置为 'name'

  ```js
  {
    source: 'Napoleon',
    target: "Myriel", 
    name: 'friend'
  }
  ```

- **linkTypeKey**: String. 连线类型的 key，默认是 'type'。

- **linkTextFrontSize**: Number. 连线名称文本字体大小。

- **linkDistance**: Number. 连线距离 / 长度。

- **svgSize**: **Object**. 包含：

  - **width**: Number. svg 画布的宽。
  - **height**: Number. svg 画布的高。

- **svgTheme**: String. svg 画布的主题颜色，有 'light' 和 'dark' 两种，默认是 'light'。

- **bodyStrength**: Number. 正值使节点相互吸引，负值使节点相互排斥。

- **highlightNodes**: Array of node id. 节点 id 数组，id 在此数组中的节点的**轮廓为黄色**。

## 事件

- **clickNode**: emits **(event, node-object)**
- **clickLink**: emits **(event, link-object)**
- **hoverNode**: emits **(event, node-object)**
- **hoverLink**: emits **(event, link-object)**

## 类

- **.element**: all nodes and links
- **.node**: all nodes
- **.link**: all links
- **.[type]**: [type] 类型的节点或边。在节点对象中，type 是 key 为 nodeTypeKey 的 key 的值。（好绕… 我晕了… 解释不清楚… 有问题发 issue 好了）
- **.selected**: 被点击的节点以及与它相连的第一层节点。


## 参考

### Repo

- [vue-d3-network](https://github.com/emiliorizzo/vue-d3-network), Vue component to graph networks using d3-force.

- [react-vis-force](https://github.com/uber/react-vis-force), d3-force graphs as React Components.


## TODO

- [x] Docs: props and events
- [ ] Learn [Vue-CLI](https://cli.vuejs.org/zh/) more
- [x] Fix: node's style when hover
- [ ] CI






