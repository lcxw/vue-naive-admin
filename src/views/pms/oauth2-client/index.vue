<script setup>
import { NButton, NSwitch } from 'naive-ui'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'RoleMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
const clientAuthenticationMethods = ref([
  {
    label: 'client_secret_basic',
    key: 'CLIENT_SECRET_BASIC',
    value: 'client_secret_basic',
  },
  {
    label: 'client_secret_post',
    key: 'CLIENT_SECRET_POST',
    value: 'client_secret_post',
  },
  {
    label: 'client_secret_jwt',
    key: 'CLIENT_SECRET_JWT',
    value: 'client_secret_jwt',
  },
  {
    label: 'private_key_jwt',
    key: 'PRIVATE_KEY_JWT',
    value: 'private_key_jwt',
  },
  {
    label: 'none',
    key: 'do not check client auth',
    value: 'none',
    disabled: true,
  },
])
const authorizationGrantTypes = ref([
  {
    label: 'authorization_code',
    key: 'AUTHORIZATION_CODE',
  },
  {
    label: 'refresh_token',
    key: 'REFRESH_TOKEN',
  },
  {
    label: 'client_credentials',
    key: 'CLIENT_CREDENTIALS',
  },
  {
    label: 'password',
    key: 'PASSWORD',
  },
  {
    label: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    key: 'JWT_BEARER',
  },
  {
    label: 'urn:ietf:params:oauth:grant-type:device_code',
    key: 'DEVICE_CODE',
  },
])
onMounted(() => {
  $table.value?.handleSearch()
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
    render: (row) =>
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
        }
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
            onClick: () => handleEditWithData(modalForm, row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          }
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
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          }
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
  } catch (error) {
    row.enableLoading = false
  }
}

const { modalRef, modalFormRef, modalAction, modalForm, handleAdd, handleDelete, handleEdit } =
  useCrud({
    name: '客户端',
    doCreate: api.create,
    doDelete: api.delete,
    doUpdate: api.update,
    initForm: { enable: true },
    refresh: () => $table.value?.handleSearch(),
  })
let currentClient = ref({})

function handleAddClient(row) {
  currentClient = {
    id: null,
    clientId: modalForm.clientName || null,
    clientSecret: modalForm.clientSecret || null,
    clientName: modalForm.clientName || null,
    clientAuthenticationMethods: modalForm.clientAuthenticationMethods || [],
    authorizationGrantTypes: modalForm.authorizationGrantTypes || [],
    scopes: modalForm.scopes?.split(',') || [],
    redirectUris: modalForm.redirectUrls?.split(',') || [],
    clientSettings: {
      clientId: modalForm.clientId,
      requireProofKey: modalForm.requireProofKey,
      requireAuthorizationConsent: modalForm.requireAuthorizationConsent,
      jwkSetUrl: modalForm.jwkSetUrl,
      signingAlgorithm: modalForm.signingAlgorithm,
    },
    tokenSettings: {
      clientId: modalForm.clientId,
      tokenFormat: modalForm.tokenFormat,
      reuseRefreshTokens: modalForm.reuseRefreshTokens,
      idTokenSignatureAlgorithm: modalForm.idTokenSignatureAlgorithm,
      accessTokenTimeToLive: modalForm.accessTokenTimeToLive,
      refreshTokenTimeToLive: modalForm.refreshTokenTimeToLive,
    },
  }
  modalFormRef.value = currentClient
  handleAdd(row)
  // api.create(currentClient)
}

function handleEditWithData(modalForm, row) {
  // console.log(row)
  api.getDetails(row.id).then((result) => {
    currentClient = result
    let redirectUris = result.redirectUris.map((s) => s.redirectUri).join(',')
    console.log(redirectUris)
    currentClient.redirectUris = redirectUris
    let scopes = result.scopes.map((s) => s.scope).join(',')
    currentClient.scopes = result.scopes.map((s) => s.scope).join(',')
    let authorizationGrantTypes = result.authorizationGrantTypes
      .map((s) => s.clientAuthenticationMethod)
      .join(',')
    currentClient.authorizationGrantTypes = authorizationGrantTypes
    let clientAuthenticationMethods = result.clientAuthenticationMethods
      .map((s) => s.clientAuthenticationMethod)
      .join(',')
    currentClient.clientAuthenticationMethods = clientAuthenticationMethods
    // console.info(res)
    // clientScopes = scopes.map((s) => s.scope).join(',')
    // let clientRedirectUrls = result.redirectUris.map((s) => s.redirectUri).join(',')
    // modalForm.scope = clientScopes
    // modalFormRef.redirectUrls = clientRedirectUrls
    // modalRef.redirectUrls = clientRedirectUrls
    // modalForm.redirectUrls = clientRedirectUrls
    // modalFormRef.currentClient = currentClient
    // modalForm.currentClient = currentClient
    modalForm.redirectUris = redirectUris
    modalForm.scopes = JSON.stringify(scopes) || null
    modalForm.authorizationGrantTypes = authorizationGrantTypes || null
    modalForm.clientAuthenticationMethods = clientAuthenticationMethods || null
    modalForm.clientAuthenticationMethods = clientAuthenticationMethods || null
    // modalForm.requireProofKey = result.clientSettings.requireProofKey || null
    // modalForm.requireAuthorizationConsent =
    //   result.clientSettings.requireAuthorizationConsent || null
    // modalForm.jwkSetUrl = result.clientSettings.jwkSetUrl || null
    // modalForm.signingAlgorithm = result.clientSettings.signingAlgorithm || null
    // modalForm.tokenFormat = result.tokenSettings.tokenFormat || null
    // modalForm.reuseRefreshTokens = result.tokenSettings.reuseRefreshTokens || null
    // modalForm.idTokenSignatureAlgorithm = result.tokenSettings.idTokenSignatureAlgorithm || null
    // modalForm.accessTokenTimeToLive = result.tokenSettings.accessTokenTimeToLive || null
    // modalForm.refreshTokenTimeToLive = result.tokenSettings.refreshTokenTimeToLive || null
    // console.log(modalForm.redirectUris)
    // modalRef.currentClient = currentClient
    handleEdit(row)
  })
}
</script>

<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAddClient()">
        <i class="i-material-symbols:add mr-4 text-18" />
        新增客户端
      </n-button>
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
        :size="'small'"
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
              <n-radio value="security" checked="checked">机密型</n-radio>
              <n-radio value="public">公共型</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          label="客户端认证方式"
          path="clientAuthenticationMethods"
          :rule="{
            required: false,
            message: '请选择客户端认证方式',
            // trigger: ['input', 'blur'],
          }"
        >
          <n-select
            v-model:value="modalForm.clientAuthenticationMethods"
            multiple
            filterable
            name="clientAuthenticationMethod"
            trigger="click"
            :options="clientAuthenticationMethods"
            @select="handleSelect"
          >
            <n-button>选择客户端认证方式</n-button>
          </n-select>
        </n-form-item>
        <n-form-item
          label="授权方式"
          path="authorizationGrantType"
          :rule="{
            required: false,
            message: '请选授权方式',
            trigger: ['input', 'blur'],
          }"
        >
          <n-select
            v-model:value="modalForm.authorizationGrantTypes"
            multiple
            filterabl
            placeholder="选择授权方式"
            clearable
            name="clientAuthenticationMethod"
            trigger="click"
            :options="authorizationGrantTypes"
            @select="handleSelect"
          >
            <n-button>请选授权方式</n-button>
          </n-select>
        </n-form-item>
        <n-form-item
          label="授权范围"
          path="scopes"
          :rule="{
            required: false,
            message: '请输入授权范围',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.scopes"
            placeholder="请输入授权范围，多个用英文逗号隔开"
          />
        </n-form-item>
        <n-form-item
          label="重定向地址"
          path="redirectUris"
          :rule="{
            required: false,
            message: '请输入回调地址列表',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.redirectUris"
            placeholder="请输入重定向uri，多个用英文逗号隔开"
          />
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
          <n-switch
            v-model:value="modalForm.clientSettings.requireProofKey"
            value="active"
            checked="checked"
          >
            需要
          </n-switch>
        </n-form-item>
        <n-form-item label="授权确认" path="requireAuthorizationConsent">
          <n-switch
            v-model:value="modalForm.clientSettings.requireAuthorizationConsent"
            value="active"
            checked="checked"
          >
            需要
          </n-switch>
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
            v-model:value="modalForm.clientSettings.jwkSetUrl"
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
            v-model:value="modalForm.clientSettings.signingAlgorithm"
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
            v-model:value="modalForm.tokenSettings.accessTokenTimeToLive"
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
          <n-radio-group v-model:value="modalForm.tokenSettings.tokenFormat" name="tokenFormat">
            <n-radio value="self-contained" checked="checked">透明令牌</n-radio>
            <n-radio value="oq">不透明令牌</n-radio>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="复用刷新令牌" path="reuseRefreshTokens">
          <n-switch
            v-model:value="modalForm.tokenSettings.reuseRefreshTokens"
            value="reuseRefreshTokens"
            checked="checked"
          >
            需要
          </n-switch>
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
            v-model:value="modalForm.tokenSettings.refreshTokenTimeToLive"
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
            v-model:value="modalForm.tokenSettings.idTokenSignatureAlgorithm"
            placeholder="认证方式为CLIENT_SECRET_JWT或PRIVATE_KEY_JWT时需要指定签名算法"
          />
        </n-form-item>
        <n-form-item label="状态" path="enable">
          <n-switch v-model:value="modalForm.enable">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<style scoped></style>
