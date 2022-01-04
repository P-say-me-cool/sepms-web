<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="上级部门" prop="parentName">
        <el-input
          v-model="form.parentName"
          clearable
          size="large"
        />
      </el-form-item>
      <br>
      <el-form-item label="组织编码" prop="companyCode">
        <el-input
          v-model="form.companyCode"
          clearable
          size="large"
        />
      </el-form-item>
      <br>
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="form.companyName"
          clearable
          size="large"
        />
      </el-form-item>
      <br>
      <el-form-item label="是否启用" prop="isUse" :formatter="isUseFormat" >
        <el-input
          v-model="form.isUse"
          clearable
          size="large"
        />
      </el-form-item>
      <br>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea"
                  v-model="form.remark"
                  clearable
                  size="large"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { listCompany, getCompany, delCompany, addCompany, updateCompany } from "@/api/model/company";

export default {
  name: "Company",
  components: {
  },
  props:['pid'],
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
      // 公司组织表格数据
      companyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 在用状态字典
      isUseOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getCompany();
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });
  },
  methods: {
    /** 获取公司组织详情*/
    getCompany(){
      let id = this.pid;
      getCompany(id).then(response => {
        this.form = response.result;
        this.open = true;
      });
    },
    /** 查询公司组织列表 */
    getList() {
      this.loading = true;
      listCompany(this.queryParams).then(response => {
        this.companyList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 在用状态字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
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
        companyName: null,
        companyCode: null,
        companyAlias: null,
        startTime: null,
        isUse: null,
        remark: null,
        parentId: null,
        parentName: null
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
      this.title = "添加公司组织";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCompany(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改公司组织";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCompany(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCompany(this.form).then(response => {
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
      this.$confirm('是否确认删除公司组织编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCompany(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/company/export', {
        ...this.queryParams
      }, `model_company.xlsx`)
    }
  }
};
</script>
