<template>
  <div class="app-container">
  <div v-show="!showSearch" style="height:15px">
    </div>
    <el-form :model="queryParams" class="allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="所属界区:" prop="areaId">
        <el-select v-model="queryParams.areaId" placeholder="请选择界区" clearable size="small">
          <el-option
            v-for="dict in modeltreeOptions"
            :key="dict.id"
            :label="dict.modelName"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="能源介质:" prop="energyType">
        <el-select v-model="queryParams.energyType" placeholder="请选择能源介质" clearable size="small">
          <el-option
            v-for="dict in energyTypeOptions"
            :key="dict.energyCode"
            :label="dict.energyAlias"
            :value="dict.energyCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="节点类型:" prop="nodeType">
        <el-select v-model="queryParams.nodeType" placeholder="请选择节点类型" clearable size="small">
          <el-option
            v-for="dict in nodeTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="节点名称:" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入节点名称"
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
          v-hasPermi="['model:energyNode:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="energyNodeList">
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="能源节点名称" align="center" prop="name" />
      <el-table-column label="所属界区" align="center" prop="areaName" />
      <el-table-column label="能源节点类型" align="center" prop="nodeType" :formatter="nodeTypeFormat" />
      <el-table-column label="能源介质" align="center" prop="energyTypeName" />
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="是否启用" align="center" prop="isUse" :formatter="isUseFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:energyNode:edit']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            class="delbtn"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:energyNode:remove']"
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
    </div>
    <!-- 添加或修改能源节点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="655px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="编码:" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-row>
            <el-col :span="12">
                <el-form-item label="所属界区:" prop="areaId">
                  <el-select v-model="form.areaId" @change="changeArea" filterable placeholder="请选择界区">
                    <el-option
                      v-for="dict in modeltreeOptions"
                      :key="dict.id"
                      :label="dict.modelName"
                      :value="dict.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="能源介质:" prop="energyType">
                <el-select v-model="form.energyType" @change="changeEnergyType" placeholder="请选择能源介质">
                  <el-option
                    v-for="dict in energyTypeOptions"
                    :key="dict.energyCode"
                    :label="dict.energyAlias"
                    :value="dict.energyCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="节点类型:" prop="nodeType">
              <el-select v-model="form.nodeType" placeholder="请选择节点类型">
                <el-option
                  v-for="dict in nodeTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="节点公式:" prop="formula">
              <el-input v-model="form.formula" placeholder="请输入节点公式" v-on:click.native="searchFormula"/>
            </el-form-item>
          </el-col>
            <el-col :span="12">
              <el-form-item label="排序:" prop="orderNum">
                <el-input-number v-model="form.orderNum" :step="1" :min="0" placeholder="请输入排序"/>
              </el-form-item>
            </el-col>
          <el-col :span="12">
          <el-form-item label="是否启用:" prop="isUse">
            <el-radio-group v-model="form.isUse">
              <el-radio
                v-for="dict in isUseOptions"
                :key="dict.dictValue"
                :label="parseInt(dict.dictValue)"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
          </el-col>
          <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="节点公式配置" :visible.sync="openFormula" width="800px" append-to-body>
        <el-row>
          <el-button @click="makeActive('+')">+</el-button>
          <el-button @click="makeActive('-')">-</el-button>
          <el-button @click="makeActive('*')">*</el-button>
          <el-button @click="makeActive('/')">/</el-button>
          <el-button @click="makeActive('(')">(</el-button>
          <el-button @click="makeActive(')')">)</el-button>
        </el-row>
        <el-input
          id="formula"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="formula"
          style="margin-top: 10px;margin-bottom: 10px"
        >
        </el-input>
        <el-tabs type="border-card" style="height: 530px;">
          <el-tab-pane label="能源仪表">
            <el-table :data="meterList" style="height: 400px;overflow: auto" >
              <el-table-column label="仪表名称" align="center" prop="name" />
              <el-table-column label="数据版本" align="center" prop="dataVersion">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.dataVersion" placeholder="请选择数据版本">
                    <el-option
                      v-for="dict in meterDataVersionOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="parseInt(dict.dictValue)"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-top"
                    @click="makeActive(scope.row,'judge')"
                  >选择</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="totalMeter>0"
              :total="totalMeter"
              :page.sync="queryMeterParams.pageNum"
              :limit.sync="queryMeterParams.pageSize"
              @pagination="getMeterList"
            />
          </el-tab-pane>
          <el-tab-pane label="能源节点">
            <el-table :data="nodeList" style="height: 400px;overflow: auto" >
              <el-table-column label="节点名称" align="center" prop="name" />
              <el-table-column label="数据版本" align="center" prop="dataVersion">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.dataVersion" placeholder="请选择数据版本">
                    <el-option
                      v-for="dict in nodeDataVersionOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="parseInt(dict.dictValue)"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-top"
                    @click="makeActive(scope.row,'judge')"
                  >选择</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="totalNode>0"
              :total="totalNode"
              :page.sync="queryNodeParams.pageNum"
              :limit.sync="queryNodeParams.pageSize"
              @pagination="getNodeList"
            />
          </el-tab-pane>
          <el-tab-pane label="运行参数">
            <el-table :data="paramList" style="height: 400px;overflow: auto" >
              <el-table-column label="参数名称" align="center" prop="name" />
              <el-table-column label="数据版本" align="center" prop="dataVersion">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.dataVersion" placeholder="请选择数据版本">
                    <el-option
                      v-for="dict in paramDataVersionOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="parseInt(dict.dictValue)"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-top"
                    @click="makeActive(scope.row,'judge')"
                  >选择</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="totalParam>0"
              :total="totalParam"
              :page.sync="queryParamParams.pageNum"
              :limit.sync="queryParamParams.pageSize"
              @pagination="getParamList"
            />
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitFormula">确 定</el-button>
          <el-button @click="cancelFormula">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { listEnergyNode, getEnergyNode, delEnergyNode, addEnergyNode, updateEnergyNode } from "@/api/model/energyNode";
import {listModeltree} from "@/api/model/modeltree";
import { selectListEnergy } from "@/api/model/energy";
import { listMeter } from '@/api/model/meter'
import { listOperationParam } from "@/api/model/operationParam";
export default {
  name: "EnergyNode",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      //模型树选项
      modeltreeOptions: [],
      energyTypeOptions: [],
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
      totalMeter: 0,
      totalNode: 0,
      totalParam: 0,
      // 能源节点表格数据
      energyNodeList: [],
      meterList: [],
      nodeList: [],
      paramList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openFormula: false,
      formula: null,
      // 节点类型字典
      nodeTypeOptions: [],
      meterDataVersionOptions: [],
      nodeDataVersionOptions: [],
      paramDataVersionOptions: [],
      // 是否启用字典
      isUseOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        name: null,
        areaId: null,
        areaName: null,
        energyType: null,
        energyTypeName: null,
        nodeType: null,
        isUse: null,
      },
      queryMeterParams:{
        pageNum: 1,
        pageSize: 10,
        meterType: 2,
        isUse:0
      },
      queryNodeParams:{
        pageNum: 1,
        pageSize: 10,
        isUse:0
      },
      queryParamParams:{
        pageNum: 1,
        pageSize: 10,
        meterType: 2,
        isUse:0
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [
          { required: true, message: "编码不能为空", trigger: "blur" },
          { max: 20, message: "编码最多20个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { max: 100, message: "名称最多100个字符", trigger: "blur" }
        ],
        areaId: [
          { required: true, message: "所属界区不能为空", trigger: "change" }
        ],
        energyType: [
          { required: true, message: "能源介质不能为空", trigger: "change" }
        ],
        nodeType: [
          { required: true, message: "节点类型不能为空", trigger: "change" }
        ],
        formula: [
          { max: 500, message: "节点公式最多500个字符", trigger: "change" }
        ],
        isUse: [
          { required: true, message: "是否启用不能为空", trigger: "change" }
        ],
        remark: [
          { max: 200, message: "备注最多200个字符", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getTreeSelect();
    this.getEnergyTypeSelect();
    this.getList();
    this.getDictsBatch("is_use,energy_node_type,meter_data_version,node_data_version,param_data_version").then(response => {
      this.isUseOptions = response.data.is_use;
      this.nodeTypeOptions = response.data.energy_node_type;
      this.meterDataVersionOptions = response.data.meter_data_version;
      this.nodeDataVersionOptions = response.data.node_data_version;
      this.paramDataVersionOptions = response.data.param_data_version;
    });
  },
  methods: {
    getMeterList() {
      listMeter(this.queryMeterParams).then((response) => {
        this.totalMeter = response.total;
        if(response.result!=null && response.result.length>0){
          this.meterList = response.result.map(item=>{
            return {"type":"meter","id":item.id,"name":item.meterName,"dataVersion":1}
          })
        }
      })
    },
    getNodeList() {
      listEnergyNode(this.queryNodeParams).then((response) => {
        this.totalNode = response.total;
        if(response.result!=null && response.result.length>0){
          this.nodeList = response.result.map(item=>{
            return {"type":"node","id":item.id,"name":item.name,"dataVersion":1}
          })
        }
      })
    },
    getParamList() {
      listOperationParam(this.queryParamParams).then((response) => {
        this.totalParam = response.total;
        if(response.result!=null && response.result.length>0){
          this.paramList = response.result.map(item=>{
            return {"type":"param","id":item.id,"name":item.name,"dataVersion":1}
          })
        }
      })
    },

    getTreeSelect() {
      listModeltree({"level":4,"isUse":0}).then(response => {
        this.modeltreeOptions = response.result;
      });
    },
    getEnergyTypeSelect(){
      selectListEnergy({"isUse":0}).then(response => {
        this.energyTypeOptions = response.result;
      });
    },
    /** 查询能源节点列表 */
    getList() {
      this.loading = true;
      listEnergyNode(this.queryParams).then(response => {
        this.energyNodeList = response.result;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 节点类型字典翻译
    nodeTypeFormat(row, column) {
      return this.selectDictLabel(this.nodeTypeOptions, row.nodeType);
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
        code: null,
        name: null,
        areaId: null,
        areaName: null,
        energyType: null,
        energyTypeName: null,
        nodeType: null,
        formula: null,
        orderNum: 0,
        isUse: 0,
        remark: null
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
      this.title = "添加能源节点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEnergyNode(id).then(response => {
        this.form = response.result;
        this.open = true;
        this.title = "修改能源节点";
      });
    },
    changeArea(areaId){
      let area = this.modeltreeOptions.find((item) => {
        return item.id === areaId
      })
      this.form.areaName = area.modelName
    },
    changeEnergyType(energyType){
      let energy = this.energyTypeOptions.find((item) => {
        return item.energyCode == energyType
      })
      this.form.energyTypeName = energy.energyAlias
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEnergyNode(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEnergyNode(this.form).then(response => {
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
      this.$confirm('是否确认删除能源节点名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEnergyNode(ids);
        }).then(() => {
          this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('model/energyNode/export', {
        ...this.queryParams
      }, `model_energyNode.xlsx`)
    },
    searchFormula(){
      this.getMeterList();
      this.getNodeList();
      this.getParamList();
      this.formula = this.form.formula;
      this.openFormula = true;
    },
    makeActive(item, judge) {
      if (judge) {
        item = '${' + item.type+'|'+ item.id+'|'+item.dataVersion+'|'+item.name + '}'
      }
      var elInput = document.getElementById('formula') // 根据id选择器选中对象
      var startPos = elInput.selectionStart // input 第0个字符到选中的字符
      var endPos = elInput.selectionEnd // 选中的字符到最后的字符
      if (startPos === undefined || endPos === undefined) return
      var txt = elInput.value
      // 将表情添加到选中的光标位置
      var result = txt.substring(0, startPos) + item + txt.substring(endPos)
      elInput.value = result // 赋值给input的value
      // 重新定义光标位置
      elInput.focus()
      elInput.selectionStart = startPos + item.length
      elInput.selectionEnd = startPos + item.length
      this.formula = result // 赋值给表单中的的字段
    },
    submitFormula(){
      this.form.formula = this.formula;
      this.openFormula = false;
    },
    cancelFormula(){
      this.formula = null;
      this.openFormula = false;
    }
  }
};
</script>
