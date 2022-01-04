<template>
  <div class="app-container ">
  <div v-show="!showSearch" style="height:15px"></div>
    <el-form :model="queryParams" class="allinput formQuery"  ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="名称:" prop="oreName">
        <el-input
          v-model="queryParams.oreName"
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

<div class="formQuery form_content_pagination">

      <div class="tablesfrom">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        style="padding-bottom:16px;"
      ></right-toolbar>
    <el-table v-loading="loading" :data="oreList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="oreCode" />
      <el-table-column label="名称" align="center" prop="oreName" />
      <el-table-column label="简称" align="center" prop="shortName" />
      <el-table-column label="所属单位" align="center" prop="affiliatedUnits" />
      <el-table-column label="状态" align="center" class-name="small-padding fixed-width">
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
    <!-- 添加或修改矿点管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="oreCOde">
          <el-input v-model="form.oreCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.oreName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="所属单位" prop="affiliatedUnits">
          <el-input v-model="form.affiliatedUnits" placeholder="请输入所属单位" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isUse">
          <el-select v-model="form.isUse" placeholder="请选择是否启用">
            <el-option
              v-for="dict in isUseOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
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
import { listOre, getOre, delOre, addOre, updateOre } from "@/api/model/ore";

export default {
  name: "Ore",
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
      // 是否启用字典
      isUseOptions: [],
      // 总条数
      total: 0,
      // 矿点管理表格数据
      oreList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        oreName: null,
        shortName: null,
        isUse: "",
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        oreCode: [
          { required: true, message: "编码不能为空", trigger: "blur" }
        ],
        oreName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
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
    // 是否启用字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
    },
    /** 查询矿点管理列表 */
    getList() {
      this.loading = true;
      listOre(this.queryParams).then(response => {
        this.oreList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    //取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    //表单重置
    reset() {
      this.form = {
        id: null,
        oreCode: null,
        oreName: null,
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
      this.title = "添加矿点管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOre(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改矿点管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOre(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOre(this.form).then(response => {
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
      this.$confirm('是否确认删除矿点管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOre(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/ore/export', {
        ...this.queryParams
      }, `model_ore.xlsx`)
    },
    // 区域状态修改
    handleIsUseChange(row) {
      let text = row.isUse === 1 ? "停用" : "启用";
      console.log(text)
      this.$confirm(
        "确认要" + text + '"' + row.oreName + '"的区域吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateOre(row.id, row.isUse);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.isUse = row.isUse === 0 ? 1 : 0;
        });
    },
  }
};
</script>
