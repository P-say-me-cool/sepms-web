<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="eqgqName">
        <el-input
          v-model="queryParams.eqgqName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编码" prop="eqgqCode">
        <el-input
          v-model="queryParams.eqgqCode"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="别名" prop="eqgqAlias">
        <el-input
          v-model="queryParams.eqgqAlias"
          placeholder="请输入别名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="容积" prop="bulk">
        <el-input
          v-model="queryParams.bulk"
          placeholder="请输入容积"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="罐高" prop="height">
        <el-input
          v-model="queryParams.height"
          placeholder="请输入罐高"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="罐类型" prop="eqgqType">
        <el-select v-model="queryParams.eqgqType" placeholder="请选择罐类型" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="启用标志" prop="isUse">
        <el-input
          v-model="queryParams.isUse"
          placeholder="请输入启用标志"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最小警戒存量" prop="minWarm">
        <el-input
          v-model="queryParams.minWarm"
          placeholder="请输入最小警戒存量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大境界存量" prop="maxWarm">
        <el-input
          v-model="queryParams.maxWarm"
          placeholder="请输入最大境界存量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大境界存量" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入最大境界存量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最大境界存量" prop="parentName">
        <el-input
          v-model="queryParams.parentName"
          placeholder="请输入最大境界存量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['model:eqgq:add']"
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
          v-hasPermi="['model:eqgq:edit']"
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
          v-hasPermi="['model:eqgq:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['model:eqgq:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="eqgqList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="最大境界存量" align="center" prop="eqgqId" />
      <el-table-column label="名称" align="center" prop="eqgqName" />
      <el-table-column label="编码" align="center" prop="eqgqCode" />
      <el-table-column label="别名" align="center" prop="eqgqAlias" />
      <el-table-column label="容积" align="center" prop="bulk" />
      <el-table-column label="罐高" align="center" prop="height" />
      <el-table-column label="罐类型" align="center" prop="eqgqType" />
      <el-table-column label="启用标志" align="center" prop="isUse" />
      <el-table-column label="最小警戒存量" align="center" prop="minWarm" />
      <el-table-column label="最大境界存量" align="center" prop="maxWarm" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="备注" align="center" prop="parentId" />
      <el-table-column label="备注" align="center" prop="parentName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:eqgq:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:eqgq:remove']"
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

    <!-- 添加或修改仓储装置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="eqgqName">
          <el-input v-model="form.eqgqName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="eqgqCode">
          <el-input v-model="form.eqgqCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="别名" prop="eqgqAlias">
          <el-input v-model="form.eqgqAlias" placeholder="请输入别名" />
        </el-form-item>
        <el-form-item label="容积" prop="bulk">
          <el-input v-model="form.bulk" placeholder="请输入容积" />
        </el-form-item>
        <el-form-item label="罐高" prop="height">
          <el-input v-model="form.height" placeholder="请输入罐高" />
        </el-form-item>
        <el-form-item label="罐类型" prop="eqgqType">
          <el-select v-model="form.eqgqType" placeholder="请选择罐类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用标志" prop="isUse">
          <el-input v-model="form.isUse" placeholder="请输入启用标志" />
        </el-form-item>
        <el-form-item label="最小警戒存量" prop="minWarm">
          <el-input v-model="form.minWarm" placeholder="请输入最小警戒存量" />
        </el-form-item>
        <el-form-item label="最大境界存量" prop="maxWarm">
          <el-input v-model="form.maxWarm" placeholder="请输入最大境界存量" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="备注" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入备注" />
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
import { listEqgq, getEqgq, delEqgq, addEqgq, updateEqgq } from "@/api/model/eqgq";

export default {
  name: "Eqgq",
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
      // 仓储装置表格数据
      eqgqList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eqgqName: null,
        eqgqCode: null,
        eqgqAlias: null,
        bulk: null,
        height: null,
        eqgqType: null,
        isUse: null,
        minWarm: null,
        maxWarm: null,
        parentId: null,
        parentName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        eqgqName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        bulk: [
          { required: true, message: "容积不能为空", trigger: "blur" }
        ],
        height: [
          { required: true, message: "罐高不能为空", trigger: "blur" }
        ],
        eqgqType: [
          { required: true, message: "罐类型不能为空", trigger: "change" }
        ],
        isUse: [
          { required: true, message: "启用标志不能为空", trigger: "blur" }
        ],
        minWarm: [
          { required: true, message: "最小警戒存量不能为空", trigger: "blur" }
        ],
        maxWarm: [
          { required: true, message: "最大境界存量不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "最大境界存量不能为空", trigger: "blur" }
        ],
        parentName: [
          { required: true, message: "最大境界存量不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询仓储装置列表 */
    getList() {
      this.loading = true;
      listEqgq(this.queryParams).then(response => {
        this.eqgqList = response.result;
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
        eqgqId: null,
        eqgqName: null,
        eqgqCode: null,
        eqgqAlias: null,
        bulk: null,
        height: null,
        eqgqType: null,
        isUse: null,
        minWarm: null,
        maxWarm: null,
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
      this.ids = selection.map(item => item.eqgqId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加仓储装置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const eqgqId = row.eqgqId || this.ids
      getEqgq(eqgqId).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改仓储装置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.eqgqId != null) {
            updateEqgq(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEqgq(this.form).then(response => {
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
      const eqgqIds = row.eqgqId || this.ids;
      this.$confirm('是否确认删除仓储装置编号为"' + eqgqIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEqgq(eqgqIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/eqgq/export', {
        ...this.queryParams
      }, `model_eqgq.xlsx`)
    }
  }
};
</script>