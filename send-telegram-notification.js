const got = require('got');

async function sendTelegramNotification(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const requestBody = {
    'chat_id': chatId,
    text: message
  }

  await got(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'content-type': 'application/json'
    }
  })
}

module.exports = sendTelegramNotification;
