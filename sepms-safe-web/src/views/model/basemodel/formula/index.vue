<template>
  <div class="app-container ">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="罐区:" prop="areaId">
        <el-select v-model="queryParams.areaId" placeholder="请选择罐区" clearable size="small">
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="罐名称:" prop="tankName">
        <el-input
          v-model="queryParams.tankName"
          placeholder="请输入罐名称"
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
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:formula:add']"
        >新增</el-button>
      </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="formulaList">
      <el-table-column label="序号" align="center" prop="index" width="60">
        <template slot-scope="scope">
          <span v-text="table_index(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column label="罐编码" align="center" prop="eqgqCode" />
      <el-table-column label="罐名称" align="center" prop="eqgqName" />
      <el-table-column label="罐类型" align="center" prop="eqgqType" :formatter="eqgqTypeFormat" />
      <el-table-column label="罐公式" align="center" prop="formula" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:formula:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:formula:remove']"
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
    <!-- 添加或修改单罐计算对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="罐区:" prop="areaId">
              <el-select v-model="form.areaId" placeholder="请选择罐区" @change="areaChange" clearable  style="width:217px">
                <el-option
                  v-for="item in areaList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="罐名称:" prop="tankId" >
            <el-select v-model="form.tankId" placeholder="请选择罐名称" clearable  @change="tankChange" style="width:217px">
              <el-option
                v-for="item in tankList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark" >
              <el-input style="width:595px" type="textarea" v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
          <el-form-item label="公式:" prop="formula">
            <el-input style="width: 595px" type="textarea" v-model="form.formula" placeholder="请输入公式" id="emojiInput" />
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button @click="makeActive('+')">+</el-button>
          <el-button @click="makeActive('-')">-</el-button>
          <el-button @click="makeActive('*')">*</el-button>
          <el-button @click="makeActive('/')">/</el-button>
          <el-button @click="makeActive('(')">(</el-button>
          <el-button @click="makeActive(')')">)</el-button>
          <el-button @click="makeActive('math.sqrt()')">sqrt</el-button>
          <el-button @click="makeActive('math.sin()')">sin</el-button>
          <el-button @click="makeActive('math.cos()')">cos</el-button>
          <el-button @click="makeActive('math.asin()')">asin</el-button>
          <el-button @click="makeActive('math.acos()')">acos</el-button>
        </el-row>
        <el-table :data="formulaData" border style="width: 100%;margin-top: 10px">
          <el-table-column prop="tankunit" label="值" width="60px;">
            <template scope="scope">
              <div style="cursor:pointer;" @click="makeActive(scope.row.tankunit)">{{ scope.row.tankunit }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="fixedValue" label="固定值" width="80px;"></el-table-column>
          <el-table-column prop="meterName" label="仪表名称"></el-table-column>
          <el-table-column prop="isConstant" label="是否常量" width="80px;" :formatter="isConstantFormater"></el-table-column>
          <el-table-column prop="remark" label="描述信息"></el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-preventReClick @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFormula, getFormula, delFormula, addFormula, updateFormula,areaList, tankList,tankUnitList } from "@/api/model/formula";
import EditCell from '../../../../components/EditCell/EditCellMouse'

export default {
  name: "Formula",
  components: {
    EditCell
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
      // 单罐计算表格数据
      formulaList: [],
      //罐类型
      eqgqTypeOptions: [],
      //罐区列表
      areaList:[],
      //罐名称
      tankList:[],
      //标识罐ID
      tankId:0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        areaId: null,
        tankName: null
      },
      formulaData: [],
      // 表单参数
      form: {
        tankId:null
      },
      // 表单校验
      rules: {
        areaId: [
          { required: true, message: "罐区不能为空", trigger: "change" }
        ],
        tankId: [
          { required: true, message: "罐名称不能为空", trigger: "change" }
        ],
        formula: [
          { required: true, message: "公式不能为空", trigger: "change" },
          {max: 500, message: "公式超出最大长度500", trigger: "blur"}
        ],
        remark: [
          {max: 500, message: "备注超出最大长度500", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("tank_type").then(response => {
      this.eqgqTypeOptions = response.data;
    });
    this.getAreaList();
    //this.getTankUnitList();
  },
  methods: {
    /** 查询单罐计算列表 */
    getList() {
      this.loading = true;
      listFormula(this.queryParams).then(response => {
        this.formulaList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 类型字典翻译
    eqgqTypeFormat(row, column) {
      return this.selectDictLabel(this.eqgqTypeOptions, row.eqgqType);
    },
    //获取罐区
    getAreaList(){
      areaList().then(response => {
        this.areaList = response.result;
      });
    },
    //获取罐列表
    areaChange(areaId){
      this.form.tankId = null;
      if(areaId){
        tankList({areaId:areaId}).then(response => {
          this.tankList = response.result;
          this.form.tankId = response.result[0].id;
          this.tankChange(this.form.tankId)
        });
      }else{
        this.form.tankId = null;
        this.tankList =[];
        this.formulaData = [];
      }
    },
    tankChange(tankId){
      if(tankId != ""){
        this.tankId = tankId;
        this.getTankUnitList();
      }else{
        this.formulaData = [];
      }
    },
    //table翻页
    table_index($index){
      return (this.queryParams.pageNum-1)*this.queryParams.pageSize + $index +1;
    },
    //常量判断
    isConstantFormater(row){
      let param = "";
      if(row.isConstant == '0'){
        param = "是";
      }else if(row.isConstant == '1'){
        param = "否";
      }
      return param;
    },
    getTankUnitList(){
      var param = {
        "tankId":this.tankId
      }
      tankUnitList(param).then(response => {
        this.formulaData = response.result;
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
        tankId: null,
        formula: null,
        remark: null,
        creator: null,
        createBy: null,
        createTime: null,
        updator: null,
        updateBy: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.tankList = [];
      this.formulaData = [];
      this.open = true;
      this.title = "添加单罐计算";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id
      this.tankId = row.tankId
      this.getTankUnitList();
      getFormula(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改单罐计算";
        tankList({areaId:this.form.areaId}).then(response => {
          this.tankList = response.result;
          this.form.tankId = this.tankId;
        });
      });
    },
    //选中罐信息追加到公式后边
    selectValue(row){
      if(this.form.formula == null ||this.form.formula == undefined){
        this.form.formula = "";
      }
      this.form.formula += row
    },
    makeActive(item) {
      var elInput = document.getElementById('emojiInput') // 根据id选择器选中对象
      var startPos = elInput.selectionStart // input 第0个字符到选中的字符
      var endPos = elInput.selectionEnd // 选中的字符到最后的字符
      if (startPos === undefined || endPos === undefined) return
      var txt = elInput.value
      // 将表情添加到选中的光标位置
      var result = txt.substring(0, startPos) + item + txt.substring(endPos)
      elInput.value = result // 赋值给input的value
      // 重新定义光标位置
      elInput.focus()
      elInput.selectionStart = startPos + item.length
      elInput.selectionEnd = startPos + item.length
      this.form.formula = result // 赋值给表单中的的字段
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.remark){
            if(this.form.remark.length > 200){
              return this.msgError("备注长度超过设定值，请重新输入！！");
            }
          }
          if (this.form.id != null) {
            updateFormula(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFormula(this.form).then(response => {
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
      this.$confirm('是否确认删除罐编码为"' + row.eqgqCode + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFormula(ids);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/formula/export', {
        ...this.queryParams
      }, `model_formula.xlsx`)
    }
  }
};
</script>
