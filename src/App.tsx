import { useEffect, useMemo, useRef, useState } from "react";
import wbcVideo from "./assets/wbc.mp4";
import gifedVideo from "./assets/gifed.mp4";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  AnimatePresence,
  cubicBezier,
} from "framer-motion";

// ✅ IMPORTS LOCAIS (VITE)
import logoImg from "./assets/Logo.jpg";
import bannerImg from "./assets/banner.jpeg";

// ✅ WhatsApp (destino final)
const WHATSAPP_LINK =
  "https://wa.me/5591999246801?text=Oi!%20Quero%20um%20or%C3%A7amento%20com%20a%20Sync.ode";

// ✅ Página intermediária (OPÇÃO 2) — use isso no Google como meta:
// https://sync-ode.vercel.app/whatsapp
const WHATSAPP_ROUTE = "/whatsapp";

// ✅ Google Analytics (GA4)
const GA_MEASUREMENT_ID = "G-FY4DZV4NPK";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

function ensureGA(measurementId: string) {
  if (typeof window === "undefined") return;

  const src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  const existing = document.querySelector(`script[src="${src}"]`);
  if (!existing) {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  });
}

function trackPageView(measurementId: string) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  const page_location = window.location.href;
  const page_path =
    window.location.pathname + window.location.search + window.location.hash;

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location,
    page_path,
    send_to: measurementId,
  });
}

function gaEvent(name: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, { send_to: GA_MEASUREMENT_ID, ...(params || {}) });
}

// ====== INFO EMPRESA (FOOTER) ======
const COMPANY = {
  name: "Sync.ode LTDA",
  email: "sync.odegroup@gmail.com",
  phone: "+55 (91) 99924-6801",
  address: "Belém - PA, Brasil",
  instagram: "@sync.ode",
  tagline:
    "Trabalhamos com contrato e escopo de projeto para garantir clareza, prazos e entregas.",
};

/**
 * ✅ PORTFÓLIO
 */
const PORTFOLIO: Array<
  | {
      id: string;
      type: "image";
      title: string;
      tag: string;
      desc: string;
      src: string;
      thumb?: string;
    }
  | {
      id: string;
      type: "video";
      title: string;
      tag: string;
      desc: string;
      src: string;
      thumb: string;
      embed?: boolean;
    }
> = [
  {
    id: "p1",
    type: "image",
    title: "Dashboard de Vendas",
    tag: "Sistema Web",
    desc: "Painel com métricas diárias e funil de atendimento.",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "p2",
    type: "video",
    title: "Lanepage de Produto Premium",
    tag: "Landing",
    desc: "Página premium com CTA e performance.",
    src: gifedVideo, // ✅ vídeo local gifed.mp4
    thumb: bannerImg,
    embed: false,
  },
  {
    id: "p3",
    type: "video",
    title: "Pagina de Consórcio de carros",
    tag: "Vídeo",
    desc: "Demonstração rápida (mp4/webm ou embed).",
    src: wbcVideo, // ✅ local wbc.mp4
    thumb: bannerImg,
    embed: false,
  },
  {
    id: "p4",
    type: "image",
    title: "Automação & Integrações",
    tag: "Integração",
    desc: "Conexões com APIs e rotinas operacionais.",
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
  },
];

const NAV = [
  { label: "Início", href: "#top" },
  { label: "Serviços", href: "#servicos" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Processo", href: "#processo" },
  { label: "Contato", href: "#contato" },
];

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-5 md:px-8">{children}</div>;
}

/** ---- Variants ---- */
const vContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const vFadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: cubicBezier(0.16, 1, 0.3, 1) },
  },
};

const vSoftIn = {
  hidden: { opacity: 0, y: 12, scale: 0.985, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: cubicBezier(0.16, 1, 0.3, 1) },
  },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] tracking-wide text-white/70 backdrop-blur">
      {children}
    </span>
  );
}

/** ---- Background animado + parallax ---- */
function Ambient({
  mx,
  my,
}: {
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
}) {
  const g1x = useTransform(mx, (v) => `${v * 18}px`);
  const g1y = useTransform(my, (v) => `${v * 18}px`);
  const g2x = useTransform(mx, (v) => `${v * -10}px`);
  const g2y = useTransform(my, (v) => `${v * -10}px`);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
        style={{ x: g1x, y: g1y }}
        animate={{ opacity: [0.55, 0.78, 0.55], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-72 left-1/3 h-[640px] w-[640px] rounded-full bg-white/5 blur-3xl"
        style={{ x: g2x, y: g2y }}
        animate={{ opacity: [0.42, 0.65, 0.42], scale: [1, 1.07, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_18%,rgba(255,255,255,0.07),transparent_62%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:96px_96px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.25%22/></svg>')]" />
    </div>
  );
}

/** ---- Scroll spy simples ---- */
function useActiveSection() {
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const ids = ["top", "servicos", "portfolio", "processo", "contato"];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const onScroll = () => {
      const y = window.scrollY + 140;
      let current = "#top";
      for (const el of els) {
        if (el.offsetTop <= y) current = `#${el.id}`;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
}

/** ---- Card tilt ---- */
function TiltCard({ title, desc }: { title: string; desc: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18, mass: 0.3 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18, mass: 0.3 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((py - 0.5) * -6);
    ry.set((px - 0.5) * 8);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_50px_rgba(0,0,0,0.55)]",
        "transition duration-300 hover:border-white/20 hover:bg-white/[0.06]"
      )}
    >
      <div className="pointer-events-none absolute -left-40 top-0 h-full w-64 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition duration-500 group-hover:translate-x-[560px] group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(420px_240px_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <div className="relative" style={{ transform: "translateZ(14px)" }}>
        <div className="text-sm font-semibold tracking-tight">{title}</div>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{desc}</p>
      </div>
    </motion.div>
  );
}

/** ---- CTA button ---- */
function CTAButton({
  href,
  children,
  primary,
  external,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  external?: boolean;
  onClick?: () => void;
}) {
  if (primary) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_18px_55px_rgba(255,255,255,0.14)]"
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -left-44 top-0 h-full w-80 -skew-x-12 bg-gradient-to-r from-transparent via-black/10 to-transparent"
          animate={{ x: [-120, 700] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: [0.22, 0.45, 0.22] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute -left-24 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-black/10 blur-2xl" />
          <span className="absolute -right-24 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-black/10 blur-2xl" />
        </motion.span>

        <span className="relative">{children}</span>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm text-white/80 backdrop-blur transition hover:bg-white/[0.07]"
    >
      {children}
    </motion.a>
  );
}

/** ---- Modal (image/video) ---- */
function MediaModal({
  item,
  onClose,
}: {
  item: (typeof PORTFOLIO)[number];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 16, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-[0_30px_120px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold tracking-tight">
                    {item.title}
                  </div>
                  <div className="mt-1 text-xs text-white/60">{item.desc}</div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80 hover:bg-white/[0.07]"
                >
                  Fechar
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : item.embed ? (
                  <iframe
                    src={item.src}
                    title={item.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  // ✅ vídeo local como “gif” (loop)
                  <video
                    src={item.src}
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** ✅ OPÇÃO 2: “/whatsapp” (página intermediária) dentro do mesmo App.tsx */
function WhatsappRedirectPage() {
  useEffect(() => {
    // Page view específico da rota /whatsapp
    document.title = "Sync.ode • WhatsApp";
    trackPageView(GA_MEASUREMENT_ID);

    gaEvent("whatsapp_redirect_view", {
      label: "whatsapp_route_view",
      where: "route",
    });

    const t = window.setTimeout(() => {
      // (opcional) evento antes de sair
      gaEvent("whatsapp_redirect_go", {
        label: "whatsapp_route_redirect",
        where: "route",
      });

      window.location.href = WHATSAPP_LINK;
    }, 350);

    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <img
          src={logoImg}
          alt="Sync.ode"
          className="mb-6 h-20 w-20 object-contain"
        />
        <div className="text-xl font-semibold">Abrindo o WhatsApp…</div>
        <div className="mt-2 text-sm text-white/65">
          Você será redirecionado automaticamente.
        </div>

        <a
          href={WHATSAPP_LINK}
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black"
          onClick={() =>
            gaEvent("click_whatsapp", {
              where: "whatsapp_route",
              label: "manual_click_fallback",
            })
          }
        >
          Se não abrir, clique aqui
        </a>

        <div className="mt-6 text-xs text-white/45">
          {COMPANY.tagline}
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const year = useMemo(() => new Date().getFullYear(), []);

  // ✅ GOOGLE ANALYTICS (gtag) + pageviews (SPA/hash)
  useEffect(() => {
    ensureGA(GA_MEASUREMENT_ID);

    const t = window.setTimeout(() => trackPageView(GA_MEASUREMENT_ID), 350);

    const onHashChange = () => trackPageView(GA_MEASUREMENT_ID);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  // ✅ FAVICON (logo na aba do navegador)
  useEffect(() => {
    let link = document.querySelector(
      "link[rel='icon']"
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/jpeg";
    link.href = logoImg as unknown as string;

    // título default (se não estiver em /whatsapp)
    if (window.location.pathname !== WHATSAPP_ROUTE) {
      document.title = "Sync.ode";
    }
  }, []);

  // ✅ Se estiver em /whatsapp, renderiza a página intermediária (OPÇÃO 2)
  const isWhatsappRoute =
    typeof window !== "undefined" &&
    (window.location.pathname === WHATSAPP_ROUTE ||
      window.location.pathname === `${WHATSAPP_ROUTE}/`);

  if (isWhatsappRoute) {
    return <WhatsappRedirectPage />;
  }

  // mouse parallax
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const mx = useSpring(mvx, { stiffness: 80, damping: 22, mass: 0.3 });
  const my = useSpring(mvy, { stiffness: 80, damping: 22, mass: 0.3 });

  // scroll progress
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.35,
  });

  // header state
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();

  // modal state
  const [openId, setOpenId] = useState<string | null>(null);
  const openItem = PORTFOLIO.find((p) => p.id === openId);

  // HERO banner subtle parallax
  const heroBx = useTransform(mx, (v) => `${v * -10}px`);
  const heroBy = useTransform(my, (v) => `${v * -8}px`);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mvx.set(x);
      mvy.set(y);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mvx, mvy]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ✅ Todos os CTAs de WhatsApp agora apontam pra rota /whatsapp (OPÇÃO 2)
  const whatsappHref = WHATSAPP_ROUTE;

  return (
    <main id="top" className="relative min-h-screen text-white">
      <Ambient mx={mx} my={my} />

      {/* Scroll progress bar */}
      <motion.div className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-white/10">
        <motion.div
          className="h-full origin-left bg-white/70"
          style={{ scaleX: progress }}
        />
      </motion.div>

      {/* Modal */}
      {openItem ? (
        <MediaModal item={openItem} onClose={() => setOpenId(null)} />
      ) : null}

      {/* HEADER */}
      <motion.header
        className={cn(
          "sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl",
          scrolled ? "bg-black/70" : "bg-black/45"
        )}
        animate={{
          boxShadow: scrolled
            ? "0 10px 30px rgba(0,0,0,0.45)"
            : "0 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.25 }}
      >
        <Container>
          <div className="flex items-center justify-between py-4">
            {/* BRAND */}
            <motion.a
              href="#top"
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative">
                <motion.div
                  aria-hidden
                  className="absolute -inset-5 rounded-3xl bg-white/10 blur-2xl"
                  animate={{ opacity: [0.25, 0.5, 0.25] }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* ✅ LOGO MAIOR */}
                <div className="relative h-16 w-16 md:h-20 md:w-20">
                  <img
                    src={logoImg}
                    alt="Sync.ode logo"
                    className="h-full w-full object-contain p-1"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/12 to-transparent opacity-70" />
                </div>
              </div>

              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, y: -6, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative"
                  >
                    <span className="text-[15px] font-semibold tracking-[-0.02em] md:text-[16px]">
                      <span className="text-white">SYNC</span>
                      <span className="text-white/80">.</span>
                      <span className="text-white/60">ODE</span>
                    </span>

                    <motion.span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-[1px] w-full bg-white/25"
                      initial={{ scaleX: 0.4, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ transformOrigin: "left" }}
                    />
                  </motion.div>
                </div>

                <div className="mt-1 max-w-[340px] text-[11px] text-white/55">
                  {COMPANY.tagline}
                </div>
              </div>
            </motion.a>

            {/* NAV */}
            <nav className="hidden items-center gap-1 md:flex">
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
                <div className="flex items-center gap-1">
                  {NAV.map((i) => {
                    const isActive = active === i.href;
                    return (
                      <a
                        key={i.href}
                        href={i.href}
                        className={cn(
                          "relative rounded-xl px-4 py-2 text-sm transition",
                          isActive
                            ? "text-white"
                            : "text-white/70 hover:text-white"
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 -z-10 rounded-xl bg-white/10"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                        {i.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              <a
                href="#contato"
                className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/[0.07] md:inline-flex"
              >
                Contato
              </a>

              {/* ✅ Agora vai pra /whatsapp (OPÇÃO 2) */}
              <motion.a
                href={whatsappHref}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() =>
                  gaEvent("click_whatsapp", {
                    where: "header",
                    label: "whatsapp_header",
                    destination: "route",
                  })
                }
                className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
              >
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute -left-40 top-0 h-full w-72 -skew-x-12 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                  animate={{ x: [-120, 520] }}
                  transition={{
                    duration: 5.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <span className="relative">WhatsApp</span>
              </motion.a>
            </div>
          </div>
        </Container>
      </motion.header>

      {/* HERO (BANNER À DIREITA) */}
      <section className="pt-16 md:pt-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            {/* texto */}
            <motion.div
              variants={vContainer}
              initial="hidden"
              animate="show"
              className="md:col-span-6"
            >
              <motion.div
                variants={vFadeUp}
                className="mb-4 flex flex-wrap gap-2"
              >
                <Pill>Minimalista</Pill>
                <Pill>Premium</Pill>
                <Pill>Alta performance</Pill>
              </motion.div>

              <motion.h1
                variants={vFadeUp}
                className="text-4xl font-semibold leading-[1.06] tracking-tight md:text-6xl"
              >
                Software sob medida
                <span className="text-white/60"> para destravar processos.</span>
              </motion.h1>

              <motion.p
                variants={vFadeUp}
                className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base"
              >
                Sistemas e automações para você operar com clareza, controle e
                velocidade — sem excesso de complexidade.
              </motion.p>

              <motion.div
                variants={vFadeUp}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <CTAButton
                  href={whatsappHref}
                  primary
                  onClick={() =>
                    gaEvent("click_whatsapp", {
                      where: "hero",
                      label: "cta_pedir_orcamento",
                      destination: "route",
                    })
                  }
                >
                  Pedir orçamento
                </CTAButton>
                <CTAButton href="#servicos">Ver serviços</CTAButton>
              </motion.div>

              <motion.div
                variants={vFadeUp}
                className="mt-9 flex flex-wrap gap-2 text-xs text-white/55"
              >
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur">
                  ✔ Entrega por etapas
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur">
                  ✔ Interface premium
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur">
                  ✔ Suporte e evolução
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur">
                  ✔ Contrato & Escopo de projeto
                </span>
              </motion.div>
            </motion.div>

            {/* banner */}
            <motion.div
              className="md:col-span-6"
              initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.62)]"
                )}
                style={{ x: heroBx, y: heroBy }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -inset-20 rounded-full bg-white/10 blur-3xl"
                  animate={{ opacity: [0.15, 0.28, 0.15] }}
                  transition={{
                    duration: 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative aspect-[16/11] w-full">
                  <img
                    src={bannerImg}
                    alt="Banner Sync.ode"
                    className="h-full w-full object-cover opacity-[0.88]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.68),rgba(0,0,0,0.18),rgba(0,0,0,0.10))]" />
                </div>

                <div className="pointer-events-none absolute -left-56 top-0 h-full w-80 -skew-x-12 bg-gradient-to-r from-transparent via-white/14 to-transparent opacity-0 transition duration-500 group-hover:translate-x-[900px] group-hover:opacity-100" />

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                    <span className="text-xs text-white/70">
                      Entregas com acabamento de produto
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold tracking-tight">
                    Sync.ode • Sistemas • Sites • Automações
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="pt-14 md:pt-20">
        <Container>
          <motion.div
            variants={vContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={vSoftIn} className="mb-8 max-w-2xl">
              <div className="text-[11px] tracking-[0.35em] text-white/50">
                SERVIÇOS
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                O essencial, bem feito.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Software com acabamento de produto: limpo, rápido e seguro.
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Sistemas Web",
                  desc: "Painéis, CRMs e plataformas internas para reduzir retrabalho.",
                },
                {
                  title: "Landing & Captação",
                  desc: "Páginas rápidas e objetivas para converter e elevar percepção.",
                },
                {
                  title: "Integrações",
                  desc: "APIs e automações para conectar ferramentas e padronizar rotinas.",
                },
              ].map((s) => (
                <motion.div key={s.title} variants={vFadeUp}>
                  <TiltCard title={s.title} desc={s.desc} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* PORTFÓLIO */}
      <section id="portfolio" className="pt-14 md:pt-20">
        <Container>
          <motion.div
            variants={vContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={vSoftIn} className="mb-8 max-w-2xl">
              <div className="text-[11px] tracking-[0.35em] text-white/50">
                PORTFÓLIO
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Trabalhos e entregas
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Espaço para fotos e vídeos dos seus projetos. Clique para abrir.
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-12">
              {PORTFOLIO.map((p, idx) => {
                const span =
                  idx === 0
                    ? "md:col-span-7"
                    : idx === 1
                    ? "md:col-span-5"
                    : idx === 2
                    ? "md:col-span-5"
                    : "md:col-span-7";

                const cover = p.type === "image" ? p.src : p.thumb;

                return (
                  <motion.button
                    key={p.id}
                    variants={vFadeUp}
                    onClick={() => {
                      gaEvent("open_portfolio_item", {
                        id: p.id,
                        type: p.type,
                        title: p.title,
                      });
                      setOpenId(p.id);
                    }}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur text-left",
                      "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_50px_rgba(0,0,0,0.55)]",
                      "transition duration-300 hover:border-white/20 hover:bg-white/[0.06]",
                      "h-[260px] md:h-[320px]",
                      span
                    )}
                  >
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {p.type === "video" ? (
                        <video
                          src={p.src}
                          className="h-full w-full object-cover opacity-[0.82]"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={cover}
                          alt={p.title}
                          className="h-full w-full object-cover opacity-[0.82]"
                          loading="lazy"
                        />
                      )}

                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78),rgba(0,0,0,0.25),rgba(0,0,0,0.15))]" />
                    </motion.div>

                    <div className="pointer-events-none absolute -left-40 top-0 h-full w-64 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition duration-500 group-hover:translate-x-[720px] group-hover:opacity-100" />

                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-white/70">
                        {p.tag}
                      </span>
                      {p.type === "video" && (
                        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-white/70">
                          ▶ vídeo
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <div className="text-sm font-semibold tracking-tight">
                        {p.title}
                      </div>
                      <div className="mt-1 text-sm text-white/70 line-clamp-2">
                        {p.desc}
                      </div>

                      <div className="mt-4 inline-flex items-center gap-2 text-xs text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                        <span className="opacity-80 group-hover:opacity-100 transition">
                          Abrir projeto
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* PROCESSO */}
      <section id="processo" className="pt-14 md:pt-20">
        <Container>
          <motion.div
            variants={vSoftIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-60 top-0 h-full w-96 -skew-x-12 bg-gradient-to-r from-transparent via-white/8 to-transparent"
              animate={{ x: [-120, 900] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
            />

            <div className="grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <div className="text-[11px] tracking-[0.35em] text-white/50">
                  PROCESSO
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Clareza do começo ao fim.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Poucas etapas, comunicação direta e entrega incremental — sempre
                  com contrato e escopo definidos.
                </p>
              </div>

              <div className="md:col-span-7">
                <div className="grid gap-3">
                  {[
                    {
                      n: "01",
                      t: "Diagnóstico",
                      d: "Entendemos objetivo, gargalo e requisitos.",
                    },
                    {
                      n: "02",
                      t: "Escopo & Contrato",
                      d: "Definimos entregas, prazos e responsabilidades.",
                    },
                    { n: "03", t: "MVP", d: "Você usa cedo, valida rápido e reduz risco." },
                    { n: "04", t: "Evolução", d: "Ajustes com base no uso real + suporte contínuo." },
                  ].map((s, idx) => (
                    <motion.div
                      key={s.n}
                      initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.08 * idx,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-4"
                    >
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70">
                        {s.n}
                      </div>
                      <div>
                        <div className="text-sm font-semibold tracking-tight">
                          {s.t}
                        </div>
                        <div className="mt-1 text-sm text-white/65">{s.d}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* CONTATO */}
      <section id="contato" className="pt-14 md:pt-20 pb-16">
        <Container>
          <motion.div
            variants={vSoftIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur md:p-10"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
              animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.05, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className="text-[11px] tracking-[0.35em] text-white/50">
                  CONTATO
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                  Vamos conversar.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65">
                  Me diga o que você quer automatizar ou criar. Retornamos um plano
                  completo com proposta, contrato e escopo definido.
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                  <div className="font-semibold text-white">Contrato & Escopo</div>
                  <div className="mt-1">
                    Trabalhamos com contrato e escopo de projeto para garantir clareza nas
                    entregas, prazos e custos — sem surpresas.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* ✅ Agora vai pra /whatsapp (OPÇÃO 2) */}
                <CTAButton
                  href={whatsappHref}
                  primary
                  onClick={() =>
                    gaEvent("click_whatsapp", {
                      where: "contato",
                      label: "cta_entrar_em_contato",
                      destination: "route",
                    })
                  }
                >
                  Entrar em Contato
                </CTAButton>

                <motion.a
                  href={`mailto:${COMPANY.email}`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() =>
                    gaEvent("click_email", {
                      where: "contato",
                      label: "email_contato",
                      email: COMPANY.email,
                    })
                  }
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm text-white/80 backdrop-blur transition hover:bg-white/[0.07]"
                >
                  {COMPANY.email}
                </motion.a>

                <div className="mt-3 text-xs text-white/55">
                  © {year} {COMPANY.name}: Todos os direitos reservados.
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* FOOTER COMPLETO */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur">
        <Container>
          <div className="py-10">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Marca */}
              <div className="flex items-start gap-4">
                <div className="h-24 w-24 overflow-hidden">
                  <img
                    src={logoImg}
                    alt="Sync.ode logo"
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold">{COMPANY.name}</div>
                  <div className="mt-1 text-sm text-white/60">
                    {COMPANY.tagline}
                  </div>
                </div>
              </div>

              {/* Contatos */}
              <div>
                <div className="text-xs tracking-[0.35em] text-white/50">
                  CONTATOS
                </div>
                <div className="mt-3 space-y-2 text-sm text-white/70">
                  <a
                    className="block hover:text-white"
                    href={`mailto:${COMPANY.email}`}
                    onClick={() =>
                      gaEvent("click_email", {
                        where: "footer",
                        label: "email_footer",
                        email: COMPANY.email,
                      })
                    }
                  >
                    {COMPANY.email}
                  </a>

                  {/* ✅ Agora vai pra /whatsapp (OPÇÃO 2) */}
                  <a
                    className="block hover:text-white"
                    href={whatsappHref}
                    onClick={() =>
                      gaEvent("click_whatsapp", {
                        where: "footer",
                        label: "whatsapp_footer",
                        destination: "route",
                      })
                    }
                  >
                    {COMPANY.phone}
                  </a>

                  <div className="text-white/55">{COMPANY.address}</div>
                </div>
              </div>

              {/* Empresa / Legal */}
              <div>
                <div className="text-xs tracking-[0.35em] text-white/50">
                  EMPRESA
                </div>
                <div className="mt-3 space-y-2 text-sm text-white/70">
                  <div>
                    <span className="text-white/50">Instagram:</span>{" "}
                    {COMPANY.instagram}
                  </div>
                  <div className="pt-2 text-xs text-white/50">
                    Atendimento mediante contrato e escopo aprovado.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/55 md:flex-row md:items-center">
              <div>
                © {year} {COMPANY.name}. Todos os direitos reservados.
              </div>
              <div className="text-white/50">
                Desenvolvido por Sync.ode • Software sob medida
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}

/*
✅ IMPORTANTE (Vercel / SPA):
Para /whatsapp abrir direto sem 404, garanta rewrite.
Crie vercel.json na raiz do projeto:

{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}

No Google Analytics/Ads, use como meta/conversão:
sync-ode.vercel.app/whatsapp
*/