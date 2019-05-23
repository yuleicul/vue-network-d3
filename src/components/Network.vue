<template>
  <div>
    <button id="reset">reset</button>

    <!-- 这个到时候放在 view 上 写代码的时候放在这里方便 -->
    <div class="svgContainer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        :width="size.w"
        :height="size.h"
      >
        <!-- node and node-text -->
        <g>
          <g >
            <circle></circle>
            <text></text>
          </g>
          <g></g>
        </g>

        <!-- links and link-text -->
        <g>
          <g></g>
          <g></g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3"; // 先这样导入 最后优化的时候要按需导入

export default {
  name: "network"
};
</script>



<style scoped>
</style>
