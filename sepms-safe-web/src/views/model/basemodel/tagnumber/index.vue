<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="位号名称" prop="tagName">
        <el-input
          v-model="queryParams.tagName"
          placeholder="请输入位号名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据来源" prop="dataSources">
        <el-input
          v-model="queryParams.dataSources"
          placeholder="请输入数据来源"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:tagnumber:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['model:tagnumber:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['model:tagnumber:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['model:tagnumber:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tagnumberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="serialNumber" />
      <el-table-column label="位号名称" align="center" prop="tagName" />
      <el-table-column label="位号描述" align="center" prop="tagDescribe" />
      <el-table-column label="数据来源" align="center" prop="dataSources" />
      <el-table-column label="位号类型" align="center" prop="tagType" :formatter="tagTypeFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:tagnumber:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:tagnumber:remove']"
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

    <!-- 添加或修改位号对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="序号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="请输入序号" />
        </el-form-item>
        <el-form-item label="位号名称" prop="tagName">
          <el-input v-model="form.tagName" placeholder="请输入位号名称" />
        </el-form-item>
        <el-form-item label="位号描述" prop="tagDescribe">
          <el-input v-model="form.tagDescribe" placeholder="请输入位号描述" />
        </el-form-item>
        <el-form-item label="数据来源" prop="dataSources">
          <el-input v-model="form.dataSources" placeholder="请输入数据来源" />
        </el-form-item>
        <el-form-item label="位号类型" prop="tagType">
          <el-select
            v-model="queryParams.tagType"
            placeholder="请选择位号类型"
            clearable
          >
          <el-option
            v-for="dict in tagTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTagnumber, getTagnumber, delTagnumber, addTagnumber, updateTagnumber } from "@/api/model/tagnumber";

export default {
  name: "Tagnumber",
  components: {
  },
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
      // 位号表格数据
      tagnumberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 位号类型字典
      tagTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tagName: null,
        dataSources: null,
        tagType:""
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getDicts("tag_type").then(response => {
      this.tagTypeOptions = response.data;
    });
    this.getList();
  },
  methods: {
    /** 查询位号列表 */
    getList() {
      this.loading = true;
      listTagnumber(this.queryParams).then(response => {
        this.tagnumberList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 位号类型字典翻译
    tagTypeFormat(row, column) {
      return this.selectDictLabel(this.tagTypeOptions, row.tagType);
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
        serialNumber: null,
        tagName: null,
        tagDescribe: null,
        dataSources: null,
        tagType: null,
        createTime: null,
        creator: null,
        createBy: null,
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加位号";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row)
      console.log(row)
      this.reset();
      const id = row.id || this.ids
      getTagnumber(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改位号";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTagnumber(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTagnumber(this.form).then(response => {
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
      this.$confirm('是否确认删除位号编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTagnumber(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/tagnumber/export', {
        ...this.queryParams
      }, `model_tagnumber.xlsx`)
    }
  }
};
</script>
