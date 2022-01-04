<template>
  <div class="app-container">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="区域:" prop="areaId">
        <treeselect v-model="queryParams.areaId" :options="modeltreeOptions" style="width: 200px;height: 32px;line-height: 32px" :normalizer="normalizer" placeholder="请选择区域" />
      </el-form-item>
      <el-form-item label="参数名称:" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入参数名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参数类型:" prop="paramType">
        <el-select v-model="queryParams.paramType" placeholder="请选择参数类型" clearable size="small">
          <el-option
            v-for="dict in paramTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="位号:" prop="tag">
        <el-input
          v-model="queryParams.tag"
          placeholder="请输入位号"
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
    <div class="formQuery form_content_pagination">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:operationParam:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="operationParamList" >
      <el-table-column label="参数编码" align="center" prop="code" />
      <el-table-column label="参数名称" align="center" prop="name" />
      <el-table-column label="参数简称" align="center" prop="shortName" />
      <el-table-column label="区域" align="center" prop="areaName" />
      <el-table-column label="能源介质" align="center" prop="energyTypeName" />
      <el-table-column label="参数类型" align="center" prop="paramType" :formatter="paramTypeFormat" />
      <el-table-column label="位号" align="center" prop="tag" :show-overflow-tooltip="true"/>
      <el-table-column label="计量单位" align="center" prop="unitName" />
      <el-table-column label="数据精度" align="center" prop="accuracy" />
      <el-table-column label="数采方式" align="center" prop="collectType" :formatter="collectTypeFormat" />
      <el-table-column label="参数上限" align="center" prop="limitUp" />
      <el-table-column label="参数上上限" align="center" prop="limitUpper" />
      <el-table-column label="参数下限" align="center" prop="limitLow" />
      <el-table-column label="参数下下限" align="center" prop="limitLower" />
      <el-table-column label="显示排序" align="center" prop="orderNum" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:operationParam:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            class="delbtn"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:operationParam:remove']"
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
    <!-- 添加或修改运行参数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="685px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
        <el-col :span="12">
        <el-form-item label="参数编码:" prop="code">
          <el-input v-model="form.code" placeholder="请输入参数编码" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="参数名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入参数名称" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="参数简称:" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入参数简称" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="区域:" prop="areaId">
          <treeselect v-model="form.areaId" :options="modeltreeOptions" @select="changeTree" :normalizer="normalizer" style="height: 36px;line-height:36px;" placeholder="请选择区域" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="能源介质:" prop="energyType">
          <el-select v-model="form.energyType" @change="changeEnergyType" placeholder="请选择能源介质">
          <el-option
            v-for="dict in energyTypeOptions"
            :key="dict.energyCode"
            :label="dict.energyName"
            :value="dict.energyCode"
          ></el-option>
        </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="参数类型:" prop="paramType">
          <el-select v-model="form.paramType" placeholder="请选择参数类型">
            <el-option
              v-for="dict in paramTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="位号:" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入位号" v-on:click.native="searchTag" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="计量单位:" prop="unitId">
          <el-select v-model="form.unitId" @change="changeUnit" placeholder="请选择单位">
            <el-option
              v-for="item in unitOptions"
              :key="item.id"
              :label="item.symbol"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="精度:" prop="accuracy">
          <el-input-number v-model="form.accuracy" controls-position="right" :precision="0" placeholder="请输入精度" :min="0" :max="100"/>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="数采方式:" prop="collectType">
          <el-select v-model="form.collectType" placeholder="请选择数采方式">
            <el-option
              v-for="dict in collectTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="参数上限:" prop="limitUp">
          <el-input v-model="form.limitUp" placeholder="请输入参数上限" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="参数上上限:" prop="limitUpper">
          <el-input v-model="form.limitUpper" placeholder="请输入参数上上限" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="参数下限:" prop="limitLow">
          <el-input v-model="form.limitLow" placeholder="请输入参数下限" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="参数下下限:" prop="limitLower">
          <el-input v-model="form.limitLower" placeholder="请输入参数下下限" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="排序:" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :precision="0" placeholder="请输入排序" :min="0"/>
        </el-form-item>
        </el-col>
        <el-col :span="24">
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改运行参数对话框 -->
    <el-dialog title="选择位号" :visible.sync="openTag" width="1000px" append-to-body>
      <div class="formQuery form_content_pagination">
        <el-form :model="queryTagParams" ref="queryTagParams" :inline="true">
          <el-form-item prop="name">
            <el-input
              v-model="queryTagParams.searchValue"
              placeholder="请输入位号或位号名称"
              clearable
              width="400px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryTag">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loadingTag" :data="tagList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="位号" align="center" prop="serialNumber" />
          <el-table-column label="位号名称" align="center" prop="tagName"/>
          <el-table-column label="描述" align="center" prop="tagDescribe" />
        </el-table>

        <pagination
          v-show="totalTag>0"
          :total="totalTag"
          :page.sync="queryTagParams.pageNum"
          :limit.sync="queryTagParams.pageSize"
          @pagination="getTagList"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="single" @click="submitTag">确 定</el-button>
        <el-button @click="cancelTag">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOperationParam, getOperationParam, delOperationParam, addOperationParam, updateOperationParam } from "@/api/model/operationParam";
import {  listModeltree} from '@/api/model/modeltree'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { selectListEnergy } from "@/api/model/energy";
import { selectUnit } from '@/api/model/unit'
import { listTagnumber } from '@/api/model/tagnumber'

export default {
  name: "OperationParam",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      loadingTag: true,
      // 选中数组
      ids: [],
      tags: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      totalTag: 0,
      // 运行参数表格数据
      operationParamList: [],
      tagList: [],
      // 模型树树选项
      modeltreeOptions: [],
      energyTypeOptions: [],
      unitOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openTag: false,
      // 参数类型字典
      paramTypeOptions: [],
      // 数采方式字典
      collectTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        areaId: null,
        paramType: null,
        tag: null
      },
      queryTagParams: {
        pageNum: 1,
        pageSize: 10,
        searchValue: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "参数编码不能为空", trigger: "blur" },
          { max: 50, message: "参数编码最多50个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "参数名称不能为空", trigger: "blur" },
          { max: 100, message: "参数名称最多100个字符", trigger: "blur" }
        ],
        shortName: [
          { required: true, message: "参数简称不能为空", trigger: "blur" },
          { max: 100, message: "参数简称最多100个字符", trigger: "blur" }
        ],
        areaId: [
          { required: true, message: "区域不能为空", trigger: "blur" }
        ],
        energyType: [
          { required: true, message: "能源介质不能为空", trigger: "blur" }
        ],
        paramType: [
          { required: true, message: "参数类型不能为空", trigger: "blur" }
        ],
        tag: [
          { max: 50, message: "位号最多50个字符", trigger: "blur" }
        ],
        unitId: [
          { required: true, message: "计量单位不能为空", trigger: "blur" }
        ],
        collectType: [
          { required: true, message: "采数方式不能为空", trigger: "blur" }
        ],
        limitUp: [
          { pattern: /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/, message: "参数上限必须是数字,可保留四位小数", trigger: "blur" }
        ],
        limitUpper: [
          { pattern: /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/, message: "参数上上限必须是数字,可保留四位小数", trigger: "blur" }
        ],
        limitLow: [
          { pattern: /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/, message: "参数下限必须是数字,可保留四位小数", trigger: "blur" }
        ],
        limitLower: [
          { pattern: /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/, message: "参数下下限必须是数字,可保留四位小数", trigger: "blur" }
        ],
        remark: [
          { max: 200, message: "备注最多200个字符", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getEnergyTypeSelect();
    this.getUnit();
    this.getDicts("param_type").then(response => {
      this.paramTypeOptions = response.data;
    });
    this.getDicts("collect_type").then(response => {
      this.collectTypeOptions = response.data;
    });
  },
  methods: {
    getTreeselect() {
      listModeltree({"isUse":0}).then(response => {
        this.modeltreeOptions = this.handleTree(response.result, "id", "parentId");
      });
    },
    /** 转换模型树数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.modelName,
        children: node.children
      };
    },
    changeTree(date){
      this.form.areaName = date.modelName;
    },
    getEnergyTypeSelect(){
      selectListEnergy({"isUse":0}).then(response => {
        this.energyTypeOptions = response.result;
      });
    },
    changeEnergyType(energyType){
      let energy = this.energyTypeOptions.find((item) => {
        return item.energyCode == energyType
      })
      this.form.energyTypeName = energy.energyName
    },
    getUnit(){
      selectUnit({isUse:0}).then((response) => {
        this.unitOptions = response.result;
      });
    },
    changeUnit(e){
      this.unitOptions.map((item, i) => {
        if (item.id == e) {
          this.form.unitName = item.symbol;
        }
      });
    },
    /** 查询运行参数列表 */
    getList() {
      this.loading = true;
      listOperationParam(this.queryParams).then(response => {
        this.operationParamList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 参数类型字典翻译
    paramTypeFormat(row, column) {
      return this.selectDictLabel(this.paramTypeOptions, row.paramType);
    },
    // 数采方式字典翻译
    collectTypeFormat(row, column) {
      return this.selectDictLabel(this.collectTypeOptions, row.collectType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelTag() {
      this.openTag = false;
      this.resetForm("queryTagParams");
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        code: null,
        name: null,
        shortName: null,
        areaId: null,
        areaName: null,
        energyType: null,
        energyTypeName: null,
        paramType: null,
        tag: null,
        unitId: null,
        unitName: null,
        accuracy: null,
        collectType: 1,
        limitUp: null,
        limitUpper: null,
        limitLow: null,
        limitLower: null,
        delFlag: null,
        orderNum: null,
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
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加运行参数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOperationParam(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改运行参数";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOperationParam(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOperationParam(this.form).then(response => {
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
      this.$confirm('是否确认删除运行参数名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOperationParam(ids);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/operationParam/export', {
        ...this.queryParams
      }, `model_operationParam.xlsx`)
    },
    searchTag(){
      this.tags=[];
      this.tagList=[];
      this.queryTagParams.searchValue='';
      this.handleQueryTag();
      this.openTag = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.tags = selection.map(item => item.serialNumber)
      this.single = selection.length!==1
    },
    handleQueryTag(){
      this.queryTagParams.pageNum = 1;
      this.getTagList();
    },
    getTagList(){
      this.loadingTag = true
      listTagnumber(this.queryTagParams).then((response) => {
        this.tagList = response.result
        this.totalTag = response.total
        this.loadingTag = false
      })
    },
    submitTag(){
      this.form.tag = this.tags[0]
      this.openTag = false;
    }
  }
};
</script>
