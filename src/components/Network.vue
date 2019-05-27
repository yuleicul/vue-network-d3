<template>
  <div id="network">
    <button id="reset-button" @click="reset">reset</button>

    <!-- 这个到时候放在 view 上 写代码的时候放在这里方便 -->
    <!-- <div class="svgContainer"> -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :width="svgSize.width"
      :height="svgSize.height"
      :class="svgClass"
      :style="{'background-color': theme.bgcolor}"
      @mousedown="svgMousedown"
      @mouseup="svgMouseup"
      @mouseover.prevent="svgMouseover"
      @mouseout="svgMouseout"
    >
      <g id="container">
        <!-- links and link-text 注：先绘制边 -->
        <g>
          <g v-for="link in links" :key="link.index">
            <line
              :class="`${link.type} ${link.selected} link element`"
              :stroke="theme.linkStroke"
              stroke-width="2"
            ></line>
            <!-- dx dy 文字左下角坐标 -->
            <text
              v-if="showLinkText"
              dx="0"
              dy="0"
              class="link-text"
              :fill="theme.textFill"
              font-size="10"
            >{{link.name}}</text>
          </g>
        </g>

        <!-- node and node-text -->
        <g id="node-group">
          <g v-for="node in nodes" :key="node.index">
            <circle
              :fill="nodeColor(node.group)"
              stroke-width="3"
              :stroke="theme.nodeStroke"
              :class="`${node.type} ${node.showText?'selected' : ''} node element`"
              :r="nodeSize"
            ></circle>
            <text
              v-show="node.showText"
              dx="13"
              dy="0"
              class="node-text"
              :fill="theme.textFill"
              font-size="10"
            >{{node.name}}</text>
          </g>
          <g></g>
        </g>
      </g>
    </svg>
  </div>
  <!-- </div> -->
</template>

<script>
import * as d3 from "d3"; // 先这样导入 最后优化的时候要按需导入

let x = 0,
  y = 0,
  s = 1; // 记录缩放导致的位置偏移

// 元素的 classList 是 DOMTokenList
DOMTokenList.prototype.indexOf = Array.prototype.indexOf;

export default {
  name: "network",
  props: {
    nodes: Array,
    links: Array,
    showLinkText: Boolean,
    forceSize: {
      type: Object,
      default: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    // dark or light
    mode: {
      type: String,
      default: "light"
    }
  },
  data() {
    return {
      svgSize: {
        width: "100%",
        height: "100%"
      },
      svgClass: {
        mouseup: true,
        mousedown: false
      },
      // nodes: [],
      // links: [],
      selection: {
        links: [],
        nodes: []
      },
      pinned: [], // 被订住的中心节点的下标
      nodeSize: 10,
      force: d3.layout.force(),
      zoom: d3.behavior.zoom(),
      nodeColor: d3.scale.category20()
    };
  },
  computed: {
    theme() {
      if (this.mode === "light") {
        return {
          bgcolor: "white",
          nodeStroke: "white",
          linkStroke: "lightgray",
          textFill: "gray"
        };
      } else {
        return {
          bgcolor: "gray",
          nodeStroke: "white",
          linkStroke: "white",
          textFill: "white"
        };
      }
    }
  },
  created() {
    // 初始化 force 布局
    this.force
      .nodes(this.nodes)
      .links(this.links)
      .size([this.forceSize.width, this.forceSize.height]) //指定作用域范围
      .linkDistance(50) //指定连线长度
      .friction(0.9)
      .charge([-200]) //相互之间的作用力
      .gravity(0.2);

    this.force.start(); //开始作用

    let i = 0;
    this.links.forEach(link => {
      link.id = i++;
    });

    console.log(this.nodes);
    console.log(this.links);

    // 初始化 zoom
    this.zoom
      .translate([0, 0]) // 初始位置
      .scale(1) // 初始比例
      .scaleExtent([0.5, 4])
      .on("zoom", this.zoomed); //??? 直接写在<svg>上了不知是否ok
  },
  mounted() {
    // 给节点添加拖拽
    d3.selectAll(".node").call(this.force.drag);
    // 更新坐标 - 更新坐标 - 每一个 tick
    this.force.on("tick", () => {
      //更新连线坐标
      d3.selectAll(".link")
        .data(this.links)
        .attr({
          x1: d => d.source.x,
          y1: d => d.source.y,
          x2: d => d.target.x,
          y2: d => d.target.y
        });
      //更新节点坐标
      d3.selectAll(".node")
        .data(this.nodes)
        .attr({
          cx: d => d.x,
          cy: d => d.y
        });
      // 更新文字坐标
      d3.selectAll(".node-text")
        .data(this.nodes)
        .attr({
          x: d => d.x,
          y: d => d.y
        });
      d3.selectAll(".link-text")
        .data(this.links)
        .attr({
          x: d => (d.source.x + d.target.x) / 2,
          y: d => (d.source.y + d.target.y) / 2
        });
    });
    d3.select("svg")
      .call(this.zoom)
      .call(this.zoom.event);
  },
  methods: {
    svgMousedown(e) {
      // 如果是按在节点上的
      if (e.target.tagName === "circle") {
        // 阻止鼠标按下事件向下传播 -> 防止触发 zoom 的拖拽
        e.stopImmediatePropagation();
        if (this.pinned.length === 0) {
          this.pinnedState(e);
        } else {
          d3.selectAll(".element").style({
            opacity: 0.2
          });
          this.pinned = [];
        }
      } else {
        // 改变鼠标样式
        this.svgClass.mouseup = false;
        this.svgClass.mousedown = true;
      }
    },
    svgMouseup() {
      // 改变鼠标样式
      this.svgClass.mouseup = true;
      this.svgClass.mousedown = false;
    },
    svgMouseover(e) {
      if (e.target.nodeName === "circle") {
        if (this.pinned.length === 0) {
          this.selectedState(e);
        }
        // 强制刷新
        this.$forceUpdate();
      }
    },
    svgMouseout(e) {
      if (e.target.nodeName === "circle") {
        if (this.pinned.length === 0) {
          this.noSelectedState(e);
        }
        // 强制刷新
        this.$forceUpdate();
      }
    },
    selectedState(e) {
      // 节点自身显示文字、增加 selected class、添加进 selection
      e.target.__data__.showText = true;
      e.target.classList.add("selected");
      this.selection.nodes.push(e.target.__data__);
      // 周围节点显示文字、边和结点增加 selected class、添加进 selection
      this.lightNeibor(e.target.__data__);
      // 除了 selected 的其余节点透明度减小
      d3.selectAll(".element").style({
        opacity: 0.2
      });
    },
    noSelectedState(e) {
      // 节点自身不显示文字、移除 selected class
      e.target.__data__.showText = false;
      // e.target.classList.remove("selected");
      // 周围节点不显示文字、边和结点移除 selected class
      this.darkenNerbor();
      // 所有节点透明度恢复
      d3.selectAll(".element").style({
        opacity: 1
      });
    },
    pinnedState(e) {
      this.pinned.push(e.target.__data__.index);
      d3.selectAll(".element").style({
        opacity: 0.05
      });
    },
    lightNeibor(node) {
      this.links.forEach(link => {
        if (link.source.index === node.index) {
          link.selected = "selected";
          this.selection.links.push(link);
          this.selection.nodes.push(link.target);
          this.lightNode(link.target);
        }
        if (link.target.index === node.index) {
          link.selected = "selected";
          this.selection.links.push(link);
          this.selection.nodes.push(link.source);
          this.lightNode(link.source);
        }
      });
    },
    lightNode(selectedNode) {
      this.nodes.forEach(node => {
        if (node.index === selectedNode.index) {
          node.showText = true;
        }
      });
    },
    darkenNerbor() {
      this.links.forEach(link => {
        this.selection.links.forEach(selectedLink => {
          if (selectedLink.id === link.id) {
            link.selected = "";
          }
        });
      });
      this.nodes.forEach(node => {
        this.selection.nodes.forEach(selectednode => {
          if (selectednode.id === node.id) {
            node.showText = false;
          }
        });
      });
      // 清空 selection
      this.selection.nodes = [];
      this.selection.links = [];
    },
    zoomed() {
      // 缩放中：以鼠标所在的位置为中心
      // console.log(d3.event);
      x = d3.event.translate[0];
      y = d3.event.translate[1];
      s = d3.event.scale;
      d3.select("#container").attr(
        "transform",
        "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
      );
    },
    reset() {
      let zoom = this.zoom;
      d3.transition()
        .duration(250)
        .tween("zoom", function() {
          let si = d3.interpolate(s, 1);
          let xi = d3.interpolate(x, 0);
          let yi = d3.interpolate(y, 0);
          return function(t) {
            d3.select("svg").call(
              zoom.translate([xi(t), yi(t)]).scale(si(t)).event
            );
          };
        });
    }
  }
};
</script>

<style scoped>
#network {
  width: 100%;
  height: 100%;
}
svg {
  border: 1px solid #000;
  /* background-color:aliceblue */
}
svg.mouseup {
  cursor: -webkit-grab;
}
svg.mousedown {
  cursor: -webkit-grabbing;
}
.element {
  transition: opacity 0.5s ease;
}
.selected {
  opacity: 1 !important;
}
/* .pinned {
  opacity: 1 !important;
} */
.link {
  /* stroke: 'gray';
  stroke-width: 1; */
}
.link-text {
  /* fill: "gray";
  font-size: 10; */
}
.node {
  /* fill: "darkcyan"; 在 css 里使用不如在代码中使用权重高 */
  cursor: pointer;
}
.node-text {
  /* fill: "gray";
  font-size: 10; */
}
#reset-button {
  position: absolute;
}
</style>

