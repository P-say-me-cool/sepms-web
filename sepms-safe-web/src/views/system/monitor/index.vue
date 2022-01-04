<template>
  <div class="app-container ">
  <div style="height:15px;" v-show="!showSearch"></div>

    <el-form class="allinput wzt_form" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="监控组名称:" prop="monitorName">
        <el-input
          v-model="queryParams.monitorName"
          placeholder="请输入监控组名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人名称:" prop="creator">
        <el-input
          v-model="queryParams.creator"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:monitor:add']"
        >新增监控组
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="monitorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="名称" align="center" prop="monitorName"/>
      <el-table-column label="创建人" align="center" prop="creator"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="描述" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="getInOutList(scope.row)"
            v-hasPermi="['system:monitor:query']"
          >分配进出厂点
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:monitor:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            class="delbtn"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:monitor:remove']"
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
    /></div>

    <!-- 添加或修改进出厂点监控组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称:" prop="monitorName">
          <el-input v-model="form.monitorName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="描述:" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="ioTitle" :visible.sync="ioOpen" width="1100px" append-to-body>
      <el-form ref="ioForm" :model="ioParams" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form-item label="进出厂点:" prop="name">
              <el-input @change="changeMethod" v-model="ioParams.name" placeholder="请输入名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运输类型:" prop="transportType">
              <el-select v-model="ioParams.transportType" placeholder="请选择运输类型" @change="changeMethod">
                <el-option
                  v-for="dict in transportTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="进出类型:" prop="inOutType">
              <el-select v-model="ioParams.inOutType" placeholder="请选择进出类型" @change="changeMethod">
                <el-option
                  v-for="dict in ioTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否分配:" prop="isOper">
              <el-select v-model="ioParams.isOper" placeholder="请选择是否分配" @change="changeMethod">
                <el-option
                  v-for="dict in operateOption"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
              <el-button type="primary"  icon="el-icon-refresh" size="mini" @click="resetIoQuery">重置</el-button>

          </el-col>
        </el-row>
      </el-form>
      <el-table ref="coalBlendTable" v-loading="ioLoading" :data="ioList" @selection-change="handleSelectionChange">
        <el-table-column label="可选指标" align="center" prop="name"/>
        <el-table-column label="运输类型" align="center" prop="transportType" :formatter="transportTypeFormat" />
        <el-table-column label="进出类型" align="center" prop="inOutType" :formatter="inOutTypeFormat" />
        <el-table-column label="是否分配" align="center" key="isOper">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOper"
              :active-value="0"
              :inactive-value="1"
              @change="handleOperChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

      </el-table>

     <!-- <pagination
        v-show="ioTotal>0"
        :total="ioTotal"
        :page.sync="ioParams.pageNum"
        :limit.sync="ioParams.pageSize"
        @pagination="getIOList"
      />-->
      <div slot="footer" class="dialog-footer">
       <!-- <el-button
          type="primary"
          plain
          icon="el-icon-ok"
          size="mini"
          @click="okIO"
        >确定
        </el-button>-->
        <el-button
          type="primary"
          plain
          icon="el-icon-ok"
          size="mini"
          @click="cancelIO"
        >取消
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {listMonitor, getMonitor, getIOMonitor, delMonitor, addMonitor, updateMonitor} from "@/api/system/monitor";
  import {addIoMonitor} from "@/api/system/iomonitor";

  export default {
    name: "Monitor",
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        ioLoading: false,
        // 选中数组
        ids: [],
        names:[],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        ioTotal: 0,
        // 进出厂点监控组表格数据
        monitorList: [],
        ioList: [],
        ioMonList:[],
        // 弹出层标题
        title: "",
        ioTitle: "",
        // 是否显示弹出层
        open: false,
        ioOpen: false,
        transportTypeOptions: [],
        ioTypeOptions: [],
        operateOption:[],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          monitorName: null,
          creator: null,
          updator: null,
        },
        ioParams: {
          monitorId: null,
          id: null,
          pageNum: 1,
          pageSize: 10,
          name:'',
          transportType:'',
          inOutType:'',
          isOper: ''
        },
        formData: {
          monitorId: null,
          ioId:'',
          isOper:'',
        },
        // 表单参数
        form: {},
        ioForm: {},
        // 表单校验
        rules: {
          monitorName: [
            {required: true, message: "名称不能为空", trigger: "blur"},
            {max: 20, message: "名称过长", trigger: "blur"}
          ],
          remark: [
            {max: 200, message: "备注过长", trigger: "blur"}
          ],
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("in_out_type").then(response => {
        this.ioTypeOptions = response.data;
      });
      this.getDicts("mechanical_type").then(response => {
        this.transportTypeOptions = response.data;
      });
      this.getDicts("sys_oper").then(response => {
        this.operateOption = response.data;
      });
    },
    methods: {
      /** 查询进出厂点监控组列表 */
      getList() {
        this.loading = true;
        listMonitor(this.queryParams).then(response => {
          this.monitorList = response.result;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 运输类型字典翻译
      transportTypeFormat(row, column) {
        return this.selectDictLabel(this.transportTypeOptions, row.transportType);
      },
      // 进出类型字典翻译
      inOutTypeFormat(row, column) {
        return this.selectDictLabel(this.ioTypeOptions, row.inOutType);
      },
      operateFormat(row, column) {
        return this.selectDictLabel(this.operateOption, row.isOper);
      },
      changeMethod(){
        this.ioParams.pageNum = 1;
        this.getIOList()
      },
      //根据监控组id获取进出厂点信息
      getInOutList(row) {
        this.ioLoading = true;
        this.ioOpen = true;
        this.ioTitle = row.monitorName;
        this.form.monitorName = row.monitorName;
        this.ioParams.monitorId = row.id;
        this.form.id = row.id;
        getIOMonitor(this.ioParams).then(response=>{
          this.ioList = response.result;
          this.ioTotal = response.total;
          this.ioLoading = false;
        })
      },
      getIOList() {
        this.ioOpen = true;
        this.ioTitle = this.form.monitorName;
        getIOMonitor(this.ioParams).then(response=>{
          this.ioList = response.result;
          this.ioTotal = response.total;
          this.ioLoading = false;
        })
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
          monitorName: null,
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
     /* okIO(){
        let formData = {
          monitorId: this.ioParams.monitorId,
          ioId: this.ids+"",
        }
        addIoMonitor(formData).then(response => {
          this.msgSuccess("分配成功");
          this.open = false;
          this.getList();
        });
        this.ioOpen = false;
        this.resetIoQuery();
      },*/
      cancelIO(){
        this.resetIoQuery();
        this.ioOpen = false;
      },
      resetIoQuery(){
        this.resetForm("ioForm");
        this.getIOList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.names = selection.map(item => item.name)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加进出厂点监控组";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getMonitor(id).then(response => {
          this.form = response.result;
          this.open = true;
          this.title = "修改进出厂点监控组";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateMonitor(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addMonitor(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      // 分配修改
      handleOperChange(row) {
          let text = row.isOper === 0 ? "分配" : "移除";
          this.formData.monitorId = this.ioParams.monitorId,
          this.formData.ioId = row.id,
          this.formData.isOper = row.isOper,
          this.$confirm("确认要" + text + " '"+row.name +"'", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(()=> {
                addIoMonitor(this.formData).then((res)=>{
                  if (res.code == '200') {
                    this.msgSuccess(text + "成功");
                  }
                })
          }).catch(()=> {
            row.isOper = row.isOper === 0 ? 1 : 0;
          });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除进出厂点监控组名称为"' + row.monitorName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delMonitor(ids);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/monitor/export', {
          ...this.queryParams
        }, `system_monitor.xlsx`)
      },
    }
  };
</script>
