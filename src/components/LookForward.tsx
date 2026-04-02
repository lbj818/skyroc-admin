import type { PropsWithChildren } from 'react'

import SvgIcon from './SvgIcon'

const LookForward = ({ children }: PropsWithChildren) => {
  return (
    <div className="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
      <div className="flex text-400px text-primary">
        <SvgIcon localIcon="expectation" />
      </div>
      {children || <h3 className="text-28px text-primary font-500">敬请期待</h3>}
    </div>
  )
}

export default LookForward
