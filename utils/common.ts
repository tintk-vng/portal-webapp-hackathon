import { AppID as BillAppID } from '@/constants/bill'
import { Domain, MAPPED_PATH } from '@/constants/common'
import { AppID as TelcoAppID } from '@/constants/telco'
import { TrackingEvent } from '@/types/common'

const isDoubleByte = (str: string): boolean => {
  for (let i = 0, n = str.length; i < n; i++) {
    if (str.charCodeAt(i) > 255) {
      return true
    }
  }
  return false
}

const decimalString = (value: number): string => {
  const currencyFormatRegex = /(\d)(?=(\d{3})+(?!\d))/g
  return value.toString().replace(currencyFormatRegex, '$1.')
}

const commonUtil = {
  isEmpty(value: any) {
    if (!value) {
      return true
    }
    if (Array.isArray(value) || typeof value === 'string' || typeof value.splice === 'function') {
      return !value.length
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      return !Object.keys(value).length
    }
    return true
  },

  formatCurrency(value: number, allowZero: boolean = false): string {
    const unit = 'đ'
    if (isNaN(value)) {
      return ''
    }
    if (!allowZero && !value) {
      return ''
    }
    const parts = value.toString().split('.')
    if (parts.length === 1) {
      return `${decimalString(value)}${unit}`
    }
    const fraction = parts[1]
    return `${decimalString(value)},${fraction}${unit}`
  },

  formatNumber(value: string): string {
    if (commonUtil.isEmpty(value)) {
      return ''
    }
    const whiteSpaceRegex = /\s+/g
    const digitRegex = /\D+/g
    return value.replace(whiteSpaceRegex, '').replace(digitRegex, '')
  },

  checkDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const agentLower = userAgent.toLowerCase()
    return {
      isWP: /iemobile/.test(agentLower),
      isAndroid: /android/i.test(agentLower) && !/iemobile/.test(agentLower),
      isIOS: /iphone|ipad|ipod/.test(agentLower) && !/iemobile/.test(agentLower),
      isMobile: /android|iphone|ipad|ipod|iemobile/.test(agentLower),
    }
  },

  isPathMatched(domain: Domain, appID: TelcoAppID | BillAppID, pathName: string): boolean {
    let isMatched = false
    const mappedPath = MAPPED_PATH[domain][appID]
    if (!mappedPath) {
      return isMatched
    }
    isMatched =
      pathName === mappedPath.source ||
      pathName === mappedPath.destination ||
      pathName.startsWith(`${mappedPath.source}/`) ||
      pathName.startsWith(`${mappedPath.destination}/`)
    return isMatched
  },

  getParameterByName(name: string, url: string = '') {
    let _url = url
    if (!_url && typeof window !== 'undefined') {
      _url = window.location.href
    }
    name = name.replace(/[[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(_url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  },

  trackEvent(event: TrackingEvent) {
    if (!event.ID) {
      return
    }
    try {
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENV !== 'local') {
        window.ZPI_TRACKING_SDK.logAction('05.' + event.ID, JSON.stringify(event?.metaData || {}))
      }
    } catch (error) {
      console.log(`Failed to track event ${event.ID}: `, error)
    }
  },

  removeAccents(value: string) {
    const formattedValue = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
    return formattedValue
  },

  b64DecodeUnicode(str: string) {
    try {
      if (isDoubleByte(str) || str === '') {
        return ''
      }
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(str), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )
    } catch (error) {
      console.log('Failed to decode: ', error)
      return ''
    }
  },

  buildPathWithSearchParams(path: string, params: Record<string, any>): string {
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        path = `${path}${path.includes('?') ? `&${key}=${value}` : `?${key}=${value}`}`
      }
    }

    return path
  },
}

export default commonUtil
