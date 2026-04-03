import clsx from 'clsx'
import KeepAlive, { useKeepAliveRef } from 'keepalive-for-react'

import { usePreviousRoute } from '@/features/router'
import { useThemeSettings } from '@/features/theme'
import { useAppStore } from '@/store/appStore'
import { useRouteStore } from '@/store/routeStore'

import './transition.css'

interface Props {
  closePadding?: boolean
}

const GlobalContent = ({ closePadding }: Props) => {
  const previousRoute = usePreviousRoute()
  const currentOutlet = useOutlet(previousRoute)
  const { pathname } = useLocation()
  const aliveRef = useKeepAliveRef()

  const removeCacheKey = useRouteStore(s => s.removeCacheKey)
  const cacheKeys = useRouteStore(s => s.cacheRoutes)
  const reload = useAppStore(s => s.reloadFlag)
  const { setRemoveCacheKey } = useRouteStore.getState()
  const themeSetting = useThemeSettings()
  const transitionName = themeSetting.page.animate ? themeSetting.page.animateMode : ''

  useUpdateEffect(() => {
    if (!aliveRef.current || !removeCacheKey) return
    aliveRef.current.destroy(removeCacheKey)
    setRemoveCacheKey(null)
  }, [removeCacheKey])

  useUpdateEffect(() => {
    aliveRef.current?.refresh()
  }, [reload, transitionName])

  return (
    <div className={clsx('h-full flex-grow bg-layout', { 'p-16px': !closePadding })}>
      <KeepAlive
        activeCacheKey={pathname}
        aliveRef={aliveRef}
        cacheNodeClassName={reload ? '' : transitionName}
        include={cacheKeys}
      >
        {!reload && currentOutlet}
      </KeepAlive>
    </div>
  )
}

export default GlobalContent
