import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8674028430:AAEsNrExdWJc60UdRwsGmmne48-pDL71sqY';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1179683039';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = body.message;
    const chat_id = body.chat_id || TELEGRAM_CHAT_ID;
    const bot_token = body.bot_token || TELEGRAM_BOT_TOKEN;
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!chat_id) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    if (!bot_token) {
      return NextResponse.json({ error: 'Bot Token is required' }, { status: 400 });
    }

    const response = await fetch(`https://api.telegram.org/bot${bot_token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chat_id,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.description || 'Failed to send Telegram message');
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Telegram API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
