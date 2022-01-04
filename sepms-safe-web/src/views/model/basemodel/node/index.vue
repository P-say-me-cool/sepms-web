<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="nodeName">
        <el-input
          v-model="queryParams.nodeName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="节点类型" prop="nodeType">
        <el-select v-model="queryParams.nodeType" placeholder="请选择节点类型" clearable size="small">
          <el-option
            v-for="dict in nodeTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="节点位置" prop="equipment">
        <el-select v-model="queryParams.equipment" placeholder="请选择节点位置" clearable size="small">
          <el-option
            v-for="dict in equipmentOptions"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:node:add']"
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
          v-hasPermi="['model:node:edit']"
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
          v-hasPermi="['model:node:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['model:node:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="nodeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="编码" align="center" prop="nodeCode" />
      <el-table-column label="名称" align="center" prop="nodeName" />
      <el-table-column label="别名" align="center" prop="alias" />
      <el-table-column label="节点类型" align="center" prop="nodeType" :formatter="nodeTypeFormat" />
      <el-table-column label="节点位置" align="center" prop="equipment" :formatter="equipmentFormat" />
      <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat" />
      <el-table-column label="节点精度" align="center" prop="nodeAccuracy" />
      <el-table-column label="显示排序" align="center" prop="displaySort" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:node:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:node:remove']"
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

    <!-- 添加或修改节点管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="nodeCode">
          <el-input v-model="form.nodeCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="nodeName">
          <el-input v-model="form.nodeName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="form.alias" placeholder="请输入别名" />
        </el-form-item>
        <el-form-item label="节点类型" prop="nodeType">
          <el-select v-model="form.nodeType" placeholder="请选择节点类型">
            <el-option
              v-for="dict in nodeTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点位置" prop="equipment">
          <el-select v-model="form.equipment" placeholder="请选择节点位置">
            <el-option
              v-for="dict in equipmentOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
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
        <el-form-item label="节点精度" prop="nodeAccuracy">
          <el-input v-model="form.nodeAccuracy" placeholder="请输入节点精度" />
        </el-form-item>
        <el-form-item label="显示排序" prop="displaySort">
          <el-input v-model="form.displaySort" placeholder="请输入显示排序" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="创建者" prop="creator">
          <el-input v-model="form.creator" placeholder="请输入创建者" />
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
import { listNode, getNode, delNode, addNode, updateNode } from "@/api/model/node";

export default {
  name: "Node",
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
      // 节点管理表格数据
      nodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 节点类型字典
      nodeTypeOptions: [],
      // 节点位置字典
      equipmentOptions: [],
      // 是否启用字典
      isUseOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nodeName: null,
        nodeType: null,
        equipment: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        nodeCode: [
          { required: true, message: "编码不能为空", trigger: "blur" }
        ],
        nodeName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        nodeType: [
          { required: true, message: "节点类型不能为空", trigger: "change" }
        ],
        equipment: [
          { required: true, message: "节点位置不能为空", trigger: "change" }
        ],
        isUse: [
          { required: true, message: "是否启用不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("node_type").then(response => {
      this.nodeTypeOptions = response.data;
    });
    this.getDicts("battery_limit").then(response => {
      this.equipmentOptions = response.data;
    });
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });
  },
  methods: {
    /** 查询节点管理列表 */
    getList() {
      this.loading = true;
      listNode(this.queryParams).then(response => {
        this.nodeList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 节点类型字典翻译
    nodeTypeFormat(row, column) {
      return this.selectDictLabel(this.nodeTypeOptions, row.nodeType);
    },
    // 节点位置字典翻译
    equipmentFormat(row, column) {
      return this.selectDictLabel(this.equipmentOptions, row.equipment);
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
        nodeCode: null,
        nodeName: null,
        alias: null,
        nodeType: null,
        equipment: null,
        isUse: null,
        nodeAccuracy: null,
        displaySort: null,
        remarks: null,
        createBy: null,
        creator: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.title = "添加节点管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getNode(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改节点管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNode(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNode(this.form).then(response => {
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
      this.$confirm('是否确认删除节点管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNode(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/node/export', {
        ...this.queryParams
      }, `model_node.xlsx`)
    }
  }
};
</script>