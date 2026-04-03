import ButtonIcon from '@/components/ButtonIcon'
import SvgIcon from '@/components/SvgIcon'
import { useAppStore } from '@/store/appStore'

interface Props {
  arrowIcon?: boolean
  className?: string
}

type NumberBool = 0 | 1

const icons: Record<NumberBool, Record<NumberBool, string>> = {
  0: { 0: 'line-md:menu-fold-left', 1: 'line-md:menu-fold-right' },
  1: { 0: 'ph-caret-double-left-bold', 1: 'ph-caret-double-right-bold' }
}

const MenuToggler = ({ arrowIcon, className }: Props) => {
  const siderCollapse = useAppStore(s => s.siderCollapse)
  const { toggleSiderCollapse } = useAppStore.getState()

  const isArrowIcon = Number(arrowIcon || false) as NumberBool
  const isCollapsed = Number(siderCollapse || false) as NumberBool

  return (
    <ButtonIcon
      className={className}
      tooltipContent={siderCollapse ? '展开菜单' : '折叠菜单'}
      tooltipPlacement="bottomLeft"
      onClick={toggleSiderCollapse}
    >
      <SvgIcon icon={icons[isArrowIcon][isCollapsed]} />
    </ButtonIcon>
  )
}

export default MenuToggler
