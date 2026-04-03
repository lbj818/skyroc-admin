import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'

import { ThemeContext } from '@/features/theme'
import { useThemeStore } from '@/store/themeStore'

export type ECOption = EChartsOption

interface Hooks {
  onRender?: (instance: echarts.ECharts) => void
  onUpdated?: (instance: echarts.ECharts) => void
}

export function useEcharts(options: ECOption, hooks: Hooks = {}) {
  const { darkMode } = useContext(ThemeContext)
  const themeSettings = useThemeStore(s => s.settings)
  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)

  const { onRender, onUpdated } = hooks

  function render() {
    if (!domRef.current) return
    const theme = darkMode ? 'dark' : undefined
    chartRef.current = echarts.init(domRef.current, theme)
    chartRef.current.setOption(options)
    onRender?.(chartRef.current)
  }

  function update() {
    if (!chartRef.current) return
    const maskColor = darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'
    chartRef.current.showLoading({ color: themeSettings.themeColor, fontSize: 14, maskColor, text: '' })
    chartRef.current.setOption(options)
    chartRef.current.hideLoading()
    onUpdated?.(chartRef.current)
  }

  useEffect(() => { render() }, [])
  useEffect(() => { update() }, [options, darkMode])

  useEventListener('resize', () => { chartRef.current?.resize() }, { target: window })

  return domRef
}
