import { c } from "@/app/utils"
import { PropsWithChildren } from "react"

export const Title = ({ children, className = "" }: PropsWithChildren<{ className?: string }>) => {
  return (
    <h2 className={c("text-3xl text-black text-medium", className)}>
      {children}
    </h2>
  )
}