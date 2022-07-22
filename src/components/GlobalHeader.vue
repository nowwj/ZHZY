<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <a class="navbar-brand" href="#">者也专栏</a>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
        <li class="list-inline-item"><router-link class="btn btn-outline-light my-2" to="/login">登录</router-link></li>
        <li class="list-inline-item"><router-link class="btn btn-outline-light my-2" to="/login">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
        <li class="list-inline-item">
          <drop-down :title="`你好，${user.nickName}`">
            <DropDownItem><a href="#" class="dropdown-item">新建文章</a></DropDownItem>
            <DropDownItem :disabled="true"><a href="#" class="dropdown-item">编辑资料</a></DropDownItem>
            <DropDownItem><a href="#" class="dropdown-item">退出登录</a></DropDownItem>
          </drop-down>
        </li>
    </ul>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, PropType } from "vue";
import DropDown from './DropDown.vue'
import DropDownItem from "./DropDownItem.vue";
import { UserProps } from '@/store'
import { useStore } from "vuex";
export default defineComponent({
  name: "GlobalHeader",
  components:{
    DropDown,
    DropDownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
  },
});
</script>

<style>
</style>