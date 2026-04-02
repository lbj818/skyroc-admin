import { ClassAttributes, ImgHTMLAttributes } from "react"
import { JSX } from "react/jsx-runtime"

const SystemLogo = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src="/logo.png" {...props} />
}

export default SystemLogo
