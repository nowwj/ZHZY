<template>
  <div class="column-detail-page w-75 mx-auto">
    <div
      class="column-info row mb-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          :src="column.avatar && column.avatar.url"
          :alt="column.title"
          class="rounded-circle border w-100"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <PostList :list="list"></PostList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { GlobalDataProps,ColumnProps } from "@/store";
import PostList from "./PostList.vue";
export default defineComponent({
  components: { PostList },
  setup() {
    const store = useStore<GlobalDataProps>();
    const route = useRoute();
    const currentId = route.params.id;
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined
      // if (selectColumn) {
      //   addColumnAvatar(selectColumn, 100, 100)
      // }
      return selectColumn
    })
    const list = computed(() => store.getters.getPostsByCid(currentId))
    onMounted(() => {
      store.dispatch("fetchColumn", { cid: currentId });
      store.dispatch("fetchPosts", {
        cid: currentId,
        currentPage: 1,
        pageSize: 5,
      });
    });
    return {
      column,
      list,
    };
  },
});
</script>
