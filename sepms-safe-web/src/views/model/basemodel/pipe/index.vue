<template>
  <div class="app-container">
  <div v-show="!showSearch" style="height:15px">
    </div>
    <el-form :model="queryParams" class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="所属装置:" prop="eqName">
        <el-select v-model="queryParams.eqName" placeholder="请选择装置" clearable size="small">
          <el-option v-for="dict in eqList"
                     :key="dict.eqName"
                     :label="dict.eqName"
                     :value="dict.eqName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="侧线名称:" prop="pipeName">
        <el-input
          v-model="queryParams.pipeName"
          placeholder="请输入侧线名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="侧线类型:" prop="pipeType">
        <el-select v-model="queryParams.pipeType" placeholder="请选择侧线类型" clearable size="small">
          <el-option
            v-for="dict in pipeTypeOptions"
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
  <div class="formQuery form_content_pagination">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:pipe:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['model:pipe:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="pipeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="侧线编码" align="center" prop="pipeCode"/>
      <el-table-column label="侧线名称" align="center" prop="pipeName"/>
      <el-table-column label="所属装置" align="center" prop="eqName"/>
      <el-table-column label="侧线类型" align="center" prop="pipeType" :formatter="pipeTypeFormat"/>
      <el-table-column label="精度" align="center" prop="accuracy"/>
      <el-table-column label="排序" align="center" prop="orderNum"/>
      <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:pipe:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            class="delbtn"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:pipe:remove']"
          >删除
          </el-button>
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
    <!-- 添加或修改侧线对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属装置:" prop="eqid">
          <el-select v-model="form.eqid"
          width="100%"
            style="display:block;" placeholder="请选择装置" filterable @change="pickEqName" clearable size="small">
            <el-option v-for="dict in eqList"
                       :key="dict.eqid"
                       :label="dict.eqName"
                       :value="dict.eqid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="侧线名称:" prop="pipeName">
          <el-input v-model="form.pipeName" placeholder="请输入侧线名称"/>
        </el-form-item>
        <el-form-item label="侧线编码:" prop="pipeCode">
          <el-input v-model="form.pipeCode" placeholder="请输入侧线编码"/>
        </el-form-item>
        <el-form-item label="侧线类型:" prop="pipeType">
          <el-select             width="100%"
            style="display:block;" v-model="form.pipeType" placeholder="请选择侧线类型">
            <el-option
              v-for="dict in pipeTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="精度:" prop="accuracy">
          <el-input-number v-model="form.accuracy" :step="1" :max="100" :min="0"
                           placeholder="请输入精度"/>
        </el-form-item>
        <el-form-item label="排序:" prop="orderNum">
          <el-input-number v-model="form.orderNum" :step="1" :min="0"
                           placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-radio-group v-model="form.isUse">
            <el-radio
              v-for="dict in isUseOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listPipe, getPipe, delPipe, addPipe, updatePipe} from "@/api/model/pipe";
  import {listModeltree} from "@/api/model/modeltree";

  export default {
    name: "Pipe",
    components: {},
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
        // 侧线表格数据
        pipeList: [],
        eqList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 侧线类型字典
        pipeTypeOptions: [],
        // 是否启用字典
        isUseOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          pipeName: null,
          pipeType: null,
          eqid: null,
        },
        eqParams: {
          type: 'pm_equipment_coking',
          isUse: 0
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          pipeName: [
            {required: true, message: "侧线名称不能为空", trigger: "blur"},
            {max: 100, message: "名称超出最大长度100", trigger: "blur"}
          ],
          pipeCode: [
            {required: true, message: "侧线编码不能为空", trigger: "blur"},
            {max: 50, message: "编码超出最大长度", trigger: "blur"}
          ],
          pipeType: [
            {required: true, message: "侧线类型不能为空", trigger: "change"}
          ],
          isUse: [
            {required: true, message: "是否启用不能为空", trigger: "blur"}
          ],
          accuracy: [
            {required: true, message: "侧线精度不能为空", trigger: "blur"}
          ],
          eqid: [
            {required: true, message: "装置id不能为空", trigger: "blur"}
          ],
          remark:[
            {max: 200, message: "备注超出最大长度", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getEqList();
      this.getDicts("pipe_type").then(response => {
        this.pipeTypeOptions = response.data;
      });
      this.getDicts("is_use").then(response => {
        this.isUseOptions = response.data;
      });
    },
    methods: {
      //下拉框传值
      pickEqName(e) {
        this.eqList.map((item, i) => {
          if (item.eqid == e) {
            this.form.eqName = item.eqName; //传值
            this.form.eqid = item.eqid;//传值
          }
        });
      },
      /** 查询侧线列表 */
      getList() {
        this.loading = true;
        listPipe(this.queryParams).then(response => {
          this.pipeList = response.result;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 获取所有装置*/
      getEqList() {
        this.loading = true;
        listModeltree(this.eqParams).then(response => {
          let ss = []
          for (let i = 0; i < response.result.length; i++) {
            ss.push({
              eqid: response.result[i].id,
              eqName: response.result[i].modelName,
            })
          }
          this.eqList = ss
        });
      },
      // 侧线类型字典翻译
      pipeTypeFormat(row, column) {
        return this.selectDictLabel(this.pipeTypeOptions, row.pipeType);
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
          creator: null,
          createBy: null,
          createTime: null,
          updator: null,
          updateBy: null,
          updateTime: null,
          pipeName: null,
          pipeCode: null,
          pipeType: null,
          isUse: 0,
          eqid: null,
          eqName: null,
          accuracy: null,
          orderNum: 0
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
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加侧线";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getPipe(id).then(response => {
          this.form = response.result;
          this.open = true;
          this.title = "修改侧线";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updatePipe(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addPipe(this.form).then(response => {
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
        const name = row.pipeName ;
        const ids = row.id;
        this.$confirm('是否确认删除名称为"' + name + '"的测线信息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delPipe(ids);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('model/pipe/export', {
          ...this.queryParams
        }, `model_pipe.xlsx`)
      }
    }
  };
</script>
