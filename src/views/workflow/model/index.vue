<template>
  <CommonPage>
    <template #action>
      <NButton @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新模型
      </NButton>
    </template>
    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="listModel"
    >
      <MeQueryItem label="模型标识" :label-width="50">
        <n-input
          v-model:value="queryItems.modelKey"
          type="text"
          placeholder="请输入模型标识"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="模型名称" :label-width="50">
        <n-input
          v-model:value="queryItems.modelName"
          type="text"
          placeholder="请输入模型名称"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="流程分类" prop="category">
        <!--        <n-select v-model:value="queryParams.category" clearable placeholder="请选择" size="small" /> -->
        <n-input
          v-model:value="queryItems.category"
          type="text"
          placeholder="请输入流程分类"
          clearable
        />
      </MeQueryItem>
    </MeCrud>
    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        :model="modalForm"
        :rules="rules"
        label-width="80px"
        :disabled="modalAction !== 'add'"
      >
        <n-form-item label="模型标识" prop="modelKey">
          <n-input v-model:value="modalForm.modelKey" clearable />
        </n-form-item>
        <n-form-item label="模型名称" prop="modelName">
          <n-input
            v-model:value="modalForm.modelName"
            clearable
            :disabled="modalForm.modelId !== undefined"
          />
        </n-form-item>
        <n-form-item label="流程分类" prop="category">
          <n-select
            v-model:value="modalForm.category"
            placeholder="请选择"
            clearable
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item label="描述" prop="description">
          <n-input
            v-model:value="modalForm.description"
            type="textarea"
            placeholder="请输入内容"
            maxlength="200"
            show-word-limit
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="dialog-footer">
          <NButton type="primary" @click="submitForm">
            确 定
          </NButton>
          <NButton @click="cancel()">
            取 消
          </NButton>
        </div>
      </template>
    </MeModal>
    <!-- 流程图 -->
    <MeModal
      v-model:show="processView.open"
      :title="processView.title"
      width="700"
      preset="dialog"
    >
      <ProcessViewer
        :key="`designer-${processView.index}`"
        :xml="processView.xmlData"
        :style="{ height: '400px' }"
      />
    </MeModal>

    <MeModal
      v-model:show="history.open"
      title="模型历史"
      width="700"
      preset="dialog"
    >
      <n-data-table
        v-if="!history.loading"
        ref="historyTableRef"
        :columns="historyColumns"
        :data="historyList"
        :pagination="false"
        row-key="modelId"
        :scroll-x="800"
      />
      <n-spin
        v-if="history.loading"
        style="
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
        "
      />
    </MeModal>

    <MeModal
      v-model:show="designerOpen"
      :title="designerData.title"
      preset="fullscreen"
      :closable="false"
    >
      <div v-if="!designerData.loading">
        <ProcessDesigner
          :key="designerOpen"
          ref="modelDesigner"
          style="border: 1px solid rgba(0, 0, 0, 0.1)"
          :bpmn-xml="designerData.bpmnXml"
          :designer-form="designerData.form"
          @save="onSaveDesigner"
        />
      </div>
      <n-spin
        v-else
        style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      />
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NCollapse, NCollapseItem, NTag } from 'naive-ui'
import {
  addCategory,
  delCategory,
  updateCategory,
} from '@/api/workflow/category.js'
import {
  addModel,
  deployModel,
  getBpmnXml,
  historyModel,
  latestModel,
  listModel,
  updateModel,
} from '@/api/workflow/model'
import { MeCrud, MeModal, MeQueryItem } from '@/components/index.js'
import { useCrud } from '@/composables/index.js'

const $table = ref(null)
const formRef = ref(null)
const historyTableRef = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
// 遮罩层
onMounted(() => {
  $table.value?.handleSearch()
})
const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleEdit,
  handleDelete,
  handleOpen,
  handleSave,
} = useCrud({
  name: '分类',
  initForm: { enable: true },
  doCreate: addCategory,
  doDelete: delCategory,
  doUpdate: updateCategory,
  refresh: () => $table.value?.handleSearch(),
})
const loading = ref(false)
// 选中数组
const ids = ref([])
// 非单个禁用
const single = ref(true)
// 非多个禁用
const multiple = ref(true)
// 显示搜索条件
const showSearch = ref(true)
// 总条数
const total = ref(0)
// 流程模型表格数据
const modelList = ref([])
const categoryOptions = ref([])
const title = ref('')
const open = ref(false)
const form = ref({})
const rules = {
  modelKey: [{ required: true, message: '模型标识不能为空', trigger: 'blur' }],
  modelName: { required: true, message: '模型名称不能为空', trigger: 'blur' },
  category: [{ required: true, message: '请选择类型', trigger: 'change' }],
}
const designerOpen = ref(false)
const designerData = ref({
  loading: false,
  bpmnXml: '',
  modelId: null,
  form: {
    processName: null,
    processKey: null,
  },
})

const designerModelId = ref(null)
const processView = ref({
  title: '',
  open: false,
  index: undefined,
  xmlData: '',
})
const history = ref({
  open: false,
  loading: false,
})
// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  modelKey: null,
  modelName: null,
  category: null,
})

const historyList = ref([])

// 表格列配置
const columns = ref([
  {
    type: 'selection',
    width: 50,
    align: 'center',
  },
  {
    title: '模型标识',
    key: 'modelKey',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '模型名称',
    key: 'modelName',
    align: 'center',
    ellipsis: true,
    render: (row) => {
      // rewrite below code by h render function
      return h(
        NButton,
        {
          type: 'text',
          size: 'small',
          onClick: () => this.handleProcessView(row),
        },
        { default: () => row.modelName },
      )
    },
  },
  {
    title: '流程分类',
    key: 'categoryName',
    align: 'center',
    render: (row) => {
      return h(
        NTag,
        { type: 'info' },
        { default: () => `v${row.categoryName}` },
      )
    },
  },
  {
    title: '模型版本',
    key: 'version',
    align: 'center',
    render: (row) => {
      return h(NTag, { type: 'info' }, { default: () => `v${row.version}` })
    },
  },
  {
    title: '描述',
    key: 'description',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 280,
    render: (row) => {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'text',
            icon: 'edit',
            onClick: () => handleEdit(row),
            style: 'margin-right: 4px',
          },
          {
            default: () => '修改',
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'text',
            icon: 'brush',
            onClick: () => handleDesigner(row),
            style: 'margin-right: 4px',
          },
          {
            default: () => '设计',
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'text',
            icon: 'eye',
            onClick: () => handleDeploy(row),
            style: 'margin-right: 4px',
          },
          {
            default: () => '部署',
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          },
        ),
        h(
          NCollapse,
          [
            h(
              NCollapseItem,
              {
                title: '更多',
                name: '1',
                arrowPlacement: "left",
              },
              [
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'text',
                    icon: 'eye',
                    onClick: () => handleHistory(row),
                    style: 'margin-right: 4px',
                  },
                  {
                    default: () => '流程图',
                    icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
                  },
                ),
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'text',
                    icon: 'eye',
                    onClick: () => handleHistory(row),
                    style: 'margin-right: 4px',
                  },
                  {
                    default: () => '历史',
                    icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
                  },
                ),
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'text',
                    icon: 'eye',
                    onClick: () => handleHistory(row),
                    style: 'margin-right: 4px',
                  },
                  {
                    default: () => '删除',
                    icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
                  },
                ),
              ],
            ),
          ],
        ),
      ]
    },
  },
])

// 历史表格列配置
const historyColumns = ref([
  {
    type: 'selection',
    width: 50,
    align: 'center',
  },
  {
    title: '模型标识',
    key: 'modelKey',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '模型名称',
    key: 'modelName',
    align: 'center',
    ellipsis: true,
    render: (row) => {
      return h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          secondary: true,
          onClick: () => handleProcess(row),
        },
        {
          default: () => {
            row.modelName
          },
        },
      )
    },
  },
  {
    title: '流程分类',
    key: 'categoryName',
    align: 'center',
    render: row =>
      h(
        NTag,
        {
          size: 'small',
          type: 'info',
          ellipsis: true,
          onClick: () => this.handleCategory(row),
        },
        {
          default: () => {
            row.categoryName
          },
        },
      ),
  },
  {
    title: '模型版本',
    key: 'version',
    align: 'center',
    render: (row) => {
      return h(
        NTag,
        {
          size: 'small',
          type: 'info',
        },
        { default: () => `v${row.version}` },
      )
    },
  },
  {
    title: '描述',
    key: 'description',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    width: 200,
    render: (row) => {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'text',
            icon: 'play',
            onClick: () => handleDeploy(row),
            style: 'margin-right: 4px',
          },
          {
            default: () => '部署',
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'text',
            icon: 'star',
            onClick: () => handleLatest(row),
          },
          {
            default: () => '设为最新',
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          },
        ),
      ]
    },
  },
])

function submitForm() {
  if (modalAction.value === 'add') {
    addModel(modalForm.value)
  }
  else if (modalAction.value === 'edit') {
    updateModel(modalForm.value)
  }
}

/** 部署流程 */
function handleDeploy(row) {
  deployModel({
    modelId: row.modelId,
  })
    .then((response) => {
      this.$message.success(response.msg)
      const obj = { name: 'Deploy', path: '/workflow/deploy' }
      return this.$store.dispatch('tagsView/delCachedView', obj).then(() => {
        this.$router.push(obj)
      })
    })
    .finally(() => {
      this.loading = false
    })
}

/** 查看流程图 */
function handleProcessView(row) {
  const modelId = row.modelId
  this.processView.title = '流程图'
  this.processView.index = modelId
  // 发送请求，获取xml
  getBpmnXml(modelId).then((response) => {
    this.processView.xmlData = response.data
  })
  this.processView.open = true
}

function getHistoryList() {
  this.history.loading = true
  historyModel(this.queryHistoryParams).then((response) => {
    this.historyTotal = response.total
    this.historyList = response.rows
    this.history.loading = false
  })
}

function handleHistory(row) {
  history.value.open = true
  this.queryHistoryParams.modelKey = row.modelKey
  this.getHistoryList()
}

/** 设为最新版 */
function handleLatest(row) {
  this.$dialog.confirm('是否确认将此版本设为最新？').then(() => {
    this.history.loading = true
    latestModel({
      modelId: row.modelId,
    })
      .then((response) => {
        history.value.open = false
        this.getList()
        this.$message.success(response.msg)
      })
      .finally(() => {
        this.history.loading = false
      })
  })
}
</script>
