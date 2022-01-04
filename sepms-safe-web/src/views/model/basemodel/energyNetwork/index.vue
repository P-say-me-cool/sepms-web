<template>
  <div class="app-container">
  <div style="height:15px;" v-show="!showSearch"></div> 
    <el-form :model="queryParams" class=" allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="管网名称:" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入管网名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属工厂:" prop="factoryId">
        <el-select v-model="queryParams.factoryId" placeholder="请选择所属工厂" clearable size="small">
          <el-option
            v-for="item in factoryList"
            :key="item.id"
            :label="item.modelName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="能源介质:" prop="energyType">
        <el-select v-model="queryParams.energyType"  placeholder="请选择能源介质" clearable size="small">
          <el-option
            v-for="dict in energyTypeOptions"
            :key="dict.energyCode"
            :label="dict.energyName"
            :value="dict.energyCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="启用状态:" prop="isUse">
        <el-select v-model="queryParams.isUse" placeholder="请选择启用状态" clearable size="small">
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
          @click="handleAdd(undefined)"
          v-hasPermi="['model:energyNetwork:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="energyNetworkList" row-key="id" class="tree_tables WZT-TREEtable"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="管网编码" class="wzt_Onechilren_cell"  align="left" prop="code" />
      <el-table-column label="管网名称" align="center" prop="name" />
      <el-table-column label="工厂名称" align="center" prop="factoryName" />
      <el-table-column label="能源介质" align="center" prop="energyTypeName" />
      <el-table-column label="分摊系数" align="center" prop="shareCoefficient" />
      <el-table-column label="分摊类型" align="center" prop="shareType" :formatter="shareTypeFormat"/>
      <el-table-column label="启用状态" align="center" prop="isUse" :formatter="isUseFormat" />
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:energyNetwork:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            class="add_btn"
            @click="handleAdd(scope.row)"
            v-hasPermi="['model:energyNetwork:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            class="delbtn"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:energyNetwork:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 添加或修改能源管网对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级管网:" prop="parentId">
              <treeselect v-model="form.parentId" disabled :options="energyNetworkOptions" :normalizer="normalizer" />
            </el-form-item>
          </el-col>
         <el-col :span="12">
        <el-form-item label="管网编码:" prop="code">
          <el-input v-model="form.code" placeholder="请输入管网编码" />
        </el-form-item>
         </el-col>
          <el-col :span="12">
        <el-form-item label="管网名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入管网名称" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="所属工厂:" prop="factoryId">
          <el-select v-model="form.factoryId" @change="changeFactory" placeholder="请选择所属工厂" >
            <el-option
              v-for="item in factoryList"
              :key="item.id"
              :label="item.modelName"
              :value="item.id"
            />
          </el-select>
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
        <el-form-item label="分摊系数:" prop="shareCoefficient">
          <el-input v-model="form.shareCoefficient" placeholder="请输入分摊系数" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="分摊类型:" prop="selectShareType">
          <el-select v-model="form.selectShareType" multiple placeholder="请选择分摊类型">
            <el-option
              v-for="dict in energyShareTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="启用状态:">
          <el-radio-group v-model="form.isUse">
            <el-radio
              v-for="dict in isUseOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script>
import { listEnergyNetwork, getEnergyNetwork, delEnergyNetwork, addEnergyNetwork, updateEnergyNetwork } from "@/api/model/energyNetwork";
import {listModeltree} from "@/api/model/modeltree";
import { selectListEnergy } from "@/api/model/energy";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "EnergyNetwork",
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
      // 能源管网表格数据
      energyNetworkList: [],
      factoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 启用状态字典
      isUseOptions: [],
      energyTypeOptions: [],
      energyShareTypeOptions: [],
      energyNetworkOptions: [],
      // 查询参数
      queryParams: {
        name: null,
        factoryId: null,
        energyType: null,
        isUse: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "管网编码不能为空", trigger: "blur" },
          { max: 50, message: "管网编码最多50个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "管网名称不能为空", trigger: "blur" },
          { max: 100, message: "管网名称最多100个字符", trigger: "blur" }
        ],
        factoryId: [
          { required: true, message: "所属工厂不能为空", trigger: "blur" }
        ],
        energyType: [
          { required: true, message: "能源介质不能为空", trigger: "blur" }
        ],
        shareCoefficient: [
          { required: true, message: "分摊系数不能为空", trigger: "blur" },
          { pattern: /^(?:\d+)(?::\d+)$/, message: '请输入正确的格式' }
        ],
        selectShareType: [
          { required: true, message: "分摊类型不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        remark: [
          { max: 200, message: "备注最多200个字符", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getFactoryList();
    this.getEnergyTypeSelect();
    this.getDictsBatch("is_use,energy_share_type").then(response => {
      this.isUseOptions = response.data.is_use;
      this.energyShareTypeOptions = response.data.energy_share_type;
    });
  },
  methods: {

    getFactoryList(){
      listModeltree({'type':'pm_model_company','isUse':0}).then(response => {
        this.factoryList = response.result;
      });
    },

    changeFactory(factoryId){
      let factory = this.factoryList.find((item) => {
        return item.id == factoryId
      })
      this.form.factoryName = factory.modelName
    },
    selectEnergyNetwork(){
      listEnergyNetwork().then(response => {
        const data = { id: 0, name: '无',parentId :0, children: [] };
        data.children = this.handleTree(response.result, "id", "parentId");
        this.energyNetworkOptions.push(data);
      });
    },
    /** 转换模型树数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 查询能源管网列表 */
    getList() {
      this.loading = true;
      listEnergyNetwork(this.queryParams).then(response => {
        this.energyNetworkList = this.treeDataTranslate(response.result, "id", "parentId");
        this.loading = false;
      });
    },
    // 启用状态字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
    },
    shareTypeFormat(row, column){
      let shareType =[];
      if(row.shareType !=null && row.shareType !=''){
        let type = row.shareType.split(",");
        for(let item in type){
          let typeName = this.selectDictLabel(this.energyShareTypeOptions, type[item]);
          shareType.push(typeName)
        }
      }
      return shareType.join(",");
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
        ancestors: null,
        code: null,
        name: null,
        factoryId: null,
        factoryName: null,
        energyType: null,
        energyTypeName: null,
        shareCoefficient: null,
        shareType: [],
        selectShareType:[],
        isUse: 0,
        delFlag: null,
        orderNum: 0,
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    async handleAdd(row) {
      this.reset();
      this.selectShareType=[];
      this.open = true;
      this.title = "添加能源管网";
      await this.selectEnergyNetwork();
      if(row == undefined){
        this.form.parentId = 0
      }else{
        this.form.parentId=row.id
      }
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      this.selectShareType=[];
      await this.selectEnergyNetwork();
      const id = row.id || this.ids
      getEnergyNetwork(id).then(response => {
        this.form = response.result;
        this.form.selectShareType=this.form.shareType.split(",");
        this.open = true;
        this.title = "修改能源管网";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.shareType = this.form.selectShareType.join(",")
          if (this.form.id != null) {
            updateEnergyNetwork(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEnergyNetwork(this.form).then(response => {
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
      this.$confirm('是否确认删除能源管网名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEnergyNetwork(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/energyNetwork/export', {
        ...this.queryParams
      }, `model_energyNetwork.xlsx`)
    }
  }
};
</script>
