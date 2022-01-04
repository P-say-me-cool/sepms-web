<template>
  <div class="app-container">

    <el-row :gutter="20">
      <el-col :span="5" :xs="24">
      <div class="wzt_Treeform">
      <div  class="head-container"  style="padding-right:2px">
        <div  style="height:calc(100vh - 120px);overflow:auto;">
          <el-tree
            :data="materialtypeList"
            :props="defaultProps"
            :expand-on-click-node=false
            :filter-node-method="filterNode"
            ref="tree"
            :default-expand-all=false
            @node-click="handleNodeClick"
          />
        </div></div>
        </div>
      </el-col>
      <el-col :span="19" :xs="24" style="padding-right:0;margin-left: -21px; margin-right: 10px;">

<div class="wzt_formQuery form_content_pagination" >
<el-form
          class="allinput"
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="85px"
        >
          <el-form-item label="名称:" prop="matName">
            <el-input
              v-model="queryParams.matName"
              placeholder="请输入名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="是否启用:" prop="isUse">
            <el-select
              v-model="queryParams.isUse"
              placeholder="请选择是否启用"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in isUseOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
            >搜索
            </el-button
            >
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置
            </el-button
            >
          </el-form-item>
        </el-form>
        <el-table class="wztel-table"  style="height:68vh;overflow:auto" v-loading="loading" :data="materialinfoList">
          <el-table-column label="编码" align="center" prop="matCode"/>
          <el-table-column label="名称" align="center" prop="oldName"/>
          <el-table-column label="别名" align="center" prop="matAlias"/>
          <el-table-column label="类别编码" align="center" prop="typeCode"/>
          <el-table-column label="类别名称" align="center" prop="typeName"/>
          <el-table-column label="单位" align="center" prop="unit"/>
          <el-table-column label="物料类型" align="center" prop="matType" :formatter="typeFormat"/>
          <el-table-column label="是否启用" align="center" key="isUse" :formatter = "isUseFormat"/>
          <el-table-column label="备注" align="center" prop="remark"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['model:materialinfo:edit']"
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
        />
</div>
        <!-- 添加或修改交接班管理对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="12">
                  <el-form-item label="物料名称:" prop="oldName">
                    <el-input v-model="form.oldName" disabled placeholder="请输入物料名称" />
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="别名:" prop="matAlias">
                  <el-input v-model="form.matAlias" placeholder="请输入别名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                    <el-form-item label="物料类型:" prop="matType">
                      <el-select v-model="form.matType" placeholder="请选择物料类型" clearable size="small">
                        <el-option
                          v-for="dict in mattypeOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="parseInt(dict.dictValue)"
                        />
                      </el-select>
                    </el-form-item>
              </el-col><br><br><br>
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
              <el-col  :span="24">
              <el-form-item label="备注:" prop="remark">
                <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
             </el-form-item>
              </el-col>
            </el-row>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listMaterialtype,
  getMaterialtype,
  delMaterialtype,
  addMaterialtype,
  updateMaterialtype,
  exportMaterialtype,
} from "@/api/model/materialtype";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Materialinfo from "../materialinfo/index";
import {
  listMaterialinfo,
  getMaterialinfo,
  delMaterialinfo,
  addMaterialinfo,
  updateMaterialinfo,
  listTypeMaterialinfo
} from "@/api/model/materialinfo";

export default {
  name: "Materialtype",
  components: {
    Materialinfo,
    Treeselect,
  },
  data() {
    return {
      typeCode: undefined,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      //控制下拉框显示与隐藏
      dropdown: false,
      // 物料信息表格数据
      materialinfoList: [],
      materialTree: [],
      typeName: undefined,
      // 物料类别表格数据
      materialtypeList: [],
      defaultProps: {
        children: "children",
        label: "typeName",
      },
      mattypeOptions: [],
      // 是否启用字典
      isUseOptions: [],
      // 物料类别树选项
      materialtypeOptions: [],
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        matName: undefined,
        isUse: "",
        matCode: undefined,
        typeCode: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        matAlias: [
          { max: 100, message: "别名最多200个字符", trigger: "blur" }
        ],
        matType: [
          { required: true, message: "物料类型不能为空", trigger: "blur" },
        ],
        isUse: [
          { required: true, message: "是否启用不能为空", trigger: "blur" },
        ],
        remark: [
          { max: 200, message: "备注最多200个字符", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getTreeList();
    this.getList();
    this.getDicts("is_use").then((response) => {
      this.isUseOptions = response.data;
    });
    this.getDicts("mat_type").then((response) => {
      this.mattypeOptions = response.data;
    });
  },
  methods: {
    /** 查询物料类别列表 */
    getTreeList() {
      this.loading = true;
      listMaterialtype(this.queryParams).then((response) => {
        console.log(response);
        this.materialtypeList = this.handleTree(
          response.result,
          "id",
          "parentId",
        );
        this.loading = false;
      });
    },

    // 启用状态字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
    },
    typeFormat(row, column) {
      return this.selectDictLabel(this.mattypeOptions, row.matType);
    },
    /** 查询物料信息列表*/
    getList() {
      this.loading = true;
      listTypeMaterialinfo(this.queryParams).then((response) => {
        this.materialinfoList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.typeCode = null;
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 是否启用字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.typeCode = data.typeCode;
      this.getList();
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
        matName: null,
        matAlias: null,
        matType: null,
        isUse: 0,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getMaterialinfo(id).then((response) => {
        this.form = response.result;
        this.form.matName = this.form.oldName
        this.open = true;
        this.title = "修改物料";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateMaterialinfo(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMaterialinfo(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>
