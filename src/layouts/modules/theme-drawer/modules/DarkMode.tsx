import { Switch } from 'antd';

import {
  ThemeSchemaSegmented,
  getThemeSettings,
  setColourWeakness,
  setGrayscale,
  setIsOnlyExpandCurrentParentMenu
} from '@/features/theme';

import SettingItem from '../components/SettingItem';
import '@/styles/css/darkMode.css';

const DarkMode = () => {
  const dispatch = useAppDispatch();

  const themeSettings = useAppSelector(getThemeSettings);

  function handleGrayscaleChange(value: boolean) {
    dispatch(setGrayscale(value));
  }

  function handleAuxiliaryColorChange(value: boolean) {
    dispatch(setColourWeakness(value));
  }

  function handleIsOnlyExpandCurrentParentMenuChange(value: boolean) {
    dispatch(setIsOnlyExpandCurrentParentMenu(value));
  }
  return (
    <div className="flex-col-stretch gap-16px">
      <div className="i-flex-center">
        <ThemeSchemaSegmented />
      </div>

      <SettingItem label="灰度模式">
        <Switch
          checked={themeSettings.grayscale}
          onChange={handleGrayscaleChange}
        />
      </SettingItem>

      <SettingItem label="色弱模式">
        <Switch
          checked={themeSettings.colourWeakness}
          onChange={handleAuxiliaryColorChange}
        />
      </SettingItem>

      <SettingItem label="仅展开当前父级菜单">
        <Switch
          checked={themeSettings.isOnlyExpandCurrentParentMenu}
          onChange={handleIsOnlyExpandCurrentParentMenuChange}
        />
      </SettingItem>
    </div>
  );
};

export default DarkMode;
