<template>
  <div class="app-container">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="平衡表名称:" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入平衡表名称"
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
          @click="handleAdd"
          v-hasPermi="['model:balanceMeter:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="balanceMeterList">
      <el-table-column label="平衡表名称" align="center" prop="name" />
      <el-table-column label="所属工厂" align="center" prop="factoryName" />
      <el-table-column label="所属管网" align="center" prop="networkNames" />
      <el-table-column label="能源介质" align="center" prop="energyTypeName" />
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
            v-hasPermi="['model:balanceMeter:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="delbtn"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:balanceMeter:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleSetting(scope.row)"
          >配置</el-button>
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
    <!-- 添加或修改平衡对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
        <el-form-item label="平衡表名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入平衡表名称" />
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
        <el-form-item label="能源管网:" prop="energyNetworks">
          <el-select v-model="form.energyNetworks"  multiple filterable  placeholder="请选择能源管网">
            <el-option
              v-for="dict in energyNetworkOptions"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
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

    <el-dialog :title="settingTitle" :visible.sync="openSetting" width="900px" append-to-body>
        <el-table :data="balanceItemList" ref="multipleTable" style="height: 500px;overflow: auto" @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="平衡项名称" align="center" prop="name" />
          <el-table-column label="进出类型" align="center" width="100"  prop="ioType" :formatter="ioTypeFormat"/>
          <el-table-column label="平衡项类型" align="center" prop="type" :formatter="typeFormat"/>
          <el-table-column label="排序" align="center" prop="orderNum">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.orderNum"  controls-position="right" :precision="0" placeholder="请输入排序" :min="0"/>
            </template>
          </el-table-column>
        </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="this.multiple" @click="submitSettingForm">确 定</el-button>
        <el-button @click="cancelSetting">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBalanceMeter, getBalanceMeter, delBalanceMeter, addBalanceMeter, updateBalanceMeter,getBalanceMeterItem,addBalanceMeterItem } from "@/api/model/balanceMeter";
import {listModeltree} from "@/api/model/modeltree";
import { selectListEnergy } from "@/api/model/energy";
import { listEnergyNetwork } from "@/api/model/energyNetwork";
import { listBalanceItem } from "@/api/model/balanceItem";

export default {
  name: "BalanceMeter",
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
      // 平衡表格数据
      balanceMeterList: [],
      factoryList: [],
      balanceItemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openSetting: false,
      settingTitle: null,

      balanceMeterId: null,
      selectBalance:[],
      // 启用状态字典
      isUseOptions: [],
      balanceItemIoTypeOptions: [],
      balanceItemTypeOptions: [],
      energyTypeOptions: [],
      energyNetworkOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        factoryId: null,
        factoryName: null,
        energyType: null,
        energyTypeName: null,
        isUse: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "平衡表名称不能为空", trigger: "blur" },
          { max: 100, message: "平衡表名称最多100个字符", trigger: "blur" }
        ],
        factoryId: [
          { required: true, message: "所属工厂不能为空", trigger: "blur" }
        ],
        energyType: [
          { required: true, message: "能源介质不能为空", trigger: "blur" }
        ],
        energyNetworks: [
          { required: true, message: "能源管网不能为空", trigger: "blur" }
        ],
        isUse: [
          { required: true, message: "启用状态不能为空", trigger: "blur" }
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
    this.selectEnergyNetwork();
    this.getDictsBatch("is_use,balanceItem_io_type,balanceItem_type").then(response => {
      this.isUseOptions = response.data.is_use;
      this.balanceItemIoTypeOptions = response.data.balanceItem_io_type;
      this.balanceItemTypeOptions = response.data.balanceItem_type;
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

    selectEnergyNetwork(){
      listEnergyNetwork({"isUse":0}).then(response => {
        this.energyNetworkOptions = response.result;
      });
    },
    /** 查询平衡列表 */
    getList() {
      this.loading = true;
      listBalanceMeter(this.queryParams).then(response => {
        this.balanceMeterList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 启用状态字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
    },
    ioTypeFormat(row, column) {
      return this.selectDictLabel(this.balanceItemIoTypeOptions, row.ioType);
    },
    typeFormat(row, column) {
      return this.selectDictLabel(this.balanceItemTypeOptions, row.type);
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
        name: null,
        factoryId: null,
        factoryName: null,
        energyType: null,
        energyTypeName: null,
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
      this.selectBalance = selection.map(item => item.balanceItemId)
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加平衡表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBalanceMeter(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改平衡表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBalanceMeter(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBalanceMeter(this.form).then(response => {
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
      this.$confirm('是否确认删除平衡表名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBalanceMeter(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/balanceMeter/export', {
        ...this.queryParams
      }, `model_balanceMeter.xlsx`)
    },
    async handleSetting(row){
      this.balanceItemList =[]
      this.settingTitle = row.name+"—平衡表平衡项配置";
      this.balanceMeterId = row.id;
      this.selectBalance = [];
      await this.balanceMeterItem(row.id);
      this.openSetting = true;

    },

    balanceMeterItem(id){
        getBalanceMeterItem(id).then(response => {
          this.balanceItemList = response.result;
          if(response.result !=null && response.result.length>0){
            this.balanceItemList.forEach(row => {
              if(row.id !=0){
                this.$nextTick( ()=> {
                  this.$refs.multipleTable.toggleRowSelection(row, true);
                })
              }
            });
          }
        });
    },

    submitSettingForm(){
      let selectList = [];
      this.balanceItemList.forEach(item=>{
        if(this.selectBalance.includes(item.balanceItemId)){
          selectList.push({"id":item.id,"balanceMeterId": this.balanceMeterId,"balanceItemId":item.balanceItemId,"orderNum":item.orderNum==null?0:item.orderNum});
        }
      })
      addBalanceMeterItem({"balanceMeterId": this.balanceMeterId,"balanceMeterItems":selectList}).then(response => {
        this.msgSuccess("配置成功");
        this.openSetting = false;
      });
    },
    cancelSetting(){
      this.openSetting = false;
    }
  }
};
</script>
