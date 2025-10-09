import { Client, LocalAuth } from "whatsapp-web.js";

let client: Client | null = null;
let currentQR: string | null = null;
let isConnected: boolean = false;
let isInitializing = false;
let initPromise: Promise<Client> | null = null;

// Verifica se o cliente está funcional (evita reinicializar Puppeteer corrompido)
function isClientUsable(): boolean {
  try {
    return !!client && !!client.pupPage && !client.pupPage.isClosed();
  } catch {
    return false;
  }
}

export async function initWhatsApp(): Promise<Client> {
  if (client && isConnected) return client;

  /*if (client && !isConnected) {
    console.log(
      "🔄 Cliente existente, mas desconectado. Verificando integridade..."
    );

    if (isClientUsable()) {
      try {
        await client.initialize();
        return client;
      } catch (err) {
        console.error("❌ Falha ao reinicializar cliente. Recriando...", err);
      }
    } else {
      console.warn(
        "⚠️ Cliente corrompido. Puppeteer está fechado. Recriando..."
      );
    }

    try {
      await client.destroy();
    } catch (destroyErr) {
      console.error("⚠️ Erro ao destruir cliente corrompido:", destroyErr);
    }
    client = null;
  }*/

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

  await client.initialize();

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

export async function initWhatsAppSafe(): Promise<Client> {
  if (isConnected) return client!;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    isInitializing = true;
    try {
      return await initWhatsApp();
    } finally {
      isInitializing = false;
      initPromise = null;
    }
  })();

  return initPromise;
}

export function getQRStatus(): { qr: string | null; connected: boolean } {
  return { qr: currentQR, connected: isConnected };
}

export function isWhatsAppConnected(): boolean {
  return isConnected;
}
