import axios, { AxiosError, AxiosResponse } from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ZLP_SUPPORT_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

axiosInstance.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data
  },
  function (error: AxiosError) {
    return Promise.reject(error)
  }
)

const faqAPI = {
  getQuestions(params: { folderID: string }) {
    const url = `/faq/api/get-article-list?folderId=${params.folderID}`
    return axiosInstance.get(url)
  },
}

export default faqAPI
