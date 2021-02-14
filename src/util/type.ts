// 返回响应体的格式
export interface ResResult {
  data: Object | Array<Object>
  meta: {
    msg: string
    status: number
  }
}

// 管理员
export interface Manager {
  id: number
  rid: number
  username: string
  email: string
  mobile: string
  token: string
}
