import { Button, Switch, Tooltip } from 'antd'

import { useThemeStore } from '@/store/themeStore'

import SettingItem from '../components/SettingItem'

import CustomPicker from './CustomPicker'

const ThemeColor = () => {
  const settings = useThemeStore(s => s.settings)
  const { setRecommendColor } = useThemeStore.getState()

  const colors = {
    error: settings.otherColor.error,
    info: settings.isInfoFollowPrimary ? settings.themeColor : settings.otherColor.info,
    primary: settings.themeColor,
    success: settings.otherColor.success,
    warning: settings.otherColor.warning
  }

  return (
    <div className="flex-col-stretch gap-12px">
      <Tooltip placement="topLeft" title={<p><span className="pr-12px">推荐颜色的算法参照</span><br /><Button className="text-gray" href="https://uicolors.app/create" rel="noopener noreferrer" target="_blank" type="link">https://uicolors.app/create</Button></p>}>
        <div>
          <SettingItem key="recommend-color" label="应用推荐算法的颜色">
            <Switch checked={settings.recommendColor} onChange={setRecommendColor} />
          </SettingItem>
        </div>
      </Tooltip>
      {Object.entries(colors).map(([key, value], index) => (
        <CustomPicker index={index} isInfoFollowPrimary={settings.isInfoFollowPrimary} key={key} label={key} theme={settings.themeColor} value={value} />
      ))}
    </div>
  )
}

export default ThemeColor
