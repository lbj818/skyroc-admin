import { resetTheme, settingsJson } from '@/features/theme';
import { useTheme } from '@/features/theme/themeContext';

const ConfigOperation = () => {
  const themeSettingsJson = useAppSelector(settingsJson);

  const dispatch = useAppDispatch();

  const { setThemeScheme } = useTheme();

  const { copy } = useCopy();

  function formatConfigText() {
    const reg = /"\w+":/g;
    return themeSettingsJson.replace(reg, match => match.replace(/"/g, ''));
  }

  async function handleCopy() {
    const text = formatConfigText();
    const success = await copy(text);
    if (success) {
      window.$message?.success('复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings');
    } else {
      window.$message?.error('复制失败');
    }
  }

  function handleReset() {
    setThemeScheme('light');
    dispatch(resetTheme());
    setTimeout(() => {
      window.$message?.success('重置成功');
    }, 50);
  }

  return (
    <div className="flex justify-between">
      <AButton
        danger
        onClick={handleReset}
      >
        重置配置
      </AButton>
      <AButton
        type="primary"
        onClick={handleCopy}
      >
        复制配置
      </AButton>
    </div>
  );
};

export default ConfigOperation;
