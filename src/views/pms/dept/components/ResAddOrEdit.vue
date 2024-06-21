<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2024/04/01 15:52:31
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <MeModal ref="modalRef">
    <n-form
      ref="modalFormRef"
      label-placement="left"
      require-mark-placement="left"
      :label-width="100"
      :model="modalForm"
    >
      <n-form-item
        label="部门名"
        path="name"
        :rule="{
          required: true,
          message: '请输入部门名',
          trigger: ['input', 'blur'],
        }"
      >
        <n-input v-model:value="modalForm.name" />
      </n-form-item>
      <n-form-item
        label="部门编码"
        path="code"
        :rule="{
          required: true,
          message: '请输入部门编码',
          trigger: ['input', 'blur'],
        }"
      >
        <n-input v-model:value="modalForm.code" :disabled="modalAction !== 'add'" />
      </n-form-item>
    </n-form>
  </MeModal>
</template>

<script setup>
import { MeModal } from '@/components/index.js'
import { useForm, useModal } from '@/composables/index.js'
import icons from 'isme:icons'
import pagePathes from 'isme:page-pathes'
import api from '../api'

const props = defineProps({
  menus: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['refresh'])
computed(() => {
  return [
    { title: '根菜单', name: '根菜单', id: '', permissionId: '', children: props.menus || [] },
  ]
})
pagePathes.map(path => ({ label: path, value: path }))
icons.map(item => ({
  label: () =>
    h('span', { class: 'flex items-center' }, [h('i', { class: `${item} text-18 mr-8` }), item]),
  value: item,
}))

const defaultForm = { enable: true, show: true, layout: '' }
const [modalFormRef, modalForm, validation] = useForm()
const [modalRef, okLoading] = useModal()

const modalAction = ref('')
const parentIdDisabled = ref(false)

function handleOpen(options = {}) {
  const { action, row = {}, ...rest } = options
  modalAction.value = action
  modalForm.value = { ...defaultForm, ...row }
  parentIdDisabled.value = !!row.parentId && (row.type === 'BUTTON' || row.type === 2)
  modalRef.value.open({ ...rest, onOk: onSave })
}

async function onSave() {
  await validation()
  okLoading.value = true
  try {
    let newFormData
    if (!modalForm.value.parentId)
      modalForm.value.parentId = null
    if (modalAction.value === 'add') {
      const res = await api.create(modalForm.value)
      newFormData = res.data
    }
    else if (modalAction.value === 'edit') {
      await api.update(modalForm.value.id || modalForm.value.permissionId, modalForm.value)
    }
    okLoading.value = false
    $message.success('保存成功')
    emit('refresh', modalAction.value === 'add' ? newFormData : modalForm.value)
  }
  catch (error) {
    console.error(error)
    okLoading.value = false
    return false
  }
}

defineExpose({
  handleOpen,
})
</script>
