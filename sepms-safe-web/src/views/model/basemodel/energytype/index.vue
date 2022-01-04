<template>
  <div class="app-container ">

    <el-row :gutter="20">
        <el-col :span="5" :xs="24">
        <div class="wzt_Treeform">
                <div  class="head-container"  style="padding-right:2px">
          <div  style="height:calc(100vh - 120px);overflow:auto;">
            <el-tree
              :data="energyTypeList"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </div></div></div>
        </el-col>
      <el-col :span="19" :xs="24"  style="padding-right:0;margin-bottom:0;margin-left: -21px; margin-right: 10px;">

<div class="wzt_formQuery form_content_pagination" style="">
  <el-form :model="queryParams" class="allinput" ref="queryForm" :inline="true" v-show="showSearch">
          <el-form-item label="名称:" prop="energyName">
            <el-input
              v-model="queryParams.energyName"
              placeholder="请输入名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="简称:" prop="energyAlias">
            <el-input
              v-model="queryParams.energyAlias"
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
        <el-table  style="height:60vh;overflow:auto" class="wztel-table tablefroms" v-loading="loading" :data="energyList">
          <el-table-column label="编码" align="center" prop="energyCode" />
          <el-table-column label="名称" align="center" prop="energyName" />
          <el-table-column label="简称" align="center" prop="energyAlias" />
          <el-table-column label="类型编码" align="center" prop="typeCode" />
          <el-table-column label="类别名称" align="center" prop="typeName" />
          <el-table-column label="单位" align="center" prop="unit" />
          <el-table-column label="备注" align="center" prop="remark" />
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
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['model:energy:edit']"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /></div>
      </el-col>
    </el-row>

    <!-- 添加或修改能源管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称:" prop="energyName">
              <el-input v-model="form.energyName" disabled placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="简称:" prop="energyAlias">
            <el-input v-model="form.energyAlias" placeholder="请输入简称" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="是否启用:" prop="isUse">
            <el-radio-group v-model="form.isUse">
              <el-radio
                v-for="dict in isUseOptions"
                :key="parseInt(dict.dictValue)"
                :label="parseInt(dict.dictValue)"
                :value="parseInt(dict.dictValue)"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
          </el-col>
          <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listEnergytype, getEnergytype, delEnergytype, addEnergytype, updateEnergytype, exportEnergytype } from "@/api/model/energytype";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Energy from "../energy/index";

import { listEnergy, getEnergy, delEnergy, addEnergy, updateEnergy } from "@/api/model/energy";

export default {
  name: "Energytype",
  components: {
    Energy,
    Treeselect
  },
  data() {
    return {
      // 是否启用字典
      isUseOptions: [],
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 能源信息表格数据
      energyList: [],
      energyTree : [],
      energyTypeName : undefined,
      //能源类型表格数据
      energyTypeList: [],
      defaultProps: {
        children: "children",
        label: "energyTypeName"
      },
      // 能源类型树选项
      energyTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum:1,
        pageSize:10,
        energyTypeCode: null,
        energyTypeName: null,
        typeCode: null,
        isUse: "",
      },
      total:0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getTreeList();
    this.getList();
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });
  },
  methods: {
    //查询能源类别
    getTreeList() {
      this.loading = true;
      listEnergytype().then(response => {
        this.energyTypeList = this.handleTree(response.result, "id", "parentId");
        console.log( this.energyTypeList)
        this.loading = false;
      });
    },
    /** 查询能源信息列表 */
    getList() {
      this.loading = true;
      listEnergy(this.queryParams).then(response => {
        this.energyList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否启用字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.typeCode = null;
      this.handleQuery();
    },
    // 筛选节点
     filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.typeCode = data.energyTypeCode;
      this.getList();
    },
    //能源状态修改
    handleIsUseChange(row) {

      let text = row.isUse === 1 ? "停用" : "启用";
      this.$confirm(
        "确认要" + text + '"' + row.energyName + '"的能源吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          var param = {
            "id":row.id,
            "isUse":row.isUse
          }
          return updateEnergy(param);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.isUse = row.isUse === 0 ? 1 : 0;
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
        energyName: null,
        energyAlias: null,
        isUse: null,
        remark: null,
      };
      this.resetForm("form");
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEnergy(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改能源介质";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEnergy(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEnergy(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  }
};
</script>
<style >

</style>
<style lang="scss"  scoped>
        .el-table::before{
            height:0 !important;

      }
</style>
