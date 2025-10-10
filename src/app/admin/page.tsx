"use client";
import AdminAgenda from "@/components/admin-agenda/admin-agenda";
import AdminFormSchedule from "@/components/admin-form-schedule/admin-form-schedule";
import BloqueioCard from "@/components/bloqueio-card/bloqueio-card";
import FormBlock from "@/components/form-block/form-block";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-screen-md text-center">
        <h1 className="text-3xl font-bold my-6">Área do Barbeiro</h1>
        <p className="mb-6 text-gray-300">
          Bem-vindo ao painel de administração!
        </p>

        {/* Botões organizados */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
            asChild>
            <Link href="#agendas">Agenda</Link>
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
            asChild>
            <Link href="#block">Bloquear Agenda</Link>
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
            asChild>
            <Link href="/admin/historico">Hitorico de Clientes</Link>
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
            asChild>
            <Link href="/admin/stock">Estoque</Link>
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
            Sair do painel
          </Button>
        </div>
      </div>

      {/* Seções separadas */}
      <div
        className="w-full max-w-screen-md border-t border-gray-700 py-12"
        id="agenda">
        <AdminFormSchedule />
      </div>

      <div
        className="w-full max-w-screen-md border-t border-gray-700 py-12"
        id="block">
        <FormBlock />
        <BloqueioCard />
      </div>

      <div className="w-full max-w-screen-md border-t border-gray-700 py-12">
        <AdminAgenda />
      </div>
    </div>
  );
}
