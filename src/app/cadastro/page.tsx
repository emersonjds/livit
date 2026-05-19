import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import ImovelForm from "@/components/ImovelForm";

export default function CadastroPage() {
  return (
    <div className="px-4 md:px-0">
      <Header title="Cadastrar imóvel" showBack />
      <div className="mx-auto hidden max-w-3xl pb-6 md:block">
        <Breadcrumbs
          items={[
            { label: "Imóveis", href: "/" },
            { label: "Cadastrar" },
          ]}
        />
        <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">Cadastrar imóvel</h1>
        <p className="mt-1 text-sm text-muted">
          Anúncio fica disponível para você editar a qualquer momento.
        </p>
      </div>
      <ImovelForm />
    </div>
  );
}
