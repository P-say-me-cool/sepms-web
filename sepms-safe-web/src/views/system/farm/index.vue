<template>
  <div class="app-container ">
  <div style="height:15px;" v-show="!showSearch"></div>
  
    <el-form class="allinput wzt_form" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="重点监控罐组:" prop="tankForm">
        <el-input
          v-model="queryParams.tankForm"
           label-width="120px"
          placeholder="请输入重点监控罐组"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人:" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入创建人"
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

    <el-table v-loading="loading" :data="farmList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="index" width="60">
        <template slot-scope="scope">
          <span v-text="table_index(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column label="重点监控罐组" align="center" prop="tankForm" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="creator" />
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="shareTanks(scope.row)"
            v-hasPermi="['system:farm:add']"
          >分配罐</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:farm:edit']"
          >修改</el-button>
          <el-button
          class="delbtn"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:farm:remove']"
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
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="重点监控罐组:" prop="tankForm">
          <el-input v-model="form.tankForm" placeholder="请输入重点监控罐组"/>
        </el-form-item>
        <el-form-item label="描述:" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="open_1" width="700px" append-to-body>
    <el-row>
      <el-form label-width="110px">
        <el-col :span="12">
          <el-form-item label="重点监控罐组:" prop="tankForm">
              <el-input v-model="tankForm"  :disabled="true"/>
            </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐名称:" prop="tankName">
              <el-input v-model="queryParams.tankName"  @blur="queryFormListByParam"/>
            </el-form-item>
        </el-col>
      </el-form>
    </el-row>
      <div style="height: 360px;overflow: auto;margin-top: 10px;">
        <el-select v-model="selected" clearable size="mini" style="margin-top: 10px;width: 100px;float: right;margin-right: 10px;" @change="shareType">
          <el-option
            v-for="item in selectedList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-table :data="tankList" style="margin-top: 10px;width: 420px;" @selection-change="handleSelectionChange" ref="multipleTable">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="罐名称" align="left" prop="tankName" />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTableDatas" v-preventReClick>保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFarm, getFarm, delFarm, addFarm, updateFarm,
                    queryTankList,addTankConfigration,queryTankFarms} from "@/api/system/farm";

export default {
  name: "Farm",
  components: {},
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
      // 【请填写功能名称】表格数据
      farmList: [],
      //分配罐集合
      tankList:[],
      //存储选中的数据
      selectList:[],
      selected:null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open_1:false,
      tankForm:null,
      id:null,
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id:null,
        tankForm: null,
        tankName:null,
        creator: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tankForm: [
          { required: true, message: "罐监控组不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listFarm(this.queryParams).then(response => {
        this.farmList = response.result;
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
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectList = selection;
    },
    submitTableDatas(){
      for(let i=0;i<this.selectList.length;i++){
        this.selectList[i].parentId = this.id;
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
        "tankData":this.selectList
      }
      addTankConfigration(param).then(response => {
        this.msgSuccess("分配罐成功！");
        this.open_1 = false;
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加重点监控组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id
      getFarm(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改重点监控组";
      });
    },
    //分配罐
    shareTanks(row){
      this.tankForm = row.tankForm;
      this.id = row.id;
      this.tankList = [];
      this.queryParams.id = row.id;
      this.selected = -1;
      queryTankList(this.queryParams).then(response => {
        this.tankList = response.result;
        this.toggleSelection(this.tankList);
        this.open_1 = true;
        this.title = "分配罐";
      })
    },
    //根据罐名称模糊查询
    queryFormListByParam(){
      this.tankList = [];
      queryTankList(this.queryParams).then(response => {
          this.tankList = response.result;
          this.toggleSelection(this.tankList);
      })
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
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.remark != null){
            if(this.form.remark.length > 100){
              return this.msgError("描述不能大于100字！");
            }
          }
          if(this.form.tankForm.length > 20){
            return this.msgError("罐组名称不能大于20字！");
          }
          if (this.form.id != null) {
            updateFarm(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFarm(this.form).then(response => {
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
      queryTankFarms(id).then(rep =>{
        if(rep.length != 0){
         return this.msgError("请先删除罐组下面的数据！");
        }
        this.$confirm('是否确认删除罐组名称为"' + row.tankForm + '"的数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFarm(id);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
      });
    },
    shareType(selected){
      queryTankList(this.queryParams).then(response => {
        this.tankList = response.result;
        for(var i=0;i<this.tankList.length;i++){
          if(selected == "1" && this.tankList[i].isSelected != 1){
            this.tankList.splice(i,1);
            i--;
          }
          if(selected == "0" && this.tankList[i].isSelected == 1){
            this.tankList.splice(i,1);
            i--;
          }
        }
        this.toggleSelection(this.tankList);
      });

    },
  }
};
</script>
