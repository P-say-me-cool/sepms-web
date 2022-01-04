<template>
  <div class="app-container">
    <el-row :gutter="20">

      <el-col :span="5" :xs="24">
        <div class="wzt_Treeform">
          <div class="head-container" style="padding-right:2px">
            <div style="height:calc(100vh - 120px);overflow:auto;">
              <el-tree
                :data="workshopList"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree"
                default-expand-all

                @node-click="handleNodeClick"
              >
          <span class="custom-tree-node" slot-scope="{ node, data }">

              <span>{{ node.label}}</span>
          </span>
              </el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="19" :xs="24" style="padding-right:0;margin-left: -21px; margin-right: 10px;">
        <div class="wzt_formQuery form_content_pagination" >
          <el-form class="allinput " :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
               >
            <el-form-item label="位号:" prop="serialNumber">
              <el-input
                v-model="queryParams.serialNumber"
                placeholder="请输入位号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="位号名称:" prop="tagName">
              <el-input
                v-model="queryParams.tagName"
                placeholder="请输入位号名称"
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
          <el-table class="wztel-table" style="height:68vh;overflow:auto" v-loading="loading" :data="tagnumberList">
            <el-table-column label="位号" align="center" prop="serialNumber"/>
            <el-table-column label="位号名称" align="center" prop="tagName"/>
            <el-table-column label="位号描述" align="center" prop="tagDescribe"/>
            <el-table-column label="位号类型" align="center" prop="tagType" :formatter="tagTypeFormat"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-s-operation"
                  @click="handleTagNumberHis(scope.row)"
                >历史值
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-s-data"
                  @click="handleChar(scope.row)"
                >趋势图
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </el-col>

    </el-row>

    <!-- 位号历史值 -->
    <el-dialog title="位号历史值" :visible.sync="hisValueOpen" width="1200px" append-to-body>
      <div class="wzt_formQuery form_content_pagination">
        <el-form class="allinput" :model="hisQueryParams" ref="hisQueryForm" :rules="hisQueryRules" :inline="true"
                 label-width="68px">
          <el-row>
            <el-col>
              <el-form-item label="时间" prop="dateTime">
                <el-date-picker clearable size="small"
                                v-model="hisQueryParams.dateTime"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="取值间隔(秒)" prop="span" label-width="110px">
                <el-input
                  v-model="hisQueryParams.span"
                  clearable
                  size="small"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleHisQuery">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table class="wztel-table" v-loading="hisLoading" :data="tagNumberHisValueList">
          <el-table-column label="位号值时间" align="center" prop="timespan"/>
          <el-table-column label="位号值" align="center" prop="value"/>
        </el-table>
        <pagination
          v-show="hisValuetotal > 0"
          :total="hisValuetotal"
          :page.sync="hisQueryParams.pageNum"
          :limit.sync="hisQueryParams.pageSize"
          @pagination="getHisValueList"
        />
      </div>
    </el-dialog>


    <!-- 位号趋势图 -->
    <el-dialog title="位号趋势图" :visible.sync="charOpen" width="1200px" append-to-body>
      <div class="wzt_formQuery form_content_pagination">
        <el-form class="allinput" :model="hisQueryParams" ref="hisQueryForm" :rules="hisQueryRules" :inline="true"
                 label-width="68px">
          <el-row>
            <el-col>
              <el-form-item label="时间" prop="dateTime">
                <el-date-picker clearable size="small"
                                v-model="hisQueryParams.dateTime"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="取值间隔(秒)" prop="span" label-width="110px">
                <el-input
                  v-model="hisQueryParams.span"
                  clearable
                  size="small"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleCharQuery">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!--Echar图-->
        <div id="myChart" style="width: 1200px;height:600px;"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listWorkshop, getWorkshop, delWorkshop, addWorkshop, updateWorkshop } from '@/api/model/workshop'
  import { listTagnumber, getHisValueByTagNumber, getCharByTagNumber } from '@/api/model/tagnumber'
  import Treeselect from '@riophae/vue-treeselect'
  import Tagnumber from '../tagnumber/index'

  export default {
    name: 'Workshop',
    components: {
      Tagnumber,
      Treeselect
    },
    data() {
      return {
        tagTypeOptions: [],
        id: null,
        parentId: 0,
        // 遮罩层
        loading: true,
        hisLoading: false,
        hisValueOpen: false,
        charOpen: false,
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
        hisValuetotal: 0,
        // 位号信息表格数据
        tagnumberList: [],
        tagnumberTree: [],
        tagName: undefined,
        // 车间表格数据
        workshopList: [],
        defaultProps: {
          children: 'children',
          label: 'workShopName'
        },
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          tagName: null,
          serialNumber: null,
          workShopId: null
        },
        hisQueryParams: {
          pageNum: 1,
          pageSize: 10,
          dateTime: null,
          tagNumber: null,
          beginTime: null,
          endTime: null,
          span: 60
        },
        hisQueryForm: {},
        tagNumberHisValueList: [],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          id: [
            { required: true, message: '主键id不能为空', trigger: 'blur' }
          ]
        },
        hisQueryRules: {
          dateTime: [
            { required: true, message: '时间不能为空', trigger: 'blur' }
          ],
          span: [
            { required: true, message: '取值间隔不能为空', trigger: 'blur' },
            { pattern: /^[0-9]*[1-9][0-9]*$/, message: '取值间隔为正整数', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getDicts('tag_type').then((response) => {
        this.tagTypeOptions = response.data
      })
      this.getList()
      this.getTreeList()
    },
    methods: {
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.workShopId = data.id
        this.getList()
      },
      /** 查询位号列表 */
      getList() {
        this.loading = true
        listTagnumber(this.queryParams).then(response => {
          this.tagnumberList = response.result
          this.total = response.total
          this.loading = false
        })
      },
      // 位号类型字典翻译
      tagTypeFormat(row, column) {
        return this.selectDictLabel(this.tagTypeOptions, row.tagType)
      },
      /** 查询车间信息列表*/
      getTreeList() {
        this.loading = true
        listWorkshop().then(response => {
          this.workshopList = this.handleTree(
            response.result,
            'id',
            'parentId'
          )
          this.loading = false
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      handleTagNumberHis(row) {
        this.resetForm('hisQueryForm')
        this.tagNumberHisValueList = null
        this.hisValuetotal = 0
        this.hisValueOpen = true
        this.hisQueryParams.dateTime = null
        this.hisQueryParams.tagNumber = row.serialNumber
      },

      handleHisQuery() {
        this.hisQueryParams.pageNum = 1
        this.getHisValueList()
      },
      getHisValueList() {
        this.$refs['hisQueryForm'].validate(valid => {
          if (valid) {
            this.hisLoading = true
            this.hisQueryParams.beginTime = this.hisQueryParams.dateTime[0]
            this.hisQueryParams.endTime = this.hisQueryParams.dateTime[1]
            let second= this.differenceSecond(this.hisQueryParams.beginTime,this.hisQueryParams.endTime);
            if(second > 172800){
              this.msgError("请查询两天以内的数据");
              this.hisLoading = false
              return
            }
            getHisValueByTagNumber(this.hisQueryParams).then(response => {
              this.tagNumberHisValueList = response.result
              this.hisValuetotal = response.total
              this.hisLoading = false
            })
          }
        })
      },

      handleChar(row) {
        this.resetForm('hisQueryForm')
        if(document.getElementById('myChart')){
          this.echarts.init(document.getElementById('myChart')).dispose();
        }
        this.charOpen = true
        this.hisQueryParams.dateTime = null
        this.hisQueryParams.tagNumber = row.serialNumber
      },

      handleCharQuery() {
        this.$refs['hisQueryForm'].validate(valid => {
          if (valid) {
            this.hisQueryParams.beginTime = this.hisQueryParams.dateTime[0]
            this.hisQueryParams.endTime = this.hisQueryParams.dateTime[1]
            let second= this.differenceSecond(this.hisQueryParams.beginTime,this.hisQueryParams.endTime);
            if(second > 172800){
              this.msgError("请查询两天以内的数据");
              return
            }
            getCharByTagNumber(this.hisQueryParams).then(response => {
              // 基于准备好的dom，初始化echarts实例
              let myChart = this.echarts.init(document.getElementById('myChart'))
              // 绘制图表
              myChart.setOption({
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross'
                  }
                },
                xAxis: {
                  data: response.result.XDATA ? response.result.XDATA:[]
                },
                yAxis: {},
                series: [{
                  name: '位号值',
                  type: 'line',
                  symbolSize:8,
                  data: response.result.YDATA ? response.result.YDATA:[]
                }]
              })
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped >
        .el-table::before{
            height:0 !important;

      }
</style>
