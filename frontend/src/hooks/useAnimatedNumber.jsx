// components/AnimatedNumber.js
import { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

export function AnimatedNumber({ value, format = v => Math.round(v).toLocaleString() }) {
    const firstRun = useRef(true);
    const previousValue = useRef(value);

    const { number } = useSpring({
        from: { number: previousValue.current },
        number: value,
        reset: !firstRun.current,
        config: { duration: 1000 },
        immediate: firstRun.current, // don't animate on first run
        onRest: () => {
            previousValue.current = value;
        }
    });

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
        }
    }, []);

    return <animated.span>{number.to(format)}</animated.span>;
}
