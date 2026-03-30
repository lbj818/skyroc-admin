import { Button, Switch, Tooltip } from 'antd';

import { getThemeSettings, setRecommendColor, themeColors } from '@/features/theme';

import SettingItem from '../components/SettingItem';

import CustomPicker from './CustomPicker';

const ThemeColor = () => {
  const themeSettings = useAppSelector(getThemeSettings);

  const dispatch = useAppDispatch();

  const colors = useAppSelector(themeColors);

  function handleRecommendColorChange(value: boolean) {
    dispatch(setRecommendColor(value));
  }

  return (
    <div className="flex-col-stretch gap-12px">
      <Tooltip
        placement="topLeft"
        title={
          <p>
            <span className="pr-12px">推荐颜色的算法参照</span>
            <br />
            <Button
              className="text-gray"
              href="https://uicolors.app/create"
              rel="noopener noreferrer"
              target="_blank"
              type="link"
            >
              https://uicolors.app/create
            </Button>
          </p>
        }
      >
        <div>
          <SettingItem
            key="recommend-color"
            label="应用推荐算法的颜色"
          >
            <Switch
              checked={themeSettings.recommendColor}
              onChange={handleRecommendColorChange}
            />
          </SettingItem>
        </div>
      </Tooltip>
      {Object.entries(colors).map(([key, value], index) => (
        <CustomPicker
          index={index}
          isInfoFollowPrimary={themeSettings.isInfoFollowPrimary}
          key={key}
          label={key}
          theme={themeSettings.themeColor}
          value={value}
        />
      ))}
    </div>
  );
};

export default ThemeColor;
