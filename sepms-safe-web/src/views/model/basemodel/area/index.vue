<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编码" prop="areaCode">
        <el-input
          v-model="queryParams.areaCode"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="areaName">
        <el-input
          v-model="queryParams.areaName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="界区类型" prop="areaType">
        <el-select v-model="queryParams.areaType" placeholder="请选择界区类型" clearable size="small">
          <el-option
            v-for="dict in areaTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用" prop="isUse">
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:area:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['model:area:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['model:area:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['model:area:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="areaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="编码" align="center" prop="areaCode" />
      <el-table-column label="名称" align="center" prop="areaName" />
      <el-table-column label="界区类型" align="center" prop="areaType" :formatter="areaTypeFormat" />
      <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat" />
      <el-table-column label="父对象ID" align="center" prop="parentId" />
      <el-table-column label="父名称" align="center" prop="parentName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:area:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:area:remove']"
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

    <!-- 添加或修改界区对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编码" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="界区类型" prop="areaType">
          <el-select v-model="form.areaType" placeholder="请选择界区类型">
            <el-option
              v-for="dict in areaTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="isUse">
          <el-select v-model="form.isUse" placeholder="请选择是否启用">
            <el-option
              v-for="dict in isUseOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父对象ID" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父对象ID" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listArea, getArea, delArea, addArea, updateArea } from "@/api/model/area";

  export default {
    name: "Area",
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
        // 界区表格数据
        areaList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 界区类型字典
        areaTypeOptions: [],
        // 是否启用字典
        isUseOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          areaCode: null,
          areaName: null,
          areaType: null,
          isUse: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          areaCode: [
            { required: true, message: "编码不能为空", trigger: "blur" }
          ],
          areaName: [
            { required: true, message: "名称不能为空", trigger: "blur" }
          ],
          areaType: [
            { required: true, message: "界区类型不能为空", trigger: "change" }
          ],
          isUse: [
            { required: true, message: "是否启用不能为空", trigger: "change" }
          ],
          parentId: [
            { required: true, message: "父对象ID不能为空", trigger: "blur" }
          ],
          parentName: [
            { required: true, message: "父名称不能为空", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("area_type").then(response => {
        this.areaTypeOptions = response.data;
      });
      this.getDicts("is_use").then(response => {
        this.isUseOptions = response.data;
      });
    },
    methods: {
      /** 查询界区列表 */
      getList() {
        this.loading = true;
        listArea(this.queryParams).then(response => {
          this.areaList = response.result;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 界区类型字典翻译
      areaTypeFormat(row, column) {
        return this.selectDictLabel(this.areaTypeOptions, row.areaType);
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
          areaCode: null,
          areaName: null,
          areaType: null,
          isUse: null,
          parentId: null,
          parentName: null,
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
        this.title = "添加界区";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getArea(id).then(response => {
          this.form = response.result;
          this.open = true;
          this.title = "修改界区";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateArea(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addArea(this.form).then(response => {
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
        this.$confirm('是否确认删除界区编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delArea(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('model/area/export', {
          ...this.queryParams
        }, `model_area.xlsx`)
      }
    }
  };
</script>
