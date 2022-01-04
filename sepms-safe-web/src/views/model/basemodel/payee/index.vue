<template>
  <div class="app-container wzt_form wzt_flex  " style="padding-bottom:22px;" >
    <div style="width: 49%;float: left;">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" style="margin: 10px 0px 0px 10px;" :rules="rules">
        <el-form-item label="工厂：" prop="factory" label-width="95px">
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
        <el-form-item label="节点类型：" prop="nodeType" label-width="95px">
          <el-select v-model="queryParams.sourceType" placeholder="请选择节点类型" clearable size="mini">
            <el-option
              v-for="item in nodeTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="源节点名称：" prop="meterType">
          <el-input v-model="queryParams.sourceName" placeholder="请输入源节点" clearable size="mini"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSourceQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 49%;float: right;display: inline-block;" >
      <el-form :model="queryParams" ref="queryForm" :inline="true" style="margin: 10px 0px 0px 10px;" :rules="rules">
        <el-form-item label="节点类型：" prop="nodeType" style="margin-left: 3%;" label-width="110px">
          <el-select v-model="objectibe.sourceType" placeholder="请选择节点类型" clearable size="mini">
            <el-option
              v-for="item in nodeTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目的节点名称：" prop="meterType" style="margin-left: 3%;">
          <el-input v-model="objectibe.sourceName" placeholder="请输入目的节点" clearable size="mini"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleObjectiveQuery">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
   <el-col style="border: 2px solid #d8dce5;width: 48%;height: 36vh;overflow: auto;">
        <el-table :data="sourceList" @row-click="querySourceById" highlight-current-row>
          <el-table-column label="源节点名称" align="left" prop="sourceName" />
        </el-table>
    </el-col>
    <el-col style="border: 2px solid #d8dce5;width: 48%;height: 33vh;overflow: auto;margin-left: 13px;">
      <el-table :data="objectiveList" @selection-change="selectionList">
        <el-table-column type="selection" width="55" align="center" highlight-current-row/>
        <el-table-column label="目的节点名称" align="left" prop="sourceName"/>
      </el-table>
    </el-col>
      <el-col style="width: 48%;height: 4vh;">
        <img v-preventReClick @click="insertObjective" style="cursor:pointer;margin-top:3px;float: right;width: 28px;height:28px;margin-right: 40%;" src='../../../../assets/images/bottom.png'/>
        <img v-preventReClick @click="deleteSource" style="cursor:pointer;margin-top:3px;float: right;width: 28px;height: 28px;margin-right: 5%;" src='../../../../assets/images/top.png'/>
      </el-col>
    <el-col style="border: 2px solid #d8dce5;width: 48%;height: 31vh;overflow: auto;margin-top: 5px;">
      <el-table :data="upList">
        <el-table-column label="源节点付方" align="left" prop="sourceName"/>
      </el-table>
    </el-col>
    <el-col style="border: 2px solid #d8dce5;width: 48%;height: 31vh;overflow: auto;margin-left: 13px;margin-top: 5px;">
      <el-table :data="downList"  @row-click="deleteById" highlight-current-row>
        <el-table-column label="源节点收方"  align="left" prop="sourceName"/>
      </el-table>
    </el-col>
    </div>
  </div>
</template>

<script>
 import {listPayees,queryRelation,insertObjective,delSource } from "@/api/model/payee";
 import {listFactorys} from "@/api/model/nodemeter";
  export default {
    name: 'Payee',
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
        //节点类型
        nodeTypeList: [],
        //源节点集合信息
        sourceList: [],
        //目的节点列表
        objectiveList:[],
        //关系列表集合
        downList:[],
        upList:[],
        //选中节点信息ID标识
        id:null,
        deleteid:null,
        //存储选中的数据
       selectedList:[],
        // 查询参数
        queryParams: {
          type:0,
          factory: null,
          sourceType:null,
          sourceName:null,
        },
        //目的节点的条件
        objectibe:{
          type:1,
          factory: null,
          sourceId:null,
          sourceType: null,
          sourceName:null
        },
        //存储点击数据
        source:{
          factory: null,
          sourceId:null,
          sourceType: null,
          sourceName:null
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
      this.getDicts("node_payment_type").then(response => {
        this.nodeTypeList = response.data;
      });
    },
    methods: {
      //获取工厂信息
      getFactorys(){
        listFactorys().then(response => {
          this.factoryList = response.result;
        });
      },
      //查询源节点信息
      handleSourceQuery() {
        if(this.queryParams.factory == null || this.queryParams.factory == ""){
          return this.msgError("请选择所属工厂");
        }
        listPayees(this.queryParams).then(response => {
          this.sourceList = response.result;
        });
        this.objectiveList = []
        this.downList = []
        this.upList = []
        this.id = null
      },
      //根据源节点查询上级和下级节点
      querySourceById(row){
        this.id = row.sourceId;
        //获取点击的数据详细信息
        this.source.factory = this.queryParams.factory;
        this.source.sourceName = row.sourceName;
        this.source.sourceType = row.sourceType;
        this.source.sourceId = row.sourceId;
        var param = {
          "sourceId":row.sourceId,
          "type": 1,
          "queryType":row.sourceType,
          "factory":this.queryParams.factory,
          "sourceType": this.objectibe.sourceType,
          "sourceName": this.objectibe.sourceName
        }
        queryRelation(param).then(response =>{
          this.downList = response.result.downList;
          this.upList = response.result.upList;
          this.objectiveList = response.result.list;
        });
      },
      //查询目的节点信息
      handleObjectiveQuery() {
        if(this.id==null || this.id==''){
          return this.msgError("请先选择源节点");
        }
        if(this.queryParams.factory == null || this.queryParams.factory == ""){
          return this.msgError("请选择所属工厂");
        }
        this.objectibe.sourceId = this.id;
        this.objectibe.factory = this.queryParams.factory;
        listPayees(this.objectibe).then(response => {
          this.objectiveList = response.result;
        });
      },
      //选中目的节点
      selectionList(row){
        this.selectedList = row;
      },
      //添加下级关联
      insertObjective(){
        if(this.id == null || this.id == ""){
          return this.msgError("请先选择源节点！");
        }
        if(this.selectedList.length == 0){
          return this.msgError("请先选择目的节点！");
        }
        //处理需要添加的的数据
        var param = {
          "source":this.source,
          "objective":this.selectedList
        }
        insertObjective(param).then(response =>{
          this.querySourceById(this.source);
          this.handleObjectiveQuery();
          this.msgSuccess("新增成功");
        });
      },
      deleteById(row){
        //获取删除数据的下标
        for(var i=0;i<this.downList.length;i++){
          if(this.downList[i].sourceName == row.sourceName){
            this.num = i;
            break;
          }
        }
        this.deleteid = row.id;
      },
      deleteSource(){
        if(this.deleteid == null || this.deleteid == ""){
          return this.msgError("请先选择要删除的信息！");
        }
        const id = this.deleteid;
        delSource(id).then(response => {
          this.downList.splice(this.num,1);
          this.handleObjectiveQuery();
          this.deleteid = null;
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
