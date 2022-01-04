<template>
  <div class="app-container ">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" ref="queryForm" class="allinput formQuery"  :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="单位名称:" prop="unitName">
        <el-input
          v-model="queryParams.unitName"
          placeholder="请输入单位名称名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="单位类型" prop="unitType">-->
<!--        <el-select v-model="queryParams.unitType" placeholder="请选择单位类型" clearable size="small">-->
<!--          <el-option-->
<!--            v-for="dict in unitTypeOptions"-->
<!--            :key="dict.dictValue"-->
<!--            :label="dict.dictLabel"-->
<!--            :value="dict.dictValue"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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
          v-hasPermi="['model:unit:add']"
        >新增</el-button>
      </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" style="height:40px"></right-toolbar>
    </el-row>
  <div class="tablesfrom">
    <el-table v-loading="loading" :data="unitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="unitCode" />
      <el-table-column label="名称" align="center" prop="unitName" />
      <el-table-column label="符号" align="center" prop="symbol" />
<!--      <el-table-column label="单位类型" align="center" prop="unitType" :formatter="unitTypeFormat" />-->
      <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat" />
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:unit:edit']"
          >编辑</el-button>
          <el-button
            class="delbtn"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:unit:remove']"
          >删除</el-button>
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
    <!-- 添加或修改单位管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码:" prop="unitCode">
          <el-input v-model="form.unitCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称:" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="符号:" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入符号" />
        </el-form-item>
<!--        <el-form-item label="单位类型" prop="unitType">-->
<!--          <el-select v-model="form.unitType" placeholder="请选择单位类型">-->
<!--            <el-option-->
<!--              v-for="dict in unitTypeOptions"-->
<!--              :key="dict.dictValue"-->
<!--              :label="dict.dictLabel"-->
<!--              :value="parseInt(dict.dictValue)"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="是否启用:">
          <el-radio-group v-model="form.isUse">
            <el-radio
              v-for="dict in isUseOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述:" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述" />
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
import { listUnit, getUnit, delUnit, addUnit, updateUnit } from "@/api/model/unit";

export default {
  name: "Unit",
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
      // 单位管理表格数据
      unitList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 单位类型字典
      unitTypeOptions: [],
      // 是否启用字典
      isUseOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        unitCode: null,
        unitName: null,
        symbol: null,
        unitType: null,
        isUse: null,
        description: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        unitName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          {max: 20, message: "名称超出最大长度20", trigger: "blur"}
        ],
        unitCode: [
          { required: true, message: "编码不能为空", trigger: "blur" },
          {max: 20, message: "名称超出最大长度20", trigger: "blur"}
        ],
        symbol: [
          { required: true, message: "符号不能为空", trigger: "blur" },
          {max: 20, message: "名称超出最大长度20", trigger: "blur"}
        ],
        remark: [
          {max: 200, message: "备注超出最大长度200", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("unit_type").then(response => {
      this.unitTypeOptions = response.data;
    });
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });
  },
  methods: {
    /** 查询单位管理列表 */
    getList() {
      this.loading = true;
      listUnit(this.queryParams).then(response => {
        this.unitList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 单位类型字典翻译
    unitTypeFormat(row, column) {
      return this.selectDictLabel(this.unitTypeOptions, row.unitType);
    },
    // 是否启用字典翻译
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
        unitCode: null,
        unitName: null,
        symbol: null,
        unitType: null,
        isUse: 0,
        description: null,
        createBy: null,
        creator: null,
        createTime: null,
        remark:null,
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
      this.title = "添加单位管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUnit(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改单位管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUnit(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else  {
            addUnit(this.form).then(response => {
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
      const unitCode = row.unitCode;
      this.$confirm('是否确认删除单位管理编码为"' + unitCode  + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUnit(ids);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/unit/export', {
        ...this.queryParams
      }, `model_unit.xlsx`)
    }
  }
};
</script>
