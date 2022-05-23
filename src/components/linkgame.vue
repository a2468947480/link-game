<template>
  <div id="content">
    <div id="board">
      <div class="blockRow" v-for="row in blocks" :key="row[0].row">
        <div :style="{
          backgroundColor: config.colors[item.color],
          borderWidth: item.color == 0 ? '0' : '5px'
        }" class="block" v-for="item in row" :key="item.col" @click="click(item.row, item.col)">
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
        <el-button type="primary" @click="start()">开始</el-button>
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
import $ from 'jquery';
export default {
  name: "linkgame",
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
    start() {
      //console.log("START");
      this.isDialogShow = false;
      this.startTime = new Date();

      //初始化棋盘
      $("#board").css("width", (this.config.width + 2) * this.config.blockSize)
        .css("height", (this.config.height + 2) * this.config.blockSize);

      //生成方块,并设置每个方块的属性
      this.blocks = [];
      for (let i = 0; i < this.config.height + 2; i++) {
        this.blocks.push([]);
        for (let j = 0; j < this.config.width + 2; j++) {
          this.blocks[i].push({
            row: i,
            col: j,
            color: 0,
            selected: false
          });
          //console.log(this.blocks[i][j]);
        }
      }

      this.$nextTick(() => {
        $(".block").css("width", this.config.blockSize)
          .css("height", this.config.blockSize);
      });

      //给每个方块上色 22一组 保证偶数
      let tempColor = 0, flag = true;
      for (let i = 1; i <= this.config.height; i++) {
        for (let j = 1; j <= this.config.width; j++) {
          if (flag) {
            tempColor = Math.floor(Math.random() * (this.config.colors.length - 1)) + 1;
            flag = false;
          } else {
            flag = true;
          }
          this.blocks[i][j].color = tempColor;
          //console.log(this.blocks[i][j].color);
        }
      }
      //打乱,方块随机交换
      for (let i = 1; i <= this.config.height; i++) {
        for (let j = 1; j <= this.config.width; j++) {
          let randH = Math.floor(Math.random() * this.config.height) + 1;
          let randW = Math.floor(Math.random() * this.config.width) + 1;
          let temp = this.blocks[i][j].color;
          this.blocks[i][j].color = this.blocks[randH][randW].color;
          this.blocks[randH][randW].color = temp;
        }
      }
    },
    click(row, col) {
      //console.log("click");
      //console.log(row, col);
      //console.log(this.selectedRow, this.selectedCol);
      //console.log(this.selected);
      if (this.selected == true) {
        //如果该方块已经被消掉或者重复选取
        if (this.blocks[row][col].color == 0 || (row == this.selectedRow && col == this.selectedCol)) {
          //取消选择
          this.blocks[this.selectedRow][this.selectedCol].selected = false;
          this.selected = false;
        }
      } else {
        //console.log('stfalse');
        //console.log(this.selectedRow, this.selectedCol);
        //如果当前点击的方块和上一次点击的方块颜色相同则消除两个方块
        if (this.blocks[row][col].color == this.blocks[this.selectedRow][this.selectedCol].color) {
          //console.log("yes");
          this.blocks[row][col].color = 0;
          this.blocks[this.selectedRow][this.selectedCol].color = 0;
          this.blocks[this.selectedRow][this.selectedCol].selected = false;
          this.selected = false;

        } else {
          //颜色不一样，则选第二个
          //console.log(3);
          this.blocks[this.selectedRow][this.selectedCol].selected = false;
          this.blocks[row][col].selected = true;
          this.selectedRow = row;
          this.selectedCol = col;
        }
      }
    },
  }//end of method
}
</script>
