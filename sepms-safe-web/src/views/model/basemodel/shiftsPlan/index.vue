<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="6" :xs="24" >
        <div class="wzt_Treeform">
          <div  class="head-container"  style="padding-right:2px">
            <div>
              <div  style="height:calc(100vh - 120px);overflow:auto;">
                <el-tree
                  :data="modelTreeList"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="tree"
                  default-expand-all
                  @node-click="handleNodeClick"
                />
              </div></div></div></div>
      </el-col>
      <!--班组数据-->
      <el-col :span="18" :xs="24">
        <el-row :gutter="10"  class="mb8" style="padding-right:0;margin-left: -21px; margin-right: 10px;overflow:auto;">
          <div  id="demo" class="wzt_formQuery form_content_pagination">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
              <el-form-item>
                {{this.queryParams.groupName}}
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  style="width:198.5px"
                  v-model="queryParams.month"
                  type="month"
                  :clearable="false"
                  >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="primary" icon="el-icon-help" :disabled="shiftsPlanDisabled" size="mini" @click="handleShiftsPlan">排班</el-button>
                <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
              </el-form-item>
            </el-form>
            <el-calendar v-model="shiftsDate" v-loading="loading">
              <template
                slot="dateCell"
                slot-scope="{date, data}">
                <span>{{ data.day.split("-").slice(2).join("-") }}</span>
                <div v-for="(item, index) in shiftsPlanList" :key="index">
                  <div v-if="item.shiftsDate.split('-').join('-') == data.day.split('-').join('-')">
                    <div v-for="(team, index) in item.shiftsPlanList" :key="index">
                      {{team.classesName}}:{{team.teamName}}
                    </div>
                  </div>
                </div>
              </template>
            </el-calendar>
          </div>
        </el-row>
      </el-col>
    </el-row>


    <!-- 界区配置 -->
    <el-dialog title="值班人员列表" :visible.sync="openShiftsPerson" width="600px" append-to-body>
      <el-table :data="openShiftsPersonList" style="height: 300px;overflow: auto" >
        <el-table-column label="班组名" align="center" prop="teamName" width="80px"/>
        <el-table-column label="人员列表" align="center" prop="personList" :formatter="personListFormat" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelShiftsPerson" v-preventReClick>关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getShiftsPlanByGroupId,editsShiftsPlan,getShiftsPerson } from "@/api/model/shiftsPlan";
import { listShiftsGroup } from "@/api/model/shiftsGroup";
import { teamListModeltree } from '../../../../api/model/modeltree'

export default {
  name: "ShiftsPlan",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      shiftsPlanDisabled: false,
      openShiftsPerson: false,
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
      modelTreeList:[],
      shiftsPlanList:[],
      openShiftsPersonList:[],
      shiftsDate: new Date(),
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      defaultProps: {
        children: "children",
        label: "modelName",
      },
      // 查询参数
      queryParams: {
        groupId:null,
        groupName:'',
        month:new Date()
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getTreeselect();
  },
  watch: {
    shiftsDate(newValue, oldValue){
      this.queryParams.month = newValue
      if(this.parseTime(newValue,'{y}-{m}') != this.parseTime(oldValue,'{y}-{m}')){
        this.getShiftsPlanList()
      }else{
        this.shiftsPerson(this.parseTime(newValue,'{y}-{m}-{d}'))
      }
    }
  },
  methods: {
    async getTreeselect() {
      let workshopList =[]
      await teamListModeltree().then((response) => {
        workshopList = response.result;
      });
      await listShiftsGroup({"isUse":0}).then((response) => {
        if(response.result!=null && response.result.length>0){
          this.queryParams.groupId = response.result[0].id
          this.queryParams.groupName = response.result[0].groupName
        }
        for (const group of response.result){
          workshopList.push({"id":group.id,"parentId":group.workshopId,"modelName":group.groupName,"type":"group"})
        }
      });
      this.modelTreeList = this.handleTree(workshopList, "id", "parentId");
      await this.getShiftsPlanList()
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(node){
      this.queryParams.groupId = null
      if("group"==node.type){
        this.queryParams.groupId = node.id
        this.queryParams.groupName = node.modelName
          this.getShiftsPlanList()
      }
    },
    handleQuery(){
      this.shiftsDate = this.queryParams.month
      this.getShiftsPlanList()
    },
    getShiftsPlanList(){
      this.loading = true
      if(this.queryParams.groupId == null){
        this.msgError("请先选择轮班组");
        this.loading = false
        return
      }
      let month = this.parseTime(this.shiftsDate,'{y}-{m}');
      getShiftsPlanByGroupId({"groupId":this.queryParams.groupId,"month":month}).then((response) => {
        this.shiftsPlanList = response.result;
        this.loading = false
      });
    },
    handleShiftsPlan(){
      this.loading = true
      this.shiftsPlanDisabled = true;
      let month = this.parseTime(this.shiftsDate,'{y}-{m}');
      editsShiftsPlan({"groupId":this.queryParams.groupId,"month":month}).then((response) => {
        this.msgSuccess("排班成功");
        this.getShiftsPlanList();
        this.loading = false
        this.shiftsPlanDisabled = false;
      }).catch(()=>{
        this.shiftsPlanDisabled = false;
        this.loading = false
      });
    },
    shiftsPerson(day){
      this.openShiftsPerson = true
      getShiftsPerson({"groupId":this.queryParams.groupId,"day":day}).then((response) => {
        this.openShiftsPersonList = response.result
        console.log(response.result)
      })
    },
    personListFormat(row, column){
      return row.personList == null ? null :row.personList.join(',')
    },
    cancelShiftsPerson(){
      this.openShiftsPerson = false
      this.openShiftsPersonList = []
    },
    /** 导出按钮操作 */
    handleExport() {
      let month = this.parseTime(this.shiftsDate,'{y}-{m}');
      this.download('model/shiftsPlan/export', {"groupId":this.queryParams.groupId,"month":month}, `model_shiftsPlan.xlsx`)
    }
  }
};
</script>
<style scoped>
  /*>>> .el-calendar__header {
    display: none;
  }*/
  >>> .el-calendar-table .el-calendar-day {
    height: 180px;
  }
</style>
