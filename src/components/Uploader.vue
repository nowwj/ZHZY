<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggleUpload" v-bind="$attrs">
      <slot v-if="fileStatus==='loading'" name="loading">
        <button class="btn btn-primary">正在上传</button>
      </slot>
      <slot v-else-if="fileStatus==='success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else>
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input type="file" class="file-input d-none" ref="fileinput" @change="handleFileChange"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref ,watch} from "vue";
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file:File)=>Boolean
emits:['file-uploaded','file-uploaded-error']
inheritAttrs:false
export default defineComponent({
  name: "Uploader",
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload:{
        type:Function as PropType<CheckFunction>
    },
    uploaded: {
      type: Object
    }
  },
  setup(props,context) {
    const fileinput = ref<null | HTMLInputElement>(null);
    const fileStatus = ref<UploadStatus>("ready");
    const uploadedData = ref()
    watch(()=>props.uploaded,(newValue)=>{
       if (newValue) {
        fileStatus.value = 'success'
        uploadedData.value = newValue
      }       
    })
    const triggleUpload = () => {
      if (fileinput.value) {
        fileinput.value.click();
      }
    };
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement;
      if (currentTarget.files) {
        const file = Array.from(currentTarget.files)
        if(props.beforeUpload){
             const result = props.beforeUpload(file[0])
             if(!result){
                return
             }
        }
        fileStatus.value = "loading";

        const formData = new FormData()
        formData.append('file',file[0])
        axios.post(props.action,formData,{
            headers:{
               'Content-Type': 'multipart/form-data'
            }
        }).then(resp=>{
            fileStatus.value = 'success' 
            uploadedData.value = resp.data
            console.log(uploadedData.value);
            
            context.emit('file-uploaded',resp.data)        
        }).catch((error)=>{
            fileStatus.value = 'error'
            context.emit('file-uploaded-error',{error})
        }).finally(()=>{
            if(fileinput.value){
              fileinput.value.value = ''
            }
        })
      }
    };
    return {
      fileinput,
      fileStatus,
      uploadedData,
      triggleUpload,
      handleFileChange,
    };
  },
});
</script>

<style></style>
