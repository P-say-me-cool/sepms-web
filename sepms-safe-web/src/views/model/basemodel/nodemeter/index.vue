<template>
  <div class="app-container wzt_form">
    <el-form :model="queryParams" ref="queryForm" class=" " :inline="true" v-show="showSearch" style="margin: 10px 0px 0px 10px;" :rules="rules">
      <div style="width: 49%;display: inline-block;">
        <el-form-item label="工厂:" prop="factory"  label-width="82px">
          <el-select v-model="queryParams.factory" placeholder="请选择工厂" clearable size="mini">
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.modelName"
              :value="item.id"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="节点类型:" prop="nodeType">
          <el-select v-model="queryParams.nodeType" placeholder="请选择节点类型" clearable size="mini">
            <el-option
              v-for="item in nodeTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="节点名称:" prop="nodeName">
          <el-input
            v-model="queryParams.nodeName"
            placeholder="请输入节点名称"
            clearable
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleNodeQuery">搜索</el-button>
        </el-form-item>
      </div>
      <div style="width: 49%;display: inline-block;">
        <el-form-item label="仪表类型:" prop="meterType" style="margin-left: 3%;">
          <el-select v-model="queryParams.meterType" placeholder="请选择仪表类型" clearable size="mini">
            <el-option
              v-for="item in meterTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仪表名称:" prop="meterName" style="margin-left: 3%;">
          <el-input
            v-model="queryParams.meterName"
            placeholder="请输入仪表名称"
            clearable
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left:48px" @click="handleMeterQuery">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div style="width: 100%;height: 66vh;"  class="colorpoupke">
      <div style="border: 2px solid #d8dce5;width: 48%;height: 64vh;float: right;overflow: auto;">
        <el-table :data="meterlist" @row-click="handleSelectionChange" highlight-current-row>
          <el-table-column label="仪表名称" align="left" prop="meterName" />
        </el-table>
      </div>
      <img v-preventReClick @click="insertNodeMeter" style="width: 2%;margin-top: 42vh;float: right;margin-right:1%;cursor:pointer;" src='../../../../assets/images/left.png'/>
      <div style="border: 2px solid #d8dce5;width: 48%;height: 31vh;margin-bottom:2vh;float: left;overflow: auto;">
        <el-table :data="nodeList" @row-click="selectMeterByNodeId" highlight-current-row>
          <el-table-column label="节点名称" align="left" prop="nodeName" />
        </el-table>
      </div>
      <div style="border: 2px solid #d8dce5;width: 48%;height: 31vh;float: left;">
        <el-table :data="nodeMeterList" @row-click="deleteId" highlight-current-row>
          <el-table-column  align="left" prop="meterName" />
        </el-table>
      </div>
      <img v-preventReClick @click="deleteNodeMeter" style="width: 2%;margin-top: 5vh;float: right;margin-right:1%;cursor:pointer;" src='../../../../assets/images/right.png'/>
    </div>
  </div>
</template>

<script>
 import {listNode,listMeter,queryMeterByNodeId,insertNodeAndMeter,delNodeMeter,listFactorys} from "@/api/model/nodemeter";
  export default {
    name: 'Nodemeter',
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
        //删除存储ID
        deleteObj:null,
        // 工厂数据
        factoryList: [],
        //节点类型
        nodeTypeList: [],
        //仪表类型
        meterTypeList: [],
        //节点列表
        nodeList:[],
        //仪表列表
        meterlist:[],
        //节点仪表关联表
        nodeMeterList:[],
        //存储选中的数据
        meter:{
          meterName:null,
          meterId: null,
          factory: null,
          nodeId:null,
          nodeType: null,
          nodeName:null,
        },
        // 查询参数
        queryParams: {
          factory: null,
          nodeId:null,
          nodeType: null,
          nodeName:null,
          meterName:null,
          meterType:null
        },
        // 表单校验
        rules: {
          factory: [
            { required: true, message: "工厂不能为空", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.getFactorys();
      this.getDictsBatch("node_meter_type,meter_type").then(response => {
        this.nodeTypeList = response.data.node_meter_type;
        this.meterTypeList = response.data.meter_type;
      });
    },
    methods: {
      //获取工厂信息
      getFactorys(){
        listFactorys().then(response => {
          this.factoryList = response.result;
        });
      },
      //查询工厂下的节点
      handleNodeQuery() {
        if(this.queryParams.factory == null || this.queryParams.factory == ""){
          return this.msgError("请选择所属工厂");
        }
        this.nodeList = [];
        listNode(this.queryParams).then(response => {
          this.nodeList = response.result;
        });
      },
      //点击节点选择仪表
      selectMeterByNodeId(row){
        this.meter.nodeName = row.nodeName;
        this.meter.nodeId = row.nodeId;
        this.meter.nodeType = row.nodeType;
        //每次选中节点清除仪表和删除的信息
        this.meter.meterName = null;
        this.meter.meterId = null;
        this.deleteObj = null;
        this.queryParams.nodeId = row.nodeId;
        this.queryParams.nodeType = row.nodeType;
        queryMeterByNodeId(this.queryParams).then(response =>{
          this.nodeMeterList = response.result;
          this.handleMeterQuery();
        });
      },
      //查询仪表
      handleMeterQuery() {
        if(this.queryParams.factory == null || this.queryParams.factory == ""){
          return this.msgError("请选择所属工厂");
        }
        this.meterlist = [];
        listMeter(this.queryParams).then(response => {
          this.meterlist = response.result;
        });
      },
      //选中仪表
      handleSelectionChange(row){
        this.meter.meterName = row.meterName;
        this.meter.meterId = row.meterId;
        this.meter.meterType = this.queryParams.meterType;
        this.meter.factory = this.queryParams.factory;
      },
      //添加仪表侧线关系
      insertNodeMeter(){
        if(this.nodeMeterList.length > 0){
          return this.msgError("节点下有仪表信息，请先删除再添加。");
        }
        if(this.meter.nodeId == null){
          return this.msgError("请先选择节点信息");
        }
        if(this.meter.meterId == null){
          return this.msgError("请先选择仪表信息");
        }
        insertNodeAndMeter(this.meter).then(response =>{
          var a = this.meter;
          this.selectMeterByNodeId(this.meter);
          this.msgSuccess("新增成功");
        });
      },
      deleteId(row){
        this.deleteObj = row;
      },
      //删除仪表
      deleteNodeMeter(){
        if(this.deleteObj == null || this.nodeMeterList == null){
          return this.msgError("请先选择要删除的信息!");
        }
        const id = this.deleteObj.id;
        delNodeMeter(id).then(response => {
          this.selectMeterByNodeId(this.deleteObj);
          this.msgSuccess("删除成功");
        })
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
