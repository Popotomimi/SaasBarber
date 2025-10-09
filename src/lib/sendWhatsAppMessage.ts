import { initWhatsApp, isWhatsAppConnected } from "./whatsapp";

export async function sendWhatsAppMessage(message: string, number: string) {
  try {
    const client = await initWhatsApp();

    if (!isWhatsAppConnected()) {
      throw new Error("WhatsApp ainda não está conectado");
    }

    await client.sendMessage(`${number}@c.us`, message);
    console.log("✅ Mensagem enviada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error);
  }
}
