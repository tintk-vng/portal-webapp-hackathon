import axios, { AxiosError, AxiosResponse } from 'axios'

const getBaseUrl = () => {
  // const baseUrl =
  //   typeof window === 'undefined'
  //     ? process.env.NEXT_PUBLIC_PAYMENT_AGGREGATOR_BASE_URL
  //     : (window as any)['runtime_configs']?.NEXT_PUBLIC_PAYMENT_AGGREGATOR_BASE_URL
  // console.log(
  //   'hihi',
  //   typeof window === 'undefined'
  //     ? process.env.NEXT_PUBLIC_PAYMENT_AGGREGATOR_BASE_URL
  //     : (window as any)['runtime_configs']?.NEXT_PUBLIC_PAYMENT_AGGREGATOR_BASE_URL
  // )
  return process.env.NEXT_PUBLIC_PAYMENT_AGGREGATOR_BASE_URL
}

const createAxiosInstance = () => {
  const axiosInstance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 120000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  axiosInstance.interceptors.request.use(
    function (config) {
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    function (response: AxiosResponse) {
      return response.data
    },
    function (error: AxiosError) {
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.log('Request timed out')
      }
      return Promise.reject(error)
    }
  )

  return axiosInstance
}

const axiosClient = createAxiosInstance()

export default axiosClient
