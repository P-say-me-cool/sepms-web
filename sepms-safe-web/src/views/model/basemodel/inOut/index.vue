<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="父id" prop="parentId">
        <el-input
          v-model="queryParams.parentId"
          placeholder="请输入父id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="进出场编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入进出场编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="进出场名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入进出场名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运输类型" prop="transportType">
        <el-select v-model="queryParams.transportType" placeholder="请选择运输类型" clearable size="small">
          <el-option
            v-for="dict in transportTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="进出类型" prop="inOutType">
        <el-select v-model="queryParams.inOutType" placeholder="请选择进出类型" clearable size="small">
          <el-option
            v-for="dict in inOutTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="精度" prop="accuracy">
        <el-input
          v-model="queryParams.accuracy"
          placeholder="请输入精度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班量计量" prop="measureType">
        <el-select v-model="queryParams.measureType" placeholder="请选择班量计量" clearable size="small">
          <el-option
            v-for="dict in measureTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
      <el-form-item label="更新者" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入更新者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新者" prop="updator">
        <el-input
          v-model="queryParams.updator"
          placeholder="请输入更新者"
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
          v-hasPermi="['model:inOut:add']"
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
          v-hasPermi="['model:inOut:edit']"
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
          v-hasPermi="['model:inOut:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['model:inOut:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inOutList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" />
      <el-table-column label="父id" align="center" prop="parentId" />
      <el-table-column label="进出场编码" align="center" prop="code" />
      <el-table-column label="进出场名称" align="center" prop="name" />
      <el-table-column label="运输类型" align="center" prop="transportType" :formatter="transportTypeFormat" />
      <el-table-column label="进出类型" align="center" prop="inOutType" :formatter="inOutTypeFormat" />
      <el-table-column label="精度" align="center" prop="accuracy" />
      <el-table-column label="班量计量" align="center" prop="measureType" :formatter="measureTypeFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat" />
      <el-table-column label="更新者" align="center" prop="creator" />
      <el-table-column label="更新者" align="center" prop="updator" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:inOut:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:inOut:remove']"
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

    <!-- 添加或修改装置-进出场装置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父id" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父id" />
        </el-form-item>
        <el-form-item label="进出场编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入进出场编码" />
        </el-form-item>
        <el-form-item label="进出场名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入进出场名称" />
        </el-form-item>
        <el-form-item label="运输类型" prop="transportType">
          <el-select v-model="form.transportType" placeholder="请选择运输类型">
            <el-option
              v-for="dict in transportTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进出类型" prop="inOutType">
          <el-select v-model="form.inOutType" placeholder="请选择进出类型">
            <el-option
              v-for="dict in inOutTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="精度" prop="accuracy">
          <el-input v-model="form.accuracy" placeholder="请输入精度" />
        </el-form-item>
        <el-form-item label="班量计量" prop="measureType">
          <el-select v-model="form.measureType" placeholder="请选择班量计量">
            <el-option
              v-for="dict in measureTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="form.isUse">
            <el-radio
              v-for="dict in isUseOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="更新者" prop="creator">
          <el-input v-model="form.creator" placeholder="请输入更新者" />
        </el-form-item>
        <el-form-item label="更新者" prop="updator">
          <el-input v-model="form.updator" placeholder="请输入更新者" />
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
import { listInOut, getInOut, delInOut, addInOut, updateInOut } from "@/api/model/inOut";

export default {
  name: "InOut",
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
      // 装置-进出场装置表格数据
      inOutList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 运输类型字典
      transportTypeOptions: [],
      // 进出类型字典
      inOutTypeOptions: [],
      // 班量计量字典
      measureTypeOptions: [],
      // 是否启用字典
      isUseOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: null,
        code: null,
        name: null,
        transportType: null,
        inOutType: null,
        accuracy: null,
        measureType: null,
        isUse: null,
        creator: null,
        updator: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "父id不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "进出场编码不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "进出场名称不能为空", trigger: "blur" }
        ],
        transportType: [
          { required: true, message: "运输类型不能为空", trigger: "change" }
        ],
        inOutType: [
          { required: true, message: "进出类型不能为空", trigger: "change" }
        ],
        isUse: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("mechanical_type").then(response => {
      this.transportTypeOptions = response.data;
    });
    this.getDicts("in_out_type").then(response => {
      this.inOutTypeOptions = response.data;
    });
    this.getDicts("measure_type").then(response => {
      this.measureTypeOptions = response.data;
    });
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });
  },
  methods: {
    /** 查询装置-进出场装置列表 */
    getList() {
      this.loading = true;
      listInOut(this.queryParams).then(response => {
        this.inOutList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 运输类型字典翻译
    transportTypeFormat(row, column) {
      return this.selectDictLabel(this.transportTypeOptions, row.transportType);
    },
    // 进出类型字典翻译
    inOutTypeFormat(row, column) {
      return this.selectDictLabel(this.inOutTypeOptions, row.inOutType);
    },
    // 班量计量字典翻译
    measureTypeFormat(row, column) {
      return this.selectDictLabel(this.measureTypeOptions, row.measureType);
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
        parentId: null,
        code: null,
        name: null,
        transportType: null,
        inOutType: null,
        accuracy: null,
        measureType: null,
        remark: null,
        isUse: 0,
        delFlag: null,
        creator: null,
        createBy: null,
        createTime: null,
        updator: null,
        updateBy: null,
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
      this.title = "添加装置-进出场装置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInOut(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改装置-进出场装置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInOut(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInOut(this.form).then(response => {
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
      this.$confirm('是否确认删除装置-进出场装置编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInOut(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/inOut/export', {
        ...this.queryParams
      }, `model_inOut.xlsx`)
    }
  }
};
</script>