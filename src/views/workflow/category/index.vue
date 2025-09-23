<template>
  <CommonPage>
    <template #action>
      <NButton v-permission="'workflow:category:add'" type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新分类
      </NButton>
    </template>
    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="listCategory"
    >
      <MeQueryItem label="分类名称" :label-width="50">
        <n-input
          v-model:value="queryItems.categoryName"
          type="text"
          placeholder="请输入分类名称"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="编码" :label-width="50">
        <n-input v-model:value="queryItems.code" type="text" placeholder="请输入分类编码" clearable />
      </MeQueryItem>
    </MeCrud>
    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
        :rules="rules"
      >
        <n-form-item
          label="分类名称"
          path="categoryName"
        >
          <n-input v-model:value="modalForm.categoryName" :disabled="modalAction !== 'add' && modalAction !== 'edit'" />
        </n-form-item>
        <n-form-item
          label="编码"
          path="code"
        >
          <n-input v-model:value="modalForm.code" :disabled="modalAction !== 'add' && modalAction !== 'edit'" />
        </n-form-item>
        <n-form-item
          label="备注"
          path="remark"
        >
          <n-input v-model:value="modalForm.remark" :disabled="modalAction !== 'add' && modalAction !== 'edit'" />
        </n-form-item>
      </n-form>
      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        详细信息需由用户本人补充修改
      </n-alert>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NCheckbox } from 'naive-ui'
import { addCategory, delCategory, listCategory, updateCategory } from '@/api/workflow/category.js'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const selectItems = ref([])

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

// 表单校验
const rules = {
  categoryName: [
    { required: true, message: '分类名称不能为空', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '分类编码不能为空', trigger: 'blur' },
  ],
  remark: [
    { required: true, message: '请输入备注', trigger: 'blur' },
  ],
}

// 表格列定义
const columns = [
  {
    type: 'selection',
    width: 55,
    fixed: 'left',
    onCheck: row => selectItems.value?.push(row.categoryId),
    render(row) {
      return h(
        NCheckbox,
        {
          size: 'small',
          type: 'primary',
          style: 'margin-left: 12px;',
          onClick: row => selectItems.value?.push(row.categoryId),
        },
        {
          default: () => '修改',
          icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
        },
      )
    },
  },
  {
    title: '分类编号',
    key: 'categoryId',
    width: 120,
    fixed: 'left',
  },
  {
    title: '分类名称',
    key: 'categoryName',
    width: 180,
  },
  {
    title: '分类编码',
    key: 'code',
    width: 180,
  },
  {
    title: '备注',
    key: 'remark',
  },
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
            style: 'margin-left: 12px;',
            onClick: () => handleOpen({ action: 'edit', title: '修改', row, onOk: onSave }),
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
function onSave() {
  if (modalAction.value === 'add') {
    return handleSave({
      api: () => addCategory(modalForm.value),
      cb: () => $message.success('添加成功'),
    })
  }
  else if (modalAction.value === 'edit') {
    return handleSave({
      api: () => updateCategory(modalForm.value),
      cb: () => $message.success('修改成功'),
    })
  }
  handleSave()
}
</script>
