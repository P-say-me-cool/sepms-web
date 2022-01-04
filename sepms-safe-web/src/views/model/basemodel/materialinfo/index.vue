<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="matName">
        <el-input
          v-model="queryParams.matName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="别名" prop="matAlias">
        <el-input
          v-model="queryParams.matAlias"
          placeholder="请输入别名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
        <el-button type="primary"  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="materialinfoList">
      <el-table-column label="编码" align="center" prop="matCode" />
      <el-table-column label="名称" align="center" prop="matName" />
      <el-table-column label="别名" align="center" prop="matAlias" />
      <el-table-column label="类型编码" align="center" prop="typeCode" />
      <el-table-column label="类别名称" align="center" prop="typeName" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="物料类型" align="center" prop="matType" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" key="isUse">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUse"
            active-value="0"
            inactive-value="1"
            active-text="禁用"
            inactive-text="启用"
            @change="handleIsUseChange(scope.row)"
          ></el-switch>
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
</template>

<script>
  import { listMaterialinfo, getMaterialinfo, delMaterialinfo, addMaterialinfo, updateMaterialinfo } from "@/api/model/materialinfo";

  export default {
    name: "Materialinfo",
    components: {
    },
    props:["materCode"],
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
        // 物料信息表格数据
        materialinfoList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否启用字典
        isUseOptions: [],
        // 物料类型字典
        matTypeOptions:[],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          matName: null,
          matAlias: null,
          isUse: '',
          matType:'',
          matCode : this.materCode,
        },
        // 表单参数
        form: {},
      };
    },
    created() {
      this.getList();
      this.getDicts("is_check").then(response => {
        this.isUseOptions = response.data;
        this.matTypeOptions = response.data;
      });
    },
    mounted(){
      console.log(this.materCode)
    },
    methods: {
      /** 查询物料信息列表 */
      getList() {
        this.loading = true;
        listMaterialinfo(this.queryParams).then(response => {
          this.materialinfoList = response.result;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 是否启用字典翻译
      isUseFormat(row, column) {
        return this.selectDictLabel(this.isUseOptions, row.isUse);
      },
      // 物料类型字典翻译
      matTypeFormat(row, column) {
        return this.selectDictLabel(this.matTypeOptions, row.matType);
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
          matCode: null,
          matName: null,
          matAlias: null,
          typeCode: null,
          typeName: null,
          unit: null,
          remark: null,
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
      /** 导出按钮操作 */
      handleExport() {
        this.download('model/materialinfo/export', {
          ...this.queryParams
        }, `model_materialinfo.xlsx`)
      },
      // 物料状态修改
      handleIsUseChange(row) {
        let text = row.isUse === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.matName + '"物料吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return updateMaterialinfo(row.id, row.isUse);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.isUse = row.isUse === "0" ? "1" : "0";
        });
      },
    }
  };
</script>
