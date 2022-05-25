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
        <el-form-item label="方块大小">
          <el-input-number v-model="config.blockSize" :min="30" :step="5"></el-input-number>
        </el-form-item>
        <el-form-item label="宽">
          <el-input-number v-model="config.width" :min="4" :step="2"></el-input-number>
        </el-form-item>
        <el-form-item label="高">
          <el-input-number v-model="config.height" :min="4" :step="2"></el-input-number>
        </el-form-item>
        <p>宽是横着几个方块,高是竖着几个方块</p>
      </el-form>
      <span slot="footer" class="">
        <el-button type="primary" @click="checksize()">开始</el-button>
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
        width: 4,
        height: 4,
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
    //检查游戏界面是否超出屏幕,不超出则开始游戏,超出则弹框提醒
    checksize() {
      //console.log(this.config.blockSize);
      //console.log(window.screen.availHeight)
      if (this.config.height * this.config.blockSize > window.screen.availHeight) {
        this.$alert(("游戏区域的高已经超过您的屏幕,请调整高或者方块大小" +
          "<br/>" + "当前游戏界面高度为:" + this.config.height * this.config.blockSize +
          "<br/>" + "您当前屏幕高度为" + window.screen.availHeight), {
          dangerouslyUseHTMLString: true,
        })
      } else if (this.config.width * this.config.blockSize > window.screen.availWidth) {
        this.$alert(("游戏区域的宽已经超过您的屏幕,请调整宽或者方块大小" +
          "<br/>" + "当前游戏界面宽度为:" + this.config.width * this.config.blockSize +
          "<br/>" + "您当前屏幕宽度为" + window.screen.availWidth), {
          dangerouslyUseHTMLString: true,
        })
      } else {
        this.start();
      }
    },
    //开始游戏
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
      //格子大小设定并确认后立即渲染(修改)前端样式,否侧无法正常修改
      this.$nextTick(() => {
        $(".block").css("width", this.config.blockSize)
          .css("height", this.config.blockSize);
      });

      //给每个方块上色 22一组 保证偶数,最外层为白
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
    //方块点击事件
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
        else {
          //console.log('stfalse');
          //console.log(this.selectedRow, this.selectedCol);
          //如果当前点击的方块和上一次点击的方块颜色相同则消除两个方块
          if (this.blocks[row][col].color == this.blocks[this.selectedRow][this.selectedCol].color) {
            //console.log("yes");
            if (this.canLink(row, col, this.selectedRow, this.selectedCol) == true) {
              this.blocks[row][col].color = 0;
              this.blocks[this.selectedRow][this.selectedCol].color = 0;
              this.blocks[this.selectedRow][this.selectedCol].selected = false;
              this.selected = false;
              //每次成功消除方块且所有数据刷新后会调用结束判定,如果判定结束,则显示所消耗的时间并重新把棋盘设置界面调出
              this.$nextTick(() => {
                if (this.isWin()) {
                  let endTime = new Date();
                  let diff = (endTime.getTime() - this.startTime.getTime()) / 1000;
                  this.$alert("Win! Time: " + diff + " s", {
                    callback: () => {
                      this.isDialogShow = true;
                    }
                  });
                }
              })
            } else {
              //不可连，直接选第二个
              this.blocks[this.selectedRow][this.selectedCol].selected = false;
              this.blocks[row][col].selected = true;
              this.selectedRow = row;
              this.selectedCol = col;
            }
          } else {
            //颜色不一样，则选第二个
            //console.log(3);
            this.blocks[this.selectedRow][this.selectedCol].selected = false;
            this.blocks[row][col].selected = true;
            this.selectedRow = row;
            this.selectedCol = col;
          }
        }
      } else {
        if (row >= 1 && row <= this.config.height && col >= 1 && col <= this.config.width && this.blocks[row][col].color != 0) {
          //直接选中
          this.blocks[row][col].selected = true;
          this.selected = true;
          this.selectedRow = row;
          this.selectedCol = col;
        }
      }
    },
    //判定是否可以消除
    canLink(r1, c1, r2, c2) {
      //console.log(r1, c1, r2, c2);
      //1号情况判定
      if (this.canLinkBy1(r1, c1, r2, c2)) {
        //console.log("can1");
        return true;
      }
      //2号判定
      if (this.canLinkBy2(r1, c1, r2, c2)) {
        //console.log("can2");
        return true;
      }
      //3号判定
      if (this.canLinkBy3(r1, c1, r2, c2)) {
        //console.log("can3");
        return true;
      }
      return false;
    },
    //1号情况判定逻辑
    canLinkBy1(r1, c1, r2, c2) {
      let min = 0, max = 0, total = 0;
      //只有在一条线上才能满足1线
      if (r1 == r2) {
        min = Math.min(c1, c2);
        max = Math.max(c1, c2);
        for (let i = min + 1; i <= max - 1; i++) {
          total += this.blocks[r1][i].color;
        }
        return total == 0;
      } else if (c1 == c2) {
        min = Math.min(r1, r2);
        max = Math.max(r1, r2);
        for (let i = min + 1; i <= max - 1; i++) {
          total += this.blocks[i][c1].color;
        }
        return total == 0;
      } else return false;
    },
    //二号情况判定逻辑
    canLinkBy2(r1, c1, r2, c2) {
      //方块1和方块2的横竖线交点为空,以及方块到交点路径上为空怎么满足2线
      if (this.blocks[r1][c2].color == 0) {
        if (this.canLinkBy1(r1, c1, r1, c2) && this.canLinkBy1(r1, c2, r2, c2))
          return true;
      }
      if (this.blocks[r2][c1].color == 0) {
        if (this.canLinkBy1(r1, c1, r2, c1) && this.canLinkBy1(r2, c1, r2, c2))
          return true;
      }
      return false;
    },
    //3号情况判定逻辑
    canLinkBy3(r1, c1, r2, c2) {
      //遍历所有方块,当遇到空方块的时候,判定该方块是否和第一次选择的方块之间通(满足can2),判断是否和当前选择的方块为一线(满足can1)
      //如果都满足,则证明两方块之间通,满足3线
      for (let i = 0; i < this.config.height + 2; i++) {
        for (let j = 0; j < this.config.width + 2; j++) {
          if (this.blocks[i][j].color == 0) {
            if (this.canLinkBy1(r1, c1, i, j) == true && this.canLinkBy2(i, j, r2, c2) == true)
              return true;
          }
        }
      }
      return false;
    },
    //遍历棋盘,全部为空则判定胜利
    isWin() {
      for (let i = 1; i <= this.config.height; i++) {
        for (let j = 1; j <= this.config.width; j++) {
          if (this.blocks[i][j].color != 0)
            return false;
        }
      }
      return true;
    }
  }
}//end of method
</script>
