<template>
  <div class="app-container ">
    <div v-show="!showSearch" style="height:15px">
    </div>
    <el-form  :model="queryParams"  class=" el-tianjia wzt_form" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称:" prop="mutName">
        <el-input
          v-model="queryParams.mutName"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="源工厂:" prop="sourceFactoryId">
        <el-select v-model="queryParams.sourceFactoryId" placeholder="选择源工厂">
          <el-option
            v-for="dict in modeltreeOptions"
            :key="dict.id"
            :label="dict.modelName"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目的工厂:" prop="destinationFactoryId">
        <el-select v-model="queryParams.destinationFactoryId" placeholder="选择目的工厂">
          <el-option
            v-for="dict in modeltreeOptions"
            :key="dict.id"
            :label="dict.modelName"
            :value="dict.id"
          ></el-option>
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
          v-hasPermi="['model:point:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <div class="tablesfrom">
    <el-table v-loading="loading" :data="pointList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="名称" align="center" prop="mutName" :width="this.tableColumnWidth"/>
      <el-table-column label="编码" align="center" prop="mutCode" :width="this.tableColumnWidth"/>
      <el-table-column label="源工厂" align="center" prop="sourceFactory" :width="this.tableColumnWidth"/>
      <el-table-column label="目的工厂" align="center" prop="destinationFactory" :width="this.tableColumnWidth"/>
      <el-table-column label="源工厂物料" align="center" prop="sourceFactoryMat" :width="this.tableColumnWidth"/>
      <el-table-column label="目的工厂物料" align="center" prop="destinationFactoryMat" :width="this.tableColumnWidth"/>
      <el-table-column label="源工厂仪表" align="center" prop="sourceFactoryMeter" :width="this.tableColumnWidth"/>
      <el-table-column label="目的工厂仪表" align="center" prop="destinationFactoryMeter" :width="this.tableColumnWidth"/>
      <el-table-column label="仲裁仪表" align="center" prop="arbitrationMeter" :width="this.tableColumnWidth"/>
      <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat"/>
      <el-table-column label="备注" align="center" prop="remark" :width="this.tableColumnWidth"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" :width="this.tableColumnWidth">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:point:edit']"
          >修改
          </el-button>
          <el-button
            class="delbtn"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:point:remove']"
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
    <!-- 添加或修改互供点维护对话框 -->
    <el-dialog :title="title" :visible.sync="open"  width="800px" append-to-body>
      <el-form ref="form" class="wzt_dialog_form" :model="form" :rules="rules" label-width="120px">
        <el-col :span="12">
          <el-form-item label="名称:" prop="mutName">
            <el-input v-model="form.mutName" placeholder="请输入名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编码:" prop="mutCode">
            <el-input v-model="form.mutCode" placeholder="请输入编码"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="源工厂:" prop="sourceFactoryId">
            <el-select v-model="form.sourceFactoryId" @change="selectSourceFactory" placeholder="选择源工厂">
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
          <el-form-item label="目的工厂:" prop="destinationFactoryId">
            <el-select v-model="form.destinationFactoryId"   @change="selectDestinationFactory" placeholder="选择目的工厂">
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
          <el-form-item label="源工厂物料:" prop="sourceFactoryMatId">
            <el-select v-model="form.sourceFactoryMatId" filterable @change="selectSourceFactoryMat" placeholder="请选择源工厂物料" clearable>
              <div class="el-select-one-option-overflow ">
              <el-option v-for="dict in matList"
                         :key="dict.id"
                         :label="dict.matName"
                         :value="dict.id"/>
              </div>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的工厂物料:" prop="destinationFactoryMatId">
            <el-select v-model="form.destinationFactoryMatId" filterable @change="selectDestinationFactoryMat" placeholder="请选择目的工厂物料" clearable>
              <div class="el-select-one-option-overflow ">
              <el-option v-for="dict in matList"
                           :key="dict.id"
                           :label="dict.matName"
                           :value="dict.id"/>
              </div>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="源工厂仪表:" prop="sourceFactoryMeterId">
            <el-select v-model="form.sourceFactoryMeterId" filterable @change="selectSourceFactoryMeter" placeholder="请选择源工厂仪表" clearable>
              <el-option v-for="dict in sourceFactoryMeterList"
                         :key="dict.id"
                         :label="dict.meterName"
                         :value="dict.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的工厂仪表:" prop="destinationFactoryMeterId">
            <el-select v-model="form.destinationFactoryMeterId" filterable @change="selectDestinationFactoryMeter" placeholder="请选择目的工厂仪表" clearable>
              <el-option v-for="dict in destinationFactoryMeterList"
                         :key="dict.id"
                         :label="dict.meterName"
                         :value="dict.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仲裁仪表:" prop="arbitrationMeterId">
            <el-select v-model="form.arbitrationMeterId" filterable @change="selectArbitrationMeter" placeholder="请选择仲裁仪表" clearable>
              <el-option v-for="dict in arbitrationMeterList"
                         :key="dict.id"
                         :label="dict.meterName"
                         :value="dict.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="倒班类型:" prop="classesTypes">
            <el-select v-model="form.classesTypes" multiple placeholder="请选择倒班类型">
              <el-option
                v-for="dict in classesTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="parseInt(dict.dictValue)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用:" prop="isUse">
            <el-radio-group v-model="form.isUse">
              <el-radio
                v-for="dict in isUseOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"/>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listPoint, getPoint, delPoint, addPoint, updatePoint} from "@/api/model/point";
import {listMaterialinfo} from "../../../../api/model/materialinfo";
import {listMeter, listToPoint} from "../../../../api/model/meter";
import {listModeltree} from "../../../../api/model/modeltree";
import Treeselect from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "Point",
  components: {
    Treeselect
  },
  data() {
    return {
      modeltreeOptions:[],
      classesTypeOptions:[],
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
      matList: [],
      matParams: {
        isUse:0,
      },
      meterParams: {},
      sourceFactoryMeterList: [],
      destinationFactoryMeterList: [],
      arbitrationMeterList: [],
      yMeter:'',
      mMeter:'',
      zMeter:'',
      // 互供点维护表格数据
      pointList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否启用字典
      isUseOptions: [],
      eqParams: {
        type:'pm_model_company',
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mutName: null,
        sourceFactoryId: null,
        destinationFactoryId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        mutName: [
          {required: true, message: "名称不能为空", trigger: "blur"},
          {max: 100, message: "名称超出最大长度100", trigger: "blur"}
        ],
        mutCode: [
          {required: true, message: "编码不能为空", trigger: "blur"},
          {max:20, message: "编码超出最大长度20", trigger: "blur"}
        ],
        sourceFactoryId: [
          {required: true, message: "源工厂不能为空", trigger: "change"},
        ],
        destinationFactoryId: [
          {required: true, message: "目的工厂不能为空", trigger: "change"},
        ],
        sourceFactoryMatId: [
          {required: true, message: "源工厂物料不能为空", trigger: "change"}
        ],
        destinationFactoryMatId: [
          {required: true, message: "目的工厂物料不能为空", trigger: "change"}
        ],
        classesTypes: [
          {required: true, message: "倒班类型不能为空", trigger: "change"}
        ],
        isUse: [
          {required: true, message: "是否启用不能为空", trigger: "change"}
        ],
        remark: [
          {max: 200, message: "备注称超出最大长度200", trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getTreeSelect();
    this.getMatList();
    this.getArbitrationMeterList();
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });
    this.getDicts("class_type").then(response => {
      this.classesTypeOptions = response.data;
    });
  },
  methods: {

    getTreeSelect() {
      listModeltree({"level":2,"type":"pm_model_company","isUse":0}).then(response => {
        this.modeltreeOptions =response.result;
      });
    },
    selectSourceFactory(id) {
      let factory = this.modeltreeOptions.find((item) => {
        return item.id === id
      })
      this.form.sourceFactory = factory.modelName
      this.form.sourceFactoryMeterId = null;
      this.getSourceFactoryMeterList(id);
    },
    selectDestinationFactory(id) {
      let factory = this.modeltreeOptions.find((item) => {
        return item.id === id
      })
      this.form.destinationFactory = factory.modelName
      this.form.destinationFactoryMeterId = null
      this.getDestinationFactoryMeterList(id)
    },
    /**获取源工厂物料*/
    getMatList() {
      this.loading = true;
      listMaterialinfo(this.matParams).then(response => {
        this.matList = response.result
      });
    },
    selectSourceFactoryMat(id) {
      let mat = this.matList.find((item) => {
        return item.id === id
      })
      this.form.sourceFactoryMat = mat.matName
    },
    selectDestinationFactoryMat(id) {
      let mat = this.matList.find((item) => {
        return item.id === id
      })
      this.form.destinationFactoryMat = mat.matName
    },
    /** 查询互供点维护列表 */
    getList() {
      this.loading = true;
      listPoint(this.queryParams).then(response => {
        this.pointList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },

    /**获取源工厂仪表*/
    getSourceFactoryMeterList(factoryId) {
      listToPoint({"factory":factoryId,"meterType":4}).then(response => {
        this.sourceFactoryMeterList = response.result;
      });
    },
    getDestinationFactoryMeterList(factoryId) {
      listToPoint({"factory":factoryId,"meterType":4}).then(response => {
        this.destinationFactoryMeterList = response.result;
      });
    },
    getArbitrationMeterList() {
      listToPoint({"meterType":4}).then(response => {
        this.arbitrationMeterList = response.result;
      });
    },
    selectSourceFactoryMeter(id) {
      let meter = this.sourceFactoryMeterList.find((item) => {
        return item.id === id
      })
      this.form.sourceFactoryMeter = meter.meterName
    },
    selectDestinationFactoryMeter(id) {
      let meter = this.destinationFactoryMeterList.find((item) => {
        return item.id === id
      })
      this.form.destinationFactoryMeter = meter.meterName
    },
    selectArbitrationMeter(id) {
      let meter = this.arbitrationMeterList.find((item) => {
        return item.id === id
      })
      this.form.arbitrationMeter = meter.meterName
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
        mutName: null,
        mutCode: null,
        sourceFactory: null,
        sourceFactoryId: null,
        destinationFactory: null,
        destinationFactoryId: null,
        sourceFactoryMat: null,
        sourceFactoryMatId: null,
        destinationFactoryMat: null,
        destinationFactoryMatId: null,
        sourceFactoryMeter: null,
        sourceFactoryMeterId: null,
        destinationFactoryMeterId: null,
        destinationFactoryMeter: null,
        arbitrationMeter: null,
        arbitrationMeterId: null,
        classesTypes: [],
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
      this.sourceFactoryMeterList = [];
      this.destinationFactoryMeterList = [];
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
      this.title = "添加互供点维护";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPoint(id).then(response => {
        this.form = response.result;
        this.getSourceFactoryMeterList(this.form.sourceFactoryId);
        this.getDestinationFactoryMeterList(this.form.destinationFactoryId);
        this.open = true;
        this.title = "修改互供点维护";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.sourceFactoryId == this.form.destinationFactoryId){
            this.msgError("源工厂与目的工厂不能相同");
            return;
          }
          if (this.form.id != null) {
            updatePoint(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
              addPoint(this.form).then(response => {
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
      const  mutName= row.mutName;
      this.$confirm('是否确认删除互供点管理"' +mutName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delPoint(ids);
      }).then(() => {
        this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/point/export', {
        ...this.queryParams
      }, `model_point.xlsx`)
    }
  }
};
</script>
<style>
.el-select-dropdown__list .el-select-one-option-overflow {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
