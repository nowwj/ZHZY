<template>
  <div class="create-post-page">
    <h4>{{isEditMode?'编辑文章':'新建文章'}}</h4>
    <Uploader
      action="/upload"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" width="500" />
      </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          type="text"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{isEditMode?'编辑文章':'新建文章'}}</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { GlobalDataProps, responseType,PostProps, ImageProps } from "@/store";
import ValidateInput, { RulesProp } from "@/components/ValidateInput.vue";
import ValidateForm from "@/components/ValidateForm.vue";
import createMessage from "@/components/createMessage";
import Uploader from "@/components/Uploader.vue";
import { beforeUploadCheck } from "@/helper";
export default defineComponent({
  name: "CreatePost",
  components: {
    ValidateInput,
    ValidateForm,
    Uploader,
  },
  setup() {
    const uploadedData = ref()
    const titleVal = ref("");
    const router = useRouter();
    const route = useRoute();
    const store = useStore<GlobalDataProps>();
    let imageId = "";
    const isEditMode = !!route.query.id
    const titleRules: RulesProp = [
      { type: "required", message: "文章标题不能为空" },
    ];
    const currentId = route.query._id
    const contentVal = ref("");
    const contentRules: RulesProp = [
      { type: "required", message: "文章详情不能为空" },
    ];
    onMounted(()=>{
      if(isEditMode){
        store.dispatch('fetchPost', route.query.id).then((rawData: responseType<PostProps>)=>{
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            id: route.query.id,
            payload: newPost
          } : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const beforeUpload = (file: File) => {
      const isJpg = file.type === "image/jpeg";
      console.log(isJpg);
      if (!isJpg) {
        //createMessage('只能上传jpg或jpeg格式的文件','error')
      }
      return isJpg;
    };
    const onFileUploaded = (rawData: responseType<ImageProps>) => {
      createMessage(`图片上传成功，id为${rawData.data._id}`, "success");
    };
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ["image/jpeg", "image/png"],
        size: 1,
      });
      const { passed, error } = result;
      if (error == "format") {
        createMessage("上传图片只能是 JPG/PNG 格式!", "error");
      }
      if (error === "size") {
        createMessage("上传图片大小不能超过 1Mb", "error");
      }
      return passed;
    };
    const handleFileUploaded = (rawData: responseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id;
      }
    };
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      uploadedData,
      isEditMode,
      onFormSubmit,
      beforeUpload,
      onFileUploaded,
      uploadCheck,
      handleFileUploaded,
    };
  },
});
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
