import { Commit, createStore } from "vuex";
import axios,{ AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from '@/helper'
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
export interface responseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}
export interface ImageProps {
  _id?:string,
  url:string,
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface ErrorProps {
  status:Boolean;
  message?:string;
}
interface ListProps<P> {
  [id: string]: P;
}
export interface GlobalDataProps {
  error: ErrorProps;
  columns: { data: ListProps<ColumnProps>; isLoaded: boolean; total: number };
  posts: { data: ListProps<PostProps>; loadedColumns: string[] };
  loading:Boolean;
  user: UserProps;
  token: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;
}
const getAndCommit = async(url: string, mutationName: string,commit: Commit) => {
  const {data} = await axios.get(url)
  commit(mutationName,data)
  return data
}
const postAndCommit = async(url: string, mutationName: string,commit: Commit,payload: any) => {
  const {data} = await axios.post(url,payload)
  commit(mutationName,data)
  return data
}
const patchAndCommit = async(url: string, mutationName: string,commit: Commit,payload: any) => {
  const {data} = await axios.patch(url,payload)
  commit(mutationName,data)
  return data
}
const deleteAndCommit = async(url: string, mutationName: string,commit: Commit,payload: any) => {
  const {data} = await axios.delete(url,payload)
  commit(mutationName,data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error:{status:false},
    columns: { data: {}, isLoaded: false, total: 0 },
    posts: { data: {}, loadedColumns: [] },
    loading: false,
    user: { isLogin: false},
    token: localStorage.getItem("token") || "",
  },
  mutations: {
    setLoading(state,status){
      state.loading = status
    },
    fetchColumns(state, rawData) {
      const { data } = state.columns
      const { list, count } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        isLoaded: true
      }
      state.columns.isLoaded = true
    },
    fetchColumn(state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts(state, { data: rawData, extraData: columnId }) {
      state.posts.data = { ...arrToObj(rawData.list) }
      state.posts.loadedColumns.push(columnId)
    },
    fetchPost(state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    updatePost(state,{data}){
      state.posts.data[data._id] = data
    },
    deletePost(state, { data }) {
      delete state.posts.data[data._id]
    },
    login(state,rawData){
      const {token} = rawData.data
      state.token = token
      localStorage.setItem('token',token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser(state,rawData){
       state.user = {isLogin:true,...rawData.data}
    },
    setError(state,e:ErrorProps){
      state.error = e
    },
    logout(state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.remove('token')
      delete axios.defaults.headers.common.Authorization
    },
  },
  actions: {
    fetchColumns({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      return getAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
        const id = cid.cid
        return getAndCommit(`/columns/${id}`, 'fetchColumn', commit) 
  
    },
    fetchPosts({ commit }, cid) {
        const id = cid.cid
        return getAndCommit(`/columns/${id}/posts`, 'fetchPosts', commit)  
    },
    login({commit},payload){
      return postAndCommit('/user/login','login',commit,payload)
    } ,
    fetchCurrentUser({commit}){
      return getAndCommit('user/current','fetchCurrentUser',commit)
    },
    createPost({ commit }, payload) {
      return postAndCommit('/posts', 'createPost', commit, payload)
    },
    updatePost({commit},{id,payload}){
      return patchAndCommit(`posts/${id}`,'updatePost',commit, payload)
    },
    deletePost({ commit }, id){
      return deleteAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    },
    fetchPost({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    loginAndfetch({dispatch},loginData){
       return dispatch('login',loginData).then(()=>{
        return dispatch('fetchCurrentUser')
       })
    }
  },
  getters: {
    getColumns: (state) => {
      if(state.columns.data){
        return objToArr(state.columns.data)
      }
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      if(state.posts.data){
        return objToArr(state.posts.data).filter(post => post.column === cid)
      }
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    }
  },
});
export default store;
