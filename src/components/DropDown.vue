<template>
  <div class="dropdown" ref="dropdownRef">
    <a
      href="#"
      class="btn btn-outline-light my-2 dropdown-toggle"
      @click.prevent="toggleOpen"
      >{{ title }}</a
    >
    <ul
      class="dropdown-menu"
      aria-labelledby="dropdownMenuButton1"
      :style="{ display: 'block' }"
      v-if="isOpen"
    >
      <slot></slot>
    </ul>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
export default defineComponent({
  name: "DropDown",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const isOpen = ref(false);
    const toggleOpen = () => {
      isOpen.value = !isOpen.value;
    };
    const dropdownRef = ref<null|HTMLElement>(null)
    const handler = (e:MouseEvent)=>{
      if(dropdownRef.value){
         if(!dropdownRef.value.contains(e.target as HTMLElement)&&isOpen.value){
           isOpen.value = false
         }
      }
    }
    onMounted(() => {
      document.addEventListener('click',handler)
    });
    onUnmounted(()=>{
      document.removeEventListener('click',handler)
    })
    return {
      isOpen,
      toggleOpen,
      dropdownRef,
    };
  },
});
</script>

<style>
</style>
