import { Button } from 'antd'
import type { FallbackProps } from 'react-error-boundary'

import { globalConfig } from '@/config'

const theme = globalConfig.defaultThemeColor

const ErrorPage = ({ error, resetErrorBoundary }: FallbackProps) => {
  const errorMsg = error?.message || '找不到页面组件'
  return (
    <div className="size-full min-h-520px flex-col-center gap-16px overflow-hidden">
      <div className="flex text-400px text-primary">
        <SvgIcon localIcon="error" />
      </div>
      <Button
        style={{ backgroundColor: theme }}
        type="primary"
        onClick={resetErrorBoundary}
      >
        {errorMsg}，请刷新重试
      </Button>
    </div>
  )
}

export default ErrorPage
