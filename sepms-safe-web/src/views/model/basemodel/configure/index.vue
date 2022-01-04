<template>
  <div class="app-container">
  <div v-show="!showSearch" style="height:15px">
    </div>
    <el-form :model="queryParams" class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch" >
      <el-form-item label="所属装置:" prop="eqid">
        <el-select v-model="queryParams.eqid" placeholder="选择所属装置">
          <el-option
            v-for="dict in modeltreeOptions"
            :key="dict.id"
            :label="dict.modelName"
            :value="dict.id"
          ></el-option>
        </el-select>      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['model:configure:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['model:configure:edit']"-->
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
<!--          v-hasPermi="['model:configure:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['model:configure:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="configureList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="所属装置" align="center" prop="eqName"/>
      <el-table-column label="有效长(毫米)" align="center" prop="effectiveLength" />
      <el-table-column label="有效宽(毫米)" align="center" prop="effectiveWide" />
      <el-table-column label="锥度(毫米)" align="center" prop="taper" />
      <el-table-column label="墙厚(毫米)" align="center" prop="wallThick" />
      <el-table-column label="顶厚(毫米)" align="center" prop="topThick" />
      <el-table-column label="中心距(毫米)" align="center" prop="centerDistance" />
      <el-table-column label="煤饼体积(立方米)" align="center" prop="coalCakeVolume" />
      <el-table-column label="装煤量(吨)" align="center" prop="coalLoading" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:configure:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            class="delbtn"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:configure:remove']"
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
</div>
    <!-- 添加或修改炉孔配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" class="allinput " :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="编码:" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="所属装置:" prop="eqid">
          <el-select v-model="form.eqid" @change="selectEq" placeholder="选择所属装置">
            <el-option
              v-for="dict in modeltreeOptions"
              :key="dict.id"
              :label="dict.modelName"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="有效长:" prop="effectiveLength">
          <el-input v-model="form.effectiveLength" placeholder="请输入有效长" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="有效宽:" prop="effectiveWide">
          <el-input v-model="form.effectiveWide" placeholder="请输入有效宽" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="锥度:" prop="taper">
          <el-input v-model="form.taper" placeholder="请输入锥度" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="墙厚:" prop="wallThick">
          <el-input v-model="form.wallThick" placeholder="请输入墙厚" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="顶厚:" prop="topThick">
          <el-input v-model="form.topThick" placeholder="请输入顶厚" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="中心距:" prop="centerDistance">
          <el-input v-model="form.centerDistance" placeholder="请输入中心距" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="煤饼体积:" prop="coalCakeVolume">
          <el-input v-model="form.coalCakeVolume" placeholder="请输入煤饼体积" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="装煤量:" prop="coalLoading">
          <el-input v-model="form.coalLoading" placeholder="请输入装煤量" />
        </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 55px">
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listConfigure, getConfigure, delConfigure, addConfigure, updateConfigure } from "@/api/model/configure";
import {listModeltree} from "../../../../api/model/modeltree";
import Treeselect from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "Configure",
  components: {
    Treeselect
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
      modeltreeOptions:[],
      // 炉孔配置表格数据
      configureList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eqid: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "编码不能为空", trigger: "blur" },
          {max: 20, message: "编码超出最大长度20", trigger: "blur"}
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          {max: 20, message: "名称超出最大长度20", trigger: "blur"}
        ],
        eqid: [
          { required: true, message: "所属装置不能为空", trigger: "change" }
        ],
        effectiveLength: [
          { required: true, message: "有效长(毫米)不能为空", trigger: "blur" },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        effectiveWide: [
          { required: true, message: "有效宽(毫米)不能为空", trigger: "blur" },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        taper: [
          { required: true, message: "锥度(毫米)不能为空", trigger: "blur" },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        wallThick: [
          { required: true, message: "墙厚(毫米)不能为空", trigger: "blur" },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        topThick: [
          { required: true, message: "顶厚(毫米)不能为空", trigger: "blur" },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        centerDistance: [
          { required: true, message: "中心距(毫米)不能为空", trigger: "blur" },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        coalCakeVolume: [
          { required: true, message: "煤饼体积(立方米)不能为空", trigger: "blur" },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        coalLoading: [
          { required: true, message: "装煤量(吨)不能为空", trigger: "blur" },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
        ],
        remark: [
          {max: 200, message: "备注超出最大长度200", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getTreeSelect();
  },
  methods: {
    /** 查询炉孔配置列表 */
    getList() {
      this.loading = true;
      listConfigure(this.queryParams).then(response => {
        this.configureList = response.result;
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
        code: null,
        name: null,
        eqid: null,
        eqName: null,
        effectiveLength: null,
        effectiveWide: null,
        taper: null,
        wallThick: null,
        topThick: null,
        centerDistance: null,
        coalCakeVolume: null,
        coalLoading: null,
        remark: null,
        createTime: null,
        creator: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        updator: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getTreeSelect() {
      listModeltree({"level":5,"type":"pm_equipment_coking","subType":4,"isUse":0}).then(response => {
        this.modeltreeOptions = response.result;
      });
    },

    selectEq(eqid){
      let eq = this.modeltreeOptions.find((item) => {
        return item.id === eqid
      })
      this.form.eqName = eq.modelName
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
      this.title = "添加炉孔配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getConfigure(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改炉孔配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateConfigure(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addConfigure(this.form).then(response => {
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
      const name = row.name;

      this.$confirm('是否确认删除炉孔配置名称为"' + name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          delConfigure(ids);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/configure/export', {
        ...this.queryParams
      }, `model_configure.xlsx`)
    }
  }
};
</script>
