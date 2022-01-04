<template>
  <div class="app-container wzt_form">
    <el-form :model="queryParams" ref="queryForm" class="allinput " :inline="true" v-show="showSearch" style="margin: 10px 0px 0px 10px;" :rules="rules">
      <div style="width: 49%;display: inline-block;">
        <el-form-item label="工厂：" prop="factory" label-width="82px">
          <el-select v-model="queryParams.factory" placeholder="请选择工厂" clearable size="mini" >
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.modelName"
              :value="item.id"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="节点类型：" prop="nodeType">
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
        <el-form-item label="节点名称：" prop="nodeName">
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
        <el-form-item label="物料类型：" prop="meterType" style="margin-left: 3%;">
          <el-select v-model="queryParams.materialType" placeholder="请选择物料类型" clearable size="mini">
            <el-option
              v-for="item in materialTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料名称：" prop="meterName" style="margin-left: 3%;">
          <el-input
            v-model="queryParams.materialName"
            placeholder="请输入物料名称"
            clearable
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleMaterialQuery">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div style="width: 100%;height: 66vh;"  class="colorpoupke">
      <div style="border: 2px solid #d8dce5;width: 48%;height: 64vh;float: right;overflow: auto;">
        <el-table :data="materiallist" @selection-change="handleSelectionChange" ref="multipleTable" tooltip-effect="dark">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="物料名称" align="left" prop="materialName" />
        </el-table>
      </div>
      <img v-preventReClick @click="insertNodeMaterial" style="width: 2%;margin-top: 42vh;float: right;margin-right:1%;cursor:pointer;" src='../../../../assets/images/left.png'/>
      <div style="border: 2px solid #d8dce5;width: 48%;height: 31vh;margin-bottom: 2vh;float: left;overflow: auto;">
        <el-table :data="nodeList" @row-click="selectMaterialByNodeId" highlight-current-row>
          <el-table-column label="节点名称" align="left" prop="nodeName" />
        </el-table>
      </div>
      <div style="border: 2px solid #d8dce5;width: 48%;height: 31vh;float: left;overflow: auto;">
        <el-table :data="nodeMaterialList" @row-click="deleteId" highlight-current-row>
          <el-table-column  align="left" prop="materialName" />
        </el-table>
      </div>
      <img v-preventReClick @click="deleteNodeMaterial" style="width: 2%;margin-top: 5vh;float: right;margin-right:1%;cursor:pointer;" src='../../../../assets/images/right.png'/>
    </div>
  </div>
</template>

<script>
 import {listNode,listMaterial,queryMaterialByNodeId,insertNodeAndMaterial,delNodeMaterial} from "@/api/model/nodemateriel";
 import {listFactorys} from "@/api/model/nodemeter";
  export default {
    name: 'Nodemateriel',
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
        id:null,
        //存储删除的是第几个
        num:null,
        // 工厂数据
        factoryList: [],
        //节点类型
        nodeTypeList: [],
        //物料类型
        materialTypeList: [],
        //节点列表
        nodeList:[],
        //仪表列表
        materiallist:[],
        //节点仪表关联表
        nodeMaterialList:[],
        //存储选中的数据
        selectedList:[],
        node:{
          factory: null,
          nodeId: null,
          nodeType: null,
          nodeName:null,
        },
        // 查询参数
        queryParams: {
          factory: null,
          nodeId: null,
          nodeType: null,
          nodeName:null,
          materialType:null,
          materialName:null
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
      this.getDictsBatch("node_mate_type,mat_type").then(response => {
        this.nodeTypeList = response.data.node_mate_type;
        this.materialTypeList = response.data.mat_type;
      });
    },
    methods: {
      //获取工厂信息
      getFactorys(){
        listFactorys().then(response => {
          this.factoryList = response.result;
        });
      },
      //获取节点的列表信息
      handleNodeQuery() {
        if(this.queryParams.factory == null || this.queryParams.factory == ""){
          return this.msgError("请选择所属工厂");
        }
        this.nodeList = [];
        listNode(this.queryParams).then(response => {
          this.nodeList = response.result;
        });
        this.materiallist =[]
        this.nodeMaterialList = []
        this.node.nodeId = null
        this.queryParams.nodeId = null
        this.id = null

      },
      //选中查看关联
      selectMaterialByNodeId(row){
        var id = row.nodeId;
        this.node.nodeName = row.nodeName;
        this.node.nodeId = row.nodeId;
        this.node.nodeType = this.queryParams.nodeType;
        this.node.factory = this.queryParams.factory;
        this.queryParams.nodeId = row.nodeId;
        this.nodeMaterialList = [];
        queryMaterialByNodeId(this.queryParams).then(response =>{
          this.nodeMaterialList = response.result.relationList;
          this.materiallist = response.result.materailList;
        });
      },
      //查询物料
      handleMaterialQuery() {
        if(this.queryParams.factory == null || this.queryParams.factory == ""){
          return this.msgError("请选择所属工厂");
        }
        this.materiallist = [];
        listMaterial(this.queryParams).then(response => {
          this.materiallist = response.result;
        });
      },
      handleSelectionChange(row){
        this.selectedList = row;
      },
      insertNodeMaterial(){
        if(this.selectedList.length == 0){
          return this.msgError("请先选择数据");
        }
        if(this.node.nodeId == null){
          return this.msgError("请先选择节点");
        }
        for(var i=0;i<this.selectedList.length;i++){
          this.selectedList[i].nodeId = this.node.nodeId;
          this.selectedList[i].nodeType = this.node.nodeType;
          this.selectedList[i].nodeName = this.node.nodeName;
          this.selectedList[i].factory = this.node.factory;
        }
        insertNodeAndMaterial(this.selectedList).then(response =>{
          this.selectMaterialByNodeId(this.node);
          this.handleMaterialQuery();
          this.msgSuccess("新增成功");
        });
      },
      deleteId(row){
        //获取删除数据的下标
        for(var i=0;i<this.nodeMaterialList.length;i++){
          if(this.nodeMaterialList[i].materialName == row.materialName){
            this.num = i;
            break;
          }
        }
        this.id = row.id;
      },
      deleteNodeMaterial(){
        if(this.id == null || this.id == ""){
          return this.msgError("请先选择要删除的信息！");
        }
        const id = this.id;
        delNodeMaterial(id).then(response => {
          this.nodeMaterialList.splice(this.num,1);
          this.handleMaterialQuery();
          this.id == null
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
