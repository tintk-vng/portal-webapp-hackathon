import { Captcha, Question, SOF, Voucher } from '@/types/common'
import commonUtil from '@/utils/common'

const commonModel = {
  modelQuestions: (response: any): Question[] => {
    try {
      if (commonUtil.isEmpty(response)) {
        return []
      }
      const questions = response.data.map((question: any) => {
        return {
          ID: question.id,
          title: question.title,
          htmlDescription: question.description,
        }
      })
      return questions
    } catch (error) {
      console.log('Failed to model questions: ', error)
      return []
    }
  },

  modelCaptcha: (response: any): Captcha => {
    let captcha = {} as Captcha
    try {
      if (commonUtil.isEmpty(response)) {
        throw Error
      }
      return {
        ID: response.captcha_id,
        image: response.base64_image,
      }
    } catch (error) {
      console.log('Failed to model captcha: ', error)
      return captcha
    }
  },

  modelVoucher: (response: any): Voucher => {
    let voucher = {} as Voucher
    try {
      if (commonUtil.isEmpty(response)) {
        throw Error
      }
      return {
        ID: response.voucher_id,
        code: response.alias_code,
        type: response.type,
        value: response.value,
        expiredTime: response.expired_time,
      }
    } catch (error) {
      console.log('Failed to model voucher: ', error)
      return voucher
    }
  },

  modelSOFs: (response: any): SOF[] => {
    try {
      if (commonUtil.isEmpty(response)) {
        throw Error
      }
      return response.sofs.map((SOF: any) => ({
        ID: SOF.id,
        name: SOF.name,
        logoURL: SOF.logo_url,
        badgeText: SOF.badge?.value || '',
      }))
    } catch (error) {
      console.log('Failed to model SOFs: ', error)
      return []
    }
  },
}

export default commonModel
