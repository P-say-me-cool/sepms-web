<template>
  <div class="app-container">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams " class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="装置组：" prop="deviceGroupName">
        <el-input
          v-model="queryParams.deviceGroupName"
          placeholder="请输入装置组名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建者：" prop="creator">
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
        <el-button type="primary"  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


<div class="formQuery form_content_pagination">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:devicegroup:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="devicegroupList">
      <el-table-column label="序号" align="center" prop="index" width="60">
        <template slot-scope="scope">
          <span v-text="table_index(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column label="装置组名称" align="center" prop="deviceGroupName" />
      <el-table-column label="创建者" align="center" prop="creator" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleShare(scope.row)"
            v-hasPermi="['system:devicegroup:share']"
          >分配装置</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:devicegroup:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            class="delbtn"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:devicegroup:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
</div>
    <!-- 添加或修改装置组配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="装置组名称" prop="deviceGroupName">
          <el-input v-model="form.deviceGroupName" placeholder="请输入装置组名称" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="open_1" width="600px"  append-to-body>
       <span  style="width: 280px;">
        装置组：
          <el-input v-model="deviceGroupName" style="width: 200px;" :disabled="true"/>
      </span>
      <span  style="width: 280px;margin-left: 40px;">
        描述：
          <el-input v-model="remark" style="width: 200px;" :disabled="true" />
      </span>
      <div style="height: 380px;overflow: auto;">
        <el-select v-model="selected" clearable size="mini" style="margin-top: 10px;width: 100px;float: right;margin-right: 10px;" @change="shareType">
          <el-option
            v-for="item in selectedList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-table :data="deviceList" style="margin-top: 10px;width: 420px;" @selection-change="handleSelectionChange" ref="multipleTable">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="装置名称" align="left" prop="deviceName" />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTable" v-preventReClick>确 定</el-button>
        <el-button @click="cancel1">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDevicegroup, getDevicegroup, delDevicegroup, addDevicegroup,
          updateDevicegroup,addDevices,getDeviceByGroupId,} from "@/api/system/devicegroup";
import { listEquipmentCoking } from '@/api/model/coking';


export default {
  name: "Devicegroup",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      id: "",
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 装置组配置表格数据
      devicegroupList: [],
      // 装置表格数据
      deviceList:[],
      //选中的装置
      deviceListSelected:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示分配装置弹出层
      open_1: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceGroupName: null,
        creator: null,
      },
      //装置组
      deviceGroupName:"",
      //描述
      remark:"",
      //筛选标识
      selected:-1,
      selectedList:[{
        "name": "全部",
        "value": -1
      },{
        "name": "已分配",
        "value": 1
      },{
        "name": "未分配",
        "value": 0
      }],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceGroupName: [
          { required: true, message: "装置组名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getdevice();
  },
  methods: {
    //初始化加载装置
    getdevice(){
      var params = {
        "isUse" : 0
      }
      listEquipmentCoking(params).then(response =>{
        this.deviceList = response.result;
      });
    },
    /** 查询装置组配置列表 */
    getList() {
      this.loading = true;
      listDevicegroup(this.queryParams).then(response => {
        this.devicegroupList = response.result;
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
      this.reset();
    },
    cancel1() {
      this.open_1 = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        deviceGroupName: null,
        remark: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加装置组配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id
      getDevicegroup(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改装置组配置";
      });
    },
    //分配装置
    handleShare(row){
      this.id = row.id;
      const id = row.id;
      this.selected = -1;
      getDevicegroup(id).then(response => {
        this.deviceGroupName = response.result.deviceGroupName;
        this.remark = response.result.remark;
        this.deviceList = response.result.list;
        if(this.deviceList != null){
          this.toggleSelection(this.deviceList);
        }
        this.open_1 = true;
        this.title = "分配装置";
      });
    },

    //默认选中
    toggleSelection (rows) {
      rows.forEach(row => {
        if (row.isSelected === "1") {
          this.$nextTick( ()=> {
            this.$refs.multipleTable.toggleRowSelection(row,true)
          })
        }
      })
    },
    handleSelectionChange(row){
      this.deviceListSelected = row;
    },
    shareType(selected){
      this.selected = selected;
      const id = this.id;
      getDevicegroup(id).then(response => {
        this.deviceGroupName = response.result.deviceGroupName;
        this.remark = response.result.remark;
        this.deviceList = response.result.list;
        for(var i=0;i<this.deviceList.length;i++){
          if(this.selected == "1" && this.deviceList[i].isSelected != 1){
            this.deviceList.splice(i,1);
            i--;
          }
          if(this.selected == "0" && this.deviceList[i].isSelected == 1){
            this.deviceList.splice(i,1);
            i--;
          }
        }
        if(this.deviceList != null){
          this.toggleSelection(this.deviceList);
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      if(this.form.remark != null){
        if(this.form.remark.length > 100){
          return this.msgError("输入描述不能超过100个字！");
        }
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.deviceGroupName.length > 20){
            return this.msgError("输入装置组名称不能超过20个字！");
          }
          if (this.form.id != null) {
            updateDevicegroup(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDevicegroup(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      //查找是否有关联数据
      getDeviceByGroupId(id).then(response => {
        if(response.result.length > 0){
          return this.msgError("请先删除装置组下的装置！！！");
        }
        this.$confirm('是否确认删除装置组名称为"' + row.deviceGroupName + '"的数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDevicegroup(id);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
      })
    },
  //选中装置的提交
    submitTable(){
      for(var i=0;i<this.deviceListSelected.length;i++){
        this.deviceListSelected[i].deviceGroupId = this.id;
        this.deviceListSelected[i].deviceId = this.deviceListSelected[i].id;
        this.deviceListSelected[i].id = null;
      }
      var type;
      if(this.selected == "0"){
        type = "0";
      }else if(this.selected == "1"){
        type = "1";
      }else{
        type = "-1";
      }
      var param = {
        "type":type,
        "nodeId": this.id,
        "data":this.deviceListSelected
      }
      addDevices(param).then(response => {
        this.msgSuccess("新增成功");
        this.open_1 = false;
      });
    },
  },
};
</script>
