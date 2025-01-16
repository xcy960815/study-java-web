declare interface UserOption {
  /**
   * 用户主键id
   */
  id: number

  /**
   * 用户昵称
   */
  nickName: string

  /**
   * 年龄
   */
  age: number

  /**
   * 登陆名称(默认为手机号)
   */
  loginName: string

  /**
   * MD5加密后的密码
   */
  passwordMd5: string

  /**
   * 个性签名
   */
  introduceSign: string

  /**
   * 收货地址
   */
  address: string

  /**
   * 注册时间
   */
  createTime: string
}

declare interface UserListResult {
  data: UserOption[]
  total: number
}
