/** Sends a plain-text message to the admin's Telegram chat (order/import
 * notifications). No-ops if TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID aren't set;
 * never throws — Telegram being down shouldn't break the caller's flow. */
export async function sendAdminMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    console.error('Failed to send Telegram message:', err);
  }
}
