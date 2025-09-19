<template>
  <CommonPage>
    <template #action>
      <n-flex>
        <NButton type="primary" @click="handleAdd()">
          <i class="i-material-symbols:add mr-4 text-18" />
          创建
        </NButton>
      </n-flex>
    </template>
    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="listForm"
    >
      <MeQueryItem label="表单名称" :label-width="50">
        <n-input
          v-model:value="queryItems.formName"
          type="text"
          placeholder="请输入表单名称"
          clearable
        />
      </MeQueryItem>
      <MeModal ref="modalRef" width="520px">
        <n-form
          ref="modalFormRef"
          label-placement="left"
          label-align="left"
          :label-width="80"
          :model="modalForm"
          :disabled="modalAction === 'view'"
        >
          <n-form-item
            v-if="['add'].includes(modalAction)"
            label="模型名称"
            path="formName"
            :rule="{
              required: true,
              message: '请输入模型名称',
              trigger: ['input', 'blur'],
            }"
          >
            <n-input v-model:value="modalForm.formName" />
          </n-form-item>
          <n-form-item
            v-if="['add'].includes(modalAction)"
            label="备注"
            path="remark"
            :rule="{
              required: true,
              message: '请输入备注',
              trigger: ['input', 'blur'],
            }"
          >
            <n-input v-model:value="modalForm.remark" />
          </n-form-item>
        </n-form>
      </MeModal>
      <!-- 预览表单对话框 -->

      <n-modal v-model:show="renderFormOpen" title="表单详情" width="60%" append-to-body>
        <v-form-render ref="vFormRef" :form-json="previewFormJson" :form-data="formData" :option-data="optionData" />
      </n-modal>
      <!-- 设计表单对话框 -->
      <n-modal v-model:show="designerFormOpen" custom-class="vf-designer" append-to-body>
        <v-form-designer
          ref="vfDesigner" :reset-form-json="true"
          :designer-config="{ externalLink: false, toolbarMaxWidth: 480 }"
        >
          <!-- 自定义按钮插槽 -->
          <template #customToolButtons>
            <el-button type="primary" @click="saveFormDesign">
              <i class="el-icon-finished" />保存
            </el-button>
            <el-button @click="designerFormOpen = false">
              关闭
            </el-button>
          </template>
        </v-form-designer>
      </n-modal>
    </MeCrud>
  </CommonPage>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { addForm, delForm, listForm, updateForm } from '@/api/workflow/form.js'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

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
} = useCrud({
  name: '模型',
  initForm: { enable: true },
  doCreate: addForm,
  doDelete: delForm,
  doUpdate: updateForm,
  refresh: () => $table.value?.handleSearch(),
})
const vfDesigner = ref(null)
const formData = ref(null)
const optionData = ref(null)
const vFormRef = ref(null)
const renderFormOpen = ref(false)
const designerFormOpen = ref(false)
const previewFormJson = ref({ formConfig: {}, widgetList: [] }) // 新增响应式数据
const columns = [
  { title: '表单编号', key: 'formId', width: 100, ellipsis: { tooltip: true } },
  { title: '表单名称', key: 'formName', width: 150, ellipsis: { tooltip: true } },
  {
    title: '备注',
    key: 'remark',
    width: 200,
    ellipsis: { tooltip: true },
  },
  { title: '内容', key: 'content', width: 60, ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 420,
    align: 'right',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            class: 'ml-12px',
            secondary: true,
            onClick: row => openDesigner(row),
          },
          {
            default: () => '详情',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            class: 'ml-12px',
            secondary: true,
            onClick: row => openPreview(row),
          },
          {
            default: () => '预览',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleEdit(),
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
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]
// 打开表单设计器
function openDesigner(row) {
  designerFormOpen.value = true
  // 如果需要初始化设计器内容，可以在这里处理
  nextTick(() => {
    if (vfDesigner.value) {
      // 可以根据需要初始化设计器
      // 例如：vfDesigner.value.setFormJson(initFormJson)
      vfDesigner.value.setFormJson(row.content)
    }
  })
}

// 保存表单设计
function saveFormDesign() {
  if (vfDesigner.value) {
    try {
      vfDesigner.value.getFormJson()
      // 这里添加实际的保存逻辑
      // 例如调用API保存表单设计
      $message.success('表单保存成功')
      designerFormOpen.value = false
      $table.value?.handleSearch() // 刷新列表
    }
    catch (error) {
      $message.error(`保存表单时出错: ${error.message}`)
    }
  }
}
function openPreview(row) {
  // 设置表单数据
  previewFormJson.value = row.content || { formConfig: {}, widgetList: [] }
  // 打开对话框
  renderFormOpen.value = true
}
</script>
