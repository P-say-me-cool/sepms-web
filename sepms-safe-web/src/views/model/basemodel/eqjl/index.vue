<template>
  <div class="app-container">
    <div>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            size="mini"
            style="width:150px; height:40px; border-radius: 15px"
            @click="getEqjlForBut"
          >装置信息</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            size="mini"
            style="width:150px; height:40px; border-radius: 15px"
            @click="getPipeList"
          >侧线信息</el-button>
        </el-col>
      </el-row>
    </div>
    <!--装置信息框-->
    <div style="margin-top: 20px" v-if="showEq">
      <el-form ref="form" :model="form" :inline="true">
        <el-form-item label="上级部门" prop="parentName">
          <el-input
            v-model="form.parentName"
            clearable
            size="large"
          />
        </el-form-item>
        <br>
        <el-form-item label="装置编码" prop="eqjlCode">
          <el-input
            v-model="form.eqjlCode"
            clearable
            size="large"
          />
        </el-form-item>
        <br>
        <el-form-item label="装置名称" prop="eqjlName">
          <el-input
            v-model="form.eqjlName"
            clearable
            size="large"
          />
        </el-form-item>
        <br>
        <el-form-item label="装置别名" prop="eqjlAlias">
          <el-input
            v-model="form.eqjlAlias"
            clearable
            size="large"
          />
        </el-form-item>
        <br>
        <el-form-item label="设计能力" prop="designAble">
          <el-input
            v-model="form.designAble"
            clearable
            size="large"
          />
        </el-form-item>
        <br>
        <el-form-item label="容积" prop="eqjlBulk">
          <el-input
            v-model="form.eqjlBulk"
            clearable
            size="large"
          />
        </el-form-item>
        <br>
        <el-form-item label="碳化室数" prop="cNum">
          <el-input
            v-model="form.cNum"
            clearable
            size="large"
          />
        </el-form-item>
        <br>
        <el-form-item label="是否启用" prop="isUse">
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
    <!--侧线信息框-->
    <div style="margin-top: 20px" v-if="showPipe">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="侧线名称" prop="pipeName">
          <el-input
            v-model="queryParams.pipeName"
            placeholder="请输入侧线名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="侧线类型" prop="pipeType">
          <el-select v-model="queryParams.pipeType" placeholder="请选择侧线类型" clearable size="small">
            <el-option
              v-for="dict in pipeTypeOptions"
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
          >新增</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="pipeList" @selection-change="handleSelectionChange">
        <el-table-column label="侧线名称" align="center" prop="pipeName" />
        <el-table-column label="侧线编码" align="center" prop="pipeCode" />
        <el-table-column label="侧线类型" align="center" prop="pipeType" :formatter="pipeTypeFormat" />
        <el-table-column label="是否校正" align="center" prop="isCheck" :formatter="isCheckFormat" />
        <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat" />
        <el-table-column label="节点名称" align="center" prop="nodeName" />
        <el-table-column label="仪表名称" align="center" prop="instrumentName" />
        <el-table-column label="物料名称" align="center" prop="materialName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['model:pipe:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['model:pipe:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或修改侧线对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="侧线名称" prop="pipeName">
          <el-input v-model="form.pipeName" placeholder="请输入侧线名称" />
        </el-form-item>
        <el-form-item label="侧线编码" prop="pipeCode">
          <el-input v-model="form.pipeCode" placeholder="请输入侧线编码" />
        </el-form-item>
        <el-form-item label="侧线类型" prop="pipeType">
          <el-select v-model="form.pipeType" placeholder="请选择侧线类型">
            <el-option
              v-for="dict in pipeTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否校正">
          <el-radio-group v-model="form.isCheck">
            <el-radio
              v-for="dict in isCheckOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
        <el-form-item label="节点名称" prop="nodeName">
          <el-select v-model="form.nodeName" placeholder="请选择节点名称">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="仪表名称" prop="instrumentName">
          <el-select v-model="form.instrumentName" placeholder="请选择仪表名称">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-select v-model="form.materialName" placeholder="请选择物料名称">
            <el-option label="请选择字典生成" value="" />
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
import { listEqjl, getEqjl, delEqjl, addEqjl, updateEqjl } from "@/api/model/eqjl";
import { listPipe, getPipe, delPipe, addPipe, updatePipe, listByEqId } from "@/api/model/pipe";

export default {
  name: "Eqjl",
  components: {
  },
  props:['pid'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      showEq: false,
      showPipe: false,
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 焦炉装置表格数据
      eqjlList: [],
      // 弹出层标题
      title: "",
      // 侧线表格数据
      pipeList: [],
      // 是否显示弹出层
      open: false,
      // 侧线类型字典
      pipeTypeOptions: [],
      // 是否校正字典
      isCheckOptions: [],
      // 是否启用字典
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
    this.getEqjlForBut();
    this.getPipeListByEqId();
    this.getDicts("pipe_type").then(response => {
      this.pipeTypeOptions = response.data;
    });
    this.getDicts("is_check").then(response => {
      this.isCheckOptions = response.data;
    });
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });
    this.showEq = true;
    this.showPipe = false;
  },
  methods: {
    getEqjlForBut() {
      let id = this.pid;
      getEqjl(id).then(response => {
        this.form = response.result;
        this.getDicts("is_use").then(response => {
          this.isUseOptions = response.data;
        });
      });
      this.showEq = true;
      this.showPipe = false;
    },
    /** 通过装置id查询侧线信息*/
    getPipeListByEqId() {
      let eqId = this.pid;
      getPipe(eqId).then(response => {
        this.pipeList = response.result;
        this.total = response.total;
        this.loading = false;
      })
    },
    /** 查询侧线列表 */
    getPipeList() {
      this.loading = true;
      listPipe(this.queryParams).then(response => {
        this.pipeList = response.result;
        this.total = response.total;
        this.loading = false;
      });
      this.showEq = false;
      this.showPipe = true;
    },
    // 是否启用字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
    },
    // 侧线类型字典翻译
    pipeTypeFormat(row, column) {
      return this.selectDictLabel(this.pipeTypeOptions, row.pipeType);
    },
    // 是否校正字典翻译
    isCheckFormat(row, column) {
      return this.selectDictLabel(this.isCheckOptions, row.isCheck);
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
        creator: null,
        createBy: null,
        createTime: null,
        updator: null,
        updateBy: null,
        updateTime: null,
        pipeName: null,
        pipeCode: null,
        pipeType: null,
        isCheck: 0,
        isUse: 0,
        nodeId: null,
        nodeName: null,
        instrumentId: null,
        instrumentName: null,
        materialId: null,
        materialName: null,
        eqid: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getPipeList();
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
      this.title = "添加侧线";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPipe(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改侧线";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePipe(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getPipeList();
            });
          } else {
            addPipe(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getPipeList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除侧线编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delPipe(ids);
      }).then(() => {
        this.getPipeList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/pipe/export', {
        ...this.queryParams
      }, `model_pipe.xlsx`)
    }
  }
};
</script>
