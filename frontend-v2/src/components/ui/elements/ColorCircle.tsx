import { c } from "@/app/utils"

export interface ColorCircleProps {
  className?: string,
  color?: string | null
}

const DefaultColor = "#e2e8f0";

export const ColorCircle = ({ className, color = DefaultColor }: ColorCircleProps) => <div
  style={{ backgroundColor: color ?? DefaultColor }}
  className={c("w-6 h-6 rounded-full border border-gray-400", className)}
></div>