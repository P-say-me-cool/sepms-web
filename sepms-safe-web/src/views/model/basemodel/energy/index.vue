<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="energyName">
        <el-input
          v-model="queryParams.energyName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="简称" prop="energyAlias">
        <el-input
          v-model="queryParams.energyAlias"
          placeholder="请输入简称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="isUse">
        <el-select v-model="queryParams.isUse" placeholder="请选择是否启用" clearable size="small">
          <el-option
            v-for="dict in isUseOptions"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:energy:add']"
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
          v-hasPermi="['model:energy:edit']"
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
          v-hasPermi="['model:energy:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['model:energy:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="energyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="能源编码" align="center" prop="energyCode" />
      <el-table-column label="名称" align="center" prop="energyName" />
      <el-table-column label="简称" align="center" prop="energyAlias" />
      <el-table-column label="类别编码" align="center" prop="typeCode" />
      <el-table-column label="类别名称" align="center" prop="typeName" />
      <el-table-column label="是否启用" align="center" prop="isUse" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:energy:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:energy:remove']"
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

    <!-- 添加或修改能源管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="能源编码" prop="energyCode">
          <el-input v-model="form.energyCode" placeholder="请输入能源编码" />
        </el-form-item>
        <el-form-item label="名称" prop="energyName">
          <el-input v-model="form.energyName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="简称" prop="energyAlias">
          <el-input v-model="form.energyAlias" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="类别编码" prop="typeCode">
          <el-input v-model="form.typeCode" placeholder="请输入类别编码" />
        </el-form-item>
        <el-form-item label="类别名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入类别名称" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isUse">
          <el-input v-model="form.isUse" placeholder="请输入是否启用" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listEnergy, getEnergy, delEnergy, addEnergy, updateEnergy } from "@/api/model/energy";

export default {
  name: "Energy",
  components: {
  },
  data() {
    return {
      // 是否启用字典
      isUseOptions: [],
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
      // 能源管理表格数据
      energyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        energyName: null,
        energyAlias: null,
        isUse: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        energyCode: [
          { required: true, message: "能源编码不能为空", trigger: "blur" }
        ],
        energyName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        energyAlias: [
          { required: true, message: "简称不能为空", trigger: "blur" }
        ],
        typeCode: [
          { required: true, message: "类别编码不能为空", trigger: "blur" }
        ],
        typeName: [
          { required: true, message: "类别名称不能为空", trigger: "blur" }
        ],
        isUse: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
        unit: [
          { required: true, message: "单位不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建者id不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateBy: [
          { required: true, message: "更新者id不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ],
        updator: [
          { required: true, message: "更新者不能为空", trigger: "blur" }
        ],
        creator: [
          { required: true, message: "创建者不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });
  },
  methods: {
    // 是否启用字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
    },
    /** 查询能源管理列表 */
    getList() {
      this.loading = true;
      listEnergy(this.queryParams).then(response => {
        this.energyList = response.result;
        this.total = response.total;
        this.loading = false;
      });
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
        energyCode: null,
        energyName: null,
        energyAlias: null,
        typeCode: null,
        typeName: null,
        isUse: null,
        unit: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        updator: null,
        creator: null
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
      this.title = "添加能源管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEnergy(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改能源管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEnergy(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEnergy(this.form).then(response => {
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
      this.$confirm('是否确认删除能源管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEnergy(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/energy/export', {
        ...this.queryParams
      }, `model_energy.xlsx`)
    }
  }
};
</script>
