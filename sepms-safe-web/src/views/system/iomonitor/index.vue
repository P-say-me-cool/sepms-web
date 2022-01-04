<template>
  <div>
    <el-row :gutter="4">


      <el-col :span="8" >
    <div class="wzt_formQuery" style="height: 830px">
        <el-col :span="24" style="margin-top: 15px">
          <el-form :model="queryParams" ref="factoryForm" :inline="true">
            <el-form-item label="工厂:" prop="factory">
              <el-select
                v-model="queryParams.factory"
                placeholder="请选择工厂"
                clearable
                size="mini"
                @change="changeFactory"
              >
                <el-option
                  v-for="item in factoryList"
                  :key="item.id"
                  :label="item.modelName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-refresh"
                type="primary"
                size="mini"
                @click="resetFacQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col
          :span="24"
          style="
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            background-color: white;
            margin-top: 2px;
          "
        >
          <div class="headersimg">进厂物料监控
            <div class="">
            </div>
          </div>

          <div
            style="
              height: 300px;
              box-sizing: border-box;
              overflow: auto;
              padding-top: 25px;
            "
          >
            <div
              style="height: 180px; overflow: hidden;padding-left:-40px;"
              v-for="(item, key) in this.materialList.inFactory"
              :key="key"
              class="maxles"
            >
              <div>
                <div
                  style="height: 300px; width: 200px; float: left"
                  :id="'miax' + key"
                  class="maxles"
                ></div>
                <div class="" style="padding-top: 30px">
                <span>
                  {{ item.materialName }}
                </span>
                   <br />
                   <span>
                  月累计量： {{ item.monthCount }}
                </span>
                   <br />
                   <span>
                  月计划量： {{ item.reMonthCount }}
                </span>
                   <br />
                   <span>
                  完成进度： {{ item.percent }} <br />

                   </span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col
          :span="24"
          style="
            border: 1px solid rgba(0, 0, 0, 0.1);
            background-color: white;
            margin-top: 5px;
          "
        >
          <div class="headersimg">出厂物料监控</div>

          <div
            style="
              height: 300px;
              box-sizing: border-box;
              overflow: auto;
              padding-top: 25px;

            "
          >
            <div
              style="height: 180px; overflow: hidden;padding-left:-40px;"
              v-for="(item, key) in this.materialList.outFactory"
              :key="key"
              class="maxls"

            >
              <div>
                <div
                  style="height: 300px; width: 200px;margin-top:30px;float: left;margin-left:-30px;margin-right:30px"
                  :id="'mia' + key"
                  class="maxles"
                ></div>
                <div style="padding-top: 30px">
                  {{ item.materialName }} <br />
                  月累计量： {{ item.monthCount }} <br />
                  月计划量： {{ item.reMonthCount }} <br />
                  完成进度： {{ item.percent }} <br />
                </div>
              </div>
            </div>
          </div>
        </el-col>
    </div>
      </el-col>

      <!--进出厂点监控框-->
      <el-col class="youce" :span="16" style="height: 668px;">
<div class="wzt_formQuery" style="margin-left: 7px;height: 830px">
        <el-col :span="24" style="margin-top: 15px">
          <el-form
            :model="eqIoParams"
            ref="queryForm"
            :inline="true"
            :rules="rules"
          >
            <el-form-item label="进出厂点监控组:" prop="monitorId">
              <el-select
                v-model="eqIoParams.monitorId"
                placeholder="请选择监控组"
                clearable
                size="mini"
              >
                <el-option
                  v-for="item in monitorList"
                  :key="item.monitorId"
                  :label="item.monitorName"
                  :value="item.monitorId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="进出厂点:" prop="name">
              <el-input
                v-model="eqIoParams.name"
                size="mini"
                clearable
                placeholder="请输入进出厂点"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <el-table
            v-loading="loading"
            :data="monList"
            ref="multipleTable"
            style="max-height: 30vh; overflow: auto"
          >
            <el-table-column width="30px" align="center">
              <template scope="scope">
                <el-radio
                  v-model="radio"
                  :label="scope.row.id"
                  @change.native="handleRowChange(scope.row)"
                  >&nbsp;&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column label="进出厂点" align="center" prop="name" />
            <el-table-column
              label="运输类型"
              align="center"
              prop="transportType"
              :formatter="transportTypeFormat"
            />
            <el-table-column
              label="进出类型"
              align="center"
              prop="inOutType"
              :formatter="inOutTypeFormat"
            />
            <el-table-column
              label="已配置物料"
              align="center"
              width="150"
              prop="material"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
            <span style="max-width:140px;display:block;overflow:hidden;
            text-overflow:ellipsis;
            white-space: nowrap">
                  {{scope.row.material}}</span>
          </template>
            </el-table-column>
          </el-table>
        </el-col>
        <div class="overauto">
        <el-col
          v-for="(item, key) in selectedList"
          :key="key"
          class="neirong"
          :span="24"
           style="height: 290px;"
        >
          <div style="height: 290px" v-if="selectedList != 'null'">
            <span class="shangzhong">
              <div style="display: block">{{ item.materialName }}</div>
              <div>
                <span v-if="item.type == 0">日进量：{{ item.amount }}</span>
                <span v-if="item.type == 1">日出量：{{ item.amount }}</span>
              </div>
            </span>

            <div class="jia_iucheng">
              <span
                style="margin-left: -30px; margin-right: 30px"
                v-if="item.transType == 0"
              >
                <img
                  style="height: 150px; width: 150px"
                  src="@/assets/images/train.png"
                  alt=""
                />
              </span>
              <span
                style="
                  margin-left: -30px;
                  margin-right: 30px;
                  height: 150px;
                  width: 150px;
                "
                v-if="item.transType == 1"
              >
                <img
                  style="height: 150px; width: 150px"
                  src="@/assets/images/txai.png"
                  alt=""
                />
              </span>
              <span
                style="
                  margin-left: -30px;
                  margin-right: 30px;
                  height: 150px;
                  width: 150px;
                "
                v-if="item.transType == 2"
              >
                <img
                  style="height: 150px; width: 150px"
                  src="@/assets/images/guanyun.png"
                  alt=""
                />
              </span>
              <span
                style="
                  margin-left: -30px;
                  margin-right: 30px;
                  height: 150px;
                  width: 150px;
                "
                v-if="item.transType == 3"
              >
                <img
                  style="height: 150px; width: 150px"
                  src="@/assets/images/lunchuan.png"
                  alt=""
                />
              </span>
              <!-- <span > -->
              <img
                v-if="item.type == 1"
                style="
                  height: 20px;
                  margin-top: 65px;
                  transform: rotate(180deg);
                "
                src="@/assets/images/zhixiang.png"
                alt=""
              />
              <img
                v-if="item.type == 0"
                style="height: 20px; margin-top: 65px"
                src="@/assets/images/zhixiang.png"
                alt=""
              />
              <!-- </span> -->
              <span
                style="
                  margin-left: 30px;
                  margin-right: -30px;
                  height: 150px;
                  width: 150px;
                "
              >
                <img v-if="item.name == '二系煤场'" src="@/assets/images/twoCoal.png" alt="">
                <img v-else-if="item.name == '四系煤场'" src="@/assets/images/fourCoal.png" alt="">
                <img
                  v-else-if="item.imageType == '1'"
                  style="height: 150px; width: 150px"
                  src="@/assets/images/guan.png"
                  alt=""
                />
                <img v-else-if="item.imageType == '2'"
                     style="height: 150px; width: 70px"
                     src="@/assets/images/pipeinout.png"
                     alt=""
                />
              </span>
            </div>

            <div style="margin: 0 auto; text-align: center">
              <div v-if="item.type == 0">
                {{ item.name }} 收 {{ item.ioName }}
                <span>{{ item.beginTime }}至{{ item.endTime }}</span>
                <span v-if="item.endTime">
                  {{ item.endTime }}
                </span>
                <span style="width: 100px" v-else></span>
              </div>
              <div v-if="item.type == 1">
                {{ item.name }} 付 {{ item.ioName }}
                <span style="margin-left: 3%">{{ item.beginTime }}至</span>
                <span v-if="item.endTime">
                  {{ item.endTime }}
                </span>
                <span style="width: 100px" v-else></span>
              </div>
            </div>
          </div>
        </el-col>
        </div>
    </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  listMonitorIO,
  getIoList,
  getMonitorInfo,
} from "../../../api/system/monitor";
import { getModelDict } from "@/api/model/modeltree";
import { queryMaterial } from "@/api/system/iomonitor";
import * as echarts from "echarts";
export default {
  name: "Iomonitor",
  data() {
    return {
      photo: null,
      radio: "",
      selectedList: "", //存储表格选中的行数据
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      //删除存储ID
      id: null,
      // 总条数
      total: 0,
      // 工厂数据
      factoryList: [],
      //节点类型
      monitorList: [],
      //物料集合
      materialList: {},
      // 运输类型字典
      transportTypeOptions: [],
      // 进出类型字典
      inOutTypeOptions: [],
      monList: [],
      // 查询参数
      queryParams: {
        factory: null,
      },
      eqIoParams: {
        monitorId: "",
        name: null,
      },
      materialParam: {
        ioId: "",
        transType: "",
        ioName: "",
        type: "",
      },
      // 表单校验
      rules: {
        monitorId: [
          { required: true, message: "监控组不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getFactorys();
    this.getMonitorGroup();
    this.getDicts("in_out_type").then((response) => {
      this.ioTypeOptions = response.data;
    });
    this.getDicts("mechanical_type").then((response) => {
      this.transportTypeOptions = response.data;
    });
  },
  watch: {
    materialList() {
      var myChart;
      var list = this.materialList;

      setTimeout(function () {
        if (list.inFactory) {
          for (var i = 1; i < list.inFactory.length + 1; i++) {
            var mias = list.inFactory[i - 1];
            var chazhi = mias.reMonthCount - mias.monthCount;
            if (chazhi < 0) {
              chazhi = 0;
            }
            var chartDom = document.getElementById("miax" + (i - 1));
            console.log(chartDom, "mia" + i, i);
            myChart = echarts.init(chartDom);
            var option;
            var dates;
            if (mias.monthCount == 0) {
              dates = [{ name: "完成量", value: mias.monthCount }];
            } else {
              dates = [
                { name: "未完成", value: chazhi },
                { name: "完成量", value: mias.monthCount },
              ];
            }
            option = {
              tooltip: {
                trigger: "item",
              },
              legend: {
                top: "5%",
                left: "center",
                show: false,
              },
              series: [
                {
                  name: "完成量",
                  type: "pie",
                  // width: 200,
                  // height: 150,
                  radius: ["40%", "70%"],
                  avoidLabelOverlap: false,
                  label: {
                    show: false,
                    position: "center",
                  },
                  emphasis: {
                    label: {
                      show: false,
                      fontSize: "16",
                      fontWeight: "bold",
                    },
                  },
                  labelLine: {
                    show: false,
                  },
                  data: dates,
                },
              ],
            };
              option && myChart.setOption(option);
          }
        }
        if (list.outFactory) {
          for (var i = 1; i < list.outFactory.length + 1; i++) {
            var dates;
            var mias = list.outFactory[i - 1];
            if (mias.monthCount == 0) {
              dates = [{ name: "完成量", value: mias.monthCount }];
            } else {
              dates = [
                { name: "完成量", value: mias.monthCount },
                { name: "未完成", value: chazhi },
              ];
            }
            var chazhi = mias.reMonthCount - mias.monthCount;
            if (chazhi < 0) {
              chazhi = 0;
            }
            if (mias.monthCount == 0) {
              dates = [{ name: "完成量", value: mias.monthCount }];
            } else {
              dates = [
                { name: "未完成", value: chazhi },
                { name: "完成量", value: mias.monthCount },
              ];
            }
            // setTimeout(() => {
            var chartDom = document.getElementById("mia" + (i - 1));
            console.log(chartDom);
            // }, 1);

            myChart = echarts.init(chartDom);
            var option;

            option = {
              tooltip: {
                trigger: "item",
              },
              legend: {
                top: "5%",
                left: "center",
                show: false,
              },
              series: [
                {
                  name: "完成量",
                  type: "pie",
                  width: 200,
                  height: 150,
                  radius: ["40%", "70%"],
                  avoidLabelOverlap: false,
                  label: {
                    show: false,
                    position: "center",
                  },
                  emphasis: {
                    label: {
                      show: false,
                      fontSize: "16",
                      fontWeight: "bold",
                    },
                  },
                  labelLine: {
                    show: false,
                  },
                  data: dates,
                },
              ],
            };
            option && myChart.setOption(option);
          }
        }
      }, 1);
    },
  },
  methods: {
    getMonitorInfo() {
      this.loading = true;
      if (this.eqIoParams.monitorId == "" && this.eqIoParams.name != null) {
        this.loading = false;
        return this.msgError("请选择监控组");
      } else {
        getMonitorInfo(this.eqIoParams).then((response) => {
          if (response.success) {
            this.monList = response.result;
            this.total = response.total;
            this.loading = false;
          }
        });
      }
    },
    getMonitorGroup() {
      listMonitorIO().then((response) => {
        let ss = [];
        for (let i = 0; i < response.result.length; i++) {
          ss.push({
            monitorId: response.result[i].id,
            monitorName: response.result[i].monitorName,
          });
        }
        this.monitorList = ss;
        this.eqIoParams.monitorId = this.monitorList[0].monitorId;
      });
    },
    // 运输类型字典翻译
    transportTypeFormat(row, column) {
      return this.selectDictLabel(this.transportTypeOptions, row.transportType);
    },
    // 进出类型字典翻译
    inOutTypeFormat(row, column) {
      return this.selectDictLabel(this.ioTypeOptions, row.inOutType);
    },
    //获取工厂信息
    getFactorys() {
      getModelDict({
        level: "2",
        type: "pm_model_company",
        iStree: false,
      }).then((response) => {
        this.factoryList = response.result;
        this.queryParams.factory = this.factoryList[0].id;
        this.getCommonWay(this.queryParams.factory)
      });
    },

    getCommonWay(data) {
      getIoList(data).then((response) => {
        this.materialList = response;
        // console.log(this.materialList.inFactory.length);

        // setTimeout( ()=>{ //延时加载echarts初始化函数

        let newPromise = new Promise((resolve) => {
          resolve();
        });
        //然后异步执行echarts的初始化函数
        newPromise.then(() => {
          this.$nextTick(function () {});
        });
        //  },100)
      });
    },
    //根据工厂id获取所有进出厂点物料信息
    async changeFactory(data) {
     this.getCommonWay(data);

      // var chartDoms = document.getElementById("mians");
      // var myCharts = echarts.init(chartDoms);
      // var options;

      // options = {
      //   tooltip: {
      //     trigger: "item",
      //   },
      //   legend: {
      //     top: "5%",
      //     left: "center",
      //     show: false,
      //   },
      //   series: [
      //     {
      //       name: "完成量",
      //       type: "pie",
      //       width: 200,
      //       height: 150,
      //       radius: ["40%", "70%"],
      //       avoidLabelOverlap: false,
      //       label: {
      //         show: false,
      //         position: "center",
      //       },
      //       emphasis: {
      //         label: {
      //           show: false,
      //           fontSize: "16",
      //           fontWeight: "bold",
      //         },
      //       },
      //       labelLine: {
      //         show: false,
      //       },
      //       data: [{ value: 20 }],
      //     },
      //   ],
      // };

      // options && myCharts.setOption(options);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.radio = "";
      this.queryParams.pageNum = 1;
      this.selectedList = "";
      this.getMonitorInfo();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.selectedList = "";
      this.radio = "";
      this.resetForm("queryForm");
      this.getMonitorInfo();
    },
    resetFacQuery() {
      this.materialList = []
      this.resetForm("factoryForm");
    },

    handleRowChange(row) {
      var that = this;
      this.materialParam.ioId = row.id;
      this.materialParam.transType = row.transportType;
      this.materialParam.ioName = row.name;
      this.materialParam.type = row.inOutType;
      queryMaterial(this.materialParam).then((response) => {
        that.selectedList = response;
      });
      console.log(this.selectedList);
    },
    getDate() {
      //获取当前时间
      let date = new Date();
      //dateFormat("YYYY-mm-dd HH:MM", date)
      //格式化为本地时间格式
      var date1 = date.toLocaleString();
      try {
        //将时间写入div
        var div1 = document.getElementById("time");
        div1.innerText =
          "当前时间: " + dateFormat("YYYY年mm月dd日 HH:MM:SS", date);
      } catch (e) {}
    },
  },
  mounted() {
    setInterval(this.getDate, 1000);
  },
};
function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
</script>
<style scoped>
.headersimg {
  height: 40px;
  width: 100%;
  padding-left: 5px;
  line-height: 40px;
  background-color: white;
  font-size: 15px;
  border-bottom: 1px solid #cccccc;
}
.neirong {
  position: relative;
  background-color: white;
  padding-left: 30px !important;
  padding-top: 30px;
}
/* 用来设置当前页面element全局table的内间距 */
.el-table__row td {
  padding: 0;
}
.shangzhong {
  width: 300px;
  text-align: center;
  position: absolute;
  margin-left: -150px;
  left: 50%;
}
/* 用来设置当前页面element全局table 选中某行时的背景色*/
.el-table__body tr.current-row > td {
  background-color: #f19944 !important;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}

/* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #f19944;
  /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}
.jia_iucheng {
  margin-top: 2vh;
  margin-bottom: 2vh;
  box-sizing: border-box;
  padding: 0 15%;
  display: flex;
  align-content: center;
  justify-content: space-around;
}
#time {
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
}
.youce .el-col {
  height: auto !important;
}
/deep/ .maxles div > canvas {
  height: 150px !important;
  width: 200px !important;
}
/deep/ .maxls div > canvas {
  height: 180px !important;
  width: 265px !important;
}
.zhongjian span{
  white-space: nowrap;    /*规定文本不换行**/
}
.overauto{
height: 400px;
  overflow:auto;
  }
</style>
