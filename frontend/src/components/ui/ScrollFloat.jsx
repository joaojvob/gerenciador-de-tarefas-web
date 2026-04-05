import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScrollFloat({
    children,
    scrollContainerRef,
    containerClassName = "",
    textClassName = "",
    animationDuration = 1,
    ease = "back.inOut(2)",
    scrollStart = "center bottom+=50%",
    scrollEnd = "bottom bottom-=40%",
    stagger = 0.03,
    scrub = false,
}) {
    const containerRef = useRef(null);

    const splitText = useMemo(() => {
        const text = typeof children === "string" ? children : "";

        return text.split("").map((char, index) => (
            <span className="inline-block word" key={`${char}-${index}`}>
                {char === " " ? "\u00A0" : char}
            </span>
        ));
    }, [children]);

    useEffect(() => {
        const element = containerRef.current;

        if (!element) return undefined;

        const scroller = scrollContainerRef?.current ?? window;
        const charElements = element.querySelectorAll(".inline-block");

        if (!charElements.length) return undefined;

        const tween = gsap.fromTo(
            charElements,
            {
                willChange: "opacity, transform",
                opacity: 0,
                yPercent: 120,
                scaleY: 2.3,
                scaleX: 0.7,
                transformOrigin: "50% 0%",
            },
            {
                duration: animationDuration,
                ease,
                opacity: 1,
                yPercent: 0,
                scaleY: 1,
                scaleX: 1,
                stagger,
                scrollTrigger: {
                    trigger: element,
                    scroller,
                    start: scrollStart,
                    end: scrollEnd,
                    scrub,
                    toggleActions: scrub
                        ? "play none none reverse"
                        : "play none none none",
                },
            },
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [
        animationDuration,
        ease,
        scrollContainerRef,
        scrollEnd,
        scrollStart,
        scrub,
        stagger,
        splitText,
    ]);

    if (typeof children !== "string") {
        return (
            <h2
                ref={containerRef}
                className={`my-5 overflow-hidden ${containerClassName}`}
            >
                <span
                    className={`block text-[clamp(1.6rem,4vw,3rem)] leading-[1.25] break-words ${textClassName}`}
                >
                    {children}
                </span>
            </h2>
        );
    }

    return (
        <h2
            ref={containerRef}
            className={`my-5 overflow-hidden ${containerClassName}`}
        >
            <span
                className={`block text-[clamp(1.6rem,4vw,3rem)] leading-[1.25] break-words ${textClassName}`}
            >
                {splitText}
            </span>
        </h2>
    );
}

export default ScrollFloat;
