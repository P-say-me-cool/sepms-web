<template>
  <div class="app-container ">

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

        <el-row :gutter="10"  class="mb8" style="padding-right:0;margin-left: -21px; margin-right: 10px;height:calc(100vh - 66px);overflow:auto;">

          <div  id="demo" class="wzt_formQuery form_content_pagination">
          <el-col class="mb20" :span="24" v-if="showBtn">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['model:teamtype:add']"
              >新增</el-button
            >
          </el-col>
            <el-table style="height:75vh;overflow:auto;" class="wztel-table" v-loading="loading" :data="teamtypeList">
              <el-table-column
                label="车间名称"
                align="center"
                prop="workshopName"
              />
              <el-table-column
                label="班组名称"
                align="center"
                prop="teamName"
              />
              <el-table-column
                label="岗位名称"
                align="center"
                prop="postName"
              />
              <el-table-column
                label="班组类型"
                align="center"
                prop="teamType"
                :formatter="classTypeFormat"
              />
              <el-table-column label="备注" align="center" prop="remark" />
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                width="200px"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['model:teamtype:edit']"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleShow(scope.row)"
                    v-hasPermi="['model:teamtype:edit']"
                  >人员</el-button
                  >
                  <el-button
                  class="delbtn"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['model:teamtype:remove']"
                    >删除</el-button
                  >
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
        </el-row>

      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form  ref="form" :model="form"  :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="班组名称:" prop="nameType" >
              <el-select v-model="form.nameType" style="width:217px" @change="selectTeamName" placeholder="请选择班组名称">
                <el-option
                  v-for="dict in nameTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位名称:" prop="postName">
              <el-select  v-model="form.postName" style="width:217px" filterable @change="pickPostId" placeholder="请选择岗位">
                <el-option
                  v-for="dict in postList"
                  :key="dict.postName"
                  :label="dict.postName"
                  :value="dict.postName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班组类型:" prop="teamType">
              <el-select v-model="form.teamType" style="width:217px" placeholder="请选择班组类型">
                <el-option
                  v-for="dict in classTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--要添加的人员列表-->
    <el-dialog :title="personTitle" :visible.sync="personShow" width="920px" append-to-body>
      <el-form  :model="queryParam" class="mf10 el-tianjia" ref="queryForm" :inline="true"  label-width="68px">
        <el-form-item label="用户名称:" prop="names">
          <el-input
            v-model="queryParam.names"
            placeholder="请输入用户名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryParam.deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item style="margin-left:20px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuerys">搜索</el-button>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="resetParam">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="addLoading" :data="ableUserList" ref="tableRef" :row-key="getRowKeys" style="height: 500px;overflow: auto" @selection-change="handleSelectionChanges">
        <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
        <el-table-column label="用户名称" align="center" key="userName" prop="userName"/>
        <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"/>
        <el-table-column label="部门" align="center" key="deptName" prop="deptName"/>
        <el-table-column label="手机号" align="center"  key="phoneNumber" prop="phoneNumber" />
      </el-table>
      <pagination
        v-show="userTotal > 0"
        :total="userTotal"
        :page.sync="queryParam.pageNo"
        :limit.sync="queryParam.pageSize"
        @pagination="getAbleUsers"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUser">确 定</el-button>
        <el-button @click="cancelUser">取 消</el-button>
      </div>
    </el-dialog>

    <!--抽屉-->
    <el-drawer
      title="班组人员"
      :append-to-body="true"
      size="40%"
      :visible.sync="innerDrawer">

      <el-row  style="margin:0 20px">
        <el-col :span="24">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="addNeedPerson"
              style="margin-bottom:14px"
            >增加人员</el-button>
          </el-col>
          <el-table :data="userList" style="max-height:650px;overflow-y:auto" v-loading="loadingod">
            <el-table-column label="名称" align="center" prop="userName" />
            <el-table-column label="姓名" align="center" prop="nickName" />
            <el-table-column label="部门" align="center" prop="deptName" />
            <el-table-column label="手机号" align="center" prop="phoneNumber" />
            <el-table-column label="操作" align="center" prop="showOrder" >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  plain
                  icon="el-icon-delete"
                  size="mini"
                  @click="deletePerson(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import {
  listAll
} from "@/api/system/user";
import {
  selectListPost
} from "@/api/system/post";
import {
  listTeamtype,
  addTeamtype,
  delTeamtype,
  getTeamtype,
  selectUserList,
  deletePmTeamPersonByPersonId,
  getPersonByTeamId,
  getAbleUser,
  addPerson
} from "@/api/model/teamtype";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {updateTeamtype} from "../../../../api/model/teamtype";
import {listModeltree, teamListModeltree} from "../../../../api/model/modeltree";
export default {
  name: "User",
  components: { Treeselect },
  data() {
    return {
      teamtypeList: [],
      modelTreeList:[],
      treeId:null,
      // 遮罩层
      loading: true,
      innerDrawer:false,
      //人员
      personShow:false,
      // 选中数组
      ids: [],
      personTitle:'人员列表',
      loadingod:false,
      addLoading:false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      showBtn:false,
      // 总条数
      total: 0,
      userTotal: 0,
      ss:[],
      // 用户表格数据
      userList: [],
      ableUserList: [],
      postList: [],
      workShopId:null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      selectedUserList:[],
      //班次类型
      classTypeOptions:[],
      nameTypeOptions:[],
      shiftModeOptions:[],
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 角色选项
      roleOptions: [],
      defaultProps: {
        children: "children",
        label: "modelName",
      },
      personnelId:[],
      personnelList:[],
      treelist:0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workshopId:null,
        workshopName:null,
      },
      //要分配用户参数
      queryParam: {
        deptName:null,
        names: null,
        pageNo: 1,
        pageSize: 10,
      },
      formData: {},
      // 表单参数
      form: {},
      rules: {
        postName: [
          {required: true, message: "岗位名称不能为空", trigger: "blur"},
          {max:20, message: "岗位名称超出最大长度20", trigger: "blur"}
        ],
        teamType: [
          {required: true, message: "班组类型不能为空", trigger: "blur"}
        ],
        remark: [
          {max: 200, message: "备注最多200个字符", trigger: "blur"}
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
        },

  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getPostList();
    this.getDictsBatch("class_type,team_name_type").then(response => {
      this.classTypeOptions = response.data.class_type;
      this.nameTypeOptions = response.data.team_name_type;
    });
  },
  methods: {
    /** 查询班组类别列表 */
    getList() {
      this.loading = true;
      listTeamtype(this.queryParams).then((response) => {
        this.teamtypeList = response.result;
        if(response.total>0 && response.result.length == 0&& this.queryParams.pageNum >1){
          this.queryParams.pageNum = this.queryParams.pageNum - 1;
          this.getList();
        }else{
          this.total = response.total;
          this.loading = false;
        }
      });
    },

    //下拉框传值
    pickPostId(e) {
      this.postList.map((item, i) => {
        if (item.postName == e) {
          this.form.postId = item.postId; //传值
          this.form.postName = item.postName;//传值
        }
      });
    },

    selectTeamName(nameType){
      this.form.teamName = this.selectDictLabel(this.nameTypeOptions, nameType);
    },
    /** 查询用户列表 */
    listUsers(teamId) {
      selectUserList({"teamId":teamId}).then((response) => {
        this.userList = response.result
      });
    },
    getRowKeys(row) {
      return row.personId
    },
    getPostList(){
      selectListPost({status:'0'}).then((response) => {
        this.postList =  response.rows;
      });
    },
    // 字典翻译
    classTypeFormat(row, column) {
      return this.selectDictLabel(this.classTypeOptions, row.teamType);
    },
    // 字典翻译
    shiftModeFormat(row, column) {
      return this.selectDictLabel(this.shiftModeOptions, row.shiftMode);
    },

    /** 查询部门下拉树结构 */
    getTreeselect() {
      teamListModeltree().then((response) => {
        this.modelTreeList = this.handleTree(response.result, "id", "parentId");
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    addNeedPerson() {
      this.personShow = true;
      this.addLoading = true;
      this.resetParam();
      this.clearSelect();
    },

    getAbleUsers() {
      getAbleUser(this.queryParam).then(response => {
        this.ableUserList = response.result;
        this.userTotal = response.total;
        this.addLoading = false;
      })
    },

    clearSelect(){
      this.$nextTick(()=>{
        this.$refs['tableRef'].clearSelection();
      })
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (data.type == "pm_model_workshop") {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
      this.queryParams.workshopId = data.id;
      this.queryParams.workshopName = data.modelName;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        //班组名称
        nameType: null,
        teamName: null,
        postName: null,
        //人员数
        personCount: 0,
        personIds: [],
        // 轮班天数
        shiftDays: null,
        //轮班模式
        shiftMode: null,
        //班组类型
        teamType: null,
        //备注信息
        remark: null,
        workshopId:this.queryParams.workshopId,
        workshopName:this.queryParams.workshopName,
      };
      this.resetForm("form");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    changePerson(personIds){
      if(personIds){
        this.form.personCount = personIds.length
      }
    },
    handleSelectionChanges(selection) {
      this.selectedUserList = selection;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加班组管理";
    },
    cancelUser(){
      this.personShow = false;
    },
    //姓名搜索
    handleQuerys() {
      this.addLoading = true;
      this.getAbleUsers();
    },

    resetParam() {
      this.resetForm("queryForm");
      this.getAbleUsers();
    },

    /** 人员按钮操作 */
    handleShow(row) {
      this.innerDrawer = !this.innerDrawer
      this.queryParams.id = row.id
      getPersonByTeamId(row.id).then((response) => {
        this.userList = response.result
      });
    },

    /** 删除人员*/
    deletePerson(row) {
      deletePmTeamPersonByPersonId(row.personId).then((response=>{
        this.loadingod = false
        getPersonByTeamId(row.teamId).then((response) => {
          this.userList = response.result
        });
      }))
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      const  teamName= row.teamName;
      this.$confirm(
        '是否确认删除班组为"' + teamName +   '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTeamtype(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    //添加人员确定按钮操作
    submitUser(){
      let cacheList = [];
      this.selectedUserList.forEach(item=>{
        cacheList.push({"personId":item.personId,"userName":item.userName,"nickName":item.nickName,"deptName":item.deptName,"phoneNumber":item.phoneNumber})
      })
      addPerson({"teamId":this.queryParams.id,"users":cacheList}).then(response=>{
        this.msgSuccess("添加成功");
        this.personShow = false;
        getPersonByTeamId(this.queryParams.id).then((response) => {
          this.userList = response.result
        });
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
        getTeamtype(id).then((response) => {
        this.form = response.result;
        this.open = true;
        this.title = "修改班组类别";
      });
    },
    cancelPeroson(){
      this.innerDrawer = !this.innerDrawer
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
        if (this.form.id != null) {
          this.form.personnelList = this.personnelList+""
          this.form.personnelId = this.personnelId+""
          var a = this.form
            updateTeamtype(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.personnelList = this.personnelList+""
            this.form.personnelId = this.personnelId+""
            addTeamtype(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss"  scoped>
        .el-table::before{
            height:0 !important;

      }
      .el-col{
          height: auto !important;
      }

</style>
