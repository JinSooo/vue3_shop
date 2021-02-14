const DEFAULT_INDEX = 'default_index'
const TOKEN = 'token'

// 设置默认激活菜单列
export const setIndex = (index: string) => {
  window.sessionStorage.setItem(DEFAULT_INDEX, index)
}

// 获取默认激活菜单列
export const getIndex = () => {
  return window.sessionStorage.getItem(DEFAULT_INDEX)
}

// 设置默认激活菜单列
export const setToken = (token: string) => {
  window.sessionStorage.setItem(TOKEN, token)
}

// 获取默认激活菜单列
export const getToken = () => {
  return window.sessionStorage.getItem(TOKEN)
}
