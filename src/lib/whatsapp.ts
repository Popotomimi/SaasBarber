import { Client, LocalAuth } from "whatsapp-web.js";

let client: Client | null = null;
let currentQR: string | null = null;
let isConnected: boolean = false;

export function initWhatsApp(): Client {
  if (client) return client;

  client = new Client({
    authStrategy: new LocalAuth({ clientId: "barbearia-session" }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", (qr) => {
    currentQR = qr;
    isConnected = false;
    console.log("📲 QR Code atualizado!");
  });

  client.on("ready", () => {
    isConnected = true;
    currentQR = null;
    console.log("✅ WhatsApp conectado!");
  });

  client.on("disconnected", () => {
    isConnected = false;
    console.log("⚠️ WhatsApp desconectado!");
  });

  client.initialize();

  return client;
}

export async function disconnectWhatsApp(): Promise<boolean> {
  if (!client) return false;

  try {
    await client.destroy();
    client = null;
    currentQR = null;
    isConnected = false;
    console.log("🔌 WhatsApp desconectado!");
    return true;
  } catch (error) {
    console.error("Erro ao desconectar:", error);
    return false;
  }
}

export function getQRStatus(): { qr: string | null; connected: boolean } {
  return { qr: currentQR, connected: isConnected };
}
