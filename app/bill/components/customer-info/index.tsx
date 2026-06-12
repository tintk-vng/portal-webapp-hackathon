import RowInfo from '../row-info'
interface ICustomerInfo {
  customerCode?: string
  phoneNumber?: string
  customerName?: string
  address?: string
  className?: string
  identityNumber?: string
  dateOfBirth?: string
  customerClassname?: string
  customerSchoolname?: string
}
const CustomerInfo = ({
  customerCode = '',
  phoneNumber = '',
  customerName = '',
  address = '',
  className = '',
  identityNumber = '',
  customerClassname = '',
  dateOfBirth = '',
  customerSchoolname = '',
}: ICustomerInfo) => {
  return (
    <>
      <div className={className}>
        <p className="mb-2 text-base font-bold">Thông tin khách hàng</p>
        <div className="divide-y divide-dark-50 text-label-md md:text-label-lg">
          {customerCode && <RowInfo title="Mã khách hàng" value={customerCode} />}
          {phoneNumber && <RowInfo title="Số điện thoại" value={phoneNumber} />}
          {customerName && <RowInfo title="Tên khách hàng" value={customerName} />}
          {address && <RowInfo title="Địa chỉ" value={address} />}
          {identityNumber && <RowInfo title="Số CMND/CCCD" value={identityNumber} />}
          {dateOfBirth && <RowInfo title="Ngày sinh" value={dateOfBirth} />}
          {customerSchoolname && <RowInfo title="Trường học" value={customerSchoolname} />}
          {customerClassname && <RowInfo title="Lớp" value={customerClassname} />}
        </div>
      </div>
    </>
  )
}
export default CustomerInfo
