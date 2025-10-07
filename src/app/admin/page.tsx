"use client";
import AdminAgenda from "@/components/admin-agenda/admin-agenda";
import AdminFormSchedule from "@/components/admin-form-schedule/admin-form-schedule";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen text-white flex flex-col text-center items-center justify-center px-4">
      <div>
        <h1 className="text-3xl font-bold my-8">Área do Barbeiro</h1>
        <p className="mb-6">Bem-vindo ao painel de administração!</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
          Sair do painel
        </button>
      </div>
      <AdminFormSchedule />
      <AdminAgenda />
    </div>
  );
}
