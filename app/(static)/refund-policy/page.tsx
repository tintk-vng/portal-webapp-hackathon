export default function RefundPolicy() {
  return (
    <div className="p-4 md:p-0">
      <div className="mb-6 text-heading-md md:text-heading-lg">CHÍNH SÁCH HOÀN HỦY VÀ BỒI HOÀN</div>
      <div className="mb-4 text-heading-sm md:text-heading-md">ĐỐI VỚI DỊCH VỤ VIỄN THÔNG</div>
      <p className="text-paragraph-lg">
        Các dịch vụ như mua thẻ điện thoại, thẻ game, hoặc thẻ data… sẽ không được hoàn trả và bảo
        hành nếu như giao dịch đã được ghi nhận thành công trên hệ thống của Zalopay.
      </p>
      <div className="mb-4 mt-6 text-heading-sm md:text-heading-md">
        ĐỐI VỚI DỊCH VỤ THANH TOÁN TRỰC TUYẾN HÓA ĐƠN ĐIỆN, NƯỚC, INTERNET, TRUYỀN HÌNH, CHUNG CƯ,
        VAY TIÊU DÙNG VÀ HỌC PHÍ
      </div>
      <p className="text-paragraph-lg">
        Các dịch vụ thanh toán trực tuyến hóa đơn điện, nước, truyền hình, Internet, truyền hình,
        chung cư, vay tiêu dùng và học phí sẽ không được hoàn trả nếu như giao dịch đã được ghi nhận
        thành công trên hệ thống của Zalopay.
        <br />
        <br />
        Nếu bạn đã hoàn tất thanh toán và bị trừ tiền, nhưng giao dịch vẫn ở trong trạng thái “Đang
        xử lý”:
      </p>
      <ul className="list-inside list-disc">
        <li className="text-paragraph-lg">
          Số tiền của bạn đã được chuyển đến nhà cung cấp, và nhà cung cấp sẽ xử lý trong vòng 1-3
          ngày làm việc:
          <ul>
            <li>- Nếu nhà cung cấp xử lý thành công, hoá đơn của bạn sẽ được gạch nợ.</li>
            <li>- Nếu nhà cung cấp xử lý không thành công, số tiền sẽ được hoàn về kênh thanh</li>
          </ul>
        </li>
        <li className="text-paragraph-lg">
          Trường hợp quá 3 ngày làm việc nhưng giao dịch vẫn ở trạng thái Đang xử lý/Đang chờ, bạn
          vui lòng gửi yêu cầu hỗ trợ để Zalopay thực hiện đối soát với nhà cung cấp.
        </li>
      </ul>
      <br />
      <p className="text-paragraph-lg">
        Nếu bạn đã thanh toán thành công, nhưng chưa được gạch nợ:
      </p>
      <ul className="list-inside list-disc">
        <li className="text-paragraph-lg">
          Để kiểm tra tình trạng thanh toán của hoá đơn, bạn truy cập mục Lịch sử trên ứng dụng,
          chọn vào giao dịch thanh toán hoá đơn, kiểm tra thông tin trạng thái.
          <ul>
            <li>
              - Trạng thái Thành công: chắc chắn số tiền đã được chuyển đến nhà cung cấp dịch vụ.
              Trong vòng 1-2 ngày làm việc, nhà cung cấp sẽ xử lý gạch nợ hoá đơn trên hệ thống trực
              tuyến.
            </li>
            <li>
              - Trạng thái Đang xử lý/Đang chờ: số tiền đã được chuyển đến nhà cung cấp dịch vụ và
              nhà cung cấp sẽ xử lý trong vòng 1-3 ngày. Nếu nhà cung cấp xử lý không thành công, số
              tiền sẽ được hoàn về kênh thanh toán bạn sử dụng; nếu nhà cung cấp xử lý thành công,
              hoá đơn của bạn sẽ được gạch nợ.
            </li>
          </ul>
        </li>
        <li className="text-paragraph-lg">
          Khi trạng thái giao dịch hiển thị thành công, bạn có thể nhập mã hoá đơn lại trên Zalopay
          để kiểm tra về số tiền nợ đang ghi nhận trên hệ thống. Nếu thông tin hiển thị không còn nợ
          nghĩa là hoá đơn của bạn đã được gạch nợ thành công.
        </li>
      </ul>
      <br />
      <p className="text-paragraph-lg">Nếu giao dịch thanh toán bị báo không đủ số dư:</p>
      <ul className="list-inside list-disc">
        <li className="text-paragraph-lg">
          Khi thanh toán thất bại do không đủ số dư, có thể bạn đang gặp các trường hợp sau:
          <ul>
            <li>
              - Một số ngân hàng yêu cầu số dư tối thiểu trong tài khoản (có thể lên tới 100.000đ).
              Khi bạn thanh toán qua Zalopay, số dư tối thiểu xuống dưới mức yêu cầu nên ngân hàng
              không chấp nhận giao dịch.
            </li>
            <li>- Bạn đang chọn tài khoản ngân hàng không đủ số dư để thực hiện thanh toán.</li>
            <li>
              - Nếu bạn dùng thẻ tín dụng thì thẻ của bạn đã hết hạn mức thanh toán với giao dịch
              này.
            </li>
          </ul>
        </li>
      </ul>
      <br />
      <p className="text-paragraph-lg">Nếu giao dịch thanh toán thất bại:</p>
      <ul className="list-inside list-disc">
        <li className="text-paragraph-lg">
          Khi nhận thông báo thanh toán thất bại, bạn hãy kiểm tra các thông tin sau:
          <ul>
            <li>
              - Ví Zalopay hoặc tài khoản ngân hàng của bạn đang không đủ số dư để thực hiện giao
              dịch. Bạn vui lòng kiểm tra và nạp thêm tiền để thực hiện giao dịch.
            </li>
            <li>
              - Hệ thống của Zalopay hoặc đối tác cung cấp dịch vụ đang tạm thời gián đoạn. Bạn vui
              lòng thực hiện lại giao dịch vào thời điểm khác nhé (trung bình khoảng 1 đến 2 giờ sau
              đó)
            </li>
          </ul>
        </li>
      </ul>
      <br />
      <p className="text-paragraph-lg">
        Khi áp dụng mã khuyến mãi để thanh toán hóa đơn trên Zalopay:
      </p>
      <ul className="list-inside list-disc">
        <li className="text-paragraph-lg">
          Trường hợp không sử dụng được mã khuyến mãi, bạn vui lòng kiểm tra lại các thông tin sau:
          <ul>
            <li>
              - Điều kiện để áp dụng khuyến mãi: Ví dụ: thời gian hiệu lực của voucher khuyến mãi,
              số tiền giao dịch tối thiểu/loại dịch vụ được áp dụng voucher (ví dụ voucher chỉ áp
              dụng cho hoá đơn điện/nước/truyền hình/internet, không áp dụng cho hoá đơn vay tiêu
              dung, ...)
            </li>
            <li>
              - Đảm bảo kết nối mạng ổn định khi áp dụng khuyến mãi và thực hiện thanh toán.
              <br />
              <p className="text-paragraph-lg text-dark-300">
                Lưu ý:
                <br />
                Việc tài khoản của bạn không sử dụng được khuyến mãi có thể do hệ thống bảo mật ghi
                nhận tài khoản của bạn có dấu hiệu không an toàn, nhằm tránh các trường hợp gian lận
                hoặc đầu cơ quà khuyến mãi
                <br />
                Để không bị gián đoạn trong việc thanh toán hoá đơn, bạn vui lòng thanh toán và
                không lựa chọn khuyến mãi nhé.
              </p>
            </li>
          </ul>
        </li>
        <li>
          Trường hợp bạn sử dụng khuyến mãi không thành công, nhưng đã bị mất mã khuyến mãi: Những
          giao dịch có sử dụng khuyến mãi của Zalopay nhưng không thành công, mã khuyến mãi sẽ được
          tạm giữ trên hệ thống trong 15 phút sau đó sẽ được hoàn về tài khoản của bạn. Bạn vui lòng
          kiểm tra và thực hiện lại giao dịch khác để sử dụng khuyến mãi nhé.
        </li>
      </ul>
      <br />
      <p className="text-paragraph-lg">
        Trường hợp bạn nhập sai thông tin hóa đơn và đã giao dịch thành công cho hóa đơn này: Bạn
        hãy liên hệ trực tiếp cho nhà cung cấp sản phẩm/ dịch vụ mà bạn thanh toán trên Zalopay để
        phản ánh và được hỗ trợ. Zalopay không trực tiếp thực hiện hoàn hủy giao dịch khi chưa được
        sự đồng ý từ nhà cung cấp.
        <br />
        <br />
        Trường hợp bạn phát hiện số tiền thanh toán hiển thị trên Zalopay khác với số tiền trên hóa
        đơn bạn nhận được từ nhà cung cấp dịch vụ:
      </p>
      <ul className="list-inside list-disc">
        <li className="text-paragraph-lg">
          Nếu bạn phát hiện điều này khi đang kiểm tra dư nợ hóa đơn: Vui lòng không thực hiện tiếp
          thao tác thanh toán và liên hệ ngay cho bộ phần CSKH của Zalopay để được hỗ trợ.
        </li>
        <li>
          Nếu bạn phát hiện điều này sau khi đã thanh toán thành công trên Zalopay: Vui lòng gửi yêu
          cầu hỗ trợ đến bộ phận CSKH của Zalopay, Zalopay sẽ tiến hành kiểm tra, đối soát với nhà
          cung cấp từ 1-3 ngày làm việc và phản hồi thông tin đến bạn.
        </li>
      </ul>
    </div>
  )
}
