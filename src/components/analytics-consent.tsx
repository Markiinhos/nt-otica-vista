import { useEffect, useState } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  captureLandingAttribution,
  getConsentChoice,
  initializeAnalytics,
  setConsentChoice,
  type ConsentChoice,
} from "@/lib/analytics";

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [showPolicy, setShowPolicy] = useState(false);

  useEffect(() => {
    captureLandingAttribution();
    const savedChoice = getConsentChoice();
    setChoice(savedChoice);
    if (savedChoice === "accepted") initializeAnalytics();
  }, []);

  const choose = (nextChoice: ConsentChoice) => {
    setConsentChoice(nextChoice);
    setChoice(nextChoice);
  };

  return (
    <>
      {choice === null && (
        <section
          aria-label="Preferências de cookies"
          className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl border border-border bg-background p-4 shadow-xl sm:bottom-5 sm:flex sm:items-center sm:gap-5 sm:p-5"
        >
          <span className="mb-3 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary sm:mb-0">
            <Cookie className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold">Sua privacidade importa</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Com sua permissão, usamos cookies de medição para entender visitas e cliques de forma agregada.
            </p>
            <button
              type="button"
              onClick={() => setShowPolicy(true)}
              className="mt-1 text-sm font-semibold text-primary underline underline-offset-4"
            >
              Ver política de privacidade e cookies
            </button>
          </div>
          <div className="mt-4 flex shrink-0 gap-2 sm:mt-0 sm:flex-col-reverse">
            <Button type="button" variant="outline" onClick={() => choose("rejected")}>
              Recusar
            </Button>
            <Button type="button" onClick={() => choose("accepted")}>
              Aceitar
            </Button>
          </div>
        </section>
      )}

      {showPolicy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-title"
          className="fixed inset-0 z-[80] grid place-items-center bg-foreground/50 p-4"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setShowPolicy(false);
          }}
        >
          <section className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-border bg-background p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h2 id="privacy-title" className="text-xl font-bold sm:text-2xl">
                  Privacidade e cookies
                </h2>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => setShowPolicy(false)} aria-label="Fechar">
                <X />
              </Button>
            </div>
            <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground">O que medimos</h3>
                <p className="mt-1">Visitas, origem da campanha, páginas acessadas, dispositivo e cliques nos botões principais.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Ferramentas</h3>
                <p className="mt-1">Google Analytics 4 e Meta Pixel, somente quando configurados e após sua autorização.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Dados agregados</h3>
                <p className="mt-1">Cidade, região, faixa etária, gênero e interesses podem aparecer apenas de forma agregada, quando disponibilizados pelas ferramentas e permitidos por suas configurações de privacidade.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">O que não coletamos</h3>
                <p className="mt-1">Não solicitamos nome, CPF, telefone, endereço residencial, localização GPS ou dados sensíveis para fins de medição.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Sua escolha</h3>
                <p className="mt-1">Você pode aceitar, recusar ou alterar sua preferência a qualquer momento. Ao recusar, os recursos de medição não são carregados.</p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { choose("rejected"); setShowPolicy(false); }}>
                Recusar medição
              </Button>
              <Button type="button" onClick={() => { choose("accepted"); setShowPolicy(false); }}>
                Aceitar medição
              </Button>
            </div>
          </section>
        </div>
      )}

      {choice !== null && (
        <button
          type="button"
          onClick={() => setShowPolicy(true)}
          className="fixed bottom-5 left-5 z-50 grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-md transition-colors hover:text-primary"
          aria-label="Alterar preferências de privacidade"
          title="Privacidade e cookies"
        >
          <ShieldCheck className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
