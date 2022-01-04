<template>
  <div class="app-container ">
  <div v-show="!showSearch" style="height:15px"></div>

    <el-form  :model="queryParams" class="el-tianjia wzt_form" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="工厂:" prop="factoryId">
        <el-select v-model="queryParams.factoryId" @change="queryFactory" clearable placeholder="请选择工厂">
          <el-option
            v-for="dict in modeltreeOptions"
            :key="dict.id"
            :label="dict.modelName"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="罐区:" prop="areaId">
        <el-select v-model="queryParams.areaId" @change="queryArea" clearable placeholder="请选择罐区">
          <el-option
            v-for="dict in queryAreaOptions"
            :key="dict.id"
            :label="dict.modelName"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="罐:" prop="tankId">
        <el-select v-model="queryParams.tankId" clearable placeholder="请选择罐">
          <el-option
            v-for="dict in queryTankOptions"
            :key="dict.id"
            :label="dict.modelName"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置类型:" prop="configureType">
        <el-select v-model="queryParams.configureType" placeholder="请选择配置类型" clearable size="small">
          <el-option
            v-for="dict in configureTypeOptions"
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
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:parameter:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <div class="tablesfrom">
    <el-table v-loading="loading" :data="parameterList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工厂" align="center" prop="factory" />
      <el-table-column label="罐区" align="center" prop="areaName" />
      <el-table-column label="配置类型" align="center" prop="configureType" :formatter="configureTypeFormat" />
      <el-table-column label="罐" align="center" prop="tankName" />
      <el-table-column label="是否常量" align="center" prop="isConstant" :formatter="isConstantFormat" />
      <el-table-column label="仪表名称" align="center" prop="meterName" />
      <el-table-column label="固定值" align="center" prop="fixedValue" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:parameter:edit']"
          >修改</el-button>
          <el-button
            class="delbtn"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:parameter:remove']"
          >删除</el-button>
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
    <!-- 添加或修改罐参数配置对话框 -->
    <el-dialog :title="title" class="all_dialog" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
          <el-form-item label="工厂:" prop="factoryId">
            <el-select v-model="form.factoryId" @change="selectFactory" placeholder="请选择工厂">
              <el-option
                v-for="dict in modeltreeOptions"
                :key="dict.id"
                :label="dict.modelName"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="罐区:" prop="areaId">
          <el-select v-model="form.areaId" @change="selectArea" placeholder="请选择罐区">
            <el-option
              v-for="dict in areaOptions"
              :key="dict.id"
              :label="dict.modelName"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="罐:" prop="tankId">
          <el-select v-model="form.tankId" @change="selectTank" placeholder="请选择罐">
            <el-option
              v-for="dict in tankOptions"
              :key="dict.id"
              :label="dict.modelName"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="配置类型:" prop="configureType">
              <el-select v-model="form.configureType" placeholder="请选择配置类型">
                <el-option
                  v-for="dict in configureTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="是否常量:" prop="isConstant">
          <el-select v-model="form.isConstant" placeholder="请选择是否常量">
            <el-option
              v-for="dict in isConstantOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="仪表名称:" v-if="form.isConstant == 1" prop="meterId">
          <el-select v-model="form.meterId" placeholder="请选择仪表名称" filterable @change="selectMeterList">
            <el-option v-for="dict in meterList"
                       :key="dict.id"
                       :label="dict.meterName"
                       :value="dict.id">
            </el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="固定值:" v-if="form.isConstant == 0" prop="fixedValue">
          <el-input v-model="form.fixedValue" placeholder="请输入固定值" />
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
import { listParameter, getParameter, delParameter, addParameter, updateParameter } from "@/api/model/parameter";
import {listModeltree} from "../../../../api/model/modeltree";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {selectListMeter} from "../../../../api/model/meter";

export default {
  name: "Parameter",
  components: {
  },
  data() {
    return {
      eqList:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      flag:false,
      flagMeter:false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      meterList:[],
      // 总条数
      total: 0,
      modeltreeOptions:[],
      queryAreaOptions: [],
      queryTankOptions: [],
      areaOptions: [],
      tankOptions: [],
      // 罐参数配置表格数据
      parameterList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 配置类型字典
      configureTypeOptions: [],
      // 是否常量字典
      isConstantOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        factoryId: null,
        areaId: null,
        tankId: null,
        configureType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        factoryId: [
          { required: true, message: "工厂不能为空", trigger: "change" }
        ],
        areaId: [
          { required: true, message: "罐区不能为空", trigger: "change" }
        ],
        configureType: [
          { required: true, message: "配置类型不能为空", trigger: "change" }
        ],
        tankId: [
          { required: true, message: "罐不能为空", trigger: "change" }
        ],
        isConstant: [
          { required: true, message: "是否常量不能为空", trigger: "change" }
        ],
        meterId: [
          { required: true, message: "仪表不能为空", trigger: "change" }
        ],
        fixedValue: [
          { required: true, message: "固定值不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getTreeSelect();
    this.getDicts("configure_type").then(response => {
      this.configureTypeOptions = response.data;
    });
    this.getDicts("is_use").then(response => {
      this.isConstantOptions = response.data;
    });
  },
  methods: {
    getTreeSelect() {
      listModeltree({"level":2,"type":"pm_model_company","isUse":0}).then(response => {
        this.modeltreeOptions = response.result;
      });
    },
    getAreaList(id){
      listModeltree({"level":4,"type":"pm_model_area","ancestors":"" + id,"subType":4,"isUse":0}).then(response => {
        this.areaOptions = response.result;
      });
    },
    getTankList(id){
      listModeltree({"level":5,"type":"pm_equipment_tank","parentId":id,"isUse":0}).then(response => {
        this.tankOptions = response.result;
      });
    },
    queryFactory(factoryId){
      this.queryParams.areaId = null;
      this.queryParams.tankId = null;
      if(factoryId == null || factoryId == ''){
        this.queryAreaOptions = []
        this.queryTankOptions = []
        return
      }
      listModeltree({"level":4,"type":"pm_model_area","ancestors":"" + factoryId,"subType":4,"isUse":0}).then(response => {
        this.queryAreaOptions = response.result;
        this.queryTankOptions = []
      });
    },
    queryArea(areaId){
      this.queryParams.tankId = null;
      if(areaId == null || areaId == ''){
        this.queryTankOptions = []
        return
      }
      listModeltree({"level":5,"type":"pm_equipment_tank","parentId":areaId,"isUse":0}).then(response => {
        this.queryTankOptions = response.result;
      });
    },
    selectFactory(factoryId){
      let factory = this.modeltreeOptions.find((item) => {
        return item.id === factoryId
      })
      this.form.factory = factory.modelName
      this.form.areaId = null;
      this.form.tankId = null;
      this.getAreaList(factoryId);
    },
    selectArea(areaId){
      let area = this.areaOptions.find((item) => {
        return item.id === areaId
      })
      this.form.areaName = area.modelName
      this.form.tankId = null;
      this.form.meterId = null;
      this.getTankList(areaId);
      this.getMeterList(areaId);
    },
    selectTank(tankId){
      let tank = this.tankOptions.find((item) => {
        return item.id === tankId
      })
      this.form.tankName = tank.modelName
    },
    //下拉框传值
    selectMeterList(meterId) {
      let meter = this.meterList.find((item) => {
        return item.id === meterId
      })
      this.form.meterName = meter.meterName
    },
    /** 获取仪表*/
    getMeterList(areaId) {
      selectListMeter({"eqid":areaId,"isUse":0}).then(response => {
        this.meterList = response.result
      });
    },
    /** 查询罐参数配置列表 */
    getList() {
      this.loading = true;
      listParameter(this.queryParams).then(response => {
        this.parameterList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 配置类型字典翻译
    configureTypeFormat(row, column) {
      return this.selectDictLabel(this.configureTypeOptions, row.configureType);
    },
    // 是否常量字典翻译
    isConstantFormat(row, column) {
      return this.selectDictLabel(this.isConstantOptions, row.isConstant);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.flag=false;
      this.flagMeter=false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        factory: null,
        factoryId: null,
        areaName: null,
        areaId: null,
        configureType: null,
        tankId: null,
        tankName: null,
        isConstant: 1,
        meterId: null,
        meterName: null,
        fixedValue: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        updator: null,
        creator: null
      };
      this.resetForm("form");
      this.areaOptions = null;
      this.tankOptions = null;
      this.meterList = null;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryAreaOptions = [];
      this.queryTankOptions = [];
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
      this.title = "添加罐参数配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getParameter(id).then(response => {
        this.form = response.result;
        this.getAreaList(this.form.factoryId);
        this.getTankList(this.form.areaId);
        if(this.form.areaId != null){
          this.getMeterList(this.form.areaId);
        }
        this.open = true;
        this.title = "修改罐参数配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            if(this.form.isConstant == 1){
              let meter = this.meterList.find(item=>{
                if(this.form.meterId == item.id){
                  return item
                }
              })
              this.form.meterName = meter.meterName
            }
            updateParameter(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addParameter(this.form).then(response => {
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
      const configureType = row.configureType;

      this.$confirm('是否确认删除该条罐参数配置信息?' , "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delParameter(ids);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/parameter/export', {
        ...this.queryParams
      }, `model_parameter.xlsx`)
    }
  }
};
</script>
