import { useEffect, useMemo, useState } from "react";
import wbcVideo from "./assets/wbc.mp4";
import gifedVideo from "./assets/gifed.mp4";
import { motion, AnimatePresence } from "framer-motion";

import logoImg from "./assets/Logo.jpg";
import bannerImg from "./assets/banner.jpeg";

// WhatsApp direto — mensagem informa origem do site/portfólio
const WHATSAPP_NUMBER = "5591999246801";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vim pelo site de portfólio da Sync.ode e gostaria de um orçamento."
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

const GA_MEASUREMENT_ID = "G-FY4DZV4NPK";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

function ensureGA(id: string) {
  if (typeof window === "undefined") return;
  const src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  if (!document.querySelector(`script[src="${src}"]`)) {
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
  window.gtag("config", id, { anonymize_ip: true, send_page_view: true });
}

function trackPageView(id: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search + window.location.hash,
    send_to: id,
  });
}

function gaEvent(name: string, params?: Record<string, any>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, { send_to: GA_MEASUREMENT_ID, ...(params || {}) });
}

const COMPANY = {
  name: "Sync.ode LTDA",
  cnpj: "69.579.417",
  email: "sync.odegroup@gmail.com",
  phone: "(91) 99924-6801",
  phoneFull: "+55 91 99924-6801",
  address: "Belém — PA, Brasil",
  instagram: "@sync.ode",
};

type PortfolioItem =
  | {
      id: string;
      type: "image";
      title: string;
      tag: string;
      desc: string;
      src: string;
    }
  | {
      id: string;
      type: "video";
      title: string;
      tag: string;
      desc: string;
      src: string;
      thumb: string;
    };

const PORTFOLIO: PortfolioItem[] = [
  {
    id: "p1",
    type: "video",
    title: "Consórcio de Veículos",
    tag: "Sistema Web",
    desc: "Escolha de marca, modelo, versão e configuração com fluxo completo.",
    src: wbcVideo,
    thumb: bannerImg,
  },
  {
    id: "p2",
    type: "video",
    title: "Landing de Produto",
    tag: "Landing Page",
    desc: "Página de conversão com carregamento rápido e CTA claro.",
    src: gifedVideo,
    thumb: bannerImg,
  },
  {
    id: "p3",
    type: "image",
    title: "Estoque de Supermercado",
    tag: "Sistema",
    desc: "Controle de entrada, saída, validade e reposição de produtos.",
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "p4",
    type: "image",
    title: "Dashboard Comercial",
    tag: "Painel",
    desc: "Métricas de vendas, funil de atendimento e metas em tempo real.",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "p5",
    type: "image",
    title: "Agenda e Oficina",
    tag: "Sistema",
    desc: "Agendamento de serviços, histórico de clientes e status de OS.",
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "p6",
    type: "image",
    title: "Site Institucional",
    tag: "Website",
    desc: "Presença online da empresa com formulário e integração WhatsApp.",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "p7",
    type: "image",
    title: "Controle de Inventário",
    tag: "Sistema",
    desc: "Inventário físico, divergências e relatórios por setor.",
    src: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "p8",
    type: "image",
    title: "Portal do Cliente",
    tag: "Web App",
    desc: "Área logada para pedidos, documentos e acompanhamento de status.",
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
  },
];

const SERVICES = [
  {
    title: "Sistemas web",
    desc: "Painéis, CRMs, estoque, agenda e plataformas internas sob medida.",
    icon: "01",
  },
  {
    title: "Estoque e inventário",
    desc: "Controle de supermercado, depósito e loja: entrada, saída e validade.",
    icon: "02",
  },
  {
    title: "Landing pages",
    desc: "Páginas rápidas para captar leads, lançar produto ou campanha.",
    icon: "03",
  },
  {
    title: "Sites institucionais",
    desc: "Site da empresa com visual profissional e formulário de contato.",
    icon: "04",
  },
  {
    title: "Técnico de informática",
    desc: "Montagem, manutenção, formatação, rede e suporte em Belém e região.",
    icon: "05",
  },
  {
    title: "Integrações e automação",
    desc: "WhatsApp, planilhas, APIs e rotinas que eliminam trabalho manual.",
    icon: "06",
  },
];

const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Processo", href: "#processo" },
  { label: "Contato", href: "#contato" },
];

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function WhatsAppButton({
  children,
  className,
  where,
}: {
  children: React.ReactNode;
  className?: string;
  where: string;
}) {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      onClick={() => gaEvent("click_whatsapp", { where, phone: WHATSAPP_NUMBER })}
      className={className}
    >
      {children}
    </a>
  );
}

function MediaModal({
  item,
  onClose,
}: {
  item: PortfolioItem;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] bg-black/75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111] shadow-2xl">
          <div className="flex items-start justify-between gap-3 border-b border-[#2a2a2a] px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-white">{item.title}</div>
              <div className="text-xs text-[#888]">{item.desc}</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#333] px-3 py-1.5 text-xs text-[#ccc] hover:bg-[#1a1a1a]"
            >
              Fechar
            </button>
          </div>
          <div className="aspect-video bg-black">
            {item.type === "image" ? (
              <img src={item.src} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <video
                src={item.src}
                className="h-full w-full object-cover"
                autoPlay
                controls
                loop
                muted
                playsInline
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const openItem = PORTFOLIO.find((p) => p.id === openId) || null;

  useEffect(() => {
    ensureGA(GA_MEASUREMENT_ID);
    const t = window.setTimeout(() => trackPageView(GA_MEASUREMENT_ID), 300);
    document.title = "Sync.ode — Sistemas, sites e suporte em Belém";
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/jpeg";
    link.href = logoImg as unknown as string;
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenId(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || openId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, openId]);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#f2f2f2] antialiased">
      {/* Top bar */}
      <div className="border-b border-[#1f1f1f] bg-[#0c0c0c] text-[11px] text-[#777]">
        <Shell>
          <div className="flex h-9 items-center justify-between">
            <span>Belém — PA · CNPJ {COMPANY.cnpj}</span>
            <WhatsAppButton where="topbar" className="hover:text-white">
              WhatsApp {COMPANY.phone}
            </WhatsAppButton>
          </div>
        </Shell>
      </div>

      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors",
          scrolled
            ? "border-[#1f1f1f] bg-[#0c0c0c]/95 backdrop-blur-md"
            : "border-transparent bg-[#0c0c0c]"
        )}
      >
        <Shell>
          <div className="flex h-16 items-center justify-between gap-4">
            <a href="#inicio" className="flex items-center gap-2.5">
              <img src={logoImg} alt="Sync.ode" className="h-8 w-8 object-contain" />
              <span className="text-[15px] font-semibold tracking-tight">Sync.ode</span>
            </a>

            <nav className="hidden items-center gap-6 md:flex">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="text-sm text-[#999] transition hover:text-white"
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <WhatsAppButton
                where="header"
                className="hidden rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-[#0c0c0c] transition hover:bg-[#2fe472] sm:inline-flex"
              >
                Orçamento no WhatsApp
              </WhatsAppButton>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a2a] text-[#ccc] md:hidden"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu"
              >
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </Shell>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[#1f1f1f] bg-[#0c0c0c] md:hidden"
            >
              <Shell>
                <div className="flex flex-col gap-1 py-3">
                  {NAV.map((n) => (
                    <a
                      key={n.href}
                      href={n.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm text-[#ccc] hover:bg-[#161616]"
                    >
                      {n.label}
                    </a>
                  ))}
                  <WhatsAppButton
                    where="mobile_menu"
                    className="mt-2 rounded-full bg-[#25D366] px-4 py-2.5 text-center text-sm font-semibold text-[#0c0c0c]"
                  >
                    Orçamento no WhatsApp
                  </WhatsAppButton>
                </div>
              </Shell>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#25D366]/10 blur-[100px]" />
        <Shell>
          <div className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#25D366]">
                Software · Suporte · Belém
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Sistemas que organizam
                <br />
                o dia a dia do seu negócio
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#999]">
                Da tela do estoque à landing page e ao suporte técnico no local.
                Trabalhamos com contrato, prazo e entrega clara — sem surpresa.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <WhatsAppButton
                  where="hero"
                  className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-[#0c0c0c] transition hover:bg-[#2fe472]"
                >
                  Falar no WhatsApp
                </WhatsAppButton>
                <a
                  href="#portfolio"
                  className="inline-flex items-center justify-center rounded-full border border-[#333] px-6 py-3.5 text-sm font-medium text-[#ddd] transition hover:border-[#555] hover:text-white"
                >
                  Ver portfólio
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#666]">
                <li>Contrato e escopo</li>
                <li>Sistemas sob medida</li>
                <li>Técnico de informática</li>
                <li>Atendimento em Belém</li>
              </ul>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-[#222] bg-[#141414]">
                <img
                  src={bannerImg}
                  alt="Sync.ode"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-[#222] bg-[#141414]/95 p-4 backdrop-blur sm:left-auto sm:right-6 sm:w-64">
                <div className="text-xs text-[#666]">Próximo passo</div>
                <div className="mt-1 text-sm font-medium text-white">
                  Conte o problema. Montamos a proposta.
                </div>
              </div>
            </div>
          </div>
        </Shell>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="border-t border-[#1a1a1a] py-16 md:py-20">
        <Shell>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#25D366]">
                Serviços
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                O que entregamos
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[#888]">
              Desenvolvimento, sistemas de estoque, landings e suporte técnico
              de informática no mesmo time.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-[#222] bg-[#121212] p-6 transition hover:border-[#333] hover:bg-[#161616]"
              >
                <div className="text-xs font-mono text-[#25D366]">{s.icon}</div>
                <h3 className="mt-3 text-base font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#888]">{s.desc}</p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      {/* DESTAQUE ESTOQUE */}
      <section className="border-t border-[#1a1a1a] py-16 md:py-20">
        <Shell>
          <div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-[#222] bg-[#121212] md:grid-cols-2">
            <div className="p-8 md:p-10">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#25D366]">
                Exemplo real de demanda
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Sistema de estoque para supermercado
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#999]">
                Controle de produtos, validade, reposição e inventário. Ideal para
                quem ainda depende de planilha ou anota na mão e perde margem
                com ruptura ou excesso de estoque.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-[#bbb]">
                <li className="flex gap-2">
                  <span className="text-[#25D366]">✓</span>
                  Entrada e saída com histórico
                </li>
                <li className="flex gap-2">
                  <span className="text-[#25D366]">✓</span>
                  Alertas de validade e estoque mínimo
                </li>
                <li className="flex gap-2">
                  <span className="text-[#25D366]">✓</span>
                  Relatórios por setor e fornecedor
                </li>
              </ul>
              <WhatsAppButton
                where="estoque_destaque"
                className="mt-8 inline-flex rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-[#0c0c0c] hover:bg-[#2fe472]"
              >
                Quero um sistema assim
              </WhatsAppButton>
            </div>
            <div className="relative min-h-[240px] md:min-h-[360px]">
              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80"
                alt="Estoque de supermercado"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent md:from-[#121212]/80" />
            </div>
          </div>
        </Shell>
      </section>

      {/* PORTFÓLIO */}
      <section id="portfolio" className="border-t border-[#1a1a1a] py-16 md:py-20">
        <Shell>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#25D366]">
                Portfólio
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Projetos e entregas
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[#888]">
              Clique para abrir. Sistemas, landings e painéis que já entregamos
              ou modelos do nosso tipo de trabalho.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PORTFOLIO.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  gaEvent("open_portfolio_item", { id: p.id, title: p.title });
                  setOpenId(p.id);
                }}
                className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#121212] text-left transition hover:border-[#3a3a3a]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {p.type === "video" ? (
                    <video
                      src={p.src}
                      className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={p.src}
                      alt={p.title}
                      className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#1a1a1a] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#888]">
                      {p.tag}
                    </span>
                    {p.type === "video" && (
                      <span className="text-[10px] text-[#666]">Vídeo</span>
                    )}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">{p.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-[#777]">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Shell>
      </section>

      {/* TÉCNICO */}
      <section className="border-t border-[#1a1a1a] py-16 md:py-20">
        <Shell>
          <div className="rounded-3xl border border-[#222] bg-gradient-to-br from-[#141414] to-[#0c0c0c] p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#25D366]">
                  Suporte local
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Técnico de informática em Belém
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#999]">
                  Além de sistemas, atendemos manutenção de computadores,
                  notebooks, montagem, formatação, backup, rede e configuração
                  de equipamentos de trabalho.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Formatação e backup",
                  "Montagem de PCs",
                  "Rede e Wi-Fi",
                  "Impressoras e periféricos",
                  "Otimização de desempenho",
                  "Visita técnica",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-[#ccc]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <WhatsAppButton
              where="tecnico"
              className="mt-8 inline-flex rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-[#0c0c0c] hover:bg-[#2fe472]"
            >
              Solicitar técnico
            </WhatsAppButton>
          </div>
        </Shell>
      </section>

      {/* PROCESSO */}
      <section id="processo" className="border-t border-[#1a1a1a] py-16 md:py-20">
        <Shell>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#25D366]">
            Processo
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Como trabalhamos
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              {
                n: "1",
                t: "Conversa",
                d: "Você conta o problema. A gente entende o que precisa existir de verdade.",
              },
              {
                n: "2",
                t: "Proposta",
                d: "Escopo, prazo e valor no papel — com contrato antes de começar.",
              },
              {
                n: "3",
                t: "Entrega",
                d: "Desenvolvimento em etapas. Você acompanha e valida o que entra no ar.",
              },
              {
                n: "4",
                t: "Suporte",
                d: "Ajustes, evolução e suporte técnico quando o negócio muda.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-[#222] bg-[#121212] p-5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/15 text-sm font-semibold text-[#25D366]">
                  {s.n}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#888]">{s.d}</p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      {/* CONTATO */}
      <section id="contato" className="border-t border-[#1a1a1a] py-16 md:py-20">
        <Shell>
          <div className="rounded-3xl border border-[#222] bg-[#121212] p-8 md:p-12">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#25D366]">
                  Contato
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  Vamos conversar pelo WhatsApp
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#999]">
                  O link já abre com uma mensagem pronta dizendo que você veio
                  pelo site de portfólio. É só enviar e contar o que precisa.
                </p>
                <div className="mt-6 space-y-2 text-sm text-[#aaa]">
                  <div>{COMPANY.phoneFull}</div>
                  <div>{COMPANY.email}</div>
                  <div>{COMPANY.address}</div>
                  <div className="text-xs text-[#666]">CNPJ {COMPANY.cnpj}</div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <WhatsAppButton
                  where="contato_principal"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-semibold text-[#0c0c0c] transition hover:bg-[#2fe472]"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Abrir WhatsApp
                </WhatsAppButton>
                <a
                  href={`mailto:${COMPANY.email}`}
                  onClick={() => gaEvent("click_email", { where: "contato" })}
                  className="inline-flex items-center justify-center rounded-full border border-[#333] px-6 py-3.5 text-sm text-[#ccc] transition hover:border-[#555] hover:text-white"
                >
                  {COMPANY.email}
                </a>
                <p className="text-center text-xs text-[#555]">
                  Mensagem automática: “Vim pelo site de portfólio da Sync.ode…”
                </p>
              </div>
            </div>
          </div>
        </Shell>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <Shell>
          <div className="grid gap-10 py-12 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="" className="h-9 w-9 object-contain" />
                <span className="font-semibold">{COMPANY.name}</span>
              </div>
              <p className="mt-3 text-sm text-[#777]">
                Sistemas, sites, estoque e suporte técnico em Belém — PA.
              </p>
              <p className="mt-2 text-xs text-[#555]">CNPJ {COMPANY.cnpj}</p>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.15em] text-[#555]">
                Contato
              </div>
              <div className="mt-3 space-y-2 text-sm text-[#999]">
                <WhatsAppButton where="footer" className="block hover:text-white">
                  {COMPANY.phoneFull}
                </WhatsAppButton>
                <a href={`mailto:${COMPANY.email}`} className="block hover:text-white">
                  {COMPANY.email}
                </a>
                <div>{COMPANY.address}</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.15em] text-[#555]">
                Redes
              </div>
              <div className="mt-3 text-sm text-[#999]">
                Instagram {COMPANY.instagram}
              </div>
              <p className="mt-4 text-xs text-[#555]">
                Atendimento com contrato e escopo definidos.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-[#1a1a1a] py-6 text-xs text-[#555] sm:flex-row sm:justify-between">
            <span>
              © {year} {COMPANY.name}. Todos os direitos reservados.
            </span>
            <span>CNPJ {COMPANY.cnpj} · Sync.ode</span>
          </div>
        </Shell>
      </footer>

      {/* Botão flutuante WhatsApp */}
      <WhatsAppButton
        where="floating"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#0c0c0c] shadow-lg shadow-black/40 transition hover:scale-105 hover:bg-[#2fe472]"
      >
        <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </WhatsAppButton>

      {openItem && <MediaModal item={openItem} onClose={() => setOpenId(null)} />}
    </div>
  );
}