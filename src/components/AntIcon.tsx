import * as AntdIcons from '@ant-design/icons'
import { createElement } from 'react'

type IconName = keyof typeof AntdIcons
export default function AntIcon({className, icon, style}: {className?: string, icon: IconName, style?: React.CSSProperties}) {
  const IconComponent = AntdIcons[icon] as React.ComponentType<any>
  if (IconComponent) {
    return createElement(IconComponent, { className, style })
  }
} 