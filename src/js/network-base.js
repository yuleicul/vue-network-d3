
let w = 800;
let h = 400;

let zoom = d3.behavior.zoom()
  .translate([0, 0]) // 初始位置
  .scale(1)         // 初始比例
  .scaleExtent([0.5, 10])
  .on('zoom', zoomed)

let svg = d3.select('.svgContainer')
  .append('svg')
  .attr({
    'width': w,
    'height': h
  }).style({
    'border': '1px solid #000',
    'cursor': '-webkit-grab'
  })
  .on('mousedown', () => {
    svg.style({
      'cursor': '-webkit-grabbing'
    })
  })
  .on('mouseup', () => {
    svg.style({
      'cursor': '-webkit-grab'
    })
  })
  .call(zoom)


let container = svg.append('g')

let x = 0, y = 0, s = 1; // 记录缩放导致的位置偏移

// 绘制网格
container.append('g')
  .selectAll('line')
  .data(d3.range(0, w, 30))
  .enter()
  .append('line')
  .attr({
    x1: (d) => { return d },
    y1: 0,
    x2: (d) => { return d },
    y2: h,
    stroke: '#ddd',
    fill: 'none'
  })

container.append('g')
  .selectAll('line')
  .data(d3.range(0, h, 30))
  .enter()
  .append('line')
  .attr({
    x1: 0,
    y1: d => { return d },
    x2: w,
    y2: d => { return d },
    stroke: '#ddd',
  })

let nodes = [{ id: 1, name: "桂林", type: 'hello' }, { id: 2, name: "广州" },
{ id: 3, name: "厦门" }, { id: 4, name: "杭州" },
{ id: 5, name: "上海" }, { id: 6, name: "青岛" },
{ name: "天津" }, { id: 4, name: "桂林" }, { name: "广州" },
{ name: "厦门" }, { name: "杭州" },
{ name: "上海" }, { name: "青岛" },
{ name: "天津" }, { name: "桂林" }, { name: "广州" },
{ name: "厦门" }, { name: "杭州" },
{ name: "上海" }, { name: "青岛" },
{ name: "天津" }, { name: "桂林" }, { name: "广州" },
{ name: "厦门" }, { name: "杭州" },
{ name: "上海" }, { name: "青岛" },
{ name: "天津" }, { name: "桂林" }, { name: "广州" },
{ name: "厦门" }, { name: "杭州" },
{ name: "上海" }, { name: "青岛" },
{ name: "天津" }, { name: "桂林" }, { name: "广州" }]

let links = [{ source: 0, target: 1, name: 'rel', type: 'has' }, { source: 0, target: 2, name: 'rel' },
{ source: 0, target: 3, name: 'rel' }, { source: 1, target: 4, name: 'has' },
{ source: 1, target: 5, name: 'rel' }, { source: 1, target: 6, name: 'rel' }, { source: 5, target: 6, name: 'rel' }, { source: 7, target: 6, name: 'rel' }, { source: 9, target: 6, name: 'rel' }, { source: 8, target: 1, name: 'rel' }, { source: 1, target: 7, name: 'rel' }];

let selected = { nodes: [], links: [] }

// 力导图布局
let force = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .size([w, h]) //指定作用域范围
  .linkDistance(50) //指定连线长度
  .friction(0.9)
  .charge([-200]) //相互之间的作用力
  .gravity(0.2)

force.start();    //开始作用

// 将 nodes 的 index 赋值为自身 id
nodes.forEach(node => {
  if (node.id) {
    node.index = node.id
  }
});

console.log(nodes)
console.log(links)

// 先绘制边
let svg_links = container.append('g')
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr({
    class: d => d.type + ' link element',
    stroke: 'gray',
    'stroke-width': 1
  })
// 绘制节点
let color = d3.scale.category20();
let svg_nodes = container.append('g')
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr({
    r: '10',
    fill: (d, i) => {
      return color(i)
    },
    class: d => d.type + ' node element',
  }).style({
    cursor: 'pointer'
  })
  .call(force.drag);  //使得节点能够拖动

// 绘制描述节点的文字
var svg_node_texts = container.append('g')
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .attr({
    dx: 13,
    dy: 0,
    fill: "gray",
    text: d => d.name,
    class: d => d.type + ' node-text element',
    'font-size': 10
  })
  .text(d => d.name)

// 绘制描述连线的文字
var svg_link_texts = container.append('g')
  .selectAll("text")
  .data(links)
  .enter()
  .append("text")
  .attr({
    dx: 0, // 文字左下角坐标
    dx: 0,
    fill: 'gray',
    class: d => d.type + ' link-text element',
    'font-size': 10
  })
  .text(d => d.name)

// 更新坐标 - 每一个 tick 
force.on("tick", () => {
  //更新连线坐标
  svg_links.attr({
    x1: d => d.source.x,
    y1: d => d.source.y,
    x2: d => d.target.x,
    y2: d => d.target.y
  })
  //更新节点坐标
  svg_nodes.attr({
    cx: d => d.x,
    cy: d => d.y
  })
  // 更新文字坐标
  svg_node_texts.attr({
    x: d => d.x,
    y: d => d.y
  })
  svg_link_texts.attr({
    x: d => (d.source.x + d.target.x) / 2,
    y: d => (d.source.y + d.target.y) / 2
  })
})

// 缩放中：以鼠标所在的位置为中心
function zoomed() {
  console.log(d3.event)
  x = d3.event.translate[0]
  y = d3.event.translate[1]
  s = d3.event.scale

  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// 复原
function reset() {
  d3.transition().duration(250).tween("zoom", function () {
    let si = d3.interpolate(s, 1);
    let xi = d3.interpolate(x, 0);
    let yi = d3.interpolate(y, 0);
    return function (t) {
      svg.call(zoom.translate([xi(t), yi(t)]).scale(si(t)).event);
    }
  })
}
d3.select('#reset').on('click', reset);

// 鼠标按下节点监听
d3.selectAll('circle').on('mousedown', function () {
  // 组织鼠标按下事件向下传播 -> 防止触发 zoom 的拖拽
  d3.event.stopImmediatePropagation()
  // 寻找邻居节点
  // findNeibor(this)
  d3.select(this)
    .classed({
      selected: true
    })
  // console.log(this)
})

// 鼠标悬停节点监听
d3.selectAll('circle').on('mouseover', function () {
  console.log("hover")
  console.log(this)
  d3.select(this)
    .classed({
      hover: true
    })
  d3.selectAll('.element:not(.hover)')
    .classed({
      nohover: true
    })

  // selected.push(this)
  // console.log("up")
  // d3.select(this).attr({
  //   class: 'selected'
  // })
})

// 鼠标离开节点监听
d3.selectAll('circle').on('mouseout', function () {
  console.log("hover out")
  console.log(this)
  d3.select(this)
    .classed({
      hover: false
    })
  d3.selectAll('.element:not(.hovered)')
    .classed({
      nohover: false
    })

  // selected.push(this)
  // console.log("up")
  // d3.select(this).attr({
  //   class: 'selected'
  // })
})

svg.call(zoom.event);

// 给字体加上类
// 让字体和节点一起成为 g
// 节点和边 hover 显示文字
// selected and selectedNeibor (array.find())



// 查找第一层

// 选中放大居中
// d3.selectAll('circle').on('click', function () {
//   var circle = d3.select(this);
//   // 如果是已经放大居中的元素
//   console.log(this)
//   console.log(circle)
//   if (selected)
//     if (this.getAttribute('class').indexOf('selected') !== -1) {
//       console.log('s')
//       reset()
//       return
//     }
//   circle.transition().duration(250).tween("zoom", function () {
//     var r = this.getAttribute('r') * 1;
//     var cx = this.getAttribute('cx') * 1;
//     var cy = this.getAttribute('cy') * 1;
//     var si = d3.interpolate(s, 4);
//     var xi = d3.interpolate(x, (w - r) / 2 - 4 * cx);
//     var yi = d3.interpolate(y, (h - r) / 2 - 4 * cy);
//     return function (t) {
//       svg.call(zoom.translate([xi(t), yi(t)]).scale(si(t)).event);
//     }
//     selected.push(this)
//     console.log("up")
//     d3.select(this).attr({
//       class: 'selected'
//     })
//   });
// });

// 寻找选中节点的邻居节点
// 关于数据绑定的还是用 vue 来写比较好
// function findNeibor(selectedNode) {
//   console.log("被按下的节点")
//   console.log(selectedNode)
//   selected.nodes.push(selectedNode)
//   selected.links = links.filter((link)=> {
//     if (link.source.index === selectedNode.__data__.index || 
//         link.target.index === selectedNode.__data__.index) {

//           link.source.type = 'selected'
//           console.log(link.source)
//       return true  
//     }
//   })
//   // d3.selectAll(selected.links)
//   //   .classed({
//   //     selected: true
//   //   })
//   console.log(selected)
// }
