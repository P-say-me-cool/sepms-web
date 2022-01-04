<template>
  <div class="app-container ">
  <div v-show="!showSearch" style="height:15px">
    </div>
  <div class="">
    <el-form class="allinput wzt_form" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称:" prop="confluName" >
        <el-input
          v-model="queryParams.confluName"
          placeholder="请输入名称"
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
  <div class="formQuery form_content_pagination">
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          @click="handleAdd"
          size="mini"
          v-hasPermi="['model:confluPoint:add']"
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['model:confluPoint:edit']"-->
      <!--        >修改</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          plain-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['model:confluPoint:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['model:confluPoint:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <div class="tablesfrom">
    <el-table v-loading="loading" :data="confluPointList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编码" align="center" prop="confluCode"/>
      <el-table-column label="名称" align="center" prop="confluName"/>
      <el-table-column label="工厂" align="center" prop="factory" :width="this.tableColumnWidth"/>
      <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat"/>
      <el-table-column label="备注" align="center" prop="remark" :width="this.tableColumnWidth"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:confluPoint:edit']"
          >修改
          </el-button>
          <el-button
            class="delbtn"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:confluPoint:remove']"
          >删除
          </el-button>
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
    <!-- 添加或修改汇流点维护对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码:" prop="confluCode">
          <el-input v-model="form.confluCode" placeholder="请输入编码"/>
        </el-form-item>
        <el-form-item label="名称:" prop="confluName">
          <el-input v-model="form.confluName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="工厂:" prop="factoryId">
          <el-select
            width="100%"
            style="display:block;"
            v-model="form.factoryId"
            placeholder="请选择工厂"
            @change="changeFactoryName"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in factoryList"
              :key="dict.id"
              :label="dict.modelName"
              :value="dict.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-radio-group v-model="form.isUse">
            <el-radio
              v-for="dict in isUseOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import {
  listConfluPoint,
  getConfluPoint,
  delConfluPoint,
  addConfluPoint,
  updateConfluPoint
} from "@/api/model/confluPoint";
import {listModeltree} from "@/api/model/modeltree";

export default {
  name: "ConfluPoint",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      factoryList: [],
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
      // 汇流点维护表格数据
      confluPointList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否启用字典
      isUseOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        confluName: null,
        isUse: null,
        factory: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // 表单校验
        confluCode: [
          {required: true, message: "编码不能为空", trigger: "blur"},
          {max: 20, message: "名称超出最大长度20", trigger: "blur"}
        ],
        confluName: [
          {required: true, message: "名称不能为空", trigger: "blur"},
          {max: 100, message: "名称超出最大长度100", trigger: "blur"}
        ],
        factoryId: [
          {required: true, message: "工厂不能为空", trigger: "blur"}
        ],
        isUse: [
          {required: true, message: "是否启用不能为空", trigger: "blur"}
        ],
        remark: [
          {max: 200, message: "备注最多200个字符", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getFactoryList();
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });
  },
  methods: {
    //下拉框传值
    changeFactoryName(e) {
      this.factoryList.map((item, i) => {
        if (item.id == e) {
          this.form.factory = item.modelName; //传值
        }
      });
    },
    /** 获取所有装置*/
    getFactoryList() {
      listModeltree({"level":2,"isUse":0}).then((response) => {
        this.factoryList = response.result;
      });
    },
    /** 查询汇流点维护列表 */
    getList() {
      this.loading = true;
      listConfluPoint(this.queryParams).then(response => {
        this.confluPointList = response.result;
        this.total = response.total;
        this.loading = false;
      });
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
        confluCode: null,
        confluName: null,
        factory: null,
        factoryId: null,
        isUse: 0,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加汇流点维护";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getConfluPoint(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改汇流点维护";
      });
    },
    /** 提交按钮 */
    submitForm() {
      var that = this
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (that.form.id != null) {
            updateConfluPoint(that.form).then(response => {
              that.msgSuccess("修改成功");
              that.open = false;
              that.getList();
            });
          } else {
            let status = true
            that.confluPointList.find((item) => {
              if (parseInt(item.confluCode) == parseInt(that.form.confluCode)) {
                status = false
                return;
              }
            })
            if (status) {
              addConfluPoint(that.form).then(response => {
                that.msgSuccess("新增成功");
                that.open = false;
                that.getList();
              });
            }
          if (!status){
            that.msgInfo("编码重复,请重新输入")
          }
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除汇流点名称为"' + row.confluName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delConfluPoint(ids);
      }).then(() => {
        this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/confluPoint/export', {
        ...this.queryParams
      }, `model_confluPoint.xlsx`)
    }
  }
};
</script>
