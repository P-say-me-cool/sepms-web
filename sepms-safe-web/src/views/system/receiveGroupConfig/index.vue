<template>
  <div class="app-container ">
    <div style="height:15px;" v-show="!showSearch"></div>
    <el-form :model="queryParams" class="allinput wzt_form" :rules="rules" ref="queryForm" :inline="true"
             v-show="showSearch">
      <el-form-item label="接令人：" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入接令人"
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
    <div class="formQuery form_content_pagination">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:notice:add']"
          >新增
          </el-button>
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
          >修改
          </el-button>
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
          >删除
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <div class="tablesfrom">
        <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="接令组名称" align="center" prop="receiveGroupName"/>
          <el-table-column label="接令组成员" align="center" prop="nickName"/>
          <el-table-column label="显示顺序" align="center" prop="orderNum"/>
          <el-table-column label="启用" align="center" prop="isUse" :formatter="isUseFormat"/>
          <el-table-column label="创建人" align="center" prop="creator"/>
          <el-table-column label="创建时间" align="center" prop="createTime"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-user-solid"
                @click="handleShow(scope.row)"
              >人员
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />-->
    </div>

    <!-- 添加或修改接令组配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="105px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="接令组名称" prop="receiveGroupName">
              <el-input v-model="form.receiveGroupName" placeholder="请输入接令组名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="isUse">
              <el-select v-model="form.isUse" placeholder="请选择是否启用" size="small">
                <el-option
                  v-for="dict in isUseOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number v-model="form.orderNum" placeholder="请输入显示顺序" :min="0" :step="1"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-drawer
      title="接令组人员配置"
      :append-to-body="true"
      size="40%"
      :visible.sync="innerDrawer">

      <el-row style="margin:0 20px">
        <el-col :span="24">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="peopleAdd"
              style="margin-bottom:14px"
            >增加人员
            </el-button>
          </el-col>
          <el-table :data="users" style="max-height:650px;overflow-y:auto;" v-loading="loadingod" :height="550">
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column label="姓名" align="center" prop="nickName"/>
            <el-table-column label="部门" align="center" prop="deptName"/>
            <el-table-column label="手机号" align="center" prop="phonenumber"/>
            <el-table-column label="操作" align="center" prop="showOrder">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  plain
                  icon="el-icon-delete"
                  size="mini"
                  @click="peopleDel(scope)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-drawer>

    <el-dialog title="增加接令组人员" :visible.sync="peopleShow" width="920px" append-to-body>
      <el-form class="mf10 el-tianjia" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="姓名:">
          <el-input
            v-model="userQueryParam.nickName"
            placeholder="请输入姓名"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="部门:">
          <el-input
            v-model="userQueryParam.deptName"
            placeholder="请输入部门"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item style="margin-left:20px">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getUseList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loadingods" :data="userList" @selection-change="handleSelectionChanges">
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="用户名" align="center" key="sums" prop="userName" v-if="columns[0].visible"/>
        <el-table-column label="部门" align="center" key="deptName" prop="deptName" v-if="columns[3].visible"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible"
                         width="120"/>

      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="userQueryParam.pageNum"
        :limit.sync="userQueryParam.pageSize"
        @pagination="peopleAdds"
        style="margin-top:20px;height:40px"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUser">确 定</el-button>
        <el-button @click="cancelUser">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listConfig,
    getConfig,
    delConfig,
    addConfig,
    updateConfig,
    getReceiveGroupUser,
    addReceiveUsers,
    selectListByNickName,
    deleteReceiveGroupConfigById,
    deleteReceiveGroupConfigUserById
  } from "@/api/system/receiveGroupConfig";
  import {selectUserAndDeptList} from "@/api/system/user";

  export default {
    name: "ReceiveGroupConfig",
    components: {},
    data() {
      return {
        psReceiveGroupConfigId: null,
        noticeList: [],
        users: [],
        columns: [
          {key: 0, label: `用户编号`, visible: true},
          {key: 1, label: `用户名称`, visible: true},
          {key: 2, label: `用户昵称`, visible: true},
          {key: 3, label: `部门`, visible: true},
          {key: 4, label: `手机号码`, visible: true},
          {key: 5, label: `状态`, visible: true},
          {key: 6, label: `创建时间`, visible: true}
        ],
        loadingods: false,
        userIds: [],
        userQueryParam: {
          pageNum: 1,
          pageSize: 10,
        },
        //添加人员弹框
        peopleShow: false,
        // 抽屉开关
        innerDrawer: false,
        loadingod: false,
        //人员列表
        userList: [],
        //是否启用字典
        isUseOptions: [],
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
        // 接令组配置表格数据
        configList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          nickName: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          receiveGroupName: [
            {required: true, message: "接令组名称不能为空", trigger: "blur"}
          ],
          orderNum: [
            {required: true, message: "显示顺序不能为空", trigger: "blur"}
          ],
          isUse: [
            {required: true, message: "是否启用 0是 1否不能为空", trigger: "blur"}
          ],
        }
      };
    },
    created() {
      this.getDicts("is_use").then(response => {
        this.isUseOptions = response.data;
      });
      this.getList();
    },
    methods: {
      /** 查询接令组配置列表 */
      getList() {
        this.loading = true;
        selectListByNickName(this.queryParams).then(response => {
          this.configList = response.result;
          this.total = response.total;
          this.loading = false;
        });
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
          receiveGroupName: null,
          orderNum: null,
          isUse: null,
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
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加接令组配置";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getConfig(id).then(response => {
          this.form = response.result;
          this.open = true;
          this.title = "修改接令组配置";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateConfig(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addConfig(this.form).then(response => {
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
        this.$confirm('是否确认删除接令组配置编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delConfig(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      // 是否启用字典翻译
      isUseFormat(row, column) {
        return this.selectDictLabel(this.isUseOptions, row.isUse);
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/config/export', {
          ...this.queryParams
        }, `system_config.xlsx`)
      },
      peopleAdd() {
        this.userIds = []
        this.peopleShow = !this.peopleShow
        this.loadingods = true
        selectUserAndDeptList(this.userQueryParam).then(response => {
          this.loadingods = false
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
      },
      getUseList() {
        this.userQueryParam.pageNum = 1;
        this.loading = true
        selectUserAndDeptList(this.userQueryParam).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
      },
      handleSelectionChanges(selection) {
        for (let item of selection) {
          if (!this.judge(this.userIds, item.userId)) {
            this.userIds.push(item);
          }
        }
      },
      judge(list, userId) {
        let isJudge = false
        for (let item of list) {
          if (item.userId === userId) {
            isJudge = true;
          }
        }
        return isJudge;
      },
      peopleAdds() {
        this.loadingods = true;
        selectUserAndDeptList(this.userQueryParam).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loadingods = false;
        })
      },
      cancelUser() {
        this.peopleShow = !this.peopleShow
      },
      submitUser() {
        this.loadingod = true;
        for (let i = 0; i < this.userIds.length; i++) {
          let repeat = false;
          for (let j = 0; j < this.users.length; j++) {
            if (this.userIds[i].userId === this.users[j].userId) {
              repeat = true;
              break;
            }
          }
          if (!repeat) {
            this.users.push(this.userIds[i]);
          }
        }
        this.users = Array.from(new Set(this.users))
        let userIds = this.users.map(item => item.userId)
        let param = {
          id: this.psReceiveGroupConfigId,
          userIds: userIds
        }
        addReceiveUsers(param).then((res) => {
          this.getList();
          this.users = res.result
          this.loadingod = false
          this.peopleShow = !this.peopleShow
        })
      },
      peopleDel(scope) {
        this.$confirm('是否确认删除接令组成员"' + scope.row.nickName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return deleteReceiveGroupConfigUserById(scope.row.id);
        }).then(() => {
          this.loadingod = true
          getReceiveGroupUser(this.psReceiveGroupConfigId).then((res) => {
            this.users = res.result
            this.loadingod = false
          })
          this.msgSuccess("删除成功");
        }).catch(()=>{})
      },
      /** 人员按钮操作 */
      handleShow(row) {
        this.users = null
        this.innerDrawer = !this.innerDrawer
        this.loadingod = true
        this.psReceiveGroupConfigId = row.id;
        getReceiveGroupUser(this.psReceiveGroupConfigId).then((res) => {
          this.users = res.result
          this.loadingod = false
        })
      },
    }
  };
</script>
<style lang="scss" scoped>
  .el-drawer {

    overflow: scroll
  }

</style>
