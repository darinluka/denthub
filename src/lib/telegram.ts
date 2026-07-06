export async function sendTelegramNotification(message: string) {
  try {
    let bot_token = undefined;
    let chat_id = undefined;

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('telegram_settings');
      if (!saved) {
        // Telegram notifications are not configured, do not send
        return;
      }
      
      const settings = JSON.parse(saved);
      if (!settings || settings.enabled !== true || !settings.botToken || !settings.chatId) {
        // Telegram notifications are disabled or incomplete
        return;
      }
      
      bot_token = settings.botToken;
      chat_id = settings.chatId;
    }

    const response = await fetch('/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        bot_token,
        chat_id
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Failed to send Telegram message:', data.error);
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}
