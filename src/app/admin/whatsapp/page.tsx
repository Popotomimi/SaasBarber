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
    <div>
      <Button className="mt-5 left-5 absolute" asChild>
        <Link href="/admin">
          <ArrowLeft />
          Voltar
        </Link>
      </Button>
      <button
        onClick={handleDisconnect}
        className="mt-6 flex absolute left-16 items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
        <LogOut size={20} />
        Desconectar WhatsApp
      </button>
      <QRPage />
    </div>
  );
};

export default WhatsPage;
