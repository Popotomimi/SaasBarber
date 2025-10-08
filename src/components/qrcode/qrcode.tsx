"use client";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { CheckCircle, QrCode, Loader2 } from "lucide-react";

export default function QRPage() {
  const [qr, setQr] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchQR = async () => {
      const res = await fetch("/api/qr");
      const data = await res.json();

      if (data.connected) {
        setConnected(true);
        return;
      }

      if (data.qr) setQr(data.qr);
    };

    fetchQR();
    const intervalId = setInterval(fetchQR, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col text-center items-center justify-center min-h-screen px-4">
      {connected ? (
        <div className="flex flex-col items-center gap-4 text-green-600">
          <CheckCircle size={48} />
          <h2 className="text-2xl font-semibold">
            WhatsApp conectado com sucesso!
          </h2>
        </div>
      ) : qr ? (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-blue-600">
            <QrCode size={32} />
            <h1 className="text-xl font-semibold">
              Escaneie o QR Code para conectar
            </h1>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <QRCode value={qr} size={256} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-gray-600">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-lg">Aguardando geração do QR Code...</p>
        </div>
      )}
    </div>
  );
}
