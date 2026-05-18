import Image from "next/image";
import Link from "next/link";
import { formatBRL, formatArea } from "@/lib/formatters";
import type { Imovel } from "@/lib/types";

export default function ImovelCard({ imovel }: { imovel: Imovel }) {
  const foto = imovel.fotos[0];
  return (
    <Link
      href={`/imovel/${imovel.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md active:scale-[0.99]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-foreground/5">
        {foto ? (
          <Image
            src={foto}
            alt={imovel.titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted">
            <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
        {imovel.aceitaPermuta && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/95 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12" />
            </svg>
            Aceita Permuta
          </span>
        )}
        {imovel.fotos.length > 1 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
            <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            {imovel.fotos.length}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs uppercase tracking-wide text-muted">{imovel.tipo}</p>
          <p className="text-[11px] text-muted">{formatArea(imovel.area)}</p>
        </div>
        <h3 className="mt-0.5 font-semibold text-base leading-tight line-clamp-2">
          {imovel.titulo}
        </h3>
        <p className="mt-1 text-sm text-muted truncate">
          {imovel.endereco.bairro}, {imovel.endereco.cidade}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted">
          {imovel.quartos !== undefined && (
            <Spec icon="bed" label={`${imovel.quartos} quarto${imovel.quartos === 1 ? "" : "s"}`} />
          )}
          {imovel.banheiros !== undefined && (
            <Spec icon="bath" label={`${imovel.banheiros}`} />
          )}
          {imovel.vagas !== undefined && imovel.vagas > 0 && (
            <Spec icon="car" label={`${imovel.vagas}`} />
          )}
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="text-lg font-bold text-foreground">{formatBRL(imovel.valor)}</span>
          {imovel.aceitaPermuta && imovel.aceitaPermutaEm.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {imovel.aceitaPermutaEm.slice(0, 2).map((tipo) => (
                <span
                  key={tipo}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                >
                  {tipo}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function Spec({ icon, label }: { icon: "bed" | "bath" | "car"; label: string }) {
  const paths: Record<string, React.ReactNode> = {
    bed: (
      <>
        <path d="M2 9v10" />
        <path d="M22 19V11a2 2 0 0 0-2-2H8" />
        <path d="M2 14h20" />
        <path d="M6 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
      </>
    ),
    bath: (
      <>
        <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
        <path d="M22 12H4" />
        <path d="m6 19-2 3" />
        <path d="m18 19 2 3" />
      </>
    ),
    car: (
      <>
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
        <circle cx="6.5" cy="16.5" r="2.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </>
    ),
  };
  return (
    <span className="inline-flex items-center gap-1">
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {paths[icon]}
      </svg>
      {label}
    </span>
  );
}
