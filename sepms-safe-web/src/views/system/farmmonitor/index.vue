<template>
  <div class="app-container">
  <div style="height:15px;" v-show="!showSearch"></div>

    <el-form class="allinput wzt_form" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" >
      <el-form-item label="重点监控罐组：" prop="tankForm" style="margin-left: 10px;" label-width="120px">
        <el-select v-model="queryParams.id" placeholder="请选择罐组" clearable size="small" style="width: 150px;">
          <el-option
            v-for="dict in tankGroup"
            :key="dict.id"
            :label="dict.tankForm"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="罐名称：" label-width="106px" prop="tankName">
        <el-input
          v-model="queryParams.tankName"
          placeholder="请输入罐名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜 索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">刷 新</el-button>
      </el-form-item>
      <el-form-item label="当前时间：" prop="currentTime" label-width="82px">
        <el-date-picker size="mini"
                        v-model="currentTime"
                        style="width: 174px;"
                        type="datetime"
                        disabled
                        value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="formQuery form_content_pagination">
    <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
          style="padding-bottom:13px"
        ></right-toolbar>
      <el-table v-loading="loading" :data="farmList">
        <el-table-column label="序号" align="center" prop="index" width="60">
          <template slot-scope="scope">
            <span v-text="table_index(scope.$index)"> </span>
          </template>
        </el-table-column>
        <el-table-column label="罐名称" align="center" prop="tankName" />
        <el-table-column label="物料" align="center" prop="tankMaterial"/>
        <el-table-column label="罐动态" align="center" prop="tankType" />
        <el-table-column label="罐存(吨)" align="center" prop="tankStorage" />
        <el-table-column label="罐存比(百分比)" align="center" prop="tankStorageRatio" />
        <el-table-column label="检尺高度(米)" align="center" prop="tankRuler"/>
        <el-table-column label="温度(摄氏度)" align="center" prop="temperature" />
        <el-table-column label="压力(帕)" align="center" prop="pressure" />
        <el-table-column label="密度(千克/立方米)" align="center" prop="density" />
        <el-table-column label="罐最大容积(立方米)" align="center" prop="maxVolume"/>
        <el-table-column label="安全高度" align="center" prop="tankHeight" />
        <el-table-column label="最低液位" align="center" prop="tankMinLevel" />
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div style="border:1px solid #d8dce5;height: 120px;margin-top: 10px;">
        <div style="border:1px solid #d8dce5;text-align:center;height: 120px;width: 4%;display: inline-block;box-sizing:border-box;padding:0 5px;padding-top：15px">
         <br> 超限报警展示
        </div>
        <div style="border:1px solid #d8dce5;width: 96%;height: 60px;line-height:30px;float: right;display: inline-block;overflow:auto">
          <img src="../../../assets/images/warning1.png" style="float:left;margin-left: 1%;margin-top: 10px;height:40px;" v-if="tankVo != null && tankVo.rulerWarning == '1'"/>
          <img src="../../../assets/images/warning.png" style="float:left;margin-left: 1%;margin-top: 10px;height:40px;" v-else/>
          <div style="margin-left: 1%;float:left;" v-for="context in farmList"><a :href="'#'+context.tankId">{{context.rulerString}}</a>
          </div>

        </div>
        <div style="border:1px solid #d8dce5;width: 96%;height: 60px;line-height:30px;margin-top:-60px;float: right;display: inline-block;overflow:auto">
          <img src="../../../assets/images/warning1.png" style="float:left;margin-left: 1%;margin-top: 10px;height:40px;" v-if="tankVo != null && tankVo.volumeWarning == '1'"/>
          <img src="../../../assets/images/warning.png" style="float:left;margin-left: 1%;margin-top: 10px;height:40px;" v-else/>
          <div style="margin-left: 1%;float:left;" v-for="context in farmList" ><a :href="'#'+context.tankId">{{context.volumeString}}</a></div>
        </div>
      </div>
      <div  class="wzt_flex ">
        <div v-for="(item,index) in farmList" style="width: 48.5%;position: relative;"  :key="index">
          <div class="kuanduflexbox" style="border:1px solid #d8dce5;margin-top: 8px;margin-left: 5px;" :id="item.tankId">
            <img src="../../../assets/images/warning1.png" style="margin-left: 1%;position: absolute;top: 5%;" v-if="item.rulerWarning == '1' || item.volumeWarning == '1'" @click="updateWarning(item)"/>
            <img src="../../../assets/images/warning.png" style="margin-left: 1%;position: absolute;top: 5%;" v-else/>
            <div class="leftlist">
              <div class="imageechars">
                <div class="listedchars lefthtml" >
                  <div  style="width:50%;margin-top:45%" v-if="item.tankType != null && item.tankType.indexOf('收') != -1">
                    <img style="width:100%;" src="@/assets/images/zhixiang.png" alt="">
                    <div style="height:200px;width:80px;overflow:auto">
                      <div style="width:100%;font-size:14px"  v-for="itin in item.deviceInTank">
                        {{itin}}
                      </div>
                    </div>

                  </div>
                </div>
                <div class="listedchars" style="text-align:center;margin-left:5%;margin-top:-6%">
                  <div style="min-height: 20%;width: 300px;margin: -30px auto 0px;margin-left: -80px;">
                    <Span v-if="item.tankRuler != null">{{item.tankRuler}}m、<br/></Span>
                    <Span v-if="item.temperature != null">{{item.temperature}}℃、<br/></Span>
                    <Span v-if="item.pressure != null">{{item.pressure}}Pa、<br/></Span>
                    <Span v-if="item.density != null">{{item.density}}kg/m³、<br/></Span>
                    <Span v-if="item.tankStorage != null">{{item.tankStorage}}T、<br/></Span>
                    <Span v-if="item.tankStorageRatio != null">{{item.tankStorageRatio}}</Span>
                  </div>
                  <div style="height:70%;">
                    <div style="width:60%;height:100%;margin-right:10%;margin-left:10%;float:left;margin-top:10px;margin-bottom:10px">
                      <img src="@/assets/images/tank10.png" width="100%" height="100%" alt="" v-if="judgeData(item.tankStorageRatio) < 10">
                      <img src="@/assets/images/tank20.png" width="100%" height="100%" alt="" v-else-if="judgeData(item.tankStorageRatio) < 20">
                      <img src="@/assets/images/tank30.png" width="100%" height="100%" alt="" v-else-if="judgeData(item.tankStorageRatio) < 30">
                      <img src="@/assets/images/tank40.png" width="100%" height="100%" alt="" v-else-if="judgeData(item.tankStorageRatio) < 40">
                      <img src="@/assets/images/tank50.png" width="100%" height="100%" alt="" v-else-if="judgeData(item.tankStorageRatio) < 50">
                      <img src="@/assets/images/tank60.png" width="100%" height="100%" alt="" v-else-if="judgeData(item.tankStorageRatio) < 60">
                      <img src="@/assets/images/tank70.png" width="100%" height="100%" alt="" v-else-if="judgeData(item.tankStorageRatio) < 70">
                      <img src="@/assets/images/tank80.png" width="100%" height="100%" alt="" v-else-if="judgeData(item.tankStorageRatio) < 80">
                      <img src="@/assets/images/tank90.png" width="100%" height="100%" alt="" v-else-if="judgeData(item.tankStorageRatio) < 90">
                      <img src="@/assets/images/tank100.png" width="100%" height="100%" alt="" v-else>
                    </div>
                  <img src="@/assets/images/upzhixiang.png" width="20%" height="120px" style="float:left;margin-top:15%;" alt="" v-if="item.judgeInOrOutFlag == '1'">
                  <img src="@/assets/images/downzhixiang.png" width="20%" height="120px" style="float:left;margin-top:15%;" alt="" v-if="item.judgeInOrOutFlag == '0'">
                  </div>
                  <div style="height:15%;width:80%;text-align:center">
                    {{item.tankName}}
                  </div>
                </div>
                <div class="listedchars lefthtml" style="padding-left:0px;">
                  <div  style="width:50%;margin-top:45%"  v-if="item.tankType != null && item.tankType.indexOf('付') != -1">
                    <img style="width:100%;" src="@/assets/images/zhixiang.png" alt="">
                    <div style="height:200px;width:80px;overflow:auto">
                        <div  v-for="itout in item.deviceOutTank">
                            {{itout}}
                          </div>
                    </div>

                  </div>
                </div>
              </div>
              <div style="text-align:center;">
              </div>
            </div>
            <div class="rightlist">
              <div style="heihgt:40%;margin-top:20%;">
                <input type="checkbox" v-model="item.rulerFlag == '0'" @click="checkedRuler(index,item)">检尺报警
                <table border="1" cellspacing="0" style="border-color:#ccc;font-size:14px;">
                  <tr height="40px">
                    <td  width="30"  style="text-align:center;"><input type="checkbox" v-model="item.rulerFlag == '0'"  v-bind:disabled="item.rulerDisplay == '0'"></td>
                    <td width="120"  style="text-align:center;">上限（米）</td>
                    <td width="40"  style="text-align:center;"><input type="text" style="width:60px" v-model="item.rulerUp" @blur="updateItem(index,item)"  v-bind:disabled="item.rulerDisplay == '0'"></td>
                  </tr>
                  <tr height="40px">
                    <td  width="30"  style="text-align:center;"><input type="checkbox" v-model="item.rulerFlag == '0'"  v-bind:disabled="item.rulerDisplay == '0'"></td>
                    <td width="120"  style="text-align:center;">下限（米）</td>
                    <td width="40"  style="text-align:center;"><input type="text" style="width:60px" v-model="item.rulerDown" @blur="updateItem(index,item)"  v-bind:disabled="item.rulerDisplay == '0'"></td>
                  </tr>
                </table>
              </div>
              <div style="heihgt:40%;margin-top:10%;">
                <input type="checkbox" v-model="item.volumeFlag == '0'" @click="checkedVolume(index,item)" >容积报警 <br>
                最大容积: {{item.maxVolume}}
                <table border="1" cellspacing="0" style="border-color:#ccc;font-size:14px;">
                  <tr height="40px">
                    <td  width="30"  style="text-align:center;"><input type="checkbox" v-model="item.volumeFlag == '0'" v-bind:disabled="item.volumeDisplay == '0'"></td>
                    <td width="120"  style="text-align:center;">上限（%）</td>
                    <td width="40"  style="text-align:center;"><input type="text" style="width:60px" v-model="item.volumeUp"  @blur="updateItem(index,item)" v-bind:disabled="item.volumeDisplay == '0'"></td>
                  </tr>
                  <tr height="40px">
                    <td  width="30"  style="text-align:center;"><input type="checkbox" v-model="item.volumeFlag == '0'" v-bind:disabled="item.volumeDisplay == '0'"/></td>
                    <td width="120"  style="text-align:center;">下限（%）</td>
                    <td width="40"  style="text-align:center;"><input type="text" style="width:60px" v-model="item.volumeDown" @blur="updateItem(index,item)" @change="" v-bind:disabled="item.volumeDisplay == '0'"/></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listFarm} from "@/api/system/farm";
import { listTankDatas,updateTankMonitor} from "@/api/system/tankmonitor";
export default {
  name: "Farmmonitor",
  components: {
  },
  data() {
    return {
      loading:false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      farmList: [],
      // 表格数据
      farmListCopy: [],
      tankVo:null,
      //分配罐集合
      tankGroup:[],
      //当前时间
      currentTime:null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        tankName:null,
      },
      barDatas:[{value: 0.2 }],
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getTankGroup();
  },
  methods: {
    /** 查询罐组列表 */
    getTankGroup() {
      listFarm().then(response => {
        this.tankGroup = response.result;
        this.queryParams.id = this.tankGroup[0].id;
        this.currentTime = new Date();
        this.getList();
      });
    },
    //罐信息
    getList() {
      this.loading = true;
      listTankDatas(this.queryParams).then(response => {
        this.farmList = response.result.tankMonitorList;
        this.farmListCopy = JSON.parse(JSON.stringify(this.farmList))
        this.tankVo = response.result;
        this.loading = false;
      });
    },
    //table翻页
    table_index($index){
      return (this.queryParams.pageNum-1) * this.queryParams.pageSize + $index +1;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        tankForm: null,
        remark: null,
        createBy: null,
        creator: null,
        createTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.currentTime = new Date();
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 刷新按钮操作 */
    resetQuery() {
      this.currentTime = new Date();
      this.getList();
    },
    //检尺的选择
    checkedRuler (index,item) {
      if(item.rulerFlag === '0'){
        item.volumeDisplay = '1';
        item.rulerFlag = '1';
      }else{
        item.volumeDisplay = '0';
        item.rulerFlag = '0';
        item.rulerDisplay = '1';
        item.volumeFlag = '1';
      }
      this.updateItem(index,item);
    },
    //容积的选择
    checkedVolume (index,item) {
      if(item.volumeFlag === '0'){
        item.rulerDisplay = '1';
        item.volumeFlag = '1';
      }else{
        item.rulerDisplay = '0';
        item.volumeFlag = '0';
        item.volumeDisplay = '1';
        item.rulerFlag = '1';
      }
      this.updateItem(index,item);
    },
    //修改数据
    updateItem(index,item){
      let itemOld = this.farmListCopy[index];

      //检尺上限判断
      if(isNaN(parseFloat(item.rulerUp))){
        item.rulerUp = itemOld.rulerUp
        return this.msgWarning("检尺上限格式错误！");
      }
      if(item.rulerUp < 0){
        item.rulerUp = itemOld.rulerUp
        return this.msgWarning("检尺上限不能小于0！");
      }
      if(this.judgeRulerLength(item.rulerUp)){
        item.rulerUp = itemOld.rulerUp
        return this.msgWarning("检尺上限超长！");
      }
      if(this.judgeDigit(item.rulerUp)){
        item.rulerUp = itemOld.rulerUp
        return this.msgWarning("数据小数末尾有零！");
      }


      //检尺下限判断
      if(isNaN(parseFloat(item.rulerDown))){
        item.rulerDown = itemOld.rulerDown
        return this.msgWarning("检尺下限格式错误！");
      }
      if(item.rulerDown < 0){
        item.rulerDown = itemOld.rulerDown
        return this.msgWarning("检尺下限不能小于0！");
      }
      if(this.judgeRulerLength(item.rulerDown)){
        item.rulerDown = itemOld.rulerDown
        return this.msgWarning("检尺下限超长！");
      }
      if(this.judgeDigit(item.rulerDown)){
        item.rulerDown = itemOld.rulerDown
        return this.msgWarning("数据小数末尾有零！");
      }

      //检尺判断
      if(parseFloat(item.rulerUp) <= parseFloat(item.rulerDown)){
        item.rulerDown = itemOld.rulerDown
        item.rulerUp = itemOld.rulerUp
        return this.msgWarning("检尺数据上限小于等于下限！");
      }

      //容积上限判断
      if(isNaN(this.connalBaifenbi(item.volumeUp))){
        item.volumeUp = itemOld.volumeUp
        return this.msgWarning("容积上限格式错误！");
      }
      if(this.judgeVolumeLength(item.volumeUp)){
        item.volumeUp = itemOld.volumeUp
        return this.msgError("容积上限超长！");
      }
      if(this.judgeDigit(item.volumeUp)){
        item.volumeUp = itemOld.volumeUp
        return this.msgError("数据小数末尾有零！");
      }

      //容积下限判断
      if(isNaN(this.connalBaifenbi(item.volumeDown))){
        item.volumeDown = itemOld.volumeDown
        return this.msgWarning("容积下限格式错误！");
      }
      if(this.judgeVolumeLength(item.volumeDown)){
        item.volumeDown = itemOld.volumeDown
        return this.msgError("容积下限超长！");
      }
      if(this.judgeDigit(item.volumeDown)){
        item.volumeDown = itemOld.volumeDown
        return this.msgError("数据小数末尾有零！");
      }
      if(this.connalBaifenbi(item.volumeUp) <= this.connalBaifenbi(item.volumeDown)){
        item.volumeDown = itemOld.volumeDown
        item.volumeUp = itemOld.volumeUp
        return this.msgError("容积数据上限小于等于下限！");
      }
      if(this.connalBaifenbi(item.volumeDown) < 0 ){
        item.volumeDown = itemOld.volumeDown
        return this.msgWarning("容积数据下限大于等于0%！");
      }
      if(this.connalBaifenbi(item.volumeUp) > 100 ){
        item.volumeUp = itemOld.volumeUp
        return this.msgWarning("容积数据上限小于等于100%！");
      }

      //判断容积是不是有%
      if(item.volumeUp.indexOf("%") === -1){
        item.volumeUp = item.volumeUp + '%'
      }
      if(item.volumeDown.indexOf("%") === -1){
        item.volumeDown = item.volumeDown + '%'
      }

      updateTankMonitor(item).then(response => {
        this.msgSuccess("修改成功");
        this.getList();
      })
    },
    connalBaifenbi(str){
      let newMsg=str.replace('%','');
      return parseFloat(newMsg);
    },
    judgeRulerLength(str){
      return str.length > str.indexOf(".") + 5;
    },
    judgeDigit(str){
      return str.indexOf(".") !== -1 && str.substring(str.length - 1) === "0";
    },
    judgeVolumeLength(str){
      let str1 = str.replace('%','');
      return str1.length > str1.indexOf(".") + 4;
    },
    //清除警告
    updateWarning(item){
      this.$confirm('是否确认清除告警', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        item.rulerDisplay = '1';
        item.volumeFlag = '1';
        item.volumeDisplay = '1';
        item.rulerFlag = '1';
        item.rulerString = "";
        item.volumeString = "";
        return updateTankMonitor(item);
      }).then(() => {
        this.getList();
        this.msgSuccess("清除成功");
      }).catch(()=>{})
    },
    //罐存的判断显示
    judgeData(item){
      if(item == null || item == ""){
        return
      }
      return item.substring(0,item.indexOf("%"));
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@media screen and (max-width: 1500px)  and (min-width: 1000px) {
    .app-container{
        font-size: 13px;
    }
    .rightlist {
        font-size: 13px !important;
        tr{
          height: 30px;
        }
    }
    .lefthtml{
        font-size: 13px !important;
    }
    .kuanduflexbox{
    min-height:300px !important;
    max-height:350px !important;
    }
}
.haoroomflex{display: flex;margin:0 15px;}
.onebar{
  flex:1;
  text-align: center;
  min-width: 30px;
  max-width: 100px;
  display: inline-block;
  .sfont{
    color:#999;
    font-size:14px;
    font-weight:900;
    font-family:"黑体";
  }
  .bar{
    height: 160px;
    width:90px;
    margin:5px auto;
    overflow: hidden;
    border: 2px #e5e5e5 solid;
    position: relative;
    span.progress {
      position: absolute;
      bottom:0;
      height: 0;
      width: 100%;
      display: block;
      -webkit-transition: height 2s ease-out;
      -o-transition: height 2s ease-out;
      transition: height 2s ease-out;

    }
  }
}
.leftlist{
  height: 100%;
  width: 60%;
  float: left;
  .lefthtml{
    padding-left:5%;
    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content: space-around;
  }
  .imageechars{
    height: 60%;
    margin-top: 20%;
    display: flex;
    .listedchars{
      height: 100%;
      width: 33%;

    }
  }
}
.rightlist{
  font-size: 14px;
  line-height: 18px;
  height: 100%;
  width: 40%;
  float: left;

}
.kuanduflexbox{
    min-height:350px;
    max-height:500px;
}
</style>
