import { Link } from "react-router-dom";
import {
    Activity,
    ArrowRight,
    Book,
    Layers,
    LifeBuoy,
    Menu,
    MessageCircle,
    Shield,
    Target,
    Users,
    Zap,
} from "lucide-react";
import DarkVeil from "../components/ui/DarkVeil";
import ScrollFloat from "../components/ui/ScrollFloat";
import SpotlightCard from "../components/ui/SpotlightCard";
import { landingContent } from "../content/landingContent";

function LandingPage() {
    const sectionTitleClass =
        "text-white font-extrabold tracking-tight text-[clamp(1.8rem,4vw,2.8rem)]";

    const sectionIconMap = {
        produto: [Layers, Shield, Activity],
        empresa: [Target, Zap, Users],
        suporte: [Book, LifeBuoy, MessageCircle],
    };

    const sectionIconColor = {
        produto: ["text-indigo-400", "text-cyan-400", "text-emerald-400"],
        empresa: ["text-orange-400", "text-yellow-400", "text-pink-400"],
        suporte: ["text-blue-400", "text-purple-400", "text-teal-400"],
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-indigo-500/30">
            <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
                    >
                        <Layers className="text-indigo-500" size={24} />
                        TaskFlow
                    </Link>

                    <div className="hidden items-center gap-8 text-sm font-medium md:flex">
                        {landingContent.navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.links[0]?.href ?? "#"}
                                className="text-slate-400 transition-colors hover:text-white"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden items-center gap-4 md:flex">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                        >
                            Entrar
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-colors hover:bg-indigo-500"
                        >
                            Criar conta
                        </Link>
                    </div>

                    <button
                        className="text-slate-400 hover:text-white md:hidden"
                        aria-label="Abrir menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            <div className="pointer-events-none absolute inset-0 z-0">
                <DarkVeil
                    hueShift={0}
                    noiseIntensity={0}
                    scanlineIntensity={0}
                    speed={0.3}
                    scanlineFrequency={0.5}
                    warpAmount={0}
                />
            </div>

            <main className="relative z-10 mx-auto max-w-7xl space-y-24 px-6 pb-24 pt-16 sm:space-y-28">
                <section
                    id="hero"
                    className="flex min-h-[calc(100vh-7rem)] flex-col items-center gap-12 pt-8 lg:flex-row lg:gap-8"
                >
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
                            {landingContent.badge}
                        </div>

                        <ScrollFloat
                            animationDuration={1}
                            ease="back.inOut(2)"
                            scrollStart="center bottom+=40%"
                            scrollEnd="bottom bottom-=35%"
                            scrub={false}
                            stagger={0.02}
                            containerClassName="mx-auto lg:mx-0"
                            textClassName={`${sectionTitleClass} leading-tight text-4xl lg:text-6xl`}
                        >
                            {landingContent.heroTitle}
                        </ScrollFloat>

                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 lg:mx-0">
                            {landingContent.heroDescription}
                        </p>

                        <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                            <Link
                                to="/register"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-500 sm:w-auto"
                            >
                                Começar gratuitamente
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                to="/login"
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-800 sm:w-auto"
                            >
                                Agendar demonstração
                            </Link>
                        </div>
                    </div>

                    <div className="relative w-full max-w-lg flex-1 lg:max-w-none">
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 opacity-20 blur" />
                        <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl transition-transform duration-500 lg:rotate-x-[5deg] lg:rotate-y-[-5deg] lg:hover:rotate-0">
                            <div className="flex h-10 items-center gap-2 border-b border-slate-800 bg-slate-950 px-4">
                                <div className="h-3 w-3 rounded-full bg-slate-700" />
                                <div className="h-3 w-3 rounded-full bg-slate-700" />
                                <div className="h-3 w-3 rounded-full bg-slate-700" />
                                <div className="ml-4 h-4 w-32 rounded-md bg-slate-800" />
                            </div>

                            <div className="flex h-80 gap-6 p-6">
                                <div className="hidden w-1/4 flex-col gap-3 sm:flex">
                                    <div className="mb-4 h-6 w-full rounded-md bg-slate-800" />
                                    <div className="h-4 w-3/4 rounded-md bg-slate-800" />
                                    <div className="h-4 w-5/6 rounded-md bg-slate-800" />
                                    <div className="h-4 w-full rounded-md bg-slate-800" />
                                </div>
                                <div className="flex flex-1 flex-col gap-4">
                                    <div className="flex gap-4">
                                        <div className="h-24 flex-1 rounded-lg border border-indigo-500/30 bg-indigo-900/30" />
                                        <div className="h-24 flex-1 rounded-lg bg-slate-800" />
                                        <div className="h-24 flex-1 rounded-lg bg-slate-800" />
                                    </div>
                                    <div className="relative flex-1 overflow-hidden rounded-lg bg-slate-800">
                                        <div className="absolute left-4 right-4 top-4 flex h-12 items-center rounded bg-slate-700/50 px-4">
                                            <div className="h-4 w-1/3 rounded bg-slate-600" />
                                        </div>
                                        <div className="absolute left-4 right-4 top-20 flex h-12 items-center rounded bg-slate-700/50 px-4">
                                            <div className="h-4 w-1/2 rounded bg-slate-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-800/60" />

                {landingContent.sections.map((section, sectionIndex) => (
                    <section
                        key={section.id}
                        className="space-y-10 scroll-mt-28"
                        id={section.id}
                    >
                        <div>
                            <h2 className="mb-2 text-2xl font-bold text-white">
                                {section.title}
                            </h2>
                            <p className="text-slate-400">{section.subtitle}</p>
                        </div>

                        <div
                            className="grid gap-6 md:grid-cols-3"
                            id={
                                sectionIndex === 0
                                    ? "precos"
                                    : sectionIndex === 1
                                      ? "carreiras"
                                      : "contato"
                            }
                        >
                            {section.cards.map((card, cardIndex) => {
                                const Icon =
                                    sectionIconMap[section.id]?.[cardIndex] ??
                                    Layers;
                                const iconColor =
                                    sectionIconColor[section.id]?.[cardIndex] ??
                                    "text-indigo-400";

                                return (
                                    <SpotlightCard
                                        key={card.title}
                                        spotlightColor={section.spotlightColor}
                                        className="group border-slate-800 bg-slate-900/50 p-6 transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-800/80"
                                    >
                                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 transition-transform duration-300 group-hover:scale-110">
                                            <Icon
                                                className={iconColor}
                                                size={24}
                                            />
                                        </div>
                                        <h3 className="mb-3 text-lg font-semibold text-white">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-slate-400">
                                            {card.description}
                                        </p>
                                    </SpotlightCard>
                                );
                            })}
                        </div>
                    </section>
                ))}

                <section className="relative mt-20 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 to-indigo-950 p-10 text-center shadow-2xl md:p-16">
                    <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

                    <p className="relative z-10 text-sm font-semibold uppercase tracking-wider text-indigo-400">
                        {landingContent.cta.overline}
                    </p>
                    <ScrollFloat
                        animationDuration={0.8}
                        ease="back.inOut(2)"
                        scrollStart="top bottom-=5%"
                        scrollEnd="bottom center"
                        scrub={false}
                        stagger={0.02}
                        textClassName="relative z-10 text-3xl font-bold text-white md:text-4xl"
                    >
                        {landingContent.cta.title}
                    </ScrollFloat>
                    <div className="relative z-10 mt-4 flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                        <Link
                            to="/register"
                            className="rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white transition-colors hover:bg-indigo-500"
                        >
                            Criar conta agora
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-lg border border-slate-700 bg-slate-800 px-8 py-3 font-medium text-white transition-colors hover:bg-slate-700"
                        >
                            Falar com vendas
                        </Link>
                    </div>
                </section>

                <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 bg-slate-950 py-8 text-sm text-slate-500 md:flex-row">
                    <p>{landingContent.footer.copyright}</p>
                    <div className="flex items-center gap-6">
                        {landingContent.footer.links.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="transition-colors hover:text-slate-300"
                            >
                                {item.label === "Status" ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        Status
                                    </span>
                                ) : (
                                    item.label
                                )}
                            </a>
                        ))}
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default LandingPage;
