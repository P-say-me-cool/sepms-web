<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <div style="height:15px;" v-show="!showSearch"></div>

    <el-form :model="queryParams" class="wzt_form" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="110px">
      <el-form-item label="指令编号：" prop="instructionNo">
        <el-input
          v-model="queryParams.instructionNo"
          placeholder="请输入指令编号"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="指令标题：" prop="instructionTitle">
        <el-input
          v-model="queryParams.instructionTitle"
          placeholder="请输入指令标题"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发令人：" prop="sender">
        <el-input
          v-model="queryParams.sender"
          placeholder="请输入发令人"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接令人：" prop="receiveName">
        <el-input
          v-model="queryParams.receiveName"
          placeholder="请输入接令人"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="紧急程度：" prop="degreeEmergency">
        <el-select v-model="queryParams.degreeEmergency" placeholder="请选择紧急程度" clearable size="mini">
          <el-option
            v-for="dict in degreeEmergencyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="queryParams.status" multiple placeholder="请选择状态" size="mini">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划开始时间：" prop="dateTime">
        <el-date-picker size="small"
                        v-model="dateTime"
                        :clearable="false"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary"  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加数据 -->
    <div class="formQuery form_content_pagination">
      <el-row :gutter="10" class="mb20">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:scheduleinstructioninfo:add']"
          >新增
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <!-- 数据展示列表 -->
      <div class="tablesfrom">
        <el-table v-loading="loading" :data="scheduleinstructioninfoList" :row-style="row_degreeEmergency">
          <el-table-column label="序号" align="center" prop="index" width="60">
            <template slot-scope="scope">
              <span v-text="table_index(scope.$index)"> </span>
            </template>
          </el-table-column>
          <el-table-column label="指令编号" align="center" prop="instructionNo" min-width="160px;"/>
          <el-table-column label="指令标题" align="center" prop="instructionTitle" min-width="200px;"/>
          <el-table-column label="发令部门" align="center" prop="sendDept" min-width="160px;"/>
          <el-table-column label="发令人" align="center" prop="sender"/>
          <el-table-column label="计划开始时间" align="center" prop="startTime" min-width="160px;"/>
          <el-table-column label="接令部门" align="center" prop="receiveDept" min-width="160px;"/>
          <el-table-column label="接令人员" align="center" prop="receiveName"/>
          <el-table-column label="状态" align="center" prop="status_string" :formatter="statusFormat"/>
          <el-table-column label="紧急程度" align="center" prop="degreeEmergency" :formatter="degreeEmergencyFormat"/>
          <el-table-column label="操作" align="center" min-width="200px;">
            <template slot-scope="scope">
              <el-button
                size="mini"
                v-if="((scope.row.status_string == 1 || scope.row.status_string == 2) &&  scope.row.flag == 5 && scope.row.senderId != userId) || (scope.row.status_string == 0 && scope.row.senderId == userId) || (scope.row.status_string == 3 && scope.row.senderId == userId)"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:scheduleinstructioninfo:edit']"
              >编辑
              </el-button>
              <el-button
                size="mini"
                v-if="scope.row.status_string == 0 && scope.row.flag == 5 && scope.row.senderId == userId"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:scheduleinstructioninfo:remove']"
              >删除
              </el-button>
              <el-button
                size="mini"
                v-if="scope.row.status_string == 3 && scope.row.senderId == userId"
                type="text"
                icon="el-icon-delete"
                @click="handleClosed(scope.row)"
              >关闭
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="queryDetailById(scope.row)"
                v-hasPermi="['system:scheduleinstructioninfo:query']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 --></div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 添加或修改调度指令对话框 -->
    <el-dialog :title="title_add" :visible.sync="open" width="1100px" append-to-body>
      <el-tabs v-model="activeKey" style="margin-top: -20px;">
        <el-tab-pane label="指令基本信息" name="first">
          <el-form ref="form" :model="form" :rules="rules" :inline="true">
            <el-row>
              <el-col :span="8">
                <el-form-item label="指令编号:" prop="instructionNo" label-width="115px">
                  <el-input v-model="form.instructionNo" size="mini"  disabled/>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="发令人:" prop="sender" label-width="60px">
                  <el-input v-model="form.sender" size="mini"  disabled/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="紧急程度:" prop="degreeEmergency" label-width="80px" style="margin-left: 5px;">
                  <el-select v-model="form.degreeEmergency" placeholder="请选择紧急程度" clearable size="mini"
                             v-bind:disabled="diasabledFlag">
                    <el-option
                      v-for="dict in degreeEmergencyOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="级别:" prop="level" label-width="110px" style="margin-left: 5px;">
                  <el-select v-model="form.level" placeholder="请选择级别" clearable size="mini"
                             v-bind:disabled="diasabledFlag">
                    <el-option
                      v-for="dict in levelDict"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"

                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
              </el-col>
            </el-row>



            <el-form-item label="指令标题:" prop="instructionTitle" label-width="110px" style="margin-left: 5px;">
              <el-input v-model="form.instructionTitle" placeholder="请输入指令标题" size="mini" style="width:830px;"
                        v-bind:disabled="diasabledFlag"/>
            </el-form-item>
            <el-form-item label="接令人员:" prop="receiveName" label-width="100px" style="margin-left: 15px;">
              <el-input v-model="form.receiveName" placeholder="请选择接令人员" size="mini" style="width:760px;" disabled/>
              <el-button type="primary" style="margin-left: 10px;" size="mini" @click="receivedNameSelect(1)"
                         v-bind:disabled="selectedFlag">选 择
              </el-button>
            </el-form-item>
            <el-form-item label="知晓人员:" prop="knowPeople" label-width="90px" style="margin-left: 25px;">
              <el-input v-model="form.knowUser" placeholder="请选择知晓人员" size="mini" style="width:760px;" disabled/>
              <el-button type="primary" style="margin-left: 10px;" size="mini" @click="receivedNameSelect(0)"
                         v-bind:disabled="selectedFlag">选 择
              </el-button>
            </el-form-item>
            <el-form-item label="计划时间:" label-width="110px" prop="value" style="margin-left: 3px;">
              <el-date-picker
                size="mini"
                v-model="form.value"
                :clearable="false"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                end-placeholder="结束日期"
                :picker-options="startTimeOperation"
                v-bind:disabled="diasabledFlag">
              </el-date-picker>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item label="指令内容:" label-width="110px" prop="instructionContent" style="margin-left: 2px;">
                      <textarea v-model="form.instructionContent" placeholder="请输入指令内容" size="mini"
                                style="width:830px;height:60px;border:1.3px solid #DCDCDC; border-radius: 5px;word-break: normal;"
                                v-bind:disabled="diasabledFlag"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="驳回原因:" prop="rejected" style="margin-left: 40px;" v-if="rejectedType === 1">
              <textarea v-model="form.rejected" v-if="rejectedType === 1" v-bind:disabled="diasabledFlag" size="mini"
                        style="width:830px;height:60px;border:1.3px solid #DCDCDC; border-radius: 5px;word-break: normal;"/>
            </el-form-item>
            <el-form-item label="执行情况:" prop="implementation" style="margin-left: 40px;" v-if="implementationType == 1">
              <textarea v-model="form.implementation" size="mini"
                        style="width:830px;height:60px;border:1.3px solid #DCDCDC; border-radius: 5px;word-break: normal;"
                        v-if="implementationType == 1" v-bind:disabled="disabledFlag"/>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item label="执行附件:" style="margin-left: 40px;" v-if="enclosureDisplay == 1 || addStutas">
                  <el-upload ref="uploadFile"
                             :headers="headers"
                             :data='{"id":form.id,"status":form.status_string}'
                             :action="url"
                             multiple
                             :auto-upload="true"
                             :limit="10"
                             accept=".png,.jpg,.jpeg,.mp4"
                             :file-list="fileList"
                             :on-success="handleFilUploadSuccess"
                             :before-remove="beforeRemove"
                             :on-remove="handleRemove"
                             :on-preview="handlePreview"
                             :before-upload="handleChecked" v-bind:disabled="disabledFlag" v-if="enclosureDisplay == 1|| addStutas">
                    <el-button size="small" type="primary" v-bind:disabled="disabledFlag" v-if="enclosureDisplay == 1|| addStutas">附 件
                    </el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="指令流程监控" name="second" style="overflow: auto;" v-if="processDisplay">
          <div style="zoom:1;height:300px;min-width:1200px;overflow: hidden; white-space: nowrap; ">
            <el-button type="primary" style="background: greenyellow;border: 2px;margin-top: 90px;float:left">开 始
            </el-button>

            <img style="border-top:5px solid #fff;margin-top:96px;margin-bottom: -4px;width:50px;float:left"
                 src='../../../assets/images/main.png'>

            <div style="border:2px solid #a1a1a1;border-radius:5px; width:70px;float:left;margin-top:95px;">
              {{sender}}
            </div>

            <div v-for="(value,id) in receiveName" :key="id" :v-if="statusProcess == 2 || statusProcess == 4"
                 style="float:left">
              <div style="float:left"
                   v-if="knowlgeList(id) === '' ||  knowlgeList(id) === undefined || knowlgeList(id) === null">
                <img style="border-top:5px solid #fff;margin-top:96px;margin-bottom: -4px;width:50px;float:left"
                     src='../../../assets/images/main.png'>
                <div style="border:2px solid #a1a1a1;border-radius:5px;display:inline;float:left;margin-top:96px"
                     ref="receivedWidth">
                  {{value}}
                </div>
              </div>
              <div style="float:left"
                   v-if="knowlgeList(id) !== '' &&  knowlgeList(id) !== undefined && knowlgeList(id) !== null">
                <img src='../../../assets/images/branch.jpg'
                     style="margin-top:99px;width: 50px;height: 80px;float:left">
                <div style="border:2px solid #a1a1a1;border-radius:5px;display:inline;float:left;margin-top:96px"
                     ref="receivedWidth">
                  {{value}}
                  <span v-if="value.length==2" style="opacity: 0;">除</span>
                </div>
                <div v-if="knowlge[id] != null" @mouseover="displayContext(id)" @mouseleave="noneContext(id)"
                     style="width:50px;float:left;height:60px;margin-left:-48px;-webkit-line-clamp: 2;-webkit-box-orient: vertical;display: -webkit-box;word-wrap: break-word;word-break: break-all;border:2px solid #a1a1a1;border-radius:5px;;white-space: pre-wrap;margin-top:162px;">
                  <span v-for="(n,kindex) in knowlge[id]">
                    <span v-if="n !=',' && positionFlag > kindex">{{n}}</span>
                    <span v-else-if="n ==',' && positionFlag > kindex"><br/></span>
                    <span v-else-if="positionFlag == kindex">....</span>
                  </span>
                  <span class="mousehover" :ref="`${id}`" style="display: none;">
                     <span v-for="know in knowlge[id]">
                        <span v-if="know !=','">{{know}}</span>
                        <span v-else><br/></span>
                       </span>
                  </span>
                </div>
              </div>
            </div>
            <span v-if="statusProcess == 4">
            <img src='../../../assets/images/main.jpg'>
            <el-button type="primary" style="background:orangered;border: 2px;margin-top: 100px;">结 束</el-button>
          </span>
          </div>

        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer" style='text-align: center;'>
        <el-button type="primary" @click="storageTemporary(0)" v-if="button_show == 2" v-preventReClick>暂 存</el-button>
        <el-button type="primary" @click="storageTemporary(7)" style='margin-left: 25px;' v-if="button_show == 3"
                   v-preventReClick>接 收
        </el-button>
        <el-button type="primary" @click="storageTemporary(5)" style='margin-left: 25px;' v-if="button_show == 3"
                   v-preventReClick>保 存
        </el-button>
        <el-button type="primary" @click="storageTemporary(1)" style='margin-left: 25px;' v-if="button_show == 2"
                   v-preventReClick>发 布
        </el-button>
        <el-button type="primary" @click="storageTemporary(8)" style='margin-left: 25px;' v-if="button_show == 3"
                   v-preventReClick>转 发
        </el-button>
        <el-button type="primary" @click="storageTemporary(9)" v-if="button_show == 3" v-preventReClick>驳 回</el-button>
        <el-button type="primary" @click="storageTemporary(4)" style='margin-left: 25px;' v-if="button_show == 3"
                   v-preventReClick>完 成
        </el-button>
        <el-button type="primary" @click="cancel" v-if="button_show == 1">关 闭</el-button>
      </div>

    </el-dialog>
    <!-- 接令人员选择框 -->
    <el-dialog :title="title_jl" :visible.sync="open_dialog" width="1120px" append-to-body>
      <el-row>
        <el-col :span="4" :xs="24" style="height: 360px;width: 250px;overflow:auto;border: 1px solid #D3D9E6;">
          <el-tree
            :data="modelTreeList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            style="height:300px;width:220px;"
            :default-expand-all="false"
            @node-click="handleNodeClick"
          />
        </el-col>
        <el-col style="height: 360px;width: 800px;">
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-form label-width="90px">
                  <el-col :span="8">

                                        <el-form-item label="员工姓名:" prop="instructionNo">
                                          <el-input
                    v-model="userListName"
                    placeholder="请输入员工姓名"
                    clearable
                    style="width:160px"
                  />
                                        </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-search"
                      @click="handleNodeClick"
                    >搜索
                    </el-button>
                  </el-col>
                  <el-col :span="8">
                <el-form-item label="接令组:" prop="instructionNo">
                  <el-select v-model="receivingSection" placeholder="请选择紧急程度" clearable
                  @change="selectSection"
                   v-bind:disabled="diasabledFlag">
                    <el-option
                      v-for="dict in receivingGroup"
                      :key="dict.id"
                      :label="dict.receiveGroupName"
                      :value="dict.id"
                    ></el-option>
                  </el-select>
                                        </el-form-item>
                  </el-col>
                                  </el-form>

              </el-row>

            </el-col>


            <el-col :span="11.5" style="height: 300px;margin-left:20px;overflow:auto;float:left">
              <el-table v-loading="loading" :data="userList" @row-click="selectUser">
                <el-table-column label="班组名称" align="center" prop="teamName" width="120"/>
                <el-table-column label="用户名" align="center" prop="personId" width="120" v-if="false"/>
                <el-table-column label="用户名" align="center" prop="userName" width="120"/>
                <el-table-column label="员工姓名" align="center" prop="nickName" width="120"/>
              </el-table>
            </el-col>
            <el-col :span="11.5" style="height: 300px;margin-left:20px;overflow:auto;float:left">
              <el-table v-loading="loading" :data="selectUserList" @row-click="removeUserList">
                <el-table-column label="选中部门" align="center" prop="workshopName" width="120"/>
                <el-table-column label="用户名" align="center" prop="personId" width="120" v-if="false"/>
                <el-table-column label="选中员工" align="center" prop="userName" width="120"/>
                <el-table-column label="选中员工" align="center" prop="nickName" width="120"/>
              </el-table>
            </el-col>

          </el-row>



        </el-col>

      </el-row>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="submitTreeSelect" v-preventReClick>确 定</el-button>
        <el-button @click="canceldialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 转发接令人员选择框 -->
    <el-dialog :title="title_zf" :visible.sync="open_dialog_zf" width="1120px" append-to-body>
      <el-row>
        <el-col :span="4" :xs="24" style="height: 360px;width: 250px;overflow:auto;">
          <!--            <div class="head-container">-->
          <el-tree
            :data="modelTreeList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            style="height:300px;width:220px;"
            :default-expand-all="false"
            @node-click="handleNodeClick_zf"
          />
          <!--          </div>-->
        </el-col>
        <el-col style="height: 360px;width: 380px;margin-left:20px;overflow:auto;">
          <el-table v-loading="loading" :data="userList_zf" @row-click="selectUser_zf">
            <el-table-column label="班组名称" align="center" prop="teamName" width="120"/>
            <el-table-column label="用户名" align="center" prop="personId" width="120" v-if="false"/>
            <el-table-column label="用户名" align="center" prop="userName" width="120"/>
            <el-table-column label="员工姓名" align="center" prop="nickName" width="120"/>
          </el-table>
        </el-col>
        <el-col style="height: 360px;width: 380px;margin-left:20px;overflow:auto;">
          <el-table v-loading="loading" :data="selectUserList_zf" @row-click="removeUserList_zf">
            <el-table-column label="选中部门" align="center" prop="workshopName" width="120"/>
            <el-table-column label="用户名" align="center" prop="personId" width="120" v-if="false"/>
            <el-table-column label="选中员工" align="center" prop="userName" width="120"/>
            <el-table-column label="选中员工" align="center" prop="nickName" width="120"/>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="submitTreeSelect_zf" v-preventReClick>确 定</el-button>
        <el-button @click="canceldialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 知晓人员选择框 -->
    <el-dialog :title="title_zx" :visible.sync="open_dialog1" width="1120px" append-to-body>
      <el-row>
        <el-col :span="4" :xs="24" style="height: 360px;width: 250px;overflow:auto;border: 1px solid #D3D9E6;">
          <!-- <div class="head-container"> -->
          <el-tree
            :data="modelTreeList1"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            style="height:300px;width:220px;"
            :default-expand-all="false"
            @node-click="handleNodeClick1"
          />
          <!-- </div> -->
        </el-col>
        <el-col style="height: 360px;width: 380px;margin-left:20px;overflow:auto;">
          <el-table v-loading="loading" :data="userList1" @row-click="selectUser1">
            <el-table-column label="班组名称" align="center" prop="teamName" width="120"/>
            <el-table-column label="用户名" align="center" prop="personId" width="120" v-if="false"/>
            <el-table-column label="用户名" align="center" prop="userName" width="120"/>
            <el-table-column label="员工姓名" align="center" prop="nickName" width="120"/>
          </el-table>
        </el-col>
        <el-col style="height: 360px;width: 380px;margin-left:20px;overflow:auto;">
          <el-table v-loading="loading" :data="selectUserList1" @row-click="removeUserList1">
            <el-table-column label="选中部门" align="center" prop="workshopName" width="120"/>
            <el-table-column label="用户名" align="center" prop="personId" width="120" v-if="false"/>
            <el-table-column label="用户名" align="center" prop="userName" width="120"/>
            <el-table-column label="选中员工" align="center" prop="nickName" width="120"/>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="submitTreeSelect1" v-preventReClick>确 定</el-button>
        <el-button @click="canceldialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 驳回弹框 -->
    <el-dialog :title="title_bh" :visible.sync="open_boh" width="400px" append-to-body>
      <div>
        <textarea v-model="rejectedContexts" placeholder="请输入驳回原因" size="mini" style="height: 150px;width: 360px;"/>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="rejectedTable" v-preventReClick>确 定</el-button>
        <el-button @click="canceldialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listScheduleinstructioninfo,
    getScheduleinstructioninfo,
    delScheduleinstructioninfo,
    addScheduleinstructioninfo,
    updateScheduleinstructioninfo,
    listTeamtype,
    closedScheduleinstructioninfo,
    listDropDown,
    deleteFileById, downLoadFile, downLoadFileByURL
  } from '@/api/system/scheduleinstructioninfo'
  import Editor from '@/components/Editor';
  import Tabs from "@/components/table/tabs";
  import Pane from "@/components/table/pane";
  import {getToken} from "@/utils/auth";
  import {getInfo} from '@/api/login';
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import {teamListModeltree} from "@/api/model/modeltree";

  export default {
    name: "Scheduleinstructioninfo",
    components: {
      Editor,
      Tabs,
      Pane,
      Treeselect
    },
    data() {
      return {
        receivingSection:'',
        //点击操作行
        clickRow: {},
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        //按钮控制
        button_show: 0,
        //动态设置宽
        //setWidth:[],
        //流程图的显示
        processDisplay: false,
        //驳回框
        rejectedType: 0,
        //执行情况框
        implementationType: 0,
        //执行附件的显示与否
        enclosureDisplay: 0,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 调度指令表格数据
        scheduleinstructioninfoList: [],
        // 弹出层标题
        title_add: "",
        title_jl: "",
        title_zf: "",
        title_bh: "",
        title_zx: "",
        title_file: "",
        //发令人
        sender: '',
        //接收人员数组--流程图
        receiveName: [],
        //知晓人员数组--流程图
        knowlge: [],
        nodeId:'',
        nodeName:'',
        //选中知晓人员数组
        selectUserList: [],
        selectUserList_zf: [],
        //部门人员数组
        userList: [],
        userList_zf: [],
        //选中知晓人员数组
        selectUserList1: [],
        //部门人员数组
        userList1: [],
        //控制流程进度的状态
        statusProcess: 0,
        // 是否显示弹出层
        open: false,
        //默认调度指令基本信息
        activeKey: 'first',
        open_dialog: false,
        open_dialog_zf: false,
        open_dialog1: false,
        open_boh: false,
        disabledFlag: false,
        //驳回内容
        rejectedContexts: null,
        //人员选择: true 接收人，false 知晓人
        selectId: true,
        // 状态字典
        statusOptions: [],
        // 添加通知人员筛选名称
        userListName:'',
        // 部门名称
        deptName: undefined,
        defaultProps: {
          children: "children",
          label: "modelName"
        },
        receivingGroup:'',
        // 部门树选项
        modelTreeList: [],
        modelTreeList1: [],
        // 紧急程度字典
        degreeEmergencyOptions: [],
        //级别字典
        levelDict: [],
        diasabledFlag: false,
        selectedFlag: false,
        dateTime: null,
        userId: null,
        userName: null,
        //知晓人样式标识
        positionFlag: 0,
        receivingList:'',
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          instructionNo: null,
          instructionTitle: null,
          sender: null,
          startTime: null,
          endTime: null,
          receiveDept: null,
          receiveName: null,
          status: [],
          status_string: null,
          degreeEmergency: null
        },
        fileList: [],
        headers: {Authorization: "Bearer " + getToken()},
        url: process.env.VUE_APP_BASE_API + "/system/scheduleinstructioninfo/importData",
        // 文件下载列表
        //dataFileList: [],
        //新增弹框显示上传文件
        addStutas:false,
        // 表单参数
        form: {
          startTime1: null,
          endTime1: null
        },
        startTimeOperation: {
          disabledDate: time => {
            if (this.form.endTime1) {
              return time.getTime() > new Date(this.form.endTime1).getTime() - 24 * 60 * 60 * 1000 || time.getTime() < new Date() - 24 * 60 * 60 * 1000
            } else {
              return time.getTime() < new Date() - 24 * 60 * 60 * 1000
            }
          }
        },
        endTimeOperation: {
          disabledDate: time => {
            if (this.form.startTime1) {
              return time.getTime() < new Date(this.form.startTime1).getTime() - 24 * 60 * 60 * 1000
            } else {
              return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000
            }
          }
        },
        // 表单校验
        rules: {
          instructionTitle: [
            {required: true, message: "指令标题不能为空", trigger: "blur"}
          ],
          receiveName: [
            {required: true, message: "接令人不能为空", trigger: "blur"}
          ],
          instructionContent: [
            {required: true, message: "指令内容不能为空", trigger: "blur"}
          ],
          endTime1: [
            {required: true, message: "结束时间不能为空", trigger: "blur"}
          ],
          value: [
            {required: true, message: "开始时间不能为空", trigger: "blur"}
          ],
        },
      };
    },
    created() {
      this.getTreeselect();
      this.getDictsBatch("urgent_step,disp_status,dispatch_level").then(response => {
        this.degreeEmergencyOptions = response.data.urgent_step;
        this.levelDict = response.data.dispatch_level;
        this.statusOptions = response.data.disp_status;
      });
      getInfo().then(res => {
        this.userId = res.user.userId;
        this.userName = res.user.userName;
        this.getList();
      })
      listDropDown().then((res) => {
        this.receivingGroup = res.result
        console.log(res)
      })
    },
    methods: {
      selectSection(){
        // receivingSection
        var array = []
        var arr = []
        if(this.receivingSection){
          this.receivingGroup.forEach(element => {
            if(element.id == this.receivingSection){
              this.receivingList = element.psReceiveGroupConfigUsers
              this.receivingList.forEach(item=>{
                item.workshopName = item.deptName
                item.personId = item.userId
              })
              array = this.selectUserList.concat(this.receivingList)
              // 去重
              array.forEach(element => {
                var t = 0
                arr.forEach(item=>{
                  if(element.personId == item.personId){
                     t = 1
                  }
                  return false
                })
                if(t == 0){
                  arr.push(element)
                }
              });
              this.selectUserList = arr

            }
          });
        }
        
      },
      /** 查询调度指令列表 */
      getList() {
        this.loading = true;
        if (this.dateTime != null) {
          this.queryParams.startTime = this.dateTime[0];
          this.queryParams.endTime = this.dateTime[1];
        }
        listScheduleinstructioninfo(this.queryParams).then(response => {
          this.scheduleinstructioninfoList = response.result;
          for (var i = 0; i < this.scheduleinstructioninfoList.length; i++) {
            if (this.userId == this.scheduleinstructioninfoList[i].receiveId) {
              this.scheduleinstructioninfoList[i].flag = 5;
            }
            if (this.userId == this.scheduleinstructioninfoList[i].senderId) {
              this.scheduleinstructioninfoList[i].flag = 5;
            }
          }
          this.total = response.total;
          this.loading = false;
        });
      },
      //table翻页
      table_index($index) {
        return (this.queryParams.pageNum - 1) * this.queryParams.pageSize + $index + 1;
      },
      //根据返回值行颜色变化
      row_degreeEmergency({row, rowIndex}) {
        if (row.degreeEmergency == '1' && row.status_string != '4') {
          return {"background-color": "#FF6347"};
        }
      },
      // 紧急程度字典翻译
      degreeEmergencyFormat(row, column) {
        return this.selectDictLabel(this.degreeEmergencyOptions, row.degreeEmergency);
      },
      //状态翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status_string);
      },
      //流程知晓人员赋值
      knowlgeList(index) {
        let knowName = this.knowlge[index];
        if (knowName != null) {
          knowName = knowName.replace(",", " ");
          if (knowName.indexOf(",") == -1) {
            this.positionFlag = 8;
          } else {
            this.positionFlag = knowName.indexOf(",") + 1;
          }
        }
        return knowName;
      },
      // 添加，编辑，查看，删除取消按钮
      cancel() {
        this.open = false;
        this.clear();
      },
      // 人员选择取消按钮
      canceldialog() {
        this.rejectedContexts = null;
        this.open_dialog = false;
        this.open_dialog_zf = false;
        this.open_dialog1 = false;
        this.open_boh = false;
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        this.modelTreeList = []
        this.modelTreeList1 = []
        teamListModeltree().then(response => {
          this.modelTreeList = this.handleTree(response.result, "id", "parentId");
          this.modelTreeList1 = this.handleTree(response.result, "id", "parentId");
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点树单击事件
      handleNodeClick(data) {
        console.log(this.nodeId,this.nodeName,data);
        if(data.modelName){
          this.nodeId = data.id
          this.nodeName = data.modelName
        }
        if(this.nodeName && this.nodeId){
          var param = {
            "workshopId": this.nodeId,
            "workshopName": this.nodeName,
            "userName":this.userListName
          }
          listTeamtype(param).then((response) => {
            this.userList = response;
          });
        }else{
          this.$message({ type: "error", message: "请选择工作人员所在车间" });
        }

      },
      handleNodeClick1(data) {
        var param = {
          "workshopId": data.id,
          "workshopName": data.modelName
        }
        listTeamtype(param).then((response) => {
          this.userList1 = response;
        });
      },
      //转发
      handleNodeClick_zf(data) {
        var param = {
          "workshopId": data.id,
          "workshopName": data.modelName
        }
        listTeamtype(param).then((response) => {
          this.userList_zf = response;
        });
      },
      selectUser_zf(row, event, column) {
        for (let i = 0; i < this.selectUserList_zf.length; i++) {
          if (this.selectUserList_zf[i].userId == row.userId && this.selectUserList_zf[i].workshopId == row.workshopId) {
            return this.msgWarning("已选中");
          }
        }
        if (this.selectUserList1 != undefined) {
          for (var i = 0; i < this.selectUserList1.length; i++) {
            if (row.userName == this.selectUserList1[i].userName) {
              return this.msgError("接令人不能是知晓人！");
            }
          }
        }
        if (row.userName == this.userName) {
          return this.msgError("接令人不能是发令人！");
        }
        if (this.clickRow.senderId === row.personId) {
          return this.msgWarning("接令人不能是发令人！");
        }
        this.selectUserList_zf.push(row);
      },
      removeUserList_zf(row, event, column) {
        var index = this.selectUserList_zf.indexOf(row);
        this.selectUserList_zf.splice(index, 1);
      },
      //转发人员选择确定按钮
      submitTreeSelect_zf() {
        if (this.selectUserList_zf.length > 1) {
          this.msgSuccess("接令人员只能一个！！！");
          return;
        }
        var selectName = "";
        var receiveId = "";
        for (var i = 0; i < this.selectUserList_zf.length; i++) {
          selectName += this.selectUserList_zf[i].workshopName + " " + this.selectUserList_zf[i].nickName + ",";
          receiveId += this.selectUserList_zf[i].personId + ",";
        }
        this.form.receiveName = selectName.substr(0, selectName.length - 1);
        this.form.receiveId = receiveId.substr(0, receiveId.length - 1);
        this.storageTemporary(2);
        this.open_dialog_zf = false;
        //this.open_dialog = false;
      },
      //选中添加人员(接令人)
      selectUser(row, event, column) {
        if (this.selectUserList1 != undefined) {
          for (var i = 0; i < this.selectUserList1.length; i++) {
            if (row.userName == this.selectUserList1[i].userName) {
              return this.msgError("接令人不能是知晓人！");
            }
          }
        }
        if (row.userName == this.userName) {
          return this.msgError("接令人不能是发令人！");
        }
        for (var i = 0; i < this.selectUserList.length; i++) {
          if (this.selectUserList[i].userName == row.userName && this.selectUserList[i].workshopId == row.workshopId) {
            return this.msgError("已选中");
          }
        }
        this.selectUserList.push(row);
      },
      //删除选中的人员
      removeUserList(row, event, column) {
        var index = this.selectUserList.indexOf(row);
        this.selectUserList.splice(index, 1);
      },
      //选中添加人员（知晓人）
      selectUser1(row, event, column) {
        if (this.selectUserList1 != undefined) {
          for (var i = 0; i < this.selectUserList1.length; i++) {
            if (this.selectUserList1[i].userName == row.userName && this.selectUserList1[i].workshopId == row.workshopId) {
              return this.msgError("已选中");
            }
          }
        } else {
          this.selectUserList1 = [];
        }
        if (row.personId == this.userId) {
          return this.msgError("知晓人不能是发令人！");
        }
        if (this.selectUserList != undefined && this.selectUserList.length > 0) {
          if (row.userName == this.selectUserList[0].userName) {
            return this.msgError("知晓人不能是接令人！");
          }
        }
        this.selectUserList1.push(row);
      },
      //删除选中的人员
      removeUserList1(row, event, column) {
        var index = this.selectUserList1.indexOf(row);
        this.selectUserList1.splice(index, 1);
      },
      //人员选择确定按钮
      submitTreeSelect() {
        // if (this.selectUserList.length > 1) {
        //   this.msgSuccess("接令人员只能一个！！！");
        //   return;
        // }
        var selectName = "";
        var receiveId = "";
        for (var i = 0; i < this.selectUserList.length; i++) {
          selectName += this.selectUserList[i].workshopName + " " + this.selectUserList[i].nickName + ",";
          receiveId += this.selectUserList[i].personId + ",";
        }
        this.form.receiveName = selectName.substr(0, selectName.length - 1);
        this.form.receiveIds = receiveId.substr(0, receiveId.length - 1);
        this.open_dialog = false;
      },
      submitTreeSelect1() {
        var selectName = "";
        var receiveId = "";
        var selectUser = "";
        for (var i = 0; i < this.selectUserList1.length; i++) {
          selectName += this.selectUserList1[i].workshopName + " "
            + this.selectUserList1[i].userName + " " + this.selectUserList1[i].nickName + ",";
          selectUser += this.selectUserList1[i].workshopName + " " + this.selectUserList1[i].nickName + ",";
          receiveId += this.selectUserList1[i].personId + ",";
        }
        this.form.knowUser = selectUser.substr(0, selectUser.length - 1);
        this.form.knowPeople = selectName.substr(0, selectName.length - 1);
        this.form.peopleIds = receiveId.substr(0, receiveId.length - 1);
        this.open_dialog1 = false;
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          instructionNo: null,
          instructionTitle: null,
          sendDept: null,
          senderId: null,
          sender: null,
          knowPeople: null,
          startTime: null,
          endTime: null,
          startTime1: null,
          endTime1: null,
          scheduleId: null,
          peopleId: null,
          receiveId: null,
          receiveDept: null,
          receiveName: null,
          implementation: null,
          degreeEmergency: null,
          instructionContent: null,
          flag: 0,
          rejected: null,
          delFlag: null,
          createBy: null,
          creator: null,
          createTime: null
        };
        this.resetForm("form");
        this.clear();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      //重置
      resetQuery() {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
        this.dateTime = null;
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.clear();
        this.selectUserList = [];
        this.selectUserList1 = [];
        this.userList = [];
        this.userList1 = [];
        this.processDisplay = false;
        this.selectedFlag = false;
        this.diasabledFlag = false;
        getScheduleinstructioninfo(-1).then(response => {
          this.form = response.result;
          var date = new Date();
          var param = date.getFullYear();
          if (date.getMonth() < 10) {
            param += "-0" + (date.getMonth() + 1);
          } else {
            param += "-" + (date.getMonth() + 1);
          }
          if (date.getDate() < 10) {
            param += "-0" + date.getDate();
          } else {
            param += "-" + date.getDate();
          }
          if (date.getHours() < 10) {
            param += " 0" + date.getHours();
          } else {
            param += " " + date.getHours();
          }
          if (date.getMinutes() < 10) {
            param += ":0" + date.getMinutes();
          } else {
            param += ":" + date.getMinutes();
          }
          if (date.getSeconds() < 10) {
            param += ":0" + date.getSeconds();
          } else {
            param += ":" + date.getSeconds();
          }
          console.log(this.levelDict);
          this.form.level = this.levelDict[0].dictValue;
          this.form.startTime1 = param;
          this.form.degreeEmergency = "正常";
          this.open = true;
          this.title_add = "新增指令";
          this.addStutas = true
          this.button_show = 2;
        });
      },
      //人员选择框
      receivedNameSelect(id) {
        if (id == 1) {
          this.title_jl = "接令人选择";
          this.open_dialog = true;
        } else {
          this.title_zx = "知晓人选择";
          this.open_dialog1 = true;
        }
      },
      //关闭按钮
      handleClosed(row) {
        var id = row.id;
        this.$confirm('是否确认关闭指令?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return closedScheduleinstructioninfo(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("关闭成功");
        })
      },
      //按钮功能
      storageTemporary(param) {
        console.log(this.form.value);
        if(this.form.value){

          this.form.startTime1 = this.form.value[0]
          this.form.endTime1 = this.form.value[1]
        }
        // 222
        if (param == 9) {
          this.title_bh = "驳回";
          this.open_boh = true;
          return;
        }
        if (param == 8) {
          this.title_zf = "转发";
          this.open_dialog_zf = true;
          return;
        }
        this.form.flag = param;
        //转化默认的正常值
        if (this.form.degreeEmergency == "正常") {
          this.form.degreeEmergency = 0;
        }
        this.diasabledFlag = false;
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.instructionTitle.length > 64) {
              return this.msgError("输入标题超长！");
            }
            if (new Date(this.form.startTime1).getTime() - new Date(this.form.endTime1).getTime() >= 0) {
              return this.msgError("结束时间应大于开始时间！！");
            }
            if (param == 4 && this.form.implementation == null) {
              return this.msgError("请输入执行情况!");
            }
            if (this.form.implementation != null && this.form.implementation.length > 1024) {
              return this.msgError("输入执行情况字数过长!");
            }
            if (this.form.rejected != null && this.form.rejected.length > 1024) {
              return this.msgError("输入驳回原因字数过长!");
            }
            if (this.form.instructionContent.length > 1024) {
              return this.msgError("输入指令内容字数过长!");
            }
            if (this.form.id == null) {
              addScheduleinstructioninfo(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.clear();
                this.open = false;
                this.getList();
              });
            } else {
              updateScheduleinstructioninfo(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.clear();
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      //驳回确定
      rejectedTable() {
        if (this.rejectedContexts == "" || this.rejectedContexts == null) {
          return this.msgError("驳回原因不能为空！！！");
        }
        this.form.rejected = this.rejectedContexts;
        this.storageTemporary(3);
        this.open_boh = false;
        this.rejectedContexts = "";
        this.addStutas = false
        this.open = false;
      },
      //查看详细信息
      queryDetailById(row) {
        this.reset();
        this.clear();
        const id = row.id
        getScheduleinstructioninfo(id).then(response => {
          this.form = response.result;
          let status = response.result.status_string;
          this.sender = response.result.sender;
          this.form.value = [this.form.startTime1,this.form.endTime1]
          this.receiveName = response.result.receiveNames;
          this.knowlge = response.result.knowPeoples;
          let know = response.result.knowPeople;
          this.fileList = response.result.fileList;
          if (know === "" || know === undefined || know === null) {
            this.form.knowUser = "";
          } else {
            let knows = know.split(",");
            let people = "";
            for (let i = 0; i < knows.length; i++) {
              people += knows[i].split(" ")[0] + " " + knows[i].split(" ")[2] + ",";
            }
            this.form.knowUser = people.substring(0, people.length - 1);
          }
          //this.setWidthList();
          if (status !== 0) {
            this.processDisplay = true;
          }
          if (status == 2) {
            this.implementationType = 1;
            //this.rejectedType = 1;
            this.statusProcess = 2;
            this.enclosureDisplay = 1;
          } else if (status == 3) {
            this.rejectedType = 1;
          } else if (status == 4) {
            this.implementationType = 1;
            this.rejectedType = 1;
            this.statusProcess = 4;
            this.enclosureDisplay = 1;
            this.enclosureFlag = false;
          }
          this.open = true;
          this.diasabledFlag = true;
          this.disabledFlag = true;
          this.selectedFlag = true;
          this.title_add = "详细信息";
          this.button_show = 1;
        });
      },
      /** 编辑按钮操作 */
      handleUpdate(row) {
        this.clickRow = row
        this.reset();
        this.clear();
        this.diasabledFlag = false;
        this.disabledFlag = false;
        this.selectedFlag = false;
        this.processDisplay = false;
        const id = row.id
        getScheduleinstructioninfo(id).then(response => {
          this.form = response.result;
          this.form.value = [this.form.startTime1,this.form.endTime1]
          var know = response.result.knowPeople;
          this.fileList = response.result.fileList;
          var list = new Array();
          if (know == "" || know == undefined) {
            this.form.knowUser = "";
          } else {
            var knows = know.split(",");
            var people = "";
            for (var i = 0; i < knows.length; i++) {
              people += knows[i].split(" ")[0] + " " + knows[i].split(" ")[2] + ",";
            }
            this.form.knowUser = people.substring(0, people.length - 1);

            var knowlage = know.split(",");
            for (var i = 0; i < knowlage.length; i++) {
              var ab = knowlage[i].split(" ");
              var param = {
                "workshopName": ab[0],
                "userName": ab[1],
                "nickName": ab[2]
              };
              list.push(param);
            }
          }
          this.selectUserList1 = list;
          this.open = true;
          this.title_add = "修改指令";
          let status = response.result.status_string;
          console.log(status)
          if (status == 0) {
            this.button_show = 2;
          } else if (status == 1) {
            this.diasabledFlag = true;
            this.enclosureDisplay = 1;
            this.selectedFlag = true;
            this.button_show = 3;
            this.implementationType = 1;
          } else if (status == 2) {
            this.diasabledFlag = true;
            this.implementationType = 1;
            this.selectedFlag = true;
            //this.rejectedType = 1;
            this.enclosureDisplay = 1;
            this.button_show = 3;
          } else if (status == 3) {
            this.button_show = 2;
            this.rejectedType = 0;
            this.instructionContent = 1;
            this.diasabledFlag = false;
            this.selectedFlag = false;
          } else if (status == 4) {
            this.diasabledFlag = true;
            this.implementationType = 1;
            this.rejectedType = 1;
            this.button_show = 1;
          } else {
            this.diasabledFlag = true;
            this.button_show = 2;
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const id = row.id || this.ids
        this.$confirm('是否确认删除指令编号为"' + row.instructionNo + '"的数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delScheduleinstructioninfo(id);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize, this.queryParams.pageNum, this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      //功能清理
      clear() {
        this.activeKey = 'first';
        this.rejectedType = 0;
        this.implementationType = 0;
        this.button_show = 0;
        this.statusProcess = 0;
        this.enclosureDisplay = 0;
        this.setWidth = [];
      },
      //文件上传类型限制
      handleChecked(file) {
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        const mp4 = testmsg === 'mp4'
        const jpg = testmsg === 'jpg'
        const jpeg = testmsg === 'jpeg'
        const png = testmsg === 'png'
        const isLt2M = file.size / 1024 / 1024 < 20
        if (!mp4 && !jpg && !jpeg && !png) {
          this.msgError('只能上传MP4，MOV，JPG，JPEG，PNG格式的文件!');
          return false;
        }
        if (!isLt2M) {
          this.msgError('上传文件大小不能超过 20MB!');
          return false;
        }
        return (mp4 || jpg || jpeg || png) && isLt2M;
      },
      //上传文件不合法清除
      beforeRemove(file) {
        for (var i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].name == file.name) {
            this.fileList.splice(i, 1);
          }
        }
      },
      handleRemove(file) {
        const id = file.id;
        if (id == null) {
          return;
        }
        this.$confirm('是否确认删除"' + file.name + '"?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return deleteFileById(id);
        }).then(() => {
          this.msgSuccess("删除成功");
        })
      },
      handlePreview(file) {
        var param = {
          "url": file.url,
          "name": file.name
        }
        const downloadLoading = this.$loading({
          lock: true,
          text: '拼命下载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        downLoadFileByURL(param).then(response => {
          let url = window.URL.createObjectURL(new Blob([response]))
          let link = document.createElement('a')
          link.href = url
          link.setAttribute('download', file.name)
          link.click()
          downloadLoading.close();
        })
      },
      handleFilUploadSuccess(res, file, fileList) {
        this.fileList = fileList;
        this.$message.success("上传成功")
      },
      /**
       *  鼠标滑过事件
       */
      displayContext(i) {
        this.$refs[`${i}`][0].style.display = 'block';
      },
      noneContext(i) {
        this.$refs[`${i}`][0].style.display = 'none';
      },
    },
    watch: {
      // 根据名称筛选部门树
      deptName(val) {
        this.$refs.tree.filter(val);
      },
    },

  };
</script>
<style>
  .tabs {
    font-size: 14px;
    color: #657180;
  }

  .tabs-bar:after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #d7dde4;
    margin-top: -1px;
  }

  .tabs-tab {
    display: inline-block;
    padding: 4px 16px;
    margin-right: 6px;
    background: #fff;
    border: 1px solid #d7dde4;
    cursor: pointer;
    position: relative;
  }

  .tabs-tab-active {
    color: #3399ff;
    border-top: 1px solid #3399ff;
    border-bottom: 1px solid #fff;
  }

  .tabs-tab-active:before {
    content: '';
    display: block;
    height: 1px;
    background: #3399ff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .tabs-content {
    padding: 8px 0;
  }

  .mousehover {
    width: 50px;
    min-height: 80px;
    margin-top: -50px;
    position: absolute;
    background-color: #bfcbd9;
  }
</style>
