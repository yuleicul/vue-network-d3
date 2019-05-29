export default {
  getData() {
    console.log("正在获取数据")
const axios = require('axios');

    let nodeData = []
    let linkData = []
    let flag = true // 请求数据中
    
    axios.get('/douban-graph.json')
      .then(res => {
        console.log(res)
        res.data.forEach(item => {
          // console.log(item.title)
          nodeData.push({
            name: item.title
          })
         
        })
        flag = false
      })
      .catch(err => {
        console.log(err)
      })
    
  }
}