<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" @click="handleAddClient()">
        <i class="i-material-symbols:add mr-4 text-18" />
        新增客户端
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1600"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="客户端名称" :label-width="50">
        <n-input
          v-model:value="queryItems.clientId"
          type="text"
          placeholder="请输入客户端名称"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="状态" :label-width="50">
        <n-select
          v-model:value="queryItems.enable"
          clearable
          :options="[
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>
    <MeModal ref="modalRef" width="600px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="160"
        size="small"
        :model="modalForm"
      >
        <n-form-item
          label="客户端名称"
          path="clientName"
          :rule="{
            required: true,
            message: '请输入客户端名称',
            // trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.clientName" />
        </n-form-item>
        <n-form-item
          label="客户端类型"
          path="clientType"
          :rule="{
            required: false,
            message: '请选择客户端类型',
            trigger: ['input', 'blur'],
          }"
        >
          <n-radio-group v-model:value="modalForm.clientType" name="clientType">
            <n-space>
              <n-radio name="clientType" value="security" :checked="true">
                机密型
              </n-radio>
              <n-radio name="clientType" value="public">
                公共型
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          label="客户端认证方式"
          path="clientAuthenticationMethod"
          :rule="{
            required: true,
            message: '请选择客户端认证方式',
          }"
        >
          <n-select
            v-model:value="modalForm.clientAuthenticationMethods"
            multiple
            filterable
            label-field="value"
            value-field="clientAuthenticationMethod"
            name="clientAuthenticationMethods"
            trigger="click"
            :options="clientAuthenticationMethods"
            @select="handleSelect"
          >
            <NButton>选择客户端认证方式</NButton>
          </n-select>
        </n-form-item>
        <n-form-item
          label="授权方式"
          path="authorizationGrantTypes"
          :rule="{
            required: true,
            message: '请选授权方式',
          }"
        >
          <n-select
            v-model:value="modalForm.authorizationGrantTypes"
            multiple
            filterable
            label-field="value"
            value-field="grantTypeName"
            placeholder="选择授权方式"
            name="authorizationGrantTypes"
            trigger="click"
            :options="authorizationGrantTypes"
          >
            <NButton>请选授权方式</NButton>
          </n-select>
        </n-form-item>
        <n-form-item label="授权范围">
          <n-dynamic-input
            v-model:value="modalForm.scopes"
            :default-value="['profile', 'openid', 'email', 'phone']"
            placeholder="请输入授权范   围，多个用英文逗号隔开"
            :min="1"
            :max="10"
            #="{ index }"
          >
            <n-input
              :key="index"
              v-model:value="modalForm.scopes"
              :value="modalForm.scopes"
              :placeholder="`请选择${modalForm.scopes}`"
            />
          </n-dynamic-input>
        </n-form-item>

        <n-form-item label="重定向地址" path="redirectUri">
          <n-dynamic-input
            v-model:value="modalForm.redirectUris"
            :value="modalForm.redirectUris"
            placeholder="请输入重定向uri，多个用英文逗号隔开"
            #="{ index }"
          >
            <n-input
              :key="index"
              v-model:value="modalForm.redirectUris"
              :placeholder="`请选择${modalForm.redirectUris}`"
            />
          </n-dynamic-input>
        </n-form-item>
        <n-form-item
          label="是否需要用户同意"
          path="proofKey"
          :rule="{
            required: false,
            message: '请选择客户端类型',
            trigger: ['input', 'blur'],
          }"
        >
          <NSwitch
            v-model:value="modalForm.requireProofKey"
            value="active"
            checked="checked"
          >
            需要
          </NSwitch>
        </n-form-item>
        <n-form-item label="授权确认" path="requireAuthorizationConsent">
          <NSwitch
            v-model:value="modalForm.requireAuthorizationConsent"
            value="active"
            checked="checked"
          >
            需要
          </NSwitch>
        </n-form-item>
        <n-form-item
          label="JWK端点"
          path="jwkSetUrl"
          :rule="{
            required: false,
            message: '请输入jwkSetUrl',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.jwkSetUrl"
            placeholder="授权方式为PRIVATE_KEY_JWT时请输入客户端提供的jwkSetUrl"
          />
        </n-form-item>
        <n-form-item
          label="签名算法"
          path="signingAlgorithm"
          :rule="{
            required: false,
            message: '请输入signingAlgorithm',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.signingAlgorithm"
            placeholder="认证方式为CLIENT_SECRET_JWT或PRIVATE_KEY_JWT时需要指定签名算法"
          />
        </n-form-item>
        <n-form-item
          label="访问令牌TTL（s）"
          path="accessTokenTimeToLive"
          :rule="{
            required: false,
            message: '请输入accessTokenTimeToLive',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.accessTokenTimeToLive"
            placeholder="访问令牌生存时间，单位秒"
            type="number"
            value="86400000"
          />
        </n-form-item>
        <n-form-item
          label="令牌格式"
          path="tokenFormat"
          :rule="{
            required: false,
            message: '请选择令牌格式',
            trigger: ['input', 'blur'],
          }"
        >
          <n-radio-group
            v-model:value="modalForm.tokenFormat"
            name="tokenFormat"
          >
            <n-radio value="self-contained" checked="checked">
              透明令牌(jwt/jws)
            </n-radio>
            <n-radio value="reference">
              不透明令牌(opaque)
            </n-radio>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="复用刷新令牌" path="reuseRefreshTokens">
          <NSwitch
            v-model:value="modalForm.reuseRefreshTokens"
            value="reuseRefreshTokens"
            checked="checked"
          >
            需要
          </NSwitch>
        </n-form-item>
        <n-form-item
          label="刷新令牌TTL（s）"
          path="refreshTokenTimeToLive"
          :rule="{
            required: false,
            message: '请输入refreshTokenTimeToLive',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.refreshTokenTimeToLive"
            placeholder="访问令牌生存时间，单位秒"
            type="number"
            value="86400000"
          />
        </n-form-item>
        <n-form-item
          label="ID Token签名算法"
          path="idTokenSignatureAlgorithm"
          :rule="{
            required: false,
            message: '请输入idTokenSignatureAlgorithm',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.idTokenSignatureAlgorithm"
            placeholder="认证方式为CLIENT_SECRET_JWT或PRIVATE_KEY_JWT时需要指定签名算法"
          />
        </n-form-item>
        <n-form-item label="状态" path="enable">
          <NSwitch v-model:value="modalForm.enable">
            <template #checked>
              启用
            </template>
            <template #unchecked>
              停用
            </template>
          </NSwitch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import api from './api'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'

defineOptions({ name: 'ClientMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const clientAuthenticationMethods = reactive([
  {
    label: 'client_secret_basic',
    key: 'CLIENT_SECRET_BASIC',
    value: 'client_secret_basic',
    clientAuthenticationMethod: 'client_secret_basic',
  },
  {
    label: 'client_secret_post',
    key: 'CLIENT_SECRET_POST',
    value: 'client_secret_post',
    clientAuthenticationMethod: 'client_secret_post',
  },
  {
    label: 'client_secret_jwt',
    key: 'CLIENT_SECRET_JWT',
    value: 'client_secret_jwt',
    clientAuthenticationMethod: 'client_secret_jwt',
  },
  {
    label: 'private_key_jwt',
    key: 'PRIVATE_KEY_JWT',
    value: 'private_key_jwt',
    clientAuthenticationMethod: 'private_key_jwt',
  },
  {
    label: 'none',
    key: 'do not check client auth',
    value: 'none',
    clientAuthenticationMethod: 'none',
    disabled: true,
  },
])
const authorizationGrantTypes = reactive([
  {
    label: 'authorization_code',
    key: 'AUTHORIZATION_CODE',
    value: 'authorization_code',
    grantTypeName: 'authorization_code',
  },
  {
    label: 'refresh_token',
    key: 'REFRESH_TOKEN',
    value: 'refresh_token',
    grantTypeName: 'refresh_token',
  },
  {
    label: 'client_credentials',
    key: 'CLIENT_CREDENTIALS',
    value: 'client_credentials',
    grantTypeName: 'client_credentials',
  },
  {
    label: 'password',
    key: 'PASSWORD',
    value: 'password',
    grantTypeName: 'password',
  },
  {
    label: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    key: 'JWT_BEARER',
    value: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    grantTypeName: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  },
  {
    label: 'urn:ietf:params:oauth:grant-type:device_code',
    key: 'DEVICE_CODE',
    value: 'urn:ietf:params:oauth:grant-type:device_code',
    grantTypeName: 'urn:ietf:params:oauth:grant-type:device_code',
  },
])
onMounted(() => {
  $table.value?.handleSearch()
})

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleSave,
  handleAdd,
  handleOpen,
  handleView,
  handleEdit,
  handleDelete,
} = useCrud({
  name: '客户端',
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  initForm: { enable: true },
  refresh: (_, keepCurrentPage) => $table.value?.handleSearch(keepCurrentPage),
})

function handleSelect(key) {
  $message.info(String(key))
}

const columns = [
  { title: '客户端id', key: 'clientId' },
  { title: '密钥', key: 'clientSecret' },
  { title: '客户端名称', key: 'clientName' },
  { title: '创建时间', key: 'clientIdIssuedAt' },
  {
    title: '状态',
    key: 'enable',
    render: row =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          disabled: row.code === 'SUPER_ADMIN',
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '启用',
          unchecked: () => '停用',
        },
      ),
  },
  {
    title: '操作',
    key: 'actions',
    width: 320,
    align: 'right',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleEditClient(row),
          },
          {
            default: () => '编辑',
            icon: () =>
              h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => '删除',
            icon: () =>
              h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.update({ id: row.id, enable: !row.enable })
    row.enableLoading = false
    $message.success('操作成功')
    $table.value?.handleSearch()
  }
  catch (error) {
    row.enableLoading = false
  }
}

const currentClient = reactive({})

function handleAddClient(row) {
  currentClient.value = {
    id: null,
    clientId: null,
    clientSecret: null,
    clientName: null,
    clientAuthenticationMethods: [],
    authorizationGrantTypes: [],
    scopes: [],
    redirectUris: [],
    requireProofKey: null,
    requireAuthorizationConsent: null,
    jwkSetUrl: null,
    signingAlgorithm: null,
    tokenFormat: null,
    reuseRefreshTokens: null,
    idTokenSignatureAlgorithm: null,
    accessTokenTimeToLive: null,
    refreshTokenTimeToLive: null,
  }
  // modalFormRef.value = currentClient
  modalForm.value = currentClient
  handleAdd(row)
  // api.create(currentClient)
}

function handleEditClient(row) {
  api.getDetails(row.id).then((result) => {
    const res = {}
    res.id = result.clientId || ''
    res.clientId = result.clientId || ''
    res.clientName = result.clientName || ''
    res.clientSecret = result.clientSecret || ''
    res.clientAuthenticationMethods
      = result.clientAuthenticationMethods?.map(
        e => e.clientAuthenticationMethod,
      ) || []
    res.authorizationGrantTypes
      = result.authorizationGrantTypes?.map(
        e => e.grantTypeName,
      ) || []
    res.scopes = result.scopes?.map(e => e.scope) || []
    res.redirectUris = result.redirectUrls?.map(e => e.redirectUri) || []
    res.requireProofKey = result.requireProofKey || true
    res.requireAuthorizationConsent
      = result.requireAuthorizationConsent || true
    res.jwkSetUrl = result.jwkSetUrl || null
    res.signingAlgorithm = result.signingAlgorithm || 'RS256'
    res.tokenFormat = result.tokenFormat || 'self-contained'
    res.reuseRefreshTokens = result.reuseRefreshTokens || true
    res.idTokenSignatureAlgorithm = result.idTokenSignatureAlgorithm || 'RS512'
    res.accessTokenTimeToLive = result.accessTokenTimeToLive || '30'
    res.refreshTokenTimeToLive = result.refreshTokenTimeToLive || '480'
    // currentClient.value = res;
    modalForm.value = res
  })
  handleAdd(row)
  // api.create(currentClient)
}

function onSave() {
  if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('分配成功'),
    })
  }
  handleSave()
}
</script>

<style scoped></style>
