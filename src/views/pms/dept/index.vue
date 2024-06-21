<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:29:56
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage>
    <div class="flex">
      <div>
        <n-space vertical :size="12">
          <h3>部门</h3>
          <NButton :on-click="initData">
            刷新
          </NButton>
          <div class="flex">
            <n-input v-model:value="pattern" placeholder="搜索" clearable />
            <NButton class="ml-12" type="primary" @click="handleAdd()">
              <i class="i-material-symbols:add mr-4 text-14" />
              新增
            </NButton>
          </div>
          <n-spin size="small" :show="treeLoading">
            <n-tree
              :show-irrelevant-nodes="false"
              :pattern="pattern"
              :data="treeData"
              :selected-keys="[currentMenu?.code]"
              :render-prefix="renderPrefix"
              :render-suffix="renderSuffix"
              :on-update:selected-keys="onSelect"
              key-field="description"
              label-field="name"
              block-line
              default-expand-all
            />
          </n-spin>
        </n-space>

        <ResAddOrEdit ref="modalRef" :menus="treeData" @refresh="initData" />
      </div>
    </div>
  </CommonPage>
</template>

<script setup>
import { CommonPage } from '@/components/index.js'
import { NButton } from 'naive-ui'
import { withModifiers } from 'vue'
import api from './api'
import ResAddOrEdit from './components/ResAddOrEdit.vue'

defineProps({
  treeData: {
    type: Array,
    default: () => [],
  },
  currentMenu: {
    type: Object,
    default: () => null,
  },
})
const emit = defineEmits(['refresh', 'update:currentMenu'])
const treeData = ref([])
const treeLoading = ref(false)
const currentMenu = ref(null)

async function initData() {
  treeLoading.value = true
  const res = await api.getDeptTree()
  treeData.value = res?.data || []
  treeLoading.value = false
  if (treeData.value) {
    currentMenu.value = treeData
  }
}
initData()
const pattern = ref('')

const modalRef = ref(null)

async function handleAdd(data = {}) {
  modalRef.value?.handleOpen({
    action: 'add',
    title: '新增菜单',
    row: { type: 'MENU', ...data },
    okText: '保存',
  })
}

function onSelect(keys, option, { action, node }) {
  emit('update:currentMenu', action === 'select' ? node : null)
}

function renderPrefix({ option }) {
  return h('i', { class: `${option.icon}?mask text-16` })
}

function renderSuffix({ option }) {
  return [
    h(
      NButton,
      {
        text: true,
        type: 'primary',
        title: '新增下级菜单',
        size: 'tiny',
        onClick: withModifiers(() => handleAdd({ parentId: option.id }), ['stop']),
      },
      { default: () => '新增' },
    ),

    h(
      NButton,
      {
        text: true,
        type: 'error',
        size: 'tiny',
        style: 'margin-left: 12px;',
        onClick: withModifiers(() => handleDelete(option), ['stop']),
      },
      { default: () => '删除' },
    ),
  ]
}

function handleDelete(item) {
  $dialog.confirm({
    content: `确认删除【${item.name || ' '}】？`,
    async confirm() {
      try {
        $message.loading('正在删除', { key: 'deleteMenu' })
        await api.deletePermission(item.permissionId)
        $message.success('删除成功', { key: 'deleteMenu' })
        emit('refresh')
        emit('update:currentMenu', null)
      }
      catch (error) {
        console.error(error)
        $message.destroy('deleteMenu')
      }
    },
  })
}
</script>
