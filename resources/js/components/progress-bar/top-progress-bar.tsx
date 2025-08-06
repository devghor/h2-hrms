import { useEffect, useRef, useState } from 'react';

interface TopProgressBarProps {
    loading: boolean;
}

export function TopProgressBar({ loading }: TopProgressBarProps) {
    const [width, setWidth] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (loading) {
            setWidth(0);
            intervalRef.current = window.setInterval(() => {
                setWidth((w) => {
                    if (w >= 70) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        return w;
                    }
                    // Professional, subtle progression
                    const increment = w < 20 ? 2 : w < 50 ? 1.5 : 0.8;
                    return Math.min(w + increment, 70);
                });
            }, 180);
        } else {
            setWidth(100);
            const timeout = setTimeout(() => setWidth(0), 300);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            return () => clearTimeout(timeout);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [loading]);

    return (
        <div
            className={`fixed top-0 left-0 z-50 h-0.5 bg-primary transition-all duration-300 ease-out`}
            style={{
                width: `${width}%`,
                opacity: width > 0 ? 0.8 : 0,
            }}
        />
    );
}
