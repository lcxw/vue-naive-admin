<template>
  <CommonPage>
    <template #action>
      <NButton
        v-permission="['workflow:process:todoExport']"
        secondary
        type="warning"
        @click="handleExport"
      >
        <i class="i-material-symbols:download mr-4 text-18" />
        导出
      </NButton>
    </template>
    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :get-data="listTodoProcess"
      :scroll-x="1200"
    >
      <MeQueryItem :label-width="50" label="流程名称">
        <n-input
          v-model:value="queryItems.processName"
          clearable
          placeholder="请输入流程名称"
          type="text"
        />
      </MeQueryItem>
    </MeCrud>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NTag } from "naive-ui";
import { h, ref } from "vue";
import { listTodoProcess } from "@/api/workflow/process";
import { MeCrud, MeQueryItem } from "@/components";
import { CommonPage } from "@/components/common";
import { withPermission } from "@/directives";
import { formatDateTime } from "@/utils/index.js";

const $table = ref(null);
const queryItems = ref({});
onMounted(() => {
  $table.value?.handleSearch();
});

const columns = [
  {
    title: "头像",
    key: "avatar",
    width: 80,
    render: ({ avatar }) =>
      h(NAvatar, {
        size: "medium",
        src: avatar
      })
  },
  { title: "用户名", key: "username", width: 150, ellipsis: { tooltip: true } },
  {
    title: "角色",
    key: "roles",
    width: 200,
    ellipsis: { tooltip: true },
    render: ({ roles }) => {
      if (roles?.length) {
        return roles.map((item, index) =>
          h(
            NTag,
            { type: "success", style: index > 0 ? "margin-left: 8px;" : "" },
            { default: () => item.name }
          )
        );
      }
      return "暂无角色";
    }
  },
  { title: "邮箱", key: "email", width: 150, ellipsis: { tooltip: true } },
  {
    title: "创建时间",
    key: "createDate",
    width: 180,
    render(row) {
      return h("span", formatDateTime(row.createTime));
    },
  },
  {
    title: "操作",
    key: "actions",
    width: 420,
    align: "right",
    fixed: "right",
    hideInExcel: true,
    render(row) {
      return [
        withPermission(
          h(NButton, {
            size: "small",
            type: "primary",
            secondary: true
          }, {
            default: () => "超管专属",
            icon: () => h("i", { class: "i-carbon:user-role text-14" })
          }),
          "SuperAdmin"
        ),
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            class: "ml-12px",
            secondary: true,
            onClick: () => handleOpenDetail(row)
          },
          {
            default: () => "查看详情",
            icon: () => h("i", { class: "i-carbon:user-role text-14" })
          }
        )
      ];
    },
  },
]

function handleOpenDetail(row) {
  this.$message.showMessage("info", "hah");
}
</script>
