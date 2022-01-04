<template>
  <div class="app-container ">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" class="allinput wzt_form" :rules="rules" ref="queryForm" :inline="true" v-show="showSearch" >
      <el-form-item label="装置组：" prop="deviceGroupId" style="margin-left: 10px;" >
        <el-select v-model="queryParams.deviceGroupId" placeholder="请选择装置组" clearable size="small" >
          <el-option
            v-for="dict in deviceGroup"
            :key="dict.id"
            :label="dict.deviceGroupName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人：" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入创建者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
   <div class="tablesfrom">
    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="index" width="60">
        <template slot-scope="scope">
          <span v-text="table_index(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column label="装置名称" align="center" prop="deviceName" />
      <el-table-column label="创建人" align="center" prop="deviceCreateName" />
      <el-table-column label="创建时间" align="center" prop="deviceCreateTime" width="180"/>
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="shareSideLine(scope.row)"
            v-hasPermi="['system:device:add']"
          >配置监控侧线</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="shareSideMeter(scope.row)"
            v-hasPermi="['system:device:add']"
          >侧线瞬时表</el-button>
        </template>
      </el-table-column>
    </el-table>
   </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

</div>

    <!-- 添加分配侧线对话框-->
    <el-dialog class="all_dialog"  :title="title" :visible.sync="open" width="600px" append-to-body>
     <el-row>
        <el-form  label-width="100px">
            <el-col :span="12">
              <el-form-item label="装置:" prop="creator">
                <el-input v-model="deviceName"  :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="侧线名称：">
                <el-input v-model="queryParams.pipeName" style="width: 180px;" @blur="queryListByParam"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="侧线类型:">
                  <el-select v-model="queryParams.pipeType" placeholder="侧线类型" @change="queryListByParam" clearable size="small">
                      <el-option
                        v-for="dict in pipeTypeList"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="">
                  <el-select v-model="shared" clearable size="mini" style="" @change="shareType">
                      <el-option
                        v-for="item in sharedList"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                </el-form-item>
            </el-col>
          </el-form>
     </el-row>
      <el-table :data="sideLineList" style="" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="侧线名称" align="left" prop="pipeName" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTable" v-preventReClick>保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改装置配置对话框 -->
    <el-dialog class="all_dialog" :title="title" :visible.sync="open_1" width="660px">
      <div style="width: 100%;height: 400px;">
        <div style="margin-right: 10px;border: 2px solid #d8dce5;width: 290px;height: 360px;float: right;overflow: auto;">
          <el-table :data="meterList" @row-click="meterClick" highlight-current-row>
            <el-table-column label="仪表名称" align="left" prop="meterName" />
          </el-table>
        </div>
        <img v-preventReClick @click="addMeterToSideLine" style="width: 20px;margin-top: 260px;float: right;cursor:pointer;" src='../../../assets/images/left.png'/>
        <div style="margin-left: 10px;border: 2px solid #d8dce5;width: 290px;height: 220px;float: left;overflow: auto;">
          <el-table :data="sideLineList" @row-click="sideLineClick" highlight-current-row>
            <el-table-column label="侧线名称" align="left" prop="pipeName" />
          </el-table>
        </div>
        <div style="margin-left: 10px;margin-top:5px; border: 2px solid #d8dce5;width: 290px;height: 135px;float: left;">
           <el-table :data="sideRelationMeter" @row-click="meterDelete" highlight-current-row>
            <el-table-column  align="left" prop="meterName" />
           </el-table>
         </div>
         <img v-preventReClick @click="deleteMeterOrLine" style="width: 20px;margin-top: 20px;float: right;cursor:pointer;" src='../../../assets/images/right.png'/>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDevice, getDeviceLine, getMeterList,addDeviceLine,sideLineList,addSideAndMeter,deleteSideLineMeter} from "@/api/system/device";
import { listDevicegroup}  from "@/api/system/devicegroup";
export default {
  name: "Device",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 装置组
      deviceGroup: [],
      //侧线类型
      pipeTypeList:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      //保存删除的信息
      meterObj:null,
      //装置名称
      deviceName:null,
      //装置ID
      deviceId:null,
      //侧线集合
      sideLineList:[],
      //瞬时表
      meterList:[],
      //侧线仪表关系表
      sideRelationMeter:[],
      //临时保存
      saveList:[],
      //存储选中数据
      selectedList:[],
      shared:-1,
      sharedList:[{
        "name": "全部",
        "value": -1
      },{
        "name": "已分配",
        "value": 1
      },{
        "name": "未分配",
        "value": 0
      }],
      // 总条数
      total: 0,
      // 装置配置表格数据
      deviceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open_1:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eqid: null,
        deviceName:null,
        deviceGroupId: null,
        pipeName:null,
        pipeType:null,
        creator: null,
      },
      //存储数据
      param:{
        deviceId:null,
        deviceName:null,
        sideLineId:null,
        sideLineName:null,
        meterId:null,
        meterName:null
      },
      // 表单校验
      rules: {
        deviceGroupId: [
          { required: true, message: "装置组不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getDeviceGroup();
    this.getDicts("pipe_type").then(response => {
      this.pipeTypeList = response.data;
    });

  },
  methods: {
    /** 装置组 */
    getDeviceGroup() {
      listDevicegroup().then(response => {
        this.deviceGroup = response.result;
        this.queryParams.deviceGroupId = response.result[0].id;
        this.getList();
      })
    },
    /** 查询装置配置列表 */
    getList() {
      this.loading = true;
      listDevice(this.queryParams).then(response => {
        this.deviceList = response.result;
        this.total = response.total;
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
      this.open_1 = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if(this.queryParams.deviceGroupId == null || this.queryParams.deviceGroupId == ""){
        return this.msgError("请先选择装置组！");
      }
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deviceGroupId = this.deviceGroup[0].id;
      this.queryParams.creator = null;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
     this.selectedList = selection;
    },
    /** 分配监控侧线 */
   shareSideLine(row) {
      this.deviceName = row.deviceName;
      this.deviceId = row.deviceId;
      this.queryParams.eqid = row.deviceId;
      this.queryParams.deviceName = row.deviceName;
      this.sideLineList = [];
      this.shared = -1
      getDeviceLine(this.queryParams).then(response => {
        this.sideLineList = response.result;
        if(this.sideLineList != null){
          this.toggleSelection(this.sideLineList);
        }
        this.open = true;
        this.title = "分配监控侧线";
      });
    },
    //根据侧线名称查询
    queryListByParam(){
      getDeviceLine(this.queryParams).then(response => {
        this.sideLineList = response.result;
        if(this.sideLineList != null){
          this.toggleSelection(this.sideLineList);
        }
      });
    },
    //默认选中
    toggleSelection (rows) {
      rows.forEach(row => {
        if (row.isSelected === "1") {
          this.$nextTick( ()=> {
            this.$refs.multipleTable.toggleRowSelection(row,true);
          })
        }
      })
    },
    shareType(shared){
      getDeviceLine(this.queryParams).then(response => {
        this.sideLineList = response.result;
        for(var i=0;i<this.sideLineList.length;i++){
          if(this.shared == "1" && this.sideLineList[i].isSelected != 1){
            this.sideLineList.splice(i,1);
            i--;
          }
          if(this.shared == "0" && this.sideLineList[i].isSelected == 1){
            this.sideLineList.splice(i,1);
            i--;
          }
        }
        if(this.sideLineList != null){
          this.toggleSelection(this.sideLineList);
        }
      });
    },
    /** 分配侧线瞬时表 */
    shareSideMeter(row) {
      const id = row.deviceId
      this.param.deviceId = row.deviceId;
      this.param.deviceName = row.deviceName;
      this.meterList = [];
      this.sideLineList = [];
      this.sideRelationMeter = [];
      getMeterList(id).then(response => {
        this.meterList = response.result.meterList;
        this.sideLineList = response.result.pipeList;
        this.open_1 = true;
        this.title = "侧线瞬时表配置";
      });
    },
    /** 提交按钮 */
    submitTable() {
      var param = {
        "nodeId":this.deviceId,
        "pipeData":this.selectedList
      }
      addDeviceLine(param).then(response => {
        this.msgSuccess("新增成功");
        this.open = false;
      });
    },
    //选择侧线
    sideLineClick(row){
      const id = row.id;
      this.param.sideLineId = row.id;
      this.param.sideLineName = row.pipeName;
      this.sideRelationMeter = [];
      this.param.meterId = null;
      this.param.meterName = null;
      sideLineList(id).then(response => {
        this.sideRelationMeter = response.result;
      })
    },
    //选择仪表
    meterClick(row){
      this.param.meterId = row.id;
      this.param.meterName = row.meterName;
    },
    //添加信息
    addMeterToSideLine(){
      //判断是否选择侧线
      if(this.param.sideLineId == null){
        return this.msgError("请先选择侧线！");
      }
      if(this.param.meterId == null){
        return this.msgError("请先选择仪表！");
      }
      this.sideRelationMeter = [];
      addSideAndMeter(this.param).then(response =>{
        const id = this.param.sideLineId;
        sideLineList(id).then(response => {
          this.sideRelationMeter = response.result;
          //判断仪表位置，去除关联仪表
          for(var i=0;i<this.meterList.length;i++){
            if(this.meterList[i].id == this.param.meterId){
              this.meterList.splice(i,1);
            }
          }
          this.param.meterId = null;
          this.param.meterName = null;
        })
      })
    },
    //去除选择错误的数据
    meterDelete(row){
      this.meterObj = row;
    },
    //删除
    deleteMeterOrLine(){
      if(this.meterObj == null){
        return this.msgError("请选择要删除的信息！");
      }
      const id = this.meterObj.id;
      deleteSideLineMeter(id).then(response => {
        this.sideRelationMeter = [];
        const deviceId = this.param.deviceId;
        this.meterObj = null;
        getMeterList(deviceId).then(response => {
          this.meterList = response.result.meterList;
        })
      })
    },
  }
};
</script>
