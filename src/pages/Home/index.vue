<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="@/assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :list="list"></ColumnList>
    <button
      class="btn text-center btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-flex"
       @click="LoadMorePage" v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
interface ColumnProps {
  id: number;
  title: string;
  avatar?: string;
  description: string;
}
const testData: ColumnProps[] = [
  {
    id: 1,
    title: "test1的专栏",
    description:
      "这是的test1专栏，有一段非常有意思的简介，可以更新一下欧, 这是的test1专栏，有一段非常有意思的简介，可以更新一下欧",
    avatar:
      "http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_150,w_150",
  },
  {
    id: 2,
    title: "test2的专栏",
    description: "这是的test2专栏，有一段非常有意思的简介，可以更新一下欧",
    avatar:
      "http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100",
  },
  {
    id: 3,
    title: "test3的专栏",
    description:
      "这是的test1专栏，有一段非常有意思的简介，可以更新一下欧 这是的test1专栏，有一段非常有意思的简介，可以更新一下欧",
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 4,
    title: "test4的专栏",
    description: "这是的test2专栏，有一段非常有意思的简介，可以更新一下欧",
    avatar:
      "http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100",
  },
];
import { defineComponent ,computed,onMounted} from "vue";
import ColumnList from "@/components/ColumnList.vue";
import { useStore } from "vuex";
import {GlobalDataProps} from '@/store'
import LoadMore from '@/hooks/LoadMore'
export default defineComponent({
  name: "Home",
  components: {
    ColumnList,
  },
  setup() {
    const total = computed(() => store.state.columns.total)
    onMounted(() => {
      store.dispatch('fetchColumns', { currentPage: 1, pageSize: 5 })
    })
    const store = useStore<GlobalDataProps>();
    const list = computed(() => store.getters.getColumns)
    const {LoadMorePage, isLastPage} =LoadMore('fetchColumns',total, { pageSize: 3, currentPage: 2 })
    return {
      list,
      LoadMorePage,
      isLastPage,
    };
  },
});
</script>
