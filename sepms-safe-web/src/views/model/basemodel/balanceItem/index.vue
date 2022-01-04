<template>
  <div class="app-container">
  <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="平衡项名称:" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入平衡项名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="平衡项类型:" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择平衡项类型" clearable size="small">
          <el-option
            v-for="dict in balanceItemTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
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
          v-hasPermi="['model:balanceItem:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="balanceItemList">
      <el-table-column label="平衡项名称" align="center" prop="name" />
      <el-table-column label="进出类型" align="center" prop="ioType" :formatter="ioTypeFormat"/>
      <el-table-column label="计算公式" align="center" prop="formula" />
      <el-table-column label="平衡项类型" align="center" prop="type" :formatter="typeFormat"/>
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:balanceItem:edit']"
            v-if="scope.row.type==2"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="delbtn"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:balanceItem:remove']"
            v-if="scope.row.type==2"
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
    <!-- 添加或修改平衡项对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
        <el-form-item label="平衡项名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入平衡项名称" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="进出类型:" prop="ioType">
          <el-select v-model="form.ioType" placeholder="请选择进出类型">
            <el-option
              v-for="dict in balanceItemIoTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="平衡项类型:" prop="type">
          <el-select v-model="form.type" disabled placeholder="请选择平衡项类型">
            <el-option
            v-for="dict in balanceItemTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
          </el-select>
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="排序:" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :precision="0" placeholder="请输入排序" :min="0"/>
        </el-form-item>
          </el-col>
          <el-col :span="24">
        <el-form-item label="计算公式:" prop="formula">
          <el-input v-model="form.formula" type="textarea" placeholder="请输入计算公式" v-on:click.native="searchFormula"/>
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

    <el-dialog title="节点公式配置" :visible.sync="openFormula" width="800px" append-to-body>
      <el-row>
        <el-button @click="makeActive('+')">+</el-button>
        <el-button @click="makeActive('-')">-</el-button>
        <el-button @click="makeActive('*')">*</el-button>
        <el-button @click="makeActive('/')">/</el-button>
        <el-button @click="makeActive('(')">(</el-button>
        <el-button @click="makeActive(')')">)</el-button>
      </el-row>
      <el-input
        id="formula"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="formula"
        style="margin-top: 10px;margin-bottom: 10px"
      >
      </el-input>
      <el-table :data="baseBalanceItemList" style="height: 400px;overflow: auto">
        <el-table-column label="平衡项名称" align="center" prop="name" />
        <el-table-column label="进出类型" align="center" prop="ioType" :formatter="ioTypeFormat"/>
        <el-table-column label="排序" align="center" prop="orderNum" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-top"
              @click="makeActive(scope.row,'judge')"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitFormula">确 定</el-button>
        <el-button @click="cancelFormula">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBalanceItem, getBalanceItem, delBalanceItem, addBalanceItem, updateBalanceItem } from "@/api/model/balanceItem";

export default {
  name: "BalanceItem",
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
      // 平衡项表格数据
      balanceItemList: [],
      baseBalanceItemList: [],
      balanceItemIoTypeOptions: [],
      balanceItemTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openFormula: false,
      formula: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        ioType: null,
        formula: null,
        type: null,
        orderNum: null,
        creator: null,
        updator: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "平衡项名称不能为空", trigger: "blur" },
          { max: 100, message: "平衡项名称最多100个字符", trigger: "blur" }
        ],
        ioType: [
          { required: true, message: "进出类型不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "平衡项类型不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        formula: [
          { max: 500, message: "计算公式最多500个字符", trigger: "blur" }
        ],
        remark: [
          { max: 200, message: "备注最多200个字符", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDictsBatch("balanceItem_io_type,balanceItem_type").then(response => {
      this.balanceItemIoTypeOptions = response.data.balanceItem_io_type;
      this.balanceItemTypeOptions = response.data.balanceItem_type;
    });
  },
  methods: {
    /** 查询平衡项列表 */
    getList() {
      this.loading = true;
      listBalanceItem(this.queryParams).then(response => {
        this.balanceItemList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },

    getBaseBalanceItemList() {
      listBalanceItem({'type':1}).then(response => {
        this.baseBalanceItemList = response.result;
      });
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
        ioType: null,
        formula: null,
        type: 2,
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
      this.title = "添加平衡项";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBalanceItem(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改平衡项";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBalanceItem(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBalanceItem(this.form).then(response => {
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
      this.$confirm('是否确认删除平衡项名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBalanceItem(ids);
        }).then(() => {
        this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/balanceItem/export', {
        ...this.queryParams
      }, `model_balanceItem.xlsx`)
    },
    searchFormula(){
      this.getBaseBalanceItemList();
      this.formula = this.form.formula;
      this.openFormula = true;
    },
    makeActive(item, judge) {
      if (judge) {
        item = '${' + item.id+'|'+item.name + '}'
      }
      var elInput = document.getElementById('formula') // 根据id选择器选中对象
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
      this.formula = result // 赋值给表单中的的字段
    },
    submitFormula(){
      this.form.formula = this.formula;
      this.openFormula = false;
    },
    cancelFormula(){
      this.formula = null;
      this.openFormula = false;
    }
  }
};
</script>
