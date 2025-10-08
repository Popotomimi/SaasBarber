"use client";

import QRPage from "@/components/qrcode/qrcode";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

const WhatsPage = () => {
  const handleDisconnect = async () => {
    const res = await fetch("/api/disconnect", { method: "POST" });
    const data = await res.json();
    if (data.message) {
      window.location.reload();
    } else {
      alert("Erro ao desconectar");
    }
  };

  return (
    <div className="relative min-h-screen px-6 pt-6">
      {/* Top bar com botões */}
      <div className=" gap-7 top-4 mt-5 left-0 right-0 flex justify-between items-center px-6 z-10">
        <Button asChild>
          <Link href="/admin" className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Voltar
          </Link>
        </Button>

        <button
          onClick={handleDisconnect}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
          <LogOut size={18} />
          Desconectar WhatsApp
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="mt-24">
        <QRPage />
      </div>
    </div>
  );
};

export default WhatsPage;
