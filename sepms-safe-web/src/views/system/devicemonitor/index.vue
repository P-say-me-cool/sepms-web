<template>
  <div class="app-container ">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form class="allinput formQuery"  :model="queryParams" :rules="rules" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="装置组：" prop="deviceGroupId" style="margin-left: 10px;">
        <el-select v-model="queryParams.deviceGroupId" placeholder="请选择装置组" clearable size="small">
          <el-option
            v-for="dict in deviceGroup"
            :key="dict.id"
            :label="dict.deviceGroupName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开停工状态：" prop="creator">
        <el-select v-model="queryParams.deviceStatus" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in deviceStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button  type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="formQuery form_content_pagination">
    
    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="装置名称" align="center" prop="deviceName"/>
      <el-table-column label="工厂" align="center" prop="factory"/>
      <el-table-column label="车间" align="center" prop="workShop"/>
      <el-table-column label="所属界区" align="center" prop="area"/>
      <el-table-column label="开停工状态" align="center" prop="deviceStatus" :formatter="deviceStatusFormat"/>
      <el-table-column label="加工能力" align="center" prop="processingCapacity"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    </div>

    <!-- 添加分配侧线-->
    <div style="border: 1px solid #d8dce5;width:100%;margin-top: 15px;display: inline-block;" class="qingchu"
         v-for="(item,index) in monitorDetailList" :key="index">

      <div style="width: 100%;float: left;padding-left:10px">
        <div style="font-size:14px;height:40px;line-height:40px">{{item.deviceName}}实时数据</div>
        <div style="font-size:16px;height:40px;">
          <span style="margin-left: 2%;font-size:14px;">监控时间：
           <el-date-picker
             v-model="item.datatime"
             type="datetimerange"
             value-format="yyyy-MM-dd HH:mm:ss"
             range-separator="至"
             start-placeholder="开始日期"
             size="mini"
             end-placeholder="结束日期"
             @change="(value) => dataTimeChange(value, index)"
           >
              </el-date-picker>
          </span>
          <el-button type="primary" size="mini" style="margin-left: 10px;" @click="echartsPipe(index)">生成历史趋势图
          </el-button>
          <el-button type="primary" size="mini" @click="flashInstantaneousData" style="margin-left: 30px;">刷 新
          </el-button>
        </div>
        <div>
          <el-table v-loading="otherLoading" :data="item.monitorList" border @selection-change="pipeEchartsDatas"
                    style="width: 100%;border: 1px solid #d8dce5;"
                    :span-method="({row, column, rowIndex, columnIndex}) => objectSpanMethod(row, column, rowIndex, columnIndex, index)">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="装置名称" align="center" prop="deviceName"/>
            <el-table-column label="侧线" align="center" prop="pipeName"/>
            <el-table-column label="侧线类型" align="center" prop="pipeType" :formatter="formatterType"/>
            <el-table-column label="物料" align="center" prop="materialName"/>
            <el-table-column label="瞬时量" align="center" prop="instantaneous"/>
            <el-table-column label="收付类型" align="center" prop="payeeType"
                             :formatter="(row, column, cellValue) => rowDataFormat(cellValue,receiptPaymentTypeOptions)"
                             width="180px"/>
            <el-table-column label="对方节点" align="center" prop="otherNode" width="180px"/>
            <el-table-column label="开始时间" align="center" prop="startTime" width="180px"/>
          </el-table>
          <div style="font-size:14px;height:40px;line-height:40px"></div>
          <div class="">
            <div class="listjump" :style="'height:' + item.heightline + 'px'" v-loading="otherLoading">
              <div class="zhuangzhi" v-for="(items,key) in  item.indelist" :key="key">
                <div>
                  <span class="label">侧线名:  {{items.pipeName}}  </span>
                </div>
                <div>
                  <span class="label">物料:  {{ items.materialName }}  </span>
                </div>
                <div>
                  <span class="label">移动关系:  {{items.moveRelation}}  </span>
                </div>
                <div>
                  <span class="label">当前瞬时量: {{items.instantaneous}} {{items.instantaneousUnit}} </span>
                </div>
                <div>
                  <span class="label">当日累计量:   {{items.sum}}  {{items.sumUnit}} </span>
                </div>
                <div class="postions">
                  <img src="@/assets/images/zhixiang.png" alt="">
                </div>
              </div>
            </div>
            <div class="listcenter" :style="'height:' + item.heightline + 'px'">
              <img src="../../../assets/images/zhuangzhijiankong.png" style="margin-left: 1%;"/>
            </div>
            <div class="listjumpright" :style="'height:' + item.heightline + 'px'" v-loading="otherLoading">
              <div class="zhuangzhi" v-for="(items,key) in  item.outlist" :key="key">
                <div>
                  <span class="label">侧线名:  {{items.pipeName}}   </span>
                </div>
                <div>
                  <span class="label">物料: {{ items.materialName }}   </span>
                </div>
                <div>
                  <span class="label">移动关系:   {{items.moveRelation}}  </span>
                </div>
                <div>
                  <span class="label">当前瞬时量:  {{items.instantaneous}} {{items.instantaneousUnit}} </span>
                </div>
                <div>
                  <span class="label">当日累计量:   {{items.sum}} {{items.sumUnit}} </span>
                </div>
                <div class="postiontwo">
                  <img src="../../../assets/images/zhixiang.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="open" width="1300px">
      <div ref="lineEcharts" style="width: 1200px;height:600px;">
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {getEchartsDatas, listDeviceMonitor, queryMonitorDetail,} from "@/api/system/devicemonitor";
  import {listDevicegroup} from "@/api/system/devicegroup";

  export default {
    name: "Devicemonitor",
    components: {},
    data() {
      return {
        otherLoading:false,
        spanArr: [],
        value1: '',
        color: ['blue', 'red', 'yellow', 'green', 'violet', 'Cyan', 'orange', 'black'],
        // 遮罩层
        loading: false,
        // 装置组
        deviceGroup: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        //装置信息
        deviceList: [],
        // 总条数
        total: 0,
        // 装置状态字典
        deviceStatusOptions: [],
        //选中装置数据
        selectedList: [],
        //选中侧线数据
        selectedPipelist: [],
        monitorDetailList: [],
        index: -1,
        dataitem: [],
        title: null,
        open: null,
        echart: {
          pipeId: null,
          interval: 0,
          startTime: null,
          endTime: null
        },
        //echarts图的数据
        xAxisDatas: [],
        yAxisDatas: [],
        seriesDatas: [],
        legendDatas: [],
        xaixsLenght: 0,
        xaixsDate: 0,
        legend: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          deviceGroupId: null,
          deviceStatus: null
        },
        // 表单校验
        rules: {
          deviceGroupId: [
            {required: true, message: "装置组不能为空", trigger: "blur"}
          ],
        },
        // 罐收付类型字典
        receiptPaymentTypeOptions: [],
      };
    },
    created() {
      this.getDeviceGroup();
      this.getDictsBatch("start_stop_status,receipt_payment_type").then(response => {
        if (response.data.start_stop_status === null) {
          this.deviceStatusOptions = []
        } else {
          this.deviceStatusOptions = response.data.start_stop_status
        }

        if (response.data.receipt_payment_type === null) {
          this.receiptPaymentTypeOptions = []
        } else {
          this.receiptPaymentTypeOptions = response.data.receipt_payment_type
        }
      });
    },
    methods: {
      /** 装置组 */
      getDeviceGroup() {
        listDevicegroup().then(response => {
          this.deviceGroup = response.result;
          this.queryParams.deviceGroupId = this.deviceGroup[0].id;
          this.getList();
        })
      },
      /** 查询装置配置列表 */
      getList() {
        this.loading = true;
        listDeviceMonitor(this.queryParams).then(response => {
          this.deviceList = response.result;
          this.loading = false;
        });
      },
      // 装置状态字典翻译
      deviceStatusFormat(row, column) {
        return this.selectDictLabel(this.deviceStatusOptions, row.deviceStatus);
      },
      formatterType(row, column) {
        let result = "";
        if (row.pipeType === '0') {
          result = "进"
        } else if (row.pipeType === '1') {
          result = "出"
        } else if (row.pipeType === '2') {
          result = "消耗"
        } else {
          result = "回流"
        }
        return result;
      },
      //收付方式换行
      formatterPayeeType(row, column) {
        if (row.payeeType == "" || row.payeeType == null || row.payeeType == undefined) {
          return "";
        }
        return row.payeeType.replaceAll(",", "<br>");
      },
      formatterOtherNode(row, column) {
        if (row.otherNode == "" || row.otherNode == null || row.otherNode == undefined) {
          return "";
        }
        return row.otherNode.replaceAll(",", "<br>");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        if (this.queryParams.deviceGroupId == null || this.queryParams.deviceGroupId == "") {
          return this.msgError("请先选择装置组！");
        }
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.deviceGroupId = this.deviceGroup[0].id;
        this.queryParams.deviceStatus = null;
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.selectedList = selection;
        if (this.selectedList.length == 0) {
          this.monitorDetailList = [];
          return;
        }
        let deviceIds = "";
        let deviceNames = "";
        for (let i = 0; i < this.selectedList.length; i++) {
          deviceIds += this.selectedList[i].deviceId + ",";
          deviceNames += this.selectedList[i].deviceName + ",";
        }
        let param = {
          "deviceId": deviceIds,
          "deviceName": deviceNames
        }
        this.otherLoading = true;
        queryMonitorDetail(param).then(response => {
          this.monitorDetailList = response.result;
          this.dataitem = this.monitorDetailList;
          this.spanArr = []
          this.monitorDetailList.forEach(item => {
            let outList = []
            let inList = []

            item.monitorList.forEach(element => {
              if (element.pipeType === '1') {
                outList.push(element)
              } else if (element.pipeType === '0') {
                inList.push(element)
              }
            });
            item.outlist = outList
            item.indelist = inList
            let jinLen = inList.length || 0
            let outLen = outList.length || 0
            if (jinLen > outLen) {
              let length = inList.length + 1
              let heightLine = length * 100
              heightLine = heightLine + 100;
              item.heightline = heightLine
            } else {
              let length = outList.length + 1
              let heightLine = length * 100
              heightLine = heightLine + 100;
              item.heightline = heightLine
            }
          })
          this.monitorDetailList.forEach(item => {
            let oldMonitorList = item.monitorList;
            let newMonitorList = []
            for (let i = 0; i < oldMonitorList.length; i++) {
              let oldMonitor = oldMonitorList[i]
              if (oldMonitor.payeeType === null) {
                let newMonitor = JSON.parse(JSON.stringify(oldMonitor));
                newMonitorList.push(newMonitor)
                continue;
              }
              let payeeTypes = oldMonitor.payeeType.split(',')
              let startTimes = oldMonitor.startTime.split(',')
              let otherNodes = oldMonitor.otherNode.split(',')
              for (let i = 0; i < payeeTypes.length; i++) {
                let newMonitor = JSON.parse(JSON.stringify(oldMonitor));
                newMonitor.payeeType = payeeTypes[i]
                newMonitor.startTime = startTimes[i]
                newMonitor.otherNode = otherNodes[i]
                newMonitorList.push(newMonitor)
              }
            }
            item.monitorList = newMonitorList
            this.getSpanArr(item.monitorList)
            this.otherLoading = false;
          })
        })
      },
      //刷新获取实时数据
      flashInstantaneousData() {
        this.handleSelectionChange(this.selectedList);
        /*var deviceId = "";
        var deviceName = "";
        for(var i=0;i<this.selectedList.length;i++){
          if(i == p){
            deviceId = this.selectedList[i].deviceId;
            deviceName = this.selectedList[i].deviceName;
          }
        }
        let param = {
          "deviceId": deviceId,
          "deviceName": deviceName
        }
        queryMonitorDetail(param).then(response => {
          this.monitorDetailList.splice(i,1,response.result[0]);
        })*/
      },
      pipeEchartsDatas(row) {
        if (this.selectedPipelist.length > 7) {
          return this.msgError("选择数据个数大于8，请重新选择！");
        }
        this.selectedPipelist = row;
      },
      echartsPipe(i) {
        this.legendDatas = [];
        this.xAxisDatas = [];
        this.yAxisDatas = [];
        this.seriesDatas = [];
        if (this.selectedPipelist.length === 0) {
          return this.msgError("请选择需要生成echarts图的数据！");
        }
        //时间查询处理
        if (this.dataitem[i].datatime) {
          this.echart.startTime = this.dataitem[i].datatime[0]
          this.echart.endTime = this.dataitem[i].datatime[1]
        } else {
          this.echart.startTime = this.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
          this.echart.endTime = this.dateFtt("yyyy-MM-dd hh:mm:ss", new Date());
        }
        this.index = i;
        let pipeId = "";
        let pipeIds = [];
        for (let i = 0; i < this.selectedPipelist.length; i++) {
          if (pipeIds.indexOf(this.selectedPipelist[i].pipeId) !== -1) {
            continue
          }
          pipeIds.push(this.selectedPipelist[i].pipeId)
          pipeId += this.selectedPipelist[i].pipeId + ",";
          this.legendDatas.push(this.selectedPipelist[i].pipeName);
        }
        this.echart.pipeId = pipeId;
        getEchartsDatas(this.echart).then(response => {
          this.xAxisData(response.result);
        });
      },
      //echarts图x轴数据
      xAxisData(datas) {
        let ax = {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: false
          },
        }
        this.xAxisDatas.push(ax);
        this.yAxisData(datas);
      },
      //echarts图y轴数据
      yAxisData(datas) {
        for (let i = 0; i < datas.length; i++) {
          this.legend = {
            data: this.legendDatas,
          }
        }
        this.seriesData(datas);
      },
      //series数据
      seriesData(datas) {
        for (let i = 0; i < this.legendDatas.length; i++) {
          let data = [];
          let chartData = datas[i].map;
          let keys = [];
          for (let key in chartData) {
            keys.push(key);
          }
          let keysSort = keys.sort();
          for (let key of keysSort) {
            data.push([key, chartData[key]]);
          }
          let by = {
            name: this.legendDatas[i],
            type: 'line',
            data: data,
          }
          this.seriesDatas.push(by);
        }
        this.drawChart();
      },
      drawChart() {
        this.open = true;
        this.title = "侧线历史趋势图";
        let newPromise = new Promise((resolve) => {
          resolve()
        })
        //然后异步执行echarts的初始化函数
        newPromise.then(() => {
          //	此dom为echarts图标展示dom
          let myChart = this.echarts.init(this.$refs.lineEcharts);
          myChart.clear();
          let option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            grid: {},
            legend: this.legend,
            xAxis: this.xAxisDatas,
            yAxis: {},
            series: this.seriesDatas,
          };
          console.log(option)
          myChart.setOption(option);
        })
      },
      dateFtt(fmt, date) {
        let o = {
          "M+": date.getMonth() + 1,                 //月份
          "d+": date.getDate(),                    //日
          "h+": date.getHours(),                   //小时
          "m+": date.getMinutes(),                 //分
          "s+": date.getSeconds(),                 //秒
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
          "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      },
      dataTimeChange(value, index) {
        if (value === null) {
          return
        }
        let date = value[1]
        if (new Date(date).getTime() > new Date().getTime()) {
          value = null;
          this.monitorDetailList[index].datatime = null
          this.msgWarning('结束时间不能超过当前时间!!!')
        }
      },
      rowDataFormat(cellValue, options) {
        let actions = [];
        Object.keys(options).some((key) => {
          if (options[key].dictValue == ('' + cellValue)) {
            actions.push(options[key].dictLabel);
            return true;
          }
        })
        if (JSON.stringify(actions) === '[]') {
          return cellValue;
        }
        return actions.join('');
      },
      //合并单元格数组
      getSpanArr(data) {
        let spanAry = []
        let pos = 0;
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            spanAry.push(1);
            pos = 0
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i].pipeId === data[i - 1].pipeId) {
              spanAry[pos] += 1;
              spanAry.push(0);
            } else {
              spanAry.push(1);
              pos = i;
            }
          }
        }
        this.spanArr.push(spanAry);
      },
      //合并单元格
      //合并行
      objectSpanMethod(row, column, rowIndex, columnIndex, index) {
        // columnIndex === xx 找到第xx列，实现合并随机出现的行数
        if (columnIndex !== 6 && columnIndex !== 7 && columnIndex !== 8) {
          let spanAry = this.spanArr[index];
          const _row = spanAry[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .listjump {
    min-height: 150px;
    overflow: hidden;
    position: relative;
    width: 40%;
    float: left;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .zhuangzhi {
      margin-top: 10px;
      margin-bottom: 10px;
      line-height: 20px;
      padding-left: 10%;
      font-size: 14px;
      width: 70%;
      height: 15vh;
      background: rgb(246, 251, 255);
      border: 1px solid #D3D9E6;
      margin-right: 10%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      float: left;

      .label {
        color: #888888;
      }
    }
  }

  .listcenter {
    width: 20%;
    text-align: center;
    display: flex;
    float: left;
    align-items: center;
    justify-content: space-around;

    img {
      width: 80%;
    }
  }

  .postions {
    position: absolute;
    width: 60px;
    right: 0%;
  }

  .postiontwo {
    position: absolute;
    width: 20px;
    left: 3%;
  }

  .listjumpright {
    position: relative;
    margin-bottom: 20px;
    width: 40%;
    float: left;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    overflow: hidden;

    .zhuangzhi {
      margin-top: 10px;
      margin-bottom: 10px;
      line-height: 20px;
      padding-left: 10%;
      font-size: 14px;
      width: 70%;
      height: 15vh;
      background: rgb(246, 251, 255);
      border: 1px solid #D3D9E6;
      margin-left: 30%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .label {
        color: #888888;
      }
    }
  }

  @media screen and (max-width: 1500px) and (min-width: 1200px) {
    .postions {
      position: absolute;
      right: -10%;

      img {
        width: 40px;
      }
    }
    .postiontwo {
      left: -8%;
      position: absolute;

      img {
        position: absolute;
        z-index: 9999;
        width: 40px;
      }
    }
    .listjumpright {
      .zhuangzhi {
        padding-left: 2%;
        height: 20vh;
        font-size: 12px;
        width: 75%;
        margin-left: 5%;
      }
    }
    .listjump {
      .zhuangzhi {
        padding-left: 4%;
        margin-left: -10%;
        padding-top: 10px;
        height: 20vh;
        width: 75%;
        font-size: 12px;
      }
    }
  }

  .qingchu {
    width: 100%;
    display: inline-block;
    overflow: auto;
    zoom: 1;
  }
</style>
