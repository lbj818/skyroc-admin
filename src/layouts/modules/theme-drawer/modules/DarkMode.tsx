import { Switch } from 'antd'

import { ThemeSchemaSegmented } from '@/features/theme'
import { useThemeStore } from '@/store/themeStore'

import SettingItem from '../components/SettingItem'
import '@/styles/css/darkMode.css'

const DarkMode = () => {
  const settings = useThemeStore(s => s.settings)
  const { setColourWeakness, setGrayscale, setIsOnlyExpandCurrentParentMenu } = useThemeStore.getState()

  return (
    <div className="flex-col-stretch gap-16px">
      <div className="i-flex-center"><ThemeSchemaSegmented /></div>
      <SettingItem label="灰度模式">
        <Switch checked={settings.grayscale} onChange={setGrayscale} />
      </SettingItem>
      <SettingItem label="色弱模式">
        <Switch checked={settings.colourWeakness} onChange={setColourWeakness} />
      </SettingItem>
      <SettingItem label="仅展开当前父级菜单">
        <Switch checked={settings.isOnlyExpandCurrentParentMenu} onChange={setIsOnlyExpandCurrentParentMenu} />
      </SettingItem>
    </div>
  )
}

export default DarkMode
