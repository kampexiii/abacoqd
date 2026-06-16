import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * One-shot IntersectionObserver hook used to drive the `.abaco-reveal` /
 * `.abaco-stagger` scroll animations. Respects prefers-reduced-motion by
 * marking elements as visible immediately.
 */
export function useInView<T extends Element>(
    options?: IntersectionObserverInit,
): { ref: React.RefObject<T | null>; inView: boolean } {
    const ref = useRef<T | null>(null);
    const [inView, setInView] = useState(() => prefersReducedMotion());

    useEffect(() => {
        const element = ref.current;

        if (!element || prefersReducedMotion()) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, options);

        observer.observe(element);

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { ref, inView };
}
