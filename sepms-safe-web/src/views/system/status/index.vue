<template>
  <div class="app-container ">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form class="wzt_form" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">

      <el-form-item  prop="deviceId" label="部门:" >
        <treeselect  v-model="queryParams.deviceId" style="height:32px;width: 200px" :options="modeltreeOptions" @select="changeTree" :normalizer="normalizer" placeholder="请选择部门" />
      </el-form-item>
      <el-form-item label="装置名称:" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入装置名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="装置状态:" prop="deviceStatus">
        <el-select v-model="queryParams.deviceStatus"   placeholder="请选择状态"  clearable >
          <el-option
            v-for="dict in deviceStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开工时间:" prop="workStartTime">
        <el-date-picker v-model="workStartTime"
                        :clearable="false"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="停工时间:" prop="workStopTime">
        <el-date-picker v-model="workStopTime"
                        :clearable="false"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary"  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加数据 -->
    <div class="formQuery form_content_pagination">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:devicestatus:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="statusList">
      <el-table-column label="序号" align="center" prop="index" width="60">
        <template slot-scope="scope">
          <span v-text="table_index(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column label="装置名称" align="center" prop="deviceName" min-width="140"/>
      <el-table-column label="装置状态" align="center" prop="deviceStatus" :formatter="deviceStatusFormat" />
      <el-table-column label="开工时间" align="center" prop="workStartTime" width="180"/>
      <el-table-column label="停工时间" align="center" prop="workStopTime" min-width="180"/>
      <el-table-column label="开工创建人" align="center" prop="workStartCreator" min-width="180"/>
      <el-table-column label="开工创建时间" align="center" prop="workCreateTime" min-width="180"/>
      <el-table-column label="停工创建人" align="center" prop="workEndCreator" min-width="180"/>
      <el-table-column label="停工创建时间" align="center" prop="workEndTime" min-width="180"/>
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:devicestatus:edit']"
          >编辑</el-button>
          <el-button
            size="mini"
            class="delbtn"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:devicestatus:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleStop(scope.row)"
            v-hasPermi="['system:devicestatus:edit']"
          >停工</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /></div>

    <!-- 添加-->
    <el-dialog class="all_dialog" :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="装置名称:" prop="device">
          <el-select v-model="deviceObj" value-key="id" filterable clearable placeholder="请选择装置名称" size="mini" >
            <el-option
              v-for="dict in deviceList"
              :key="dict.id"
              :label="dict.name"
              :value="dict"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开工时间:" prop="workStartTime">
          <el-date-picker size="small"
                          :clearable="false"
            v-model="form.workStartTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开工时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="描述:" prop="remark">
          <textarea v-model="form.remark" placeholder="请输入描述" style="width: 220px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改装置运行状态对话框 -->
    <el-dialog :title="title" :visible.sync="open_1" width="400px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item  label="装置名称:"  prop="deviceName">
          <el-input v-model="form.deviceName" style="width: 220px"  disabled/>
        </el-form-item>
        <el-form-item label="开工时间:" prop="workStartTime" v-if="flag">
          <el-date-picker size="small"
                          :clearable="false"
                          v-model="form.workStartTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择开工时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="停工时间:" prop="workStopTime" v-if="!flag">
          <el-date-picker size="small"
                          :clearable="false"
                          v-model="form.workStopTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择停工时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="描述:" prop="remark">
          <textarea v-model="form.remark" placeholder="请输入描述" style="width: 220px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStatus, getStatus, delStatus, addStatus, updateStatus,} from "@/api/system/status";
import { getModelDict } from '@/api/model/modeltree'
import { listEquipmentCoking } from '@/api/model/coking'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "Status",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 装置运行状态表格数据
      statusList: [],
      // 弹出层标题
      title: "",
      //开停工显示标识
      flag:false,
      // 是否显示弹出层
      open: false,
      open_1: false,
      deviceObj:null,
      workStartTime:null,
      workStopTime: null,
      // 装置状态字典
      deviceStatusOptions: [],
      // 模型树树选项
      modeltreeOptions: [],
      deviceList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceId:null,
        deviceName: null,
        deviceStatus: null,
        workStartTime1: null,
        workStartTime2: null,
        workStopTime1: null,
        workStopTime2: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceObj: [
          { required: true, message: "装置名称不能为空", trigger: "blur" }
        ],
        workStartTime: [
          { required: true, message: "开工时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("start_stop_status").then(response => {
      this.deviceStatusOptions = response.data;
    });
    this.getTreeSelect();
    this.queryDeviceList();
  },
  methods: {
    /** 机构树 */
    getTreeSelect() {
      getModelDict({"level":3,"type":"pm_equipment_coking","iStree":true}).then(response => {
        this.modeltreeOptions = this.handleTree(response.result, "id", "parentId");
        //this.modeltree = response.result;
      });
    },
    queryDeviceList(){
      var params = {
        "hasPromi" : true
      }
      listEquipmentCoking(params).then(response =>{
        this.deviceList = response.result;
      });
    },
    /** 机构树选择 */
    changeTree(node){
      this.queryParams.deviceId = node.id;
    },
    /** 机构树选择(新增) */
    changeTrees(node){
      this.form.deviceName = node.modelName;
      this.form.deviceId = node.id;
    },
    /** 转换模型树数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.modelName,
        children: node.children
      };
    },
    /** 查询装置运行状态列表 */
    getList() {
      this.loading = true;
      if(this.workStartTime != null){
        this.queryParams.workStartTime1 = this.workStartTime[0];
        this.queryParams.workStartTime2 = this.workStartTime[1];
      }
      if(this.workStopTime != null){
        this.queryParams.workStopTime1 = this.workStopTime[0];
        this.queryParams.workStopTime2= this.workStopTime[1];
      }
      var a = this.queryParams;
      listStatus(this.queryParams).then(response => {
        this.statusList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    //table翻页
    table_index($index){
      return (this.queryParams.pageNum-1) * this.queryParams.pageSize + $index +1;
    },
    // 装置状态字典翻译
    deviceStatusFormat(row, column) {
      return this.selectDictLabel(this.deviceStatusOptions, row.deviceStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.open_1 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        deviceId: null,
        deviceName: null,
        deviceStatus: null,
        workStartTime: null,
        workStopTime: null,
        workStartCreator: null,
        workCreateTime: null,
        workEndCreator: null,
        workEndTime: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.workStartTime = null;
      this.workStopTime= null;
      this.queryParams.workStartTime1 = null;
      this.queryParams.workStartTime2 = null;
      this.queryParams.workStopTime1 = null;
      this.queryParams.workStopTime2= null;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.flag = true;
      this.open = true;
      this.title = "添加装置运行状态";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id
      if(row.workStopTime == "" || row.workStopTime == null){
        this.flag = true;
      }else{
        this.flag = false;
      }
      getStatus(id).then(response => {
        this.form = response.result;
        this.open_1 = true;
        this.title = "修改装置运行状态";
      });
    },
    //停工
    handleStop(row){
      this.reset();
      const id = row.id
      this.flag = false;
      getStatus(id).then(response => {
        this.form = response.result;
        this.open_1 = true;
        this.title = "停工";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStatus(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.open_1 = false;
              this.flag = false;
              this.getList();
            });
          } else {
            this.form.deviceName = this.deviceObj.name ;
            this.form.deviceId = this.deviceObj.id ;
            addStatus(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.open_1 = false;
              this.flag = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$confirm('是否确认删除装置名称为"' + row.deviceName + '"的开停工数据吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStatus(id);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
  }
};
</script>
