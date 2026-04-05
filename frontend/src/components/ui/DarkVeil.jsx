import { useEffect, useMemo, useState } from "react";

function DarkVeil({
    hueShift = 0,
    noiseIntensity = 0,
    scanlineIntensity = 0,
    speed = 0.5,
    scanlineFrequency = 2,
    warpAmount = 4,
}) {
    const [position, setPosition] = useState(0);

    useEffect(() => {
        const intervalMs = Math.max(16, 120 - speed * 80);

        const interval = setInterval(() => {
            setPosition((current) => (current + 1) % 200);
        }, intervalMs);

        return () => clearInterval(interval);
    }, [speed]);

    const gradientStyle = useMemo(() => {
        const hue = Number.isFinite(hueShift) ? hueShift : 0;
        const warp = Number.isFinite(warpAmount) ? warpAmount : 0;

        return {
            background: `radial-gradient(1200px 500px at ${50 + warp}% -10%, hsla(${230 + hue}, 95%, 65%, 0.35), transparent 60%), radial-gradient(900px 400px at ${20 - warp}% 30%, hsla(${260 + hue}, 90%, 58%, 0.2), transparent 65%), linear-gradient(180deg, #020617 0%, #020617 100%)`,
        };
    }, [hueShift, warpAmount]);

    const scanlineStyle = useMemo(() => {
        if (!scanlineIntensity) {
            return { backgroundImage: "none" };
        }

        const opacity = Math.min(Math.max(scanlineIntensity, 0), 1) * 0.18;
        const frequency = Math.max(2, 10 - scanlineFrequency * 6);

        return {
            backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,${opacity}) 0px, rgba(255,255,255,${opacity}) 1px, transparent 1px, transparent ${frequency}px)`,
            transform: `translateY(${position * 0.15}px)`,
        };
    }, [position, scanlineFrequency, scanlineIntensity]);

    const noiseStyle = useMemo(() => {
        if (!noiseIntensity) {
            return { opacity: 0 };
        }

        const opacity = Math.min(Math.max(noiseIntensity, 0), 1) * 0.06;

        return {
            opacity,
            backgroundImage:
                "radial-gradient(rgba(255,255,255,0.35) 0.5px, transparent 0.5px)",
            backgroundSize: "3px 3px",
            transform: `translate(${position * 0.1}px, ${position * 0.08}px)`,
        };
    }, [noiseIntensity, position]);

    return (
        <div className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-0" style={gradientStyle} />
            <div className="absolute inset-0" style={scanlineStyle} />
            <div className="absolute inset-0" style={noiseStyle} />
        </div>
    );
}

export default DarkVeil;
