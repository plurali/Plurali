import { motion, Easing } from "framer-motion";
import { useMemo, useState, useEffect, PropsWithChildren, ComponentProps } from "react";
import { useInView } from "react-intersection-observer";

interface FadeBoxProps {
    yOffset?: number;
    easing?: Easing;
    delayOrder?: number;
}

const FadeBox = ({
    children,
    yOffset = 24,
    easing = [0.42, 0, 0.58, 1],
    delayOrder = 1, // order of appearance
    ...props
}: PropsWithChildren<ComponentProps<"div"> & FadeBoxProps>) => {
    const { inView, ref } = useInView({
        triggerOnce: true,
    });
    const [delay, setDelay] = useState(0.1);

    const offset = 0.15;

    useEffect(() => {
        if (delayOrder) return setDelay(delayOrder * offset);
    }, [delayOrder, offset]);

    const transition = useMemo(
        () => ({
            duration: 0.4,
            delay,
            ease: easing,
        }),
        [delay, easing],
    );

    const variants = {
        hidden: { y: yOffset, opacity: 0, transition },
        show: {
            y: 0,
            x: 0,
            opacity: 1,
            transition,
        },
    };

    return (

        <motion.div
            // @ts-ignore
            ref={ref}
            initial="hidden" 
            animate={inView ? "show" : "hidden"} 
            exit="hidden" 
            variants={variants} 
            {...props}
        >
            {children} 
            {inView}
        </motion.div>
    );
};

export { FadeBox };
export default FadeBox;
