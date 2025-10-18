import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermosDeUso() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-white">
      <Button asChild>
        <Link href="/" className="mb-6 inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>

      <section className="space-y-4 text-white">
        <p>
          Ao utilizar o site Artista do Corte, você concorda com os seguintes
          termos e condições. Estes termos visam garantir uma experiência segura
          e transparente para todos os usuários.
        </p>

        <h2 className="text-xl font-semibold mt-6">1. Agendamentos</h2>
        <p>
          Os agendamentos realizados através da plataforma estão sujeitos à
          disponibilidade e confirmação por parte da barbearia.
        </p>

        <h2 className="text-xl font-semibold mt-6">2. Privacidade</h2>
        <p>
          Seus dados são tratados com responsabilidade e não serão
          compartilhados com terceiros sem sua autorização.
        </p>

        <h2 className="text-xl font-semibold mt-6">3. Responsabilidades</h2>
        <p>
          A barbearia se compromete a prestar os serviços conforme descrito, mas
          não se responsabiliza por eventuais falhas técnicas da plataforma.
        </p>

        <h2 className="text-xl font-semibold mt-6">4. Alterações</h2>
        <p>
          Estes termos podem ser atualizados a qualquer momento. Recomendamos
          que você os revise periodicamente.
        </p>
      </section>
    </main>
  );
}
