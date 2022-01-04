<template>

  <div class="app-container ">
  <div v-show="!showSearch" style="height:15px">
    </div>
    <el-form
    class="el-tianjia wzt_form formQuery"
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称:" prop="meterName">
        <el-input
          v-model="queryParams.meterName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属界区:" prop="eqid">
        <el-select v-model="queryParams.eqid" clearable placeholder="选择所属界区">
          <el-option
            v-for="dict in modeltreeOptions"
            :key="dict.id"
            :label="dict.modelName"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仪表类型:" prop="meterType">
        <el-select v-model="queryParams.meterType" placeholder="请选择仪表类型">
          <el-option
            v-for="dict in meterTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="parseInt(dict.dictValue)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用:" prop="isUse">
        <el-select
          v-model="queryParams.isUse"
          placeholder="请选择是否启用"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in isUseOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>
    <div class="form_content_pagination_two">
    <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['model:meter:add']"
        >新增
        </el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <div class="tablesfrom">
    <el-table
        :height="overflowHeight"
      v-loading="loading"
      :data="meterList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编码" align="center" prop="meterCode"/>
      <el-table-column label="名称" align="center" :width="this.tableColumnWidth" prop="meterName"/>
      <el-table-column label="位号" align="center" :width="this.tableColumnWidth" prop="tagNumber"/>
      <el-table-column label="所属界区" align="center" :width="this.tableColumnWidth" prop="eqName"/>
      <el-table-column label="量程上限" align="center"  :width="this.tableColumnWidth" prop="upperRangeLimit"/>
      <el-table-column
        label="累计标识"
        align="center"
        prop="cumulativeSigns"
        :formatter="cumulativeSignsFormat"
      />
      <el-table-column
        label="仪表类型"
        align="center"
        prop="meterType"
        :formatter="meterTypeFormat"
      />
      <el-table-column label="单位" align="center" prop="unit"/>
      <el-table-column
        label="虚实标识"
        align="center"
        prop="virtualAndRealSigns"
        :formatter="virtualAndRealSignsFormat"
      />
      <el-table-column label="系数" align="center" prop="coefficient"/>
      <el-table-column
        label="是否启用"
        align="center"
        prop="isUse"
        :formatter="isUseFormat"
      />
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['model:meter:edit']"
          >修改
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            class="delbtn"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['model:meter:remove']"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      style="height:60px"
    />
</div>
    <!-- 添加或修改仪对话框 -->
    <el-dialog class="wzt_dialog"  :title="title" :visible.sync="open" width="595px" append-to-body>
    <div class="wzt_dialog_header">
            {{title}}
            <span class="wzt_closeIcon" @click="open=false">
                  <i class="el-icon-close" size="14" ></i>
            </span>
          </div>
        <div class="wzt_dialog_body">
      <el-form
        v-show="dialog"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="margin-left:-10px;"
      >

        <el-row>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="编码:" prop="meterCode">
              <el-input v-model="form.meterCode" placeholder="请输入编码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="名称:" prop="meterName">
              <el-input v-model="form.meterName" placeholder="请输入名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="位号:" prop="tagNumber" v-if="form.virtualAndRealSigns == 0" >
              <el-input
                id="tagnameInput"
                v-model="form.tagNumber"
                v-on:click.native="onSearch"
                placeholder="请输入位号"
              />
            </el-form-item>
            <el-form-item label="位号:" prop="tagNumber1" v-if="form.virtualAndRealSigns == 1" >
              <el-input
                id="tagnameInput"
                v-model="form.tagNumber"
                v-on:click.native="onSearch"
                placeholder="请输入位号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="单位:" prop="unit">
              <el-select
                v-model="form.unit"
                placeholder="请选择单位"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in unitList"
                  :key="dict.unit"
                  :label="dict.unit"
                  :value="dict.unit"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="仪表类型:" prop="meterType">
              <el-select v-model="form.meterType" placeholder="请选择仪表类型">
                <el-option
                  v-for="dict in meterTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="量程上限:" prop="upperRangeLimit">
              <el-input-number
                v-model="form.upperRangeLimit"
                :step="1" :min="0" :max="10000000000"
                placeholder="请输入量程上限"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="所属界区:" prop="eqid">
              <el-select v-model="form.eqid" @change="selectWorkshop" filterable placeholder="请选择所属界区">
                <el-option
                  v-for="dict in modeltreeOptions"
                  :key="dict.id"
                  :label="dict.modelName"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="系数:" prop="coefficient">
              <el-input-number
                v-model="form.coefficient"
                :step="1" :min="0"
                placeholder="请输入系数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="虚实标识:">
              <el-radio-group v-model="form.virtualAndRealSigns">
                <el-radio
                  v-for="dict in virtualAndRealSignsOptions"
                  :key="dict.dictValue"
                  :label="parseInt(dict.dictValue)"
                >{{ dict.dictLabel }}
                </el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="累计标识:">
              <el-radio-group v-model="form.cumulativeSigns">
                <el-radio
                  v-for="dict in cumulativeSignsOptions"
                  :key="dict.dictValue"
                  :label="parseInt(dict.dictValue)"
                >{{ dict.dictLabel }}
                </el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="height: 50px">
            <el-form-item label="是否启用:">
              <el-radio-group v-model="form.isUse">
                <el-radio
                  v-for="dict in isUseOptions"
                  :key="dict.dictValue"
                  :label="parseInt(dict.dictValue)"
                >{{ dict.dictLabel }}
                </el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                style="width:465px"
                v-model="form.remark"
                type="textarea"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      </div>
      <div slot="footer" v-show="dialog" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title1" :visible.sync="open_dialog" width="800px" append-to-body>
      <div style="width: 100%; height: 100%; ">
        <el-row>
          <el-button @click="makeActive('+')">+</el-button>
          <el-button @click="makeActive('-')">-</el-button>
          <el-button @click="makeActive('*')">*</el-button>
          <el-button @click="makeActive('/')">/</el-button>
          <el-button @click="makeActive('(')">(</el-button>
          <el-button @click="makeActive(')')">)</el-button>
        </el-row>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          id="emojiInput"
          v-model="jobtitle"
          ref="userpass"
        >
        </el-input>
        <div style="width: 100%; height: 500px; overflow:auto; margin-top: 10px; overflow: auto">
          <el-input
            style="width: 400px"
            type="text"
            placeholder="请输入搜索关键词"
            v-model="managementquery.searchValue"
          >
          </el-input>
          <el-button type="primary" @click="autosearch()">搜索</el-button>
          <el-table
            v-loading="loading"
            :data="management"
            row-key="id"
          >
            <el-table-column label="ID" align="center" prop="id">
              <template slot-scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>
            <el-table-column label="位号" align="center" prop="serialNumber">
              <template slot-scope="scope">
                <a
                  @click="makeActive(scope.row.serialNumber,'judge')"
                  style="color: blue; cursor: pointer"
                >{{ scope.row.serialNumber }}</a
                >
              </template>
            </el-table-column>
            <el-table-column label="位号名称" align="center" prop="tagName"/>
            <el-table-column
              label="位号描述"
              align="center"
              prop="tagDescribe"
            />
          </el-table>
          <div class="block">
            <pagination
              v-show="total1 > 0"
              :total="total1"
              :page.sync="managementquery.pageNum"
              :limit.sync="managementquery.pageSize"
              @pagination="insertVariable"
            />
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="determine">确 定</el-button>
          <el-button @click="cancelpress">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listMeter,
    getMeter,
    delMeter,
    addMeter,
    updateMeter
  } from '@/api/model/meter'
  import { listTagnumber, getTagnumber } from '@/api/model/tagnumber'
  import { selectUnit } from '@/api/model/unit'
  import {listModeltree} from "../../../../api/model/modeltree";
  import Treeselect from "@riophae/vue-treeselect";
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'


  export default {
    name: 'Meter',
    components: {
      Treeselect
    },
    data() {
      return {
        title1: '',
        manaDataInt: [],
        searchval: '',
        eqList: '',
        areaName: '',
        textarea: '',
        pipeList: [],
        open_dialog: false,
        // 遮罩层
        loading: true,
        dialog: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        management: [],
        modeltreeOptions:[],
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 总条数
        total1: 0,
        // 仪表格数据
        meterList: [],
        //位号数据
        tagnumber: [],
        // 弹出层标题
        title: '',
        overflowHeight: 'auto',
        // 是否显示弹出层
        open: false,
        unitList: [],
        unitParams: {},
        // 仪表类型字典
        meterTypeOptions: [],

        batteryLimitOptions: [],
        // 虚实标识字典
        virtualAndRealSignsOptions: [],
        // 累计标识字典
        cumulativeSignsOptions: [],
        // 是否启用字典
        isUseOptions: [],
        tagnumberListquery: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          meterName: null,
          batteryLimit: null,
          meterType: null,
          isUse: null,
          eqid:null,
          eqName:null
        },
        jobtitle: '',
        managementquery: {
          pageNum: 1,
          pageSize: 10,
          searchValue: ''
        },
        eqParams: {
          level: 4
        },
        // 表单参数
        form: {},
        itemData: '',
        // 表单校验
        rules: {
          meterName: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            {max: 100, message: "名称超出最大长度100", trigger: "blur"}
          ],
          upperRangeLimit: [
            { required: true, message: '量程上限不能为空', trigger: 'blur' }
          ],
          meterType: [
            { required: true, message: '仪表类型不能为空', trigger: 'change' }
          ],
          coefficient: [
            { required: true, message: '系数不能为空', trigger: 'blur' }
          ],
          unit: [{ required: true, message: '单位不能为空', trigger: 'blur' },
            {max: 20, message: "单位超出最大长度20", trigger: "blur"}
          ],
          virtualAndRealSigns: [
            { required: true, message: '虚实标识不能为空', trigger: 'blur' }
          ],
          cumulativeSigns: [
            { required: true, message: '累计标识不能为空', trigger: 'blur' }
          ],
          isUse: [
            { required: true, message: '是否启用不能为空', trigger: 'blur' }
          ],
          meterCode: [
            { required: true, message: '编码不能为空', trigger: 'blur' },
            {max: 20, message: "编码超出最大长度20", trigger: "blur"}
          ],
          tagNumber: [
            { required: true, message: '位号不能为空', trigger: 'change' },
            {max: 500, message: "位号超出最大长度500", trigger: "blur"}
          ],
          remark: [
            {max: 200, message: "备注超出最大长度200", trigger: "blur"}
          ]
        }
      }
    },
    created() {
      this.getList()
      this.getTreeSelect()
      this.getUnitList()
      this.insertVariable()
      this.getDictsBatch('meter_type,inv_real_mark,addup_mark,is_use').then((response) => {
        this.meterTypeOptions = response.data.meter_type;
        this.virtualAndRealSignsOptions = response.data.inv_real_mark;
        this.cumulativeSignsOptions = response.data.addup_mark;
        this.isUseOptions = response.data.is_use;
      })
    },
    methods: {
      selectWorkshop(id) {
        let selectedWorkName = this.modeltreeOptions.find((item) => {
          return item.id === id
        })
        this.form.eqName = selectedWorkName.modelName
      },
      getTreeSelect() {
        listModeltree({"level":4,"isUse":0}).then(response => {
          this.modeltreeOptions = response.result;
        });
      },
      autosearch() {
        this.managementquery.pageNum = 1
        this.insertVariable()
      },
      insertVariable() {
        listTagnumber(this.managementquery).then((response) => {
          this.management = response.result
          this.total1 = response.total
        })
      },
      getUnitList() {
        this.loading = true
        selectUnit({isUse:0}).then((response) => {
          let ss = []
          for (let i = 0; i < response.result.length; i++) {
            ss.push({
              unit: response.result[i].unitName
            })
          }
          this.unitList = ss
        })
      },
      /** 查询仪列表 */
      getList() {
        this.loading = true
        listMeter(this.queryParams).then((response) => {
          this.meterList = response.result
          this.total = response.total
          this.loading = false
          this.open_dialog = false
          this.overflowHeight = this.styleHeight()
        })
      },
      // 仪表类型字典翻译
      meterTypeFormat(row, column) {
        return this.selectDictLabel(this.meterTypeOptions, row.meterType)
      },
      // 虚实标识字典翻译
      virtualAndRealSignsFormat(row, column) {
        return this.selectDictLabel(
          this.virtualAndRealSignsOptions,
          row.virtualAndRealSigns
        )
      },
      // 累计标识字典翻译
      cumulativeSignsFormat(row, column) {
        return this.selectDictLabel(
          this.cumulativeSignsOptions,
          row.cumulativeSigns
        )
      },
      // 是否启用字典翻译
      isUseFormat(row, column) {
        return this.selectDictLabel(this.isUseOptions, row.isUse)
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.open_dialog = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          textarea: null,
          id: null,
          meterCode: null,
          meterName: null,
          tagNumber: null,
          upperRangeLimit: null,
          meterType: null,
          batteryLimit: null,
          coefficient: 1,
          eqName: null,
          unit: null,
          virtualAndRealSigns: 0,
          cumulativeSigns: 0,
          isUse: 0,
          remark: null,
          createTime: null,
          creator: null,
          createBy: null,
          updateTime: null,
          updateBy: null,
          updator: null,
          eqid: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map((item) => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.jobtitle = null
        this.open = true
        this.title = '添加仪表'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getMeter(id).then((response) => {
          this.form = response.result
          this.jobtitle = this.form.tagNumber
          this.open = true
          this.title = '修改仪表'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id != null) {
              updateMeter(this.form).then((response) => {
                this.msgSuccess('修改成功')
                this.open = false
                this.open_dialog = false
                this.getList()
              })
            } else  {
                addMeter(this.form).then(response => {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                });
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        const  meterName= row.meterName;

        this.$confirm('是否确认删除仪表名称为"' + meterName + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function() {
            return delMeter(ids)
          })
          .then(() => {
            this.queryParams.pageNum = this.isOne(this.queryParams.pageSize,this.queryParams.pageNum,this.total);
            this.getList()
            this.msgSuccess('删除成功')
          })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download(
          'model/meter/export',
          {
            ...this.queryParams
          },
          `model_meter.xlsx`
        )
      },
      onSearch() {
        this.jobtitle = this.form.tagNumber
        this.title1 = '选择位号'
        this.open_dialog = true
      },
      cancelpress() {
        this.open_dialog = false
        this.jobtitle = null
      },
      determine() {
        this.open_dialog = false
        this.form.tagNumber = this.jobtitle
        this.jobtitle = null
      },
      makeActive(item, judge) {
        if (judge) {
          item = '$' + '{' + item + '}'
        }
        var elInput = document.getElementById('emojiInput') // 根据id选择器选中对象
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
        this.jobtitle = result // 赋值给表单中的的字段
      }
    }
  }
</script>
