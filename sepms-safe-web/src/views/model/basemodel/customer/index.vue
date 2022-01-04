<template>
  <div class="app-container">
   <div v-show="!showSearch" style="height:15px">
   </div>
    <el-form :model="queryParams" class="formQuery" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="客商名称:" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客商简称:" prop="customerAlias">
        <el-input
          v-model="queryParams.customerAlias"
          placeholder="请输入客商简称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属区域:" prop="regionCode">
        <el-select
          v-model="queryParams.regionCode"
          placeholder="请选择所属区域"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in regionList"
            :key="dict.regionCode"
            :label="dict.region"
            :value="dict.regionCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属矿点:" prop="oreCode">
        <el-select
          v-model="queryParams.oreCode"
          placeholder="请选择所属矿点"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in oreList"
            :key="dict.oreCode"
            :label="dict.oreOccurrence"
            :value="dict.oreCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用:" prop="isUse">
        <el-select v-model="queryParams.isUse" placeholder="请选择是否启用" size="small">
          <el-option
            v-for="dict in isUseOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="form_content_pagination_ti" >
  <div class="tablesfrom">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        style="padding-bottom:16px"
      ></right-toolbar>
    <el-table v-loading="loading"  :height="overflowHeight" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="customerCode" />
      <el-table-column label="客商名称" align="center" prop="customerName" :width="this.tableColumnWidth"/>
      <el-table-column label="客商简称" align="center" prop="customerAlias" />
      <el-table-column label="法人代表" align="center" prop="legalRepresentative" :width="this.tableColumnWidth" />
      <el-table-column label="统一社会信用代码" align="center" prop="creditCode" :width="this.tableColumnWidth"/>
      <el-table-column label="联系电话" align="center" prop="contactPhone" />
      <el-table-column label="所属区域" align="center" prop="region"/>
      <el-table-column label="所属矿点" align="center" prop="oreOccurrence"/>
      <el-table-column label="客商类型" align="center" prop="customerType" :formatter="customerTypeFormat" />
      <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:customer:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            class="delbtn"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:customer:remove']"
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
    <!-- 添加或修改客商管理对话框 -->

    <el-dialog class="all_dialog" :title="title" :visible.sync="open" width="770px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-col :span="12">
        <el-form-item label="编码:" prop="customerCode">
          <el-input v-model="form.customerCode" :disabled="true" placeholder="请输入编码" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="客商名称:" prop="customerName">
          <el-input v-model="form.customerName" :disabled="true" placeholder="请输入客商名称" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="客商简称:" prop="customerAlias">
          <el-input v-model="form.customerAlias" placeholder="请输入客商简称" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="法人代表:" prop="legalRepresentative">
          <el-input v-model="form.legalRepresentative" placeholder="请输入法人代表" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="统一社会信用代码:" prop="creditCode">
          <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="联系电话:" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="所属区域:" prop="regionCode">
          <el-select
            v-model="form.regionCode"
            placeholder="请选择所属区域"
            @change="pickRegion"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="dict in regionList"
              :key="dict.regionCode"
              :label="dict.region"
              :value="dict.regionCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="所属矿点:" prop="oreCode">
          <el-select
            v-model="form.oreCode"
            placeholder="请选择所属矿点"
            @change="pickOre"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="dict in oreList"
              :key="dict.oreCode"
              :label="dict.oreOccurrence"
              :value="dict.oreCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="客商类型:" prop="customerType">
          <el-select v-model="form.customerType" placeholder="请选择客商类型">
            <el-option
              v-for="dict in customerTypeOptions"
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
              :label="parseInt(dict.dictValue)"
              :key="dict"
            >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer } from "@/api/model/customer";
import {listRegion} from "../../../../api/model/region";
import {listOre} from "../../../../api/model/ore";

export default {
  name: "Customer",
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
      // 客商管理表格数据
      customerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      regionList:[],
      oreList:[],
      regionParams: {'isUse':0},
      oreParams: {'isUse':0},
      // 所属区域字典
      regionOptions: [],
      // 所属矿点字典
      oreOccurrenceOptions: [],
      // 客商类型字典
      customerTypeOptions: [],
      // 是否启用字典
      isUseOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerName: null,
        customerAlias: null,
        regionCode: null,
        oreCode: null,
        isUse: null,
      },
      overflowHeight: 'auto',
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        customerCode: [
          { required: true, message: "编码不能为空", trigger: "blur" }
        ],
        customerName: [
          { required: true, message: "客商名称不能为空", trigger: "blur" }
        ],
        isUse: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getRegionList();
    this.getOreList();
    this.getDicts("customer_type").then(response => {
      this.customerTypeOptions = response.data;
    });
    this.getDicts("is_use").then(response => {
      this.isUseOptions = response.data;
    });

  },
  methods: {
    //下拉框传值
    pickRegion(e) {
      this.regionList.map((item, i) => {
        if (item.regionCode == e) {
          this.form.region = item.region; //传值
          this.form.regionCode = item.regionCode; //传值
        }
      });
    },
    /**获取区域*/
    getRegionList(){
      this.loading = true;
      listRegion(this.regionParams).then(response => {
        let ss = []
        for (let i = 0; i < response.result.length; i++) {
          ss.push({
            region: response.result[i].regionName,
            regionCode: response.result[i].regionCode,
          })
        }
        this.regionList = ss
      });
    },
    //下拉框传值
    pickOre(e) {
      this.oreList.map((item, i) => {
        if (item.oreCode == e) {
          this.form.oreOccurrence = item.oreOccurrence; //传值
          this.form.oreCode = item.oreCode; //传值
        }
      });
    },
    /**获取矿点*/
    getOreList(){
      this.loading = true;
      listOre(this.oreParams).then(response => {
        let ss = []
        for (let i = 0; i < response.result.length; i++) {
          ss.push({
            oreOccurrence: response.result[i].oreName,
            oreCode: response.result[i].oreCode,
          })
        }
        this.oreList = ss
      });
    },
    /** 查询客商管理列表 */
    getList() {
      this.loading = true;
      listCustomer(this.queryParams).then(response => {
        this.customerList = response.result;
        this.total = response.total;
        this.loading = false;
        this.overflowHeight = this.styleHeight()
      });
    },
    // 是否启用字典翻译
    isUseFormat(row, column) {
      return this.selectDictLabel(this.isUseOptions, row.isUse);
    },
    // 客商类型字典翻译
    customerTypeFormat(row, column) {
      return this.selectDictLabel(this.customerTypeOptions, row.customerType);
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
        customerCode: null,
        customerName: null,
        customerAlias: null,
        legalRepresentative: null,
        creditCode: null,
        contactPhone: null,
        regionCode: null,
        oreCode: null,
        customerType: null,
        isUse: 0,
        remark: null,
        createBy: null,
        creator: null,
        createTime: null,
        updateBy: null,
        updator: null,
        updateTime: null
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
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客商管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCustomer(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改客商管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCustomer(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCustomer(this.form).then(response => {
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
      this.$confirm('是否确认删除客商管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCustomer(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/customer/export', {
        ...this.queryParams
      }, `model_customer.xlsx`)
    }
  }
};
</script>
