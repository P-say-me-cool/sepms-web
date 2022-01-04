<template>
  <div class="app-container ">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="班次类型:" prop="classesType">
        <el-select v-model="queryParams.classesType" placeholder="请选择班次类型" clearable size="small">
          <el-option
            v-for="dict in classesTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
<div class="formQuery form_content_pagination">
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:classes:add']"
        >新增
        </el-button>
      </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="height:40px"></right-toolbar>
      
    </el-row>
    <div class="tablesfrom">
    <el-table v-loading="loading" :data="classesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="班次类型" align="center" prop="classesType" :formatter="classesTypeFormat"/>
      <el-table-column label="名称" align="center" prop="classesName"/>
      <el-table-column label="上班时间" align="center" prop="workTime" width="180">
      </el-table-column>
      <el-table-column label="下班时间" align="center" prop="closingTime" width="180">
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:classes:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            class="delbtn"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:classes:remove']"
          >删除
          </el-button>
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
    <!-- 添加或修改班次对话框 -->
    <el-dialog :title="title" class="all_dialog" :visible.sync="open" width="650px" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-col :span="12">
            <el-form-item label="班次类型:" prop="classesType">
              <el-select v-model="form.classesType" placeholder="请选择班次类型">
                <el-option
                  v-for="dict in classesTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称:" prop="classesName">
              <el-input v-model="form.classesName" placeholder="请输入名称"/>
            </el-form-item>
          </el-col>
          <div class="block">
            <el-col :span="12">
              <el-form-item label="上班时间:" prop="workTime">
                <el-time-picker
                  v-model="form.workTime"
                  type="date"
                  value-format="HH:mm:ss"
                  placeholder="上班时间">
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下班时间:" prop="closingTime">
                <el-time-picker
                  v-model="form.closingTime"
                  type="date"
                  value-format="HH:mm:ss"
                  placeholder="下班时间">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listClasses, getClasses, delClasses, addClasses, updateClasses} from "@/api/model/classes";

export default {
  name: "Classes",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 班次表格数据
      classesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 班次类型字典
      classesTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classesType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        classesType: [
          {required: true, message: "班次类型不能为空", trigger: "change"},
        ],
        classesName: [
          {required: true, message: "名称不能为空", trigger: "change"},
          {max: 20, message: "名称超出最大长度20", trigger: "blur"}
        ],
        workTime: [
          {required: true, message: "上班时间不能为空", trigger: "change"}
        ],
        closingTime: [
          {required: true, message: "下班时间不能为空", trigger: "change"}
        ],
        remark:[
          {max: 200, message: "备注超出最大长度200", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("class_type").then(response => {
      this.classesTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询班次列表 */
    getList() {
      this.loading = true;
      listClasses(this.queryParams).then(response => {
        this.classesList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 班次类型字典翻译
    classesTypeFormat(row, column) {
      return this.selectDictLabel(this.classesTypeOptions, row.classesType);
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
        classesType: null,
        classesName: null,
        workTime: null,
        closingTime: null,
        remark: null,
        createBy: null,
        creator: null,
        createTime: null,
        updateTime: null,
        updateBy: null,
        updator: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加班次";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getClasses(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改班次";
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.workTime);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateClasses(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClasses(this.form).then(response => {
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
      const ids = row.id || this.ids;
      const classesName = row.classesName;
      this.$confirm('是否确认删除"' + classesName + '"的班次数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delClasses(ids);
      }).then(() => {
        this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/classes/export', {
        ...this.queryParams
      }, `model_classes.xlsx`)
    }
  }
};
</script>
