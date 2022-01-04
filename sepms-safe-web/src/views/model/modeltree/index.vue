<template>
  <div class="app-container ">
    <div v-show="!showSearch" style="height:15px">
    </div>
    <el-form :model="queryParams" class=" allinput wzt_form" ref="queryForm" :inline="true" v-show="showSearch" >
      <el-form-item label="模型名称:" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          placeholder="请输入模型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="启用状态:" prop="isUse">
        <el-select v-model="queryParams.isUse" placeholder="请选择启用状态" clearable size="small">
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
  <div class="formQuery form_content_pagination">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(undefined)"
          v-hasPermi="['model:modeltree:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar  :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
    class="tree_tables WZT-TREEtable"
      v-loading="loading"
      :data="modeltreeList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      icon-class="el-icon-caret-right"
    >
      <!--<el-table-column label="编码" align="center" prop="code" />-->
      <el-table-column class="wzt_Onechilren_cell"  label="模型名称" show-overflow-tooltip width="320" align="left" prop="modelName" />
      <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="层级" align="center" prop="level" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="启用状态" align="center" prop="isUse" :formatter="isUseFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:modeltree:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            class="add_btn"
            v-hasPermi="['model:modeltree:add']"
            v-if="(scope.row.type =='pm_model_park' || scope.row.type =='pm_model_company' || scope.row.type =='pm_model_workshop' || scope.row.type =='pm_model_area')&& scope.row.isUse ==0"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            class="delbtn"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:modeltree:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
</div>
    <!-- 添加或修改模型树对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="685px" append-to-body>
      <el-form ref="form" style="margin-left:-20px;" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级模型:"  prop="parentId">
              <treeselect v-model="form.parentId" disabled :options="modeltreeOptions" :normalizer="normalizer" placeholder="上级模型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型:" prop="type" v-show="false">
              <el-select v-model="form.type" disabled placeholder="请选择类型">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--园区附加信息-->
          <template v-if="form.type == 'pm_model_park'">
            <el-col :span="24">
              <el-form-item label="园区名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入园区名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="园区编码:" prop="code">
                <el-input v-model="form.code" style="width:217px" placeholder="请输入园区编码" />
              </el-form-item>
            </el-col>
          </template>
          <!--公司附加信息-->
          <template v-if="form.type == 'pm_model_company'">
            <el-col :span="24">
              <el-form-item label="公司名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司编码:" prop="code">
                <el-input v-model="form.code" style="width:217px" placeholder="请输入公司编码" />
              </el-form-item>
            </el-col>
          </template>
          <!--车间信息-->
          <template v-if="form.type == 'pm_model_workshop'">
            <el-col :span="24">
              <el-form-item label="车间名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入车间名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车间编码:" prop="code">
                <el-input v-model="form.code" style="width:217px" placeholder="请输入车间编码" />
              </el-form-item>
            </el-col>
          </template>
          <!--界区信息-->
          <template v-if="form.type == 'pm_model_area'">
            <el-col :span="24">
              <el-form-item label="界区名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入界区名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="界区编码:" prop="code">
                <el-input style="width:220px;" v-model="form.code" placeholder="请输入界区编码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="界区类型:" prop="areaType">
                <el-select style="width:220px;" v-model="form.areaType" @change="changeAreaType" placeholder="请选择界区类型">
                  <el-option
                    v-for="dict in areaTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库类型:" prop="areaSubType" v-if="form.areaType == 2">
                <el-select v-model="form.areaSubType" style="width:220px" placeholder="请选择仓库类型">
                  <el-option
                    v-for="dict in warehouseTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="装置界区类型" prop="areaSubType"  v-if="form.areaType == 3" label-width="110px">
                <el-select v-model="form.areaSubType" placeholder="请选择装置界区类型">
                  <el-option
                    v-for="dict in equipmentAreaOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="罐区类型:" prop="areaSubType" v-if="form.areaType == 4">
                <el-select v-model="form.areaSubType" placeholder="请选择罐区类型">
                  <el-option
                    v-for="dict in tankAreaOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <!--班组信息-->
          <template v-if="form.type == 'pm_model_clazz'">
            <el-col :span="24">
              <el-form-item label="模型名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入模型名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="班组编码:" prop="code">
                <el-input v-model="form.code" placeholder="请输入班组编码" />
              </el-form-item>
            </el-col>
          </template>
          <!--进出场装置信息-->
          <template v-if="form.type == 'pm_equipment_in_out'">
            <el-col :span="24">
              <el-form-item label="节点名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入节点名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="节点编码:" prop="code">
                <el-input style="width:217px" v-model="form.code" placeholder="请输入节点编码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运输类型:" prop="transportType">
                <el-select style="width:220px" v-model="form.transportType" placeholder="请选择运输类型">
                  <el-option
                    v-for="dict in transportTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进出类型:" prop="inOutType">
                <el-select style="width:220px" v-model="form.inOutType"  placeholder="请选择进出类型">
                  <el-option
                    v-for="dict in ioTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="精度:" prop="accuracy">
                <el-input-number  style="width:220px" v-model="form.accuracy"  :step="1" :max="100" :min="0" placeholder="请输入精度" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="班量计量:" prop="measureType">
                <el-select style="width:220px" v-model="form.measureType" placeholder="请选择班量计量类型">
                  <el-option
                    v-for="dict in measureTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <!--仓库装置信息-->
          <template v-if="form.type == 'pm_equipment_warehouse'">
            <el-col :span="24">
              <el-form-item label="节点名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入节点名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="节点编码:" prop="code">
                <el-input v-model="form.code" placeholder="请输节点编码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分区:" prop="warehousePartition">
                <el-select v-model="form.warehousePartition" placeholder="请选择分区">
                  <el-option
                    v-for="dict in warehousePartitionOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <!--焦化装置信息-->
          <template v-if="form.type == 'pm_equipment_coking'">
            <el-col :span="24">
              <el-form-item label="节点名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入节点名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="节点编码:" prop="code">
                <el-input v-model="form.code" placeholder="请输入节点编码" />
              </el-form-item>
            </el-col>
            <el-col :span="12" >
              <el-form-item  label="装置类型:" prop="cokingType">
                <el-select v-model="form.cokingType" placeholder="请选择装置类型">
                  <el-option
                    v-for="dict in eqjhTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="加工能力:" prop="processAble">
                <el-input v-model="form.processAble" placeholder="请输入加工能力" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位:" prop="unit">
                <el-select v-model="form.unit" placeholder="请选择单位">
                  <el-option
                    v-for="item in unitOptions"
                    :key="item.unitName"
                    :label="item.unitName"
                    :value="item.unitName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规定结焦时间:" prop="cokingTime" v-if="form.cokingType == 4" label-width="110px">
                <el-input v-model="form.cokingTime" placeholder="请输入规定结焦时间" />
              </el-form-item>
            </el-col>
          </template>
          <!--罐区装置信息-->
          <template v-if="form.type == 'pm_equipment_tank'">
            <el-col :span="24">
              <el-form-item label="节点名称:" prop="name">
                <el-input v-model="form.name" placeholder="请输入节点名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="节点编码:" prop="code">
                <el-input v-model="form.code" placeholder="请输入节点编码" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型:" prop="tankType">
                <el-select style="width:217px" v-model="form.tankType" placeholder="请选择罐类型" clearable >
                  <el-option
                    v-for="dict in eqgqTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="罐高:" prop="height">
                <el-input-number style="width:217px" v-model="form.height"  :step="1" :min="0" placeholder="请输入罐高" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大容积:" prop="maxBulk">
                <el-input-number style="width:220px" v-model="form.maxBulk" :step="1" :min="0" placeholder="请输入最大容积" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="浮盘质量:" prop="quality">
                <el-input-number style="width:217px" v-model="form.quality" :step="1" :min="0" placeholder="请输入浮盘质量" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="罐底高度:" prop="bottomHeight">
                <el-input-number style="width:220px" v-model="form.bottomHeight"  :step="1" :min="0" placeholder="请输入罐底高度" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安全高度:" prop="securityHeight">
                <el-input-number style="width:217px" v-model="form.securityHeight" :step="1"  :min="0"  placeholder="请输入安全高度" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="精度:" prop="accuracy">
                <el-input-number style="width:220px" v-model="form.accuracy" :step="1" :max="100" :min="0" placeholder="请输入精度" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12" v-show = "false">
            <el-col :span="20">
              <el-form-item label="所属层级:" prop="level">
                <el-input disabled v-model="form.type" />
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序:" prop="orderNum" style="">
              <el-input-number   v-model="form.orderNum"  style="width:220px" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用:" prop="isUse">
              <el-radio-group v-model="form.isUse">
                <el-radio
                  v-for="dict in isUseOptions"
                  :key="parseInt(dict.dictValue)"
                  :label="parseInt(dict.dictValue)"
                  :value="parseInt(dict.dictValue)"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息:" prop="remark">
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
  </div>
</template>

<script>
  import { addModeltree, delModeltree, delModeltreeById, getModeltree, listModeltree, updateModeltree,getNextCode } from '@/api/model/modeltree'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { selectUnit } from '@/api/model/unit'

  export default {
    name: "Modeltree",
    components: {
      Treeselect
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 模型树表格数据
        modeltreeList: [],
        // 模型树树选项
        modeltreeOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 类型字典
        typeOptions: [],
        // 启用状态字典
        isUseOptions: [],
        // 界区类型字典
        areaTypeOptions: [],
        warehouseTypeOptions: [],
        equipmentAreaOptions: [],
        tankAreaOptions: [],
        eqgqTypeOptions: [],
        transportTypeOptions:[],
        ioTypeOptions:[],
        measureTypeOptions:[],
        eqjhTypeOptions:[],
        warehousePartitionOptions:[],
        unitOptions:[],
        // 查询参数
        queryParams: {
          type: null,
          modelName: null,
          aliasName: null,
          isUse: null,
          level: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          parentId: [
            { required: true, message: "上级模型不能为空", trigger: "change" }
          ],
          type: [
            { required: true, message: "类型不能为空", trigger: "change" }
          ],
          name: [
            { required: true, message: "模型名称不能为空", trigger: "blur" },
            {max: 100, message: "名称最多100个字符", trigger: "blur"}
          ],
          orderNum: [
            { required: true, message: "显示顺序不能为空", trigger: "blur" }
          ],
          isUse: [
            { required: true, message: "启用状态不能为空", trigger: "change" }
          ],
          code: [
            { required: true, message: "编码不能为空", trigger: "blur" },
            {max: 20, message: "编码最多20个字符", trigger: "blur"}
          ],
          areaType: [
            { required: true, message: "界区类型不能为空", trigger: "change" }
          ],
          areaSubType: [
            { required: true, message: "类型不能为空", trigger: "blur" }
          ],
          warehousePartition: [
            { required: true, message: "分区不能为空", trigger: "change" }
          ],
          transportType: [
            { required: true, message: "运输类型不能为空", trigger: "change" }
          ],
          inOutType: [
            { required: true, message: "进出类型不能为空", trigger: "change" }
          ],
          measureType: [
            { required: true, message: "班量计量不能为空", trigger: "change" }
          ],
          cokingType: [
            { required: true, message: "装置类型不能为空", trigger: "change" }
          ],
          processAble: [
            { max: 50, message: "加工能力最多50个字符", trigger: "blur"},
            { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式,可保留两位小数' }
          ],
          cokingTime: [
            { required: true, message: "规定结焦时间不能为空", trigger: "blur" },
            { pattern: /^(?:\d+)(?::[0-5]\d)$/, message: '请输入正确的时分格式' }
          ],
          height: [
            { required: true, message: "罐高不能为空", trigger: "blur" }
          ],
          maxBulk: [
            { required: true, message: "最大容积不能为空", trigger: "blur" }
          ],
          tankType: [
            { required: true, message: "罐类型不能为空", trigger: "change" }
          ],
          quality: [
            { required: true, message: "浮盘质量不能为空", trigger: "blur" }
          ],
          bottomHeight: [
            { required: true, message: "罐底高度不能为空", trigger: "blur" }
          ],
          securityHeight: [
            { required: true, message: "安全高度不能为空", trigger: "blur" }
          ],
          accuracy: [
            { required: true, message: "精度不能为空", trigger: "blur" }
          ],
          remark: [
            { max: 200, message: "备注最多200个字符", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.getList();
      this.getDictsBatch("model_type,is_use,tank_type,area_type,warehouse_type,equipment_area_type,tank_area_type,in_out_type,mechanical_type,device_type,measure_type,warehouse_partition").then(response => {
        this.typeOptions = response.data.model_type;
        this.isUseOptions = response.data.is_use;
        this.eqgqTypeOptions = response.data.tank_type;
        this.areaTypeOptions = response.data.area_type;
        this.warehouseTypeOptions = response.data.warehouse_type;
        this.equipmentAreaOptions = response.data.equipment_area_type;
        this.tankAreaOptions = response.data.tank_area_type;
        this.ioTypeOptions = response.data.in_out_type;
        this.transportTypeOptions = response.data.mechanical_type;
        this.eqjhTypeOptions = response.data.device_type;
        this.measureTypeOptions = response.data.measure_type;
        this.warehousePartitionOptions = response.data.warehouse_partition;
      });
      this.getUnit()
    },
    methods: {
      /** 查询模型树列表 */
      getList() {
        this.loading = true;
        listModeltree(this.queryParams).then(response => {
          this.modeltreeList = this.treeDataTranslate(response.result, "id", "parentId");
          this.loading = false;
        });
      },
      /** 转换模型树数据结构 */
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
      /** 查询部门下拉树结构 */
      getTreeselect() {
        listModeltree().then(response => {
          this.modeltreeOptions = [];
          const data = { id: 0, modelName: '顶级节点',parentId :0, children: [] };
          data.children = this.handleTree(response.result, "id", "parentId");
          this.modeltreeOptions.push(data);
        });
      },
      // 类型字典翻译
      typeFormat(row, column) {
        if(row.type == "pm_model_area"){
          return this.selectDictLabel(this.areaTypeOptions, row.subType);
        }else if(row.type == "pm_equipment_tank"){
          return this.selectDictLabel(this.eqgqTypeOptions, row.subType);
        }else if(row.type == "pm_equipment_coking"){
          return this.selectDictLabel(this.eqjhTypeOptions, row.subType);
        }else{
          return this.selectDictLabel(this.typeOptions, row.type);
        }
      },
      // 启用状态字典翻译
      isUseFormat(row, column) {
        return this.selectDictLabel(this.isUseOptions, row.isUse);
      },
      tankTypeFormat(row, column) {
        return this.selectDictLabel(this.eqgqTypeOptions, row.eqgqType);
      },
      changeAreaType(){
        this.form.areaSubType = null
      },
      getUnit(){
        selectUnit({isUse:0}).then((response) => {
          this.unitOptions = response.result;
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
          parentId: null,
          code: null,
          type: null,
          hasChild: null,
          modelName: null,
          aliasName: null,
          orderNum: null,
          isUse: 0,
          delFlag: null,
          level: null,
          areaSubType: null,
          warehousePartition: null,
          height: 0,
          quality: 0,
          unit: null,
          maxBulk: 0,
          bottomHeight: 0,
          securityHeight: 0,
          accuracy: 0,
          cokingTime: null,
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      async handleAdd(row) {
        this.reset();
        this.getTreeselect();
        let modelType = '';
        if (row != undefined) {
          this.form.parentId = row.id;
          if(row.type=="pm_model_park"){
            this.form.type = "pm_model_company";
            modelType = '公司'
          }else if(row.type=="pm_model_company"){
            this.form.type = "pm_model_workshop";
            modelType = '车间'
          }else if(row.type=="pm_model_workshop"){
            this.form.type = "pm_model_area";
            modelType = '界区'
          }else if(row.type=="pm_model_area"){
              if(row.subType == 1){
                this.form.type = "pm_equipment_in_out";
                modelType = '进出厂点'
              }else if(row.subType == 2){
                this.form.type = "pm_equipment_warehouse";
                modelType = '库位'
              }else if(row.subType == 3){
                this.form.type = "pm_equipment_coking";
                modelType = '装置'
              }else if(row.subType == 4){
                this.form.type = "pm_equipment_tank";
                modelType = '罐'
              }
          }
        }else{
          this.form.parentId = 0;
          this.form.type = "pm_model_park";
          modelType = '园区'
        }
        await getNextCode({"parentId":this.form.parentId,"type":this.form.type}).then(response => {
          this.form.code = response.result;
        });
        this.open = true;
        this.title = "添加"+modelType;

      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getTreeselect();
        if (row != null) {
          this.form.parentId = row.id;
        }
        getModeltree({id:row.id, type:row.type}).then(response => {
          this.form = response.result;
          let modelType = '';
          if(this.form.type=="pm_model_park"){
            modelType = '园区'
          }else if(this.form.type=="pm_model_company"){
            modelType = '公司'
          }else if(this.form.type=="pm_model_workshop"){
            modelType = '车间'
          }else if(this.form.type=="pm_model_area"){
            modelType = '界区'
          }else if(this.form.type=="pm_equipment_in_out"){
            modelType = '进出厂点'
          }else if(this.form.type=="pm_equipment_warehouse"){
            modelType = '库位'
          }else if(this.form.type=="pm_equipment_coking"){
            modelType = '装置'
          }else if(this.form.type=="pm_equipment_tank"){
            modelType = '罐'
          }
          this.open = true;
          this.title = "修改"+modelType;
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if(this.form.type=="pm_equipment_tank"){
              if(this.form.bottomHeight>this.form.height){
                this.msgError("罐底高度必须小于罐高度");
                return
              }
              if(this.form.securityHeight>this.form.height){
                this.msgError("罐安全高度必须小于罐高度");
                return
              }
            }
            if (this.form.id != null) {
              updateModeltree(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addModeltree(this.form).then(response => {
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
        this.$confirm('是否确认删除模型名称为"' + row.modelName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delModeltreeById({id:row.id, type:row.type});
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      }
    }
  };
</script>
