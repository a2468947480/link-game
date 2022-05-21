<template>
  <div id="content">
    <div id="board">
      <div class="blockRow" v-for="row in blocks" :key="row[0].row">
        <div :style="{
          backgroundColor: config.colors[item.color],
          borderWidth: item.color == 0 ? '0' : '5px'
        }" class="block" v-for="item in row" :key="item.col">
          <i v-if="item.selected" class="el-icon-star-on"></i>
        </div>
      </div>
    </div>
    <el-dialog title="新游戏" center :visible.sync="isDialogShow" width="320px" :show-close="falseData"
      :close-on-click-modal="falseData" :close-on-press-escape="falseData">
      <el-form label-width="80px">
        <el-form-item label="格子大小">
          <el-input-number v-model="config.blockSize" :min="30" :step="5"></el-input-number>
        </el-form-item>
        <el-form-item label="宽">
          <el-input-number v-model="config.width" :min="4" :step="2"></el-input-number>
        </el-form-item>
        <el-form-item label="高">
          <el-input-number v-model="config.height" :min="4" :step="2"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="">
        <el-button type="primary" >开始</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
#content {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;

  #board {
    border: 1px solid black;

    .blockRow {
      width: 100%;
      overflow: hidden;

      .block {
        border-radius: 0px;
        border-top-color: rgba(255, 2555, 255, .66);
        border-left-color: rgba(255, 2555, 255, .33);
        border-bottom-color: rgba(0, 0, 0, .5);
        border-right-color: rgba(0, 0, 0, .25);
        border-style: solid;
        box-sizing: border-box;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: rgba(0, 0, 0, .66);
      }
    }
  }
}
</style>

<script>
export default {
  name: "linkingGame",
  data() {
    return {
      falseData: false,
      isDialogShow: true,
      config: {
        blockSize: 50,
        width: 8,
        height: 8,
        colors: [
          "#ffffff",
          "#ff5353",
          "#ffa23b",
          "#fff957",
          "#b5ff61",
          "#68ffaf",
          "#76cdff",
          "#7c59ff",
          "#f595ff",
          "#aeaeae",
          "#525252",
        ]
      },
      blocks: [],
      selected: false,
      selectedRow: 0,
      selectedCol: 0,
      startTime: null,
    }
  },//end of  data
  mounted: function () {

  },
  methods: {


  }
}
</script>
