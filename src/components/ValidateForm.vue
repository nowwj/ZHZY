<template>
  <div class="validate-form--container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
//import mitt from "mitt";
type ValidateFunc = () => boolean;
//export const emitter = mitt()
export default defineComponent({
  name: "ValidateForm",
  emits: ["form-submit"],
  setup(props, context) {
    let funcArr: ValidateFunc[] = [];
    const result = funcArr.map((func) => func());
    const submitForm = () => {
      context.emit("form-submit", result);
    };
    const callback = (func: ValidateFunc) => {
      funcArr.push(func);
    };
    // (this as any).$bus.$on("form-item-created", callback);
    // onUnmounted(() => {
    //   (this as any).$bus.$off("form-item-created", callback);
    //   funcArr = [];
    // });
    return {
      submitForm,
    };
  },
});
</script>

<style></style>
