import { ComponentProps, PropsWithChildren } from "react";
import { FadeBox } from "@/components/ui/motion/FadeBox";
import { c, transitionClass } from "@/app/utils";

export const HeroWrapper = ({
  hoverable = false,
  children,
  className = "",
  delayOrder,
  ...props
}: PropsWithChildren<ComponentProps<"a"> & { hoverable?: boolean; delayOrder?: number }>) => (
  <FadeBox
    delayOrder={delayOrder}
    // @ts-ignore
    whileHover={hoverable ? { scale: 0.98 } : {}}
    className={c("w-full h-full rounded-3xl py-6 md:py-12 px-6 md:px-16 flex flex-col justify-center cursor-pointer", transitionClass, className)}
    {...props}
  >
    {children}
  </FadeBox>
);