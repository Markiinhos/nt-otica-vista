import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Navigation } from "lucide-react";
import logoAsset from "../assets/logo-nt-oticas.jpg.asset.json";

const WHATSAPP_URL =
  "https://wa.me/557130339834?text=" +
  encodeURIComponent("Olá! Vim pelo site da NT Óticas e gostaria de saber mais.");

const ADDRESS = "Av. Sete de Setembro, 400 – Loja 139, Dois de Julho, Salvador – BA";
const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(ADDRESS);
const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=" +
  encodeURIComponent("Av. Sete de Setembro, 400, Dois de Julho, Salvador, BA") +
  "&output=embed";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "NT Óticas | Sua visão em boas mãos" },
      {
        name: "description",
        content:
          "NT Óticas em Salvador. Encontre sua ótica, confira nosso horário de funcionamento e fale conosco pelo WhatsApp.",
      },
      { property: "og:title", content: "NT Óticas | Sua visão em boas mãos" },
      {
        property: "og:description",
        content:
          "NT Óticas em Salvador. Encontre sua ótica, confira nosso horário de funcionamento e fale conosco pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Optician",
          name: "NT Óticas",
          slogan: "Sua visão em boas mãos!",
          telephone: "+55-71-3033-9834",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Sete de Setembro, 400 – Loja 139",
            addressLocality: "Salvador",
            addressRegion: "BA",
            addressCountry: "BR",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "18:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "09:00",
              closes: "13:00",
            },
          ],
        }),
      },
    ],
  }),
});

function WhatsAppButton({
  children,
  size = "default",
  className = "",
}: {
  children: React.ReactNode;
  size?: "default" | "lg";
  className?: string;
}) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.66_0.19_50/0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_oklch(0.66_0.19_50/0.6)] ${
        size === "lg" ? "px-8 py-4 text-base sm:text-lg" : "px-5 py-2.5 text-sm"
      } ${className}`}
    >
      <MessageCircle className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      {children}
    </a>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
          <a href="#" className="flex min-w-0 items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Logo NT Óticas"
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border sm:h-12 sm:w-12"
            />
            <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">
              NT Óticas
            </span>
          </a>
          <WhatsAppButton className="shrink-0">Falar no WhatsApp</WhatsAppButton>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-44 sm:pb-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-0 h-56 w-56 rounded-full bg-lime-accent/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl animate-fade-in px-4 text-center sm:px-6">
            <img
              src={logoAsset.url}
              alt="NT Óticas – Sua visão em boas mãos"
              className="mx-auto h-36 w-36 rounded-full object-cover shadow-lg ring-1 ring-border sm:h-48 sm:w-48"
            />
            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
              NT Óticas
            </h1>
            <p className="mt-3 text-xl font-semibold text-primary sm:text-2xl">
              Sua visão em boas mãos!
            </p>
            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
              Cuide da sua visão com quem entende de você.
            </p>
            <div className="mt-8">
              <WhatsAppButton size="lg">Falar pelo WhatsApp</WhatsAppButton>
            </div>
            <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Estamos em Salvador – BA
            </p>
          </div>
        </section>

        {/* Localização */}
        <section className="border-t border-border/60 bg-card py-16 sm:py-24">
          <div className="mx-auto max-w-5xl animate-fade-in px-4 sm:px-6">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Localização
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Estamos aqui para você
              </h2>
              <p className="mt-4 flex items-start gap-2 text-base text-muted-foreground sm:text-lg">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>
                  Av. Sete de Setembro, 400 – Loja 139
                  <br />
                  Dois de Julho – Salvador/BA
                </span>
              </p>
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <Navigation className="h-4 w-4" />
                Como chegar
              </a>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="Mapa da NT Óticas em Salvador"
                src={MAPS_EMBED_URL}
                className="h-72 w-full sm:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Horário de funcionamento */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl animate-fade-in px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Horário de funcionamento
              </h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Segunda a sexta
                </p>
                <p className="mt-2 text-2xl font-bold">09h às 18h</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Sábado
                </p>
                <p className="mt-2 text-2xl font-bold">09h às 13h</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Domingo
                </p>
                <p className="mt-2 text-2xl font-bold text-muted-foreground">Fechado</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contato */}
        <section className="border-t border-border/60 bg-card py-16 sm:py-24">
          <div className="mx-auto max-w-2xl animate-fade-in px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Precisa de ajuda?</h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Fale com nossa equipe pelo WhatsApp e tire suas dúvidas.
            </p>
            <div className="mt-8">
              <WhatsAppButton size="lg">Chamar no WhatsApp</WhatsAppButton>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t border-border/60 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <img
            src={logoAsset.url}
            alt="Logo NT Óticas"
            className="h-16 w-16 rounded-full object-cover ring-1 ring-border"
          />
          <p className="font-display text-lg font-bold">NT Óticas</p>
          <p className="text-sm text-primary font-semibold">Sua visão em boas mãos!</p>
          <p className="text-sm text-muted-foreground">Salvador – Bahia</p>
          <WhatsAppButton>Falar no WhatsApp</WhatsAppButton>
          <p className="mt-4 text-xs text-muted-foreground">
            © NT Óticas – Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Botão flutuante WhatsApp */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-primary-foreground shadow-[0_10px_30px_-6px_oklch(0.65_0.2_145/0.6)] transition-transform duration-300 hover:scale-110 active:scale-95 sm:h-16 sm:w-16"
      >
        <MessageCircle className="h-7 w-7" fill="currentColor" />
      </a>
    </div>
  );
}
