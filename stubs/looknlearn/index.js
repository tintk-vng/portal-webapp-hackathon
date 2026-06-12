'use client'

const React = require('react')

const NAV = [
  { label: 'Nạp ĐT / Data', path: '/telco/topup' },
  { label: 'Thanh toán hóa đơn', path: '/bill' },
  { label: 'Game', path: '/game' },
  { label: 'Hỗ trợ', path: 'https://support.zalopay.vn' },
]

function Header(props) {
  const currentPath = (props && props.currentPath) || ''
  const onNavigate = (props && props.onNavigate) || function () {}

  return React.createElement(
    'header',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: '1px solid #E6E9EC',
        background: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      },
    },
    React.createElement(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 10 } },
      React.createElement(
        'div',
        {
          style: {
            width: 30,
            height: 30,
            borderRadius: 8,
            background: '#0033C9',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 17,
          },
        },
        'Z'
      ),
      React.createElement(
        'span',
        { style: { fontSize: 18, fontWeight: 700, color: '#001F3E' } },
        'ZaloPay'
      )
    ),
    React.createElement(
      'nav',
      { style: { display: 'flex', gap: 24 } },
      NAV.map(function (item) {
        const active = currentPath.indexOf(item.path) === 0
        return React.createElement(
          'a',
          {
            key: item.path,
            onClick: function (e) {
              if (item.path.indexOf('http') === 0) return
              e.preventDefault()
              onNavigate(item.path)
            },
            href: item.path,
            style: {
              fontSize: 14,
              cursor: 'pointer',
              textDecoration: 'none',
              color: active ? '#0033C9' : '#334C65',
              fontWeight: active ? 700 : 400,
              borderBottom: active ? '2px solid #0033C9' : '2px solid transparent',
              paddingBottom: 4,
            },
          },
          item.label
        )
      })
    ),
    React.createElement(
      'span',
      {
        style: {
          fontSize: 13,
          color: '#FF8D00',
          fontWeight: 700,
          border: '1px solid #FFEAA5',
          background: '#FFFBEC',
          borderRadius: 8,
          padding: '6px 10px',
        },
      },
      'offline stub header'
    )
  )
}

function Footer() {
  const cols = [
    { title: 'Dịch vụ', links: ['Nạp tiền ĐT', 'Thanh toán hóa đơn', 'Mua thẻ', 'Game'] },
    { title: 'Về ZaloPay', links: ['Giới thiệu', 'Điều khoản', 'Bảo mật', 'Hoàn tiền'] },
    { title: 'Hỗ trợ', links: ['FAQ', 'Liên hệ', 'support.zalopay.vn'] },
  ]
  return React.createElement(
    'footer',
    {
      style: {
        borderTop: '1px solid #E6E9EC',
        background: '#F5F9FF',
        padding: '32px 24px 24px',
        marginTop: 40,
      },
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          gap: 64,
          flexWrap: 'wrap',
          maxWidth: 1100,
          margin: '0 auto',
        },
      },
      React.createElement(
        'div',
        { style: { maxWidth: 220 } },
        React.createElement(
          'div',
          { style: { fontSize: 18, fontWeight: 700, color: '#0033C9', marginBottom: 8 } },
          'ZaloPay'
        ),
        React.createElement(
          'p',
          { style: { fontSize: 13, color: '#66798B', lineHeight: 1.5, margin: 0 } },
          'Thanh toán ngay tại website ZaloPay · VNG Corporation'
        )
      ),
      cols.map(function (col) {
        return React.createElement(
          'div',
          { key: col.title },
          React.createElement(
            'div',
            { style: { fontSize: 14, fontWeight: 700, color: '#001F3E', marginBottom: 10 } },
            col.title
          ),
          col.links.map(function (l) {
            return React.createElement(
              'div',
              {
                key: l,
                style: { fontSize: 13, color: '#66798B', marginBottom: 8, cursor: 'pointer' },
              },
              l
            )
          })
        )
      })
    ),
    React.createElement(
      'div',
      {
        style: {
          maxWidth: 1100,
          margin: '24px auto 0',
          paddingTop: 16,
          borderTop: '1px solid #E6E9EC',
          fontSize: 12,
          color: '#99A5B2',
        },
      },
      '© ZaloPay — offline stub footer (real component on private registry)'
    )
  )
}

module.exports = { Header: Header, Footer: Footer }
