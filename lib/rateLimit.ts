const DAILY_LIMIT = 25
const WINDOW_MS   = 24 * 60 * 60 * 1000

interface Slot { count: number; reset: number }

const rateLimitMap = new Map<string, Slot>()
const vpnCache     = new Map<string, boolean>()

// Known VPN/proxy provider keywords — checked against ipinfo.io org + hostname
const VPN_KEYWORDS = [
  'vpn', 'proxy', 'proxies', 'socks',
  'nordvpn', 'expressvpn', 'mullvad', 'protonvpn', 'private internet access',
  'torguard', 'ipvanish', 'surfshark', 'windscribe', 'cyberghost',
  'hidemyass', 'hotspot shield', 'tunnelbear', 'purevpn', 'astrill',
  'tor exit', 'tor-exit', 'torexit',
]

// Datacenter ASNs commonly used to run VPN endpoints — conservative list
const DATACENTER_KEYWORDS = [
  'digitalocean', 'linode', 'vultr', 'hetzner', 'contabo',
  'choopa', 'quadranet', 'colocrossing', 'ponynet', 'frantech',
  'serverius', 'tzulo', 'leaseweb', 'psychz', 'hostkey',
]

function isPrivateIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'unknown' ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('fc') ||
    ip.startsWith('fd')
  )
}

export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip)
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  // Local/private IPs are always exempt — development and owner use
  if (isPrivateIp(ip)) return { allowed: true, remaining: DAILY_LIMIT, resetAt: Date.now() + WINDOW_MS }

  const now  = Date.now()
  const slot = rateLimitMap.get(ip)

  if (!slot || now > slot.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    return { allowed: true, remaining: DAILY_LIMIT - 1, resetAt: now + WINDOW_MS }
  }

  if (slot.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: slot.reset }
  }

  slot.count++
  return { allowed: true, remaining: DAILY_LIMIT - slot.count, resetAt: slot.reset }
}

export async function isVpnOrProxy(ip: string): Promise<boolean> {
  if (isPrivateIp(ip)) return false
  if (vpnCache.has(ip)) return vpnCache.get(ip)!

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2_500)

    const res = await fetch(`https://ipinfo.io/${ip}/json`, { signal: controller.signal })
    clearTimeout(timer)

    if (!res.ok) { vpnCache.set(ip, false); return false }

    const data = await res.json() as { org?: string; hostname?: string }
    const text = `${(data.org ?? '').toLowerCase()} ${(data.hostname ?? '').toLowerCase()}`

    const isVpn = VPN_KEYWORDS.some(k => text.includes(k)) ||
                  DATACENTER_KEYWORDS.some(k => text.includes(k))

    vpnCache.set(ip, isVpn)
    return isVpn
  } catch {
    // If check fails (timeout, network), fail open — don't block
    vpnCache.set(ip, false)
    return false
  }
}
