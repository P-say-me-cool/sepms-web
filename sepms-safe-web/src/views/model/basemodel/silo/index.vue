<template>
  <div class="app-container wzt_form " >
    <el-form :model="queryParams" ref="queryForm" class="allinput" :inline="true" v-show="showSearch" style="margin: 10px 0px 0px 10px;" :rules="rules">
      <div style="width: 51%;display: inline-block;">
        <el-form-item label="工厂：" prop="factory" label-width="82px">
          <el-select v-model="queryParams.factory" placeholder="请选择工厂" @change="deviceChange" clearable size="mini" >
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.modelName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="装置名称：" prop="deviceId">
          <el-select v-model="queryParams.deviceId" filterable placeholder="请选择装置名称" clearable size="mini">
            <el-option
              v-for="item in deviceNameList"
              :key="item.deviceId"
              :label="item.deviceName"
              :value="item.deviceId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="侧线名称：" prop="sideLineName">
          <el-input
            v-model="queryParams.sideLineName"
            placeholder="请输入侧线名称"
            clearable
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSideLineQuery">搜索</el-button>
        </el-form-item>
      </div>
      <div style="width: 48%;display: inline-block;">
        <el-form-item label="料仓名称：" prop="siloName" >
          <el-input
            v-model="queryParams.siloName"
            placeholder="请输入料仓名称"
            clearable
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSiloQuery">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div style="width: 100%;height: 66vh;" class="colorpoupke">
      <div style="border: 2px solid #d8dce5;width: 48%;height: 64vh;float: right;overflow: auto;">
        <el-table :data="silolist" @selection-change="handleSelectionChange" ref="multipleTable" tooltip-effect="dark">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="料仓名称" align="left" prop="siloName" />
        </el-table>
      </div>
      <img @click="insertSideLineSilo" v-preventReClick style="width: 2%;margin-top: 42vh;float: right;margin-right:1%;cursor:pointer;" src='../../../../assets/images/left.png'/>
      <div style="border: 2px solid #d8dce5;width: 48%;height: 31vh;margin-bottom: 2vh;float: left;overflow: auto;">
        <el-table :data="sideLineList" @row-click="selectSiloBydeviceId" highlight-current-row>
          <el-table-column label="侧线名称" align="left" prop="sideLineName" />
        </el-table>
      </div>
      <div style="border: 2px solid #d8dce5;width: 48%;height: 31vh;float: left;">
        <el-table :data="sideLineSiloList" @row-click="deleteId" highlight-current-row>
          <el-table-column  align="left" prop="siloName" />
          <el-table-column align="center" key="isUse">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isUse"
                active-value="0"
                inactive-value="1"
                active-text="算量启用"
                inactive-text="算量停用"
                @change="handleIsUseChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <img v-preventReClick @click="deleteSideLineSilo" style="width: 2%;margin-top: 5vh;float: right;margin-right:1%;cursor:pointer;" src='../../../../assets/images/right.png'/>
    </div>
  </div>
</template>

<script>
 import {queryDevices,listSideLines,listSilo,querySiloBySideLineId,insertSideLineSilo,delSideLineSilo,updateSideLineSilo} from "@/api/model/sidelinesilo";
 import {listFactorys} from "@/api/model/nodemeter";
  export default {
    name: 'Silo',
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 工厂数据
        factoryList: [],
        //装置名称
        deviceNameList:[],
        //侧线名称列表
        sideLineList: [],
        //仪表列表
        silolist:[],
        //节点仪表关联表
        sideLineSiloList:[],
        num: null,
        id: null,
        //存储选中的数据
        selectedSiloList:[],
        silo:{
          sideLineid:null,
          sideLineName: null
        },
        // 查询参数
        queryParams: {
          factory: null,
          sideLineid:null,
          sideLineName: null,
          siloName:null,
          deviceId:null,
          deviceName:null,
        },
        // 表单校验
        rules: {
          factory: [
            { required: true, message: "调度令编号不能为空", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.getFactorys();
    },
    methods: {
      //获取工厂信息
      getFactorys(){
        listFactorys().then(response => {
          this.factoryList = response.result;
        });
      },
      //获取装置
      deviceChange(factory){
        this.deviceNameList = [];
        this.queryParams.deviceId = null;
        if(this.queryParams.factory == null || this.queryParams.factory == ""){
          return this.msgError("请选择所属工厂");
        }
        queryDevices({factory}).then(response => {
          this.deviceNameList = response.result;
        });
      },
      //获取节点信息
      handleSideLineQuery() {
        if(this.queryParams.factory == null || this.queryParams.factory == ""){
          return this.msgError("请选择所属工厂");
        }
        this.sideLineList = [];
        this.sideLineSiloList = [];
        this.silolist = [];
        this.silo.sideLineId = null;
        listSideLines(this.queryParams).then(response => {
          this.sideLineList = response.result;
        });
      },
      //获取节点的详细信息
      selectSiloBydeviceId(row){
        var id = row.sideLineId;
        this.silo.sideLineName = row.sideLineName;
        this.silo.sideLineId = row.sideLineId;
        this.sideLineSiloList = [];
        querySiloBySideLineId(id).then(response =>{
          this.sideLineSiloList = response.result;
          this.handleSiloQuery();
        });
      },
      //查询料仓信息
      handleSiloQuery() {
        if(this.queryParams.factory == null || this.queryParams.factory == ""){
          return this.msgError("请选择所属工厂");
        }
        this.silolist = [];
        listSilo(this.queryParams).then(response => {
          this.silolist = response.result;
        });
      },
      //选中料仓
      handleSelectionChange(row){
        this.selectedSiloList = row;
			},
      //添加关联关系
			insertSideLineSilo(){
        if(this.silo.sideLineId == null){
          return this.msgError("请先选择侧线");
        }
        if(this.selectedSiloList.length == 0){
          return this.msgError("请先选择要添加的料仓");
        }
        //根据装置ID判断装置名称
        for(var i=0;i<this.deviceNameList.length;i++){
          if(this.deviceNameList[i].deviceId == this.queryParams.deviceId){
            this.queryParams.deviceName = this.deviceNameList[i].deviceName;
            break;
          }
        }
			  for(var i=0;i<this.selectedSiloList.length;i++){
          this.selectedSiloList[i].deviceId = this.queryParams.deviceId;
          this.selectedSiloList[i].deviceName = this.queryParams.deviceName;
          this.selectedSiloList[i].sideLineId = this.silo.sideLineId;
          this.selectedSiloList[i].sideLineName = this.silo.sideLineName;
          this.selectedSiloList[i].factory = this.queryParams.factory;
        }
			  insertSideLineSilo(this.selectedSiloList).then(response =>{
          this.selectSiloBydeviceId(this.silo);
          this.handleSiloQuery();
          this.msgSuccess("新增成功");
			  });
			},
      //获取删除的下标
			deleteId(row){
			  this.id = row.id;
        //获取删除数据的下标
        for(var i=0;i<this.sideLineSiloList.length;i++){
          if(this.sideLineSiloList[i].siloName == row.siloName){
            this.num = i;
            break;
          }
        }
			},
      //删除信息
			deleteSideLineSilo(){
        if(this.id == null || this.id == ""){
          return this.msgError("请先选择要删除的信息！");
        }
			  const id = this.id;
			  delSideLineSilo(id).then(response => {
          this.sideLineSiloList.splice(this.num,1);
          this.handleSiloQuery();
          this.id = null;
          this.msgSuccess("删除成功");
			  })
			},
      // 启用状态
      handleIsUseChange(row) {
        let text = row.isUse == "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.siloName + '"料仓吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          var param = {
            "id":row.id,
            "isUse":row.isUse
          }
          return updateSideLineSilo(param);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.isUse = row.isUse === "1" ? "0" : "1";
        });
      },
    }
  }
</script>

<style scoped>
  /* 用来设置当前页面element全局table的内间距 */
  .el-table__row td{
    padding: 0;
  }
  /* 用来设置当前页面element全局table 选中某行时的背景色*/
  .el-table__body tr.current-row>td{
    background-color: #f19944 !important;
    /* color: #f19944; */  /* 设置文字颜色，可以选择不设置 */
  }
  /* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #f19944;
    /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
  }
</style>
