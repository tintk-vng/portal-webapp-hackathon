import commonUtil from '@/utils/common'

const aparmentModel = {
  modelBill: (bills: any) => {
    try {
      const bill = bills?.[0] || {}
      if (commonUtil.isEmpty(bill.apartment_fee)) {
        return {}
      }
      const {
        management_fee = 0,
        parking_fee = 0,
        water_fee = 0,
        electric_fee = 0,
        gas_fee = 0,
        other_fee = 0,
        old_dept = 0,
        paid = 0,
        service_fee = 0,
      } = bill.apartment_fee
      const fee: { [key: string]: { name: string; amount: number } } = {
        management: {
          name: 'Phí quản lý',
          amount: management_fee,
        },
        parking: {
          name: 'Phí gửi xe',
          amount: parking_fee,
        },
        water: {
          name: 'Phí nước',
          amount: water_fee,
        },
        electric: {
          name: 'Phí điện',
          amount: electric_fee,
        },
        gas: {
          name: 'Phí gas',
          amount: gas_fee,
        },
        service: {
          name: 'Phí dịch vụ',
          amount: service_fee,
        },
        other: {
          name: 'Phí khác',
          amount: other_fee,
        },
        old_dept: {
          name: 'Nợ cũ',
          amount: old_dept,
        },
        paid: {
          name: 'Đã trả',
          amount: paid,
        },
      }
      return {
        fees: Object.keys(fee).map((key) => ({
          ID: key,
          ...fee[key],
        })),
      }
    } catch (error) {
      console.log('Failed to model bill: ', error)
      return {}
    }
  },
}

export default aparmentModel
