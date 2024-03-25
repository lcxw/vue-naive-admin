/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:47
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    accessRoutes: [],
    permissions: [],
    menus: []
  }),
  actions: {
    setPermissions(permissions) {
      this.permissions = permissions
      this.menus = this.permissions
        .filter((item) => item.type === '1' || item.type === '0' || item.type === 'MENU')
        .map((item) => this.getMenuItem(item))
        .filter((item) => !!item)
        .sort((a, b) => a.order - b.order)
    },
    getMenuItem(item, parent) {
      const route = this.generateRoute(item, item.show ? null : parent?.permissionId)
      if (item.enable && route.path && !route.path.startsWith('http')) this.accessRoutes.push(route)
      if (item.type === '2' || item.enabled === false) return null
      const menuItem = {
        label: route.meta.title,
        key: route.name || route.code,
        name: route.name,
        path: route.path,
        icon: () => h('i', { class: `${route.meta.icon}?mask text-16` }),
        order: item.order ?? 0
      }
      const children = item.children || []
      if (children.length) {
        menuItem.children = children
          .map((child) => this.getMenuItem(child, menuItem))
          .filter((item) => !!item)
          .sort((a, b) => a.order - b.order)
        if (!menuItem.children.length) delete menuItem.children
      }
      return menuItem
    },
    generateRoute(item, parentKey) {
      return {
        name: item.title || item.description || item.name,
        code: item.permissionId || item.code,
        path: item.href || item.path || '',
        redirect: item.redirect,
        component: item.component,
        meta: {
          icon: item.icon,
          title: item.title || item.name,
          layout: item.layout,
          keepAlive: !!item.keepAlive,
          parentKey,
          btns: item.children
            ?.filter((item) => item.type === '2')
            ?.map((item) => ({ code: item.code, name: item.name }))
        }
      }
    },
    resetPermission() {
      this.$reset()
    }
  }
})
