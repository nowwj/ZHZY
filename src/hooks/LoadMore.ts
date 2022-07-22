import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'
interface LoadParams {
    currentPage:number;
    pageSize:number;
}
const LoadMore = (actionName:string,total:ComputedRef<number>,params:LoadParams={currentPage:5,pageSize:2})=>{
     const store = useStore()
     const currentPage = ref(params.currentPage)
     const requestParams = computed(()=>({
        currentPage:currentPage.value,
        pageSize:params.pageSize
     }))
     const LoadMorePage = ()=>{
        store.dispatch(actionName,requestParams.value).then(()=>{
            currentPage.value++
        })
     }
     const isLastPage = computed(()=>{
        return Math.ceil(total.value/params.pageSize)<currentPage.value
     })
     return {
        currentPage,
        LoadMorePage,
        isLastPage,
     }
}
export default LoadMore