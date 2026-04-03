import { useDebounceFn, useKeyPress } from 'ahooks'
import type { InputRef } from 'antd'
import clsx from 'clsx'

import { useMixMenuContext } from '@/features/menu'
import { useRouter } from '@/features/router'
import { useAppStore } from '@/store/appStore'

import SearchFooter from './SearchFooter'
import SearchResult from './SearchResult'

interface Props {
  onClose: () => void
  show: boolean
}

function transformMenuToSearchMenus(menus: App.Global.Menu[], treeMap: App.Global.Menu[] = []) {
  if (!menus?.length) return []
  return menus.reduce((acc, cur) => {
    acc.push(cur)
    if (cur.children?.length) transformMenuToSearchMenus(cur.children, treeMap)
    return acc
  }, treeMap)
}

const SearchModal = ({ onClose, show }: Props) => {
  const [resultOptions, setResultOptions] = useState<App.Global.Menu[]>([])
  const [activeRoute, setActiveRoute] = useState<string>('')
  const isMobile = useAppStore(s => s.isMobile)
  const keyword = useRef<InputRef>(null)
  const { allMenus } = useMixMenuContext()
  const { navigate } = useRouter()
  const searchMenus = useMemo(() => transformMenuToSearchMenus(allMenus), [allMenus])

  function handleClose() {
    setTimeout(() => { onClose(); setResultOptions([]) }, 200)
  }

  function search() {
    const trimKeyword = keyword.current?.input?.value?.toLocaleLowerCase().trim()
    const result = searchMenus.filter(menu => trimKeyword && menu.title?.includes(trimKeyword))
    setResultOptions(result)
    setActiveRoute(result[0]?.key || '')
  }

  const handleSearch = useDebounceFn(search, { wait: 300 })

  function handleKeyPress(direction: 1 | -1) {
    const { length } = resultOptions
    if (!length) return
    const index = resultOptions.findIndex(item => item.key === activeRoute)
    if (index === -1) return
    setActiveRoute(resultOptions[(index + direction + length) % length].key)
  }

  function handleEnter() {
    if (!resultOptions.length || !activeRoute) return
    handleClose()
    navigate(activeRoute)
  }

  useKeyPress('Escape', handleClose)
  useKeyPress('Enter', handleEnter)
  useKeyPress('uparrow', () => handleKeyPress(-1))
  useKeyPress('downarrow', () => handleKeyPress(1))

  return (
    <AModal
      destroyOnHidden
      className={clsx({ 'top-0px rounded-0': isMobile })}
      closable={false}
      footer={isMobile ? null : <SearchFooter />}
      height={isMobile ? '100%' : 400}
      open={show}
      style={isMobile ? { margin: 0, maxWidth: '100%', padding: 0 } : undefined}
      styles={{ body: { height: isMobile ? '100vh' : '100%', paddingBottom: 0 } }}
      width={isMobile ? '100%' : 630}
      onCancel={handleClose}
    >
      <ASpace.Compact className="w-full">
        <AInput allowClear placeholder="请输入关键词搜索" prefix={<IconUilSearch className="text-15px text-#c2c2c2" />} ref={keyword} onInput={handleSearch.run} />
        {isMobile && <AButton ghost type="primary" onClick={handleClose}>取消</AButton>}
      </ASpace.Compact>
      <div className="mt-20px">
        {resultOptions.length === 0 ? <AEmpty /> : resultOptions.map(item => (
          <SearchResult active={item.key === activeRoute} enter={handleEnter} key={item.key} menu={item} setActiveRouteName={setActiveRoute} />
        ))}
      </div>
    </AModal>
  )
}

export default SearchModal
