"use client";
import { useEffect, useState, useRef } from "react";
import { CheckCircle, QrCode, Loader2 } from "lucide-react";
import Image from "next/image";

export default function QRPage() {
  const [qr, setQr] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const lastQrRef = useRef(""); // para comparar QR anterior
  const attemptsRef = useRef(0); // para limitar tentativas

  const fetchQR = async () => {
    try {
      const res = await fetch("https://saasbarberbackend.onrender.com/qrcode");

      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

      const data = await res.json();
      console.log("Resposta do backend:", data);

      if (data.status === "conectado ✅") {
        setConnected(true);
        setLoading(false);
        return;
      }

      if (data.status === "aguardando leitura" && data.qrcode) {
        setConnected(false);
        setLoading(false);

        // Se o QR Code mudou, atualiza
        if (lastQrRef.current !== data.qrcode) {
          lastQrRef.current = data.qrcode;
          setQr(data.qrcode);
          attemptsRef.current = 0; // reseta tentativas
        } else {
          attemptsRef.current++;
        }

        return;
      }

      if (data.status === "inicializando...") {
        setLoading(true);
        setQr("");
        return;
      }

      // fallback genérico
      setLoading(true);
      setQr("");
    } catch (err) {
      console.error("Erro ao buscar QR Code:", err);
      setLoading(true);
      setQr("");
    }
  };

  useEffect(() => {
    fetchQR();
    const intervalId = setInterval(() => {
      if (attemptsRef.current >= 10) {
        console.warn("QR Code não mudou após 10 tentativas. Interrompendo.");
        clearInterval(intervalId);
        return;
      }
      fetchQR();
    }, 3000);

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
      ) : loading ? (
        <div className="flex flex-col items-center gap-4 text-gray-600">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-lg">Aguardando geração do QR Code...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-blue-600">
            <QrCode size={32} />
            <h1 className="text-xl font-semibold">
              Escaneie o QR Code para conectar
            </h1>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <Image
              src={qr}
              alt="QR Code"
              width={64}
              height={64}
              className="w-64 h-64"
            />
          </div>
        </div>
      )}
    </div>
  );
}
