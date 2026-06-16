function getHostname(host: string | null) {
  if (!host) {
    return ''
  }

  const normalizedHost = host.trim().toLowerCase()

  if (normalizedHost.startsWith('[')) {
    return normalizedHost.slice(1, normalizedHost.indexOf(']'))
  }

  return normalizedHost.split(':')[0]
}

export function isLocalHost(host: string | null) {
  const hostname = getHostname(host)
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

export function isLocalRequest(request: Request) {
  return isLocalHost(request.headers.get('host'))
}
