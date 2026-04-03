import { useAppStore } from '@/store/appStore'

export function useMobile() {
  return useAppStore(s => s.isMobile)
}
