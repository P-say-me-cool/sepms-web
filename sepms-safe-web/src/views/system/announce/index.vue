<template>
  <div class="app-container ">
    <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" ref="queryForm"  class="allinput wzt_form" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="通知类型:" prop="noticeTitle">
          <el-select v-model="queryParams.groupType">
            <el-option
            v-for="(item,key) in notice_type"
            :key="key"
            :label="item.dictLabel"
            :value="item.dictValue"
             size="mini"
            >
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="通知人员:" prop="createBy">
        <el-input
          v-model="queryParams.notifyUsers"
          placeholder="请输入通知人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
  <div  class="formQuery form_content_pagination">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:notice:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:notice:edit']"
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
          v-hasPermi="['system:notice:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="noticeList"  @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="通知组名称"
        align="center"
        prop="groupName"
        width="200"
      />
      <el-table-column
        label="通知类型"
        align="center"
        prop="groupType"
        :formatter="typeFormat"
      />
      <el-table-column
        label="通知组成员"
        align="center"
        prop="notifyUsers"
      />
      <el-table-column label="显示顺序" align="center" prop="showOrder" />
      <el-table-column label="启用" align="center" prop="open" >
        <template slot-scope="scope">
          <span v-if="scope.row.open == 1">是</span>
          <span v-if="scope.row.open == 2">否</span>
        </template>
      </el-table-column>

      <el-table-column label="创建人
      " align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            {{scope.row.createUser}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template slot-scope="scope">
        <span>{{scope.row.createTime}}</span>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
                  <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-receiving"
                  @click="handleUpdates(scope.row)"
                  v-hasPermi="['system:notice:edit']"
                >  范围</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-user-solid"
                  @click="handleShow(scope.row)"
                  v-hasPermi="['system:notice:remove']"
                >人员</el-button>

        </template>
      </el-table-column>

    </el-table>
    <pagination
          v-show="totals>0"
          :total="totals"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          style="margin-top:20px;height:40px"
        />


    <el-drawer
     title="通知组人员配置"
     :append-to-body="true"
     :visible.sync="innerDrawer">

        <el-row  style="margin:0 20px">
              <el-col :span="24">
              <el-col :span="1.5">
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="popleAdd"
                    v-hasPermi="['system:notice:add']"
                    style="margin-bottom:14px"

                  >增加人员</el-button>
                </el-col>
                    <el-table :data="userListTree" style="max-height:80vh;overflow-y:auto;" v-loading="loadingod">
                          <el-table-column label="序号" align="center" prop="sums" />
                          <el-table-column label="姓名" align="center" prop="nickName" />
                          <el-table-column label="部门" align="center" prop="deptName" />
                          <el-table-column label="手机号" align="center" prop="phonenumber" />
                          <el-table-column label="操作" align="center" prop="showOrder" >
                            <template slot-scope="scope">
                                  <el-button
                                  type="text"
                                  plain
                                  icon="el-icon-delete"
                                  size="mini"
                                  @click="popleDel(scope.row)"
                                >删除</el-button>
                            </template>


                          </el-table-column>
                    </el-table>
              </el-col>
          </el-row>


   </el-drawer>




    </div>

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
          <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-if="title=='新增通知组' || title == '修改通知组'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="通知组名称" prop="groupName">
                  <el-input style="width:200px" v-model="form.groupName" placeholder="请输入通知组名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否启用" prop="open">
                  <el-select v-model="form.open" style="width:200px"  placeholder="请选择" >
                      <el-option label="是" value="1"></el-option>
                      <el-option label="否" value="2"></el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="通知类型" prop="groupType">
                  <el-select v-model="form.groupType" style="width:200px"  placeholder="请选择通知类型">
                      <el-option
                        v-for="(item,key) in notice_type"
                        :key="key"
                        :label="item.dictLabel"
                        :value="parseInt(item.dictValue)"
                        >
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="显示顺序" prop="showOrder">
                  <el-input style="width:200px" v-model="form.showOrder" placeholder="请输入显示顺序" />
                </el-form-item>
              </el-col>
              <el-col :span="12"  v-if="form.groupType == 2">
                <el-form-item label="报警级别" prop="alarmLevels">
                  <el-select v-model="form.alarmLevels" style="width:200px" multiple collapse-tags placeholder="请选择报警级别">
                      <el-option
                        v-for="(item,key) in indicators_level"
                        :key="key"
                        :label="item.dictLabel"
                        :value="parseInt(item.dictValue)"
                        size="mini"
                        >
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12"  v-if="form.groupType == 2 || !form.groupType">
                <el-form-item label="报警类型" prop="alarmTypes">
                  <el-select v-model="form.alarmTypes" style="width:200px" multiple collapse-tags placeholder="请选择报警类型">
                      <el-option
                        v-for="(item,key) in indicators_type"
                        :key="key"
                        :label="item.dictLabel"
                        :value="parseInt(item.dictValue)"
                        size="mini"
                        >
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.groupType == 1">
                <el-form-item label="配煤通知类型" prop="notifyType">
                  <el-select v-model="form.notifyType" style="width:200px"  placeholder="请选择报警类型">
                      <el-option
                        v-for="(item,key) in blend_list_notice_type"
                        :key="key"
                        :label="item.dictLabel"
                        :value="parseInt(item.dictValue)"
                        size="mini"
                        >
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
    <el-dialog title="告警范围" :visible.sync="userIn" width="780px" append-to-body>
            <el-tree
              style="max-height:500px;overflow:auto"
              :data="datas"
              show-checkbox
              :default-expand-all="expand"
              :default-checked-keys="dept"
              node-key="id"
              v-if="userIn"
              ref="tree"
              :props="defaultProps"
              @check-change="handleCheckChange"
              >
            </el-tree>
             <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitIn">确 定</el-button>
          <el-button @click="cancelIn">取 消</el-button>
        </div>
    </el-dialog>
    <el-dialog :title="popleTitle" :visible.sync="popleShow" width="920px" append-to-body>
    <el-form   class="mf10 el-tianjia" ref="queryForm" :inline="true"  label-width="68px">
      <el-form-item label="用户名称:">
            <el-input
                      v-model="queryParam.nickName"
                      placeholder="请输入用户名称"
                      clearable
                      size="small"
                />

      </el-form-item>
      <el-form-item style="margin-left:20px">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuerys">搜索</el-button>
      </el-form-item>
    </el-form>
         <el-table v-loading="loadingods" :data="userList" @selection-change="handleSelectionChanges">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="用户名" align="center"   key="sums" prop="userName" v-if="columns[0].visible" />
          <el-table-column label="部门" align="center" key="deptName" prop="deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center"  key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />

        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParam.pageNum"
          :limit.sync="queryParam.pageSize"
          @pagination="popleAdds"
          style="margin-top:20px;height:40px"
        />
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitUser">确 定</el-button>
          <el-button @click="cancelUser">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  >>>.el-input__inner .el-input__suffix{
    top:6px !important;

  }
</style>
<script>
import { listUser} from "@/api/system/user";
import { listNotice, getNotice, delNotice, addNotice, updateNotice, exportNotice } from "@/api/system/notice";
import { listAlarmGroup,listAlarmAlarmadd,listAlarmUpdate,updateUsers,updateDepts,alarmgroupIn,alarmgroupDel } from "@/api/system/announce";
import Editor from '@/components/Editor';
import { getModelDict } from '@/api/model/modeltree'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { treeselect } from "@/api/system/dept";
import { number } from 'echarts';

export default {
  name: "Notice",
  components: {
    Editor,
    Treeselect
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "modelName"
      },
      annouceIds:[],
      modeltreeOptions: [ ],
      userListTree:[],
      // 人员列表
      userList:[],
      // 抽屉开关
      innerDrawer:false,
      // 添加人员的标题
      popleTitle:'增加通知组人员',
      // 添加人员的弹框的显示与否
      popleShow:false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      loadingods:false,
      loadingod:false,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupName: undefined,
        createBy: undefined,
        status: undefined
      },
      dept:[],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      expand:false,
      // 表单校验
      rules: {
        groupName: [
          { required: true, message: "通知组名称不能为空", trigger: "blur" }
        ],
        groupType: [
          { required: true, message: "通知类型不能为空", trigger: "blur" }
        ],
        open: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
        showOrder: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" }
        ],
        alarmLevels: [
          { required: true, message: "报警级别不能为空", trigger: "blur" }
        ],
        alarmTypes: [
          { required: true, message: "报警类型不能为空", trigger: "blur" }
        ],
        notifyType:[
           { required: true, message: "配煤通知类型不能为空", trigger: "blur" }
        ],
      },
      notice_type:[],
      blend_list_notice_type:[],
      indicators_level:[],
      indicators_type:[],
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      userids:[],
      userIn:false,
      datas:[],
      totals:0,
    };
  },
  created() {
    // treeselect().then(response => {
    //   // children: "children",
    //   //   label: "label"
    //     // this.modeltreeOptions = this.handleTree(response.result, "children");
    // });
      getModelDict({"level":4,"type":"pm_model_workshop","iStree":true}).then(res => {

           this.datas = this.handleTree(res.result, "id", "parentId");

      })
    this.getList();
    this.getDicts("sys_notice_status").then(response => {

          this.statusOptions = response.data;

    });
    this.getDicts("sys_notice_type").then(response => {
      this.typeOptions = response.data;
    });

    // 查找字典中的字段
    this.getDictsBatch("notice_type,blend_list_notice_type,indicators_level,indicators_type").then((res)=>{
      this.notice_type = res.data.notice_type;
      this.blend_list_notice_type = res.data.blend_list_notice_type;
      this.indicators_level = res.data.indicators_level;
      this.indicators_type = res.data.indicators_type;
    })
  },
  methods: {
    handleUpdate(){
        console.log();
        alarmgroupIn(this.ids).then((res) => {
            console.log(res);
            this.open = true
            this.title = '修改通知组'
            this.form = res.result
            this.form.open = String(this.form.open)
        })
    },
    handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
    announceOk(){
      var arr = []
          console.log(this.userListTree);
        this.userListTree.forEach(item=>{
            var obj = {userId:item.userId,userName:item.nickName,phoneNum:item.phonenumber,dept:item.deptName}
            arr.push(obj)
        })
        var obn = {id:this.annouceIds,users:arr}
        console.log(obn);
        updateUsers(obn).then((res) => {
            this.$message.success("告警人员设置成功!");
            // this.innerDrawer = !this.innerDrawer
            this.getList()
        })
    },
     submitIn() {
       console.log(this.annouceIds);
        var obn = {id:this.annouceIds,depts:this.$refs.tree.getCheckedKeys()}

        updateDepts(obn).then((result) => {
          console.log(result);
          this.$message.success("告警范围设置成功!");
          this.userIn = !this.userIn
        })
      },
      cancelIn(){
          this.userIn = !this.userIn
      },
    announceNo(){
        this.innerDrawer = !this.innerDrawer
    },
    inputChange(){
      if(!this.queryParams.workshopId){
            this.queryParams.planDepts = ''
      }
    },
    changeTree1(node){
      console.log(node);
      this.queryParams.planDepts = node.ancestors + ',' + node.id;
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.modelName,
        children: node.children
      };
    },
    handleSelectionChanges(selection) {
      this.userids = selection
      console.log(selection);
    },
    submitUser(){
      var arr = [] 
      console.log(this.userids,this.userListTree);
      var arrs = this.userids.concat(this.userListTree)
      
            for(var i= 0;i<this.userids.length;i++){
                var repeat=false;
                for(var j=0;j<this.userListTree.length;j++){
                    if(this.userids[i].userId==this.userListTree[j].userId){
                        repeat=true;
                        break;
                    }
                }
                if(!repeat){
                    this.userListTree.push(this.userids[i]);
                }
            }
      console.log(this.userListTree);



      // for(var i = 0; i< this.userids.length ; i ++){
      //   for(var j = 0; j< this.userListTree.length ; j ++){
      //       console.log(this.userids[i].userId,this.userListTree[j].userId)


      //       if(this.userids[i].userId != this.userListTree[j].userId){
      //           // console.log(this.userids[i].userId,this.userListTree[j].userId)
      //           this.userListTree.push(this.userids[i])
      //             break;
      //       }
      //   }
        
      // }
      console.log(this.userListTree);
      this.userListTree = Array.from(new	Set(this.userListTree))
      // console.log(arr);
      // arr.forEach(item=>{
          
      //     this.userListTree.push(item)

      // })
      console.log(this.userListTree);

      var id = 0
      this.userListTree.forEach(item=>{
        item.sums =  ++ id
      })
      this.announceOk()
      this.popleShow = false
        
    },
    cancelUser(){
        this.popleShow = false
    },
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listAlarmGroup(this.queryParams).then(response => {
        this.noticeList = response.result;
        this.totals = response.total
        console.log(this.noticeList);
        this.loading = false;
      });
    },
    // 公告状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 公告状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.notice_type, row.groupType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: null,
        noticeTitle: null,
        noticeType: null,
        noticeContent: null,
        status: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleQuerys() {
      this.queryParam.pageNum = 1;
      this.loading = true
      listUser(this.addDateRange(this.queryParam, this.dateRange)).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
          var num = 0
           this.userList.forEach(item=>{
              item.sums = ++ num
          })
        })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
      console.log(selection);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增通知组";
    },
    /** 范围按钮操作 */
    handleUpdates(row) {
      this.$nextTick(()=>{
        this.$refs.tree.setCheckedKeys([]); 

      })
        this.userIn = true;
        this.annouceIds = row.id;
        alarmgroupIn(this.annouceIds).then((res) => {
          this.dept = res.result.depts
        })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            listAlarmUpdate(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            listAlarmAlarmadd(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 模板按钮操作 */
    handleShow(row) {
        this.userListTree = null
        console.log(row);
        this.innerDrawer = !this.innerDrawer
        this.loadingods = true
        this.annouceIds = row.id;
        console.log(this.annouceIds);
        alarmgroupIn(this.annouceIds).then((res) => {
          this.userListTree = res.result.users
          var num  = 0
          this.userListTree.forEach(element => {
            element.nickName = element.userName
            element.phonenumber = element.phoneNum
            element.deptName = element.dept
            element.sums = ++ num
          });
          this.loadingods = false
        })

        // this.
    },
    handleDelete(){
      console.log(this.ids);
      var obj = {
        ids:this.ids
      }
      alarmgroupDel(obj).then((res) => {
          console.log(res);
          if(res.message == '操作成功！'){
            this.msgSuccess("删除成功！");
            this.getList()
          }
      })
    },
    popleAdds(){
      this.loadingods = true;
      listUser(this.addDateRange(this.queryParam, this.dateRange)).then(response => {
            console.log(this.queryParam.pageNum);
          this.userList = response.rows;
          this.total = response.total;
          if(this.queryParam.pageNum == 1){
          var num  = 0
          this.userList.forEach(item=>{
              item.sums = ++ num
          })
          }else{
            var num  = (this.queryParam.pageNum - 1)*10
              this.userList.forEach(item=>{
                item.sums = ++ num
            })
          }
          this.loadingods = false;
        })
    },
    popleAddes(){
      this.loading = true;
      this.getList()
    },
    popleAdd(row){
          this.popleShow = !this.popleShow
          console.log(row);
          this.loadingods = true
          listUser(this.addDateRange(this.queryParam, this.dateRange)).then(response => {
          this.loadingods = false

          this.userList = response.rows;
          this.total = response.total;
          if(this.queryParam.pageNum == 1){
          var num  = 0
          this.userList.forEach(item=>{
              item.sums = ++ num
          })
          }else{
            var num  = (this.queryParam.pageNum - 1 )*10
              this.noticeList.forEach(item=>{
                item.sums = ++ num 
            })
          }
          this.loading = false;
        })
    },
    popleDel(row){
      var arr = []
      var id = 0
      this.userListTree.forEach(item=>{
        if(item.userId != row.userId){
          item.sums = ++ id
          arr.push(item)

        }
      })
      this.userListTree = arr
          console.log(row);
      this.announceOk()
    }
  }
};
</script>
