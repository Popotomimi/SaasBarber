import { initWhatsApp } from "./whatsapp";

export async function sendWhatsAppMessage(message: string, number: string) {
  try {
    const client = initWhatsApp();
    await client.sendMessage(`${number}@c.us`, message);
    console.log("✅ Mensagem enviada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error);
  }
}
