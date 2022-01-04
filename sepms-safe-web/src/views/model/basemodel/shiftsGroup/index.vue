<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="allinput wzt_form" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="车间:" prop="workshopId">
        <el-select v-model="queryParams.workshopId" placeholder="请选择车间" clearable size="small">
          <el-option
            v-for="item in workshopList"
            :key="item.id"
            :label="item.modelName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="倒班类型:" prop="classesType">
        <el-select v-model="queryParams.classesType" placeholder="请选择倒班类型" clearable size="small">
          <el-option
            v-for="dict in classesTypeOptions"
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
          v-hasPermi="['model:shiftsGroup:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shiftsGroupList">
      <el-table-column label="轮班组名称" align="center" prop="groupName" />
      <el-table-column label="所属车间" align="center" prop="workshopName" />
      <el-table-column label="倒班类型" align="center" prop="classesType" :formatter="classesTypeFormat" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="启用状态" align="center" prop="isUse" :formatter="isUseFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:shiftsGroup:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            class="delbtn"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:shiftsGroup:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleAreaConfig(scope.row)"
          >界区配置</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-help"
            @click="handleShiftsPlan(scope.row)"
          >轮班配置</el-button>
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
    <!-- 添加或修改轮班组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="480px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="轮班组名称:" prop="groupName" >
          <el-input v-model="form.groupName" placeholder="请输入轮班组名称" style="width:217px"/>
        </el-form-item>
        <el-form-item label="所属车间:" prop="workshopId">
          <el-select v-model="form.workshopId" @change="changeWorkshop"  placeholder="请选择车间">
            <el-option
              v-for="item in workshopList"
              :key="item.id"
              :label="item.modelName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="倒班类型:" prop="classesType">
          <el-select v-model="form.classesType" placeholder="请选择倒班类型">
            <el-option
              v-for="dict in classesTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序:" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :precision="0" placeholder="请输入排序" :min="0"/>
        </el-form-item>
        <el-form-item label="启用状态:" prop="isUse">
          <el-radio-group v-model="form.isUse">
            <el-radio
              v-for="dict in isUseOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 界区配置 -->
    <el-dialog title="界区配置" :visible.sync="openAreaConfig" width="600px" append-to-body>
      <el-form ref="form" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车间:" prop="workshopId">
              <el-select v-model="areaConfigForm.workshopId" disabled  placeholder="请选择车间">
                <el-option
                  v-for="item in workshopList"
                  :key="item.id"
                  :label="item.modelName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="倒班类型:" prop="classesType">
              <el-select v-model="areaConfigForm.classesType" disabled placeholder="请选择倒班类型">
                <el-option
                  v-for="dict in classesTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="areaSelectList" ref="multipleTable" style="height: 500px;overflow: auto" @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="界区名称" align="left" prop="modelName" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAreaConfig" v-preventReClick>确 定</el-button>
        <el-button @click="cancelAreaConfig">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 轮班配置 -->
    <el-dialog title="轮班配置" :visible.sync="openShiftPlan" width="620px" append-to-body>
      <el-form ref="shiftsPlanForm" :model="shiftsPlanForm" :rules="shiftsPlanRules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车间:" prop="workshopId">
              <el-select v-model="shiftsPlanForm.workshopId" disabled  placeholder="请选择车间">
                <el-option
                  v-for="item in workshopList"
                  :key="item.id"
                  :label="item.modelName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="倒班类型:" prop="classesType">
              <el-select v-model="shiftsPlanForm.classesType" disabled placeholder="请选择倒班类型">
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
            <el-form-item label="开始时间:" prop="beginDate">
              <el-date-picker
                style="width:198.5px"
                v-model="shiftsPlanForm.beginDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始时间">
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始班次:" prop="beginClasses">
              <el-select v-model="shiftsPlanForm.beginClasses" @change="changeClasses" placeholder="请选择开始班次">
                <el-option
                  v-for="item in classesOptions"
                  :key="item.id"
                  :label="item.classesName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="轮班天数:" prop="shiftDays">
              <el-input style="width:198.5px" v-model="shiftsPlanForm.shiftDays" oninput ="value=value.replace(/[^0-9]/g,'')" placeholder="请输入轮班天数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-button  style="margin-left:15px" type="primary" icon="el-icon-search" size="mini" @click="handleShiftsPlanQuery">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="shiftsPlanList" style="height: 500px;overflow: auto" >
        <el-table-column label="序号"  type="index" align="center" />
        <el-table-column label="日期" align="center" prop="shiftsDate" />
        <el-table-column label="班次" align="center" prop="classesName" />
        <el-table-column label="班组" align="center" prop="teamNameType" >
          <template slot-scope="scope">
            <el-select v-model="scope.row.teamNameType">
              <el-option
                v-for="dict in teamNameTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="parseInt(dict.dictValue)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShiftsPlan" v-preventReClick>确 定</el-button>
        <el-button @click="cancelShiftsPlan">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listShiftsGroup, getShiftsGroup, delShiftsGroup, addShiftsGroup, updateShiftsGroup,getAreaSelectList,getAreaAllocationList } from "@/api/model/shiftsGroup";
import { addShiftsArea } from "@/api/model/shiftsArea";
import { getShiftsPlanQuery,addShiftsPlan } from "@/api/model/shiftsPlan";
import {listModeltree} from "@/api/model/modeltree";
import { selectListClasses } from '@/api/model/classes'

export default {
  name: "ShiftsGroup",
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
      // 轮班组表格数据
      shiftsGroupList: [],
      workshopList: [],
      areaSelectList: [],
      areaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openAreaConfig: false,
      openShiftPlan: false,
      // 倒班类型字典
      classesTypeOptions: [],
      classesOptions: [],
      teamNameTypeOptions: [],
      // 启用状态字典
      isUseOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workshopId: null,
        classesType: null
      },
      // 表单参数
      form: {},
      areaConfigForm: {
        groupId : null,
        workshopId: null,
        classesType: null
      },
      shiftsPlanForm: {
        groupId : null,
        workshopId: null,
        classesType: null,
        beginDate: null,
        beginClasses: null,
        beginClassesName: null,
        classesBeginTime: null,
        classesEndTime: null,
        shiftDays: null,
        shiftsPlanList:[]
      },
      shiftsPlanList: [],
      // 表单校验
      rules: {
        groupName: [
          { required: true, message: "轮班组名称不能为空", trigger: "blur" },
          { max: 100, message: "轮班组名称最多100个字符", trigger: "blur" }
        ],
        workshopId: [
          { required: true, message: "所属车间不能为空", trigger: "blur" }
        ],
        classesType: [
          { required: true, message: "倒班类型不能为空", trigger: "blur" }
        ],
        isUse: [
          { required: true, message: "启用状态不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      },

      shiftsPlanRules: {
        beginDate: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        beginClasses: [
          { required: true, message: "开始班次不能为空", trigger: "change" }
        ],
        shiftDays: [
          { required: true, message: "轮班天数不能为空", trigger: "blur" }
        ],
      },

    };
  },
  created() {
    this.getList();
    this.getWorkshopList();
    this.getDictsBatch("class_type,is_use,team_name_type").then(response => {
      this.classesTypeOptions = response.data.class_type;
      this.isUseOptions = response.data.is_use;
      this.teamNameTypeOptions = response.data.team_name_type;
    });
  },
  methods: {

    getWorkshopList(){
      listModeltree({'type':'pm_model_workshop','isUse':0}).then(response => {
        this.workshopList = response.result;
      });
    },

    changeWorkshop(workshopId){
      let workshop = this.workshopList.find((item) => {
        return item.id == workshopId
      })
      this.form.workshopName = workshop.modelName
    },
    /** 查询轮班组列表 */
    getList() {
      this.loading = true;
      listShiftsGroup(this.queryParams).then(response => {
        this.shiftsGroupList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 倒班类型字典翻译
    classesTypeFormat(row, column) {
      return this.selectDictLabel(this.classesTypeOptions, row.classesType);
    },
    // 启用状态字典翻译
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
        groupName: null,
        workshopId: null,
        workshopName: null,
        classesType: null,
        orderNum: 0,
        isUse: 0,
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
      this.areaList = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加轮班组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id
      getShiftsGroup(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改轮班组";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateShiftsGroup(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShiftsGroup(this.form).then(response => {
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
      this.$confirm('是否确认删除轮班组为"' + row.groupName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delShiftsGroup(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    handleAreaConfig(row){
      this.openAreaConfig = true;
      this.areaConfigForm.groupId = row.id;
      this.areaConfigForm.workshopId = row.workshopId;
      this.areaConfigForm.classesType = row.classesType;

      getAreaSelectList({"workshopId":row.workshopId,"groupId":row.id}).then(response => {
        this.areaSelectList = response.result;
        getAreaAllocationList(row.id).then(response => {
          let areaList = response.result;
          if(areaList !=null && areaList.length>0){
            this.areaSelectList.forEach(row => {
              if(areaList.includes(row.id)){
                this.$nextTick( ()=> {
                  this.$refs.multipleTable.toggleRowSelection(row, true);
                })
              }
            });
          }
        });
      });

    },
    submitAreaConfig(){
      addShiftsArea({"groupId":this.areaConfigForm.groupId,"areaIds":this.areaList}).then(response => {
        this.msgSuccess("配置成功");
        this.openAreaConfig = false;
      });
    },
    cancelAreaConfig(){
      this.openAreaConfig = false;
      this.areaSelectList = [];
      this.areaSelectList = [];
    },
    handleShiftsPlan(row){
      this.openShiftPlan = true;
      this.resetForm("shiftsPlanForm");
      this.shiftsPlanForm.groupId = row.id;
      this.shiftsPlanForm.workshopId = row.workshopId;
      this.shiftsPlanForm.classesType = row.classesType;
      this.shiftsPlanList = []
      selectListClasses({"classesType":row.classesType}).then(response => {
        this.classesOptions = response.result;
      });
    },
    changeClasses(classesId){
      let classes = this.classesOptions.find((item) => {
        return item.id == classesId
      })
      this.shiftsPlanForm.classesName = classes.classesName;
      this.shiftsPlanForm.classesBeginTime = classes.workTime;
      this.shiftsPlanForm.classesEndTime = classes.closingTime;
    },
    handleShiftsPlanQuery(){
      this.shiftsPlanList = []
      this.shiftsPlanForm.shiftsPlanList = null
      this.$refs["shiftsPlanForm"].validate(valid => {
        if (valid) {
          getShiftsPlanQuery(this.shiftsPlanForm).then(response => {
            this.shiftsPlanList = response.result;
          });
        }
      });
    },
    submitShiftsPlan(){
      this.$refs["shiftsPlanForm"].validate(valid => {
        if (valid) {
          for (const item of this.shiftsPlanList){
              if(item.teamNameType == null){
                this.msgError("配置失败，班组不能为空");
                return
              }else{
                item.teamName = this.selectDictLabel(this.teamNameTypeOptions, item.teamNameType);
              }
          }
          this.shiftsPlanForm.shiftsPlanList = this.shiftsPlanList
          addShiftsPlan(this.shiftsPlanForm).then(response => {
            this.msgSuccess("配置成功");
            this.openShiftPlan = false;
          })
        }
      });
    },
    cancelShiftsPlan(){
      this.openShiftPlan = false;
    },
  }
};
</script>
