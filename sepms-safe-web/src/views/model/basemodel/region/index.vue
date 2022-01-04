<template>
  <div class="app-container ">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="名称:" prop="regionName">
        <el-input
          v-model="queryParams.regionName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="简称:" prop="shortName">
        <el-input
          v-model="queryParams.shortName"
          placeholder="请输入简称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用:" prop="isUse">
        <el-select
          v-model="queryParams.isUse"
          placeholder="请选择是否启用"
          clearable
          size="small"
        >
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
        <el-button type="primary"  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="formQuery form_content_pagination">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="height:40px"></right-toolbar>

  <div class="tablesfrom">
    <el-table v-loading="loading" :data="regionList">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编码" align="center" prop="regionCode"/>
      <el-table-column label="名称" align="center" prop="regionName"/>
      <el-table-column label="简称" align="center" prop="shortName"/>
      <el-table-column label="所属单位" align="center" prop="affiliatedUnits"/>
      <el-table-column label="状态" align="center" key="isUse">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUse"
            :active-value="0"
            :inactive-value="1"
            @change="handleIsUseChange(scope.row)"
          ></el-switch>
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
    <!-- 添加或修改区域管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码:" prop="regionCode">
          <el-input v-model="form.regionCode" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="名称:" prop="regionName">
          <el-input v-model="form.regionName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="简称:" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入简称"/>
        </el-form-item>
        <el-form-item label="所属单位:" prop="affiliatedUnits">
          <el-input v-model="form.affiliatedUnits" placeholder="请输入所属单位"/>
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
import {listRegion, getRegion, delRegion, addRegion, updateRegion} from "@/api/model/region";

export default {
  name: "Region",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 是否启用字典
      isUseOptions: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 区域管理表格数据
      regionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        regionName: null,
        shortName: null,
        isUse: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          {required: true, message: "主键不能为空", trigger: "blur"}
        ],
        regionCode: [
          {required: true, message: "编码不能为空", trigger: "blur"}
        ],
        regionName: [
          {required: true, message: "名称不能为空", trigger: "blur"}
        ],
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
    /** 查询区域管理列表 */
    getList() {
      this.loading = true;
      listRegion(this.queryParams).then(response => {
        this.regionList = response.result;
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
        regionCode: null,
        regionName: null,
        shortName: null,
        affiliatedUnits: null,
        isUse: null,
        createBy: null,
        creator: null,
        createTime: null,
        updateBy: null,
        updator: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    // 是否启用字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
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
      this.title = "添加区域管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRegion(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改区域管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRegion(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRegion(this.form).then(response => {
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
      this.$confirm('是否确认删除区域管理编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delRegion(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/region/export', {
        ...this.queryParams
      }, `model_region.xlsx`)
    },
    handleIsUseChange(row) {
      let text = row.isUse === 1 ? "停用" : "启用";
      this.$confirm('确认要' + text + '"' + row.regionName + '"的区域吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return updateRegion(row.id, row.isUse);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function () {
        row.isUse = row.isUse === 0 ? 1 : 0;
      });
    },
  }
};
</script>
