<template>
  <div>from domain data</div>
  <el-table border :data="userList" style="width: 100%">
    <el-table-column prop="userId" label="用户主键id" />
    <el-table-column prop="nickName" label="用户昵称" />
    <el-table-column prop="loginName" label="登陆名称(默认为手机号)" />
    <el-table-column prop="passwordMd5" label="MD5加密后的密码" />
    <el-table-column prop="introduceSign" label="个性签名" />
    <el-table-column prop="address" label="收货地址" />
    <el-table-column prop="isDeleted" label="注销标识字段(0-正常 1-已注销)" />
    <el-table-column prop="lockedFlag" label="锁定标识字段(0-未锁定 1-已锁定)" />
    <el-table-column prop="createTime" label="注册时间" />
  </el-table>
  <div>from dto data</div>
  <el-table border :data="userListDto" style="width: 100%">
    <el-table-column prop="id" label="用户主键id" />
    <el-table-column prop="nickName" label="用户昵称" />
    <el-table-column prop="loginName" label="登陆名称(默认为手机号)" />
    <el-table-column prop="introduceSign" label="个性签名" />
    <el-table-column prop="address" label="收货地址" />
    <el-table-column prop="createTime" label="注册时间" />
  </el-table>
</template>
<script setup lang="ts">
import { request } from "@utils/request"
import { onMounted, ref } from "vue"
interface User {
  /**
   * 用户主键id
   */
  userId: string;

  /**
   * 用户昵称
   */
  nickName: string;

  /**
   * 登陆名称(默认为手机号)
   */
  loginName: string;

  /**
   * MD5加密后的密码
   */
  passwordMd5: string;

  /**
   * 个性签名
   */
  introduceSign: string;

  /**
   * 收货地址
   */
  address: string;

  /**
   * 注销标识字段(0-正常 1-已注销)
   */
  isDeleted: number;

  /**
   * 锁定标识字段(0-未锁定 1-已锁定)
   */
  lockedFlag: number;

  /**
   * 注册时间
   */
  createTime: string;
}

interface UserDto {
  address: string
  age: number
  createTime: string
  id: number
  introduceSign: string
  loginName: string
  nickName: string
}

const userList = ref<Array<User>>()

const getUserList = async () => {
  const result = await request.get("/user/getAllUser")
  if (result.data.code === 200) {
    userList.value = result.data.data
  }
}

const userListDto = ref<Array<UserDto>>()
const getUserListDto = async () => {
  const result = await request.get("/user/getAllUserDto")
  if (result.data.code === 200) {
    userListDto.value = result.data.data
  }
}
onMounted(() => {
  getUserList()
  getUserListDto()
})
</script>
