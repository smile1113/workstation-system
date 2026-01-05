import axios from "axios";

const baseUrl = 'http://127.0.0.1:3009'

const instance = axios.create({
    baseUrl,
    timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
      // 在发送请求之前做些什么
      return config
    },
    (error) => {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
  )

  // 添加响应拦截器
  instance.interceptors.response.use(
    (response) => {
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      // if (response.data.status !== 200) {
      //   console.error(response.data.message)
      //   return Promise.reject(response.data)
      // }
      return response
    },
    (error) => {
      // 超出 2xx 范围的状态码都会触发该函数。
      // 对响应错误做点什么
      if (error.response?.status === 401) {
        console.log("asas");
      }
      console.error(error.response.data.message || '服务异常')

      return Promise.reject(error)
    }
  )

export default instance



