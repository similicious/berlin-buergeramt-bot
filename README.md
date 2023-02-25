# Berlin Bürgeramt Appointment Bot

A bot that sends a notification when a buergeramt appointment is available.
It periodically checks the given buergeramt appointment page for new appointments. It then notifies the user using Telgram.
As of now, this bot is meant to be self hosted - it can easily be run on a raspberry pi or a cheap vps.

**Please use responsibly**: Set a USER_AGENT containing contact information in case something goes wrong.

**USE AT OWN RISK**

## Limitations

Currently this bot is only checking the current and the next month, as I was mainly going for appointments on short notice.

## Getting started

- clone the repository

```
git clone https://github.com/similicious/berlin-buergeramt-bot
```

- cd into the cloned repository
- install dependencies

```
npm install
```

- create .env by copying .env.sample

```
cp .env.sample .env
```

- edit .env to suit your needs

```
BOOKING_URL=The link to the appointments page. Use the link behind "Termin buchen" or "Termin berlinweit suchen" buttons.
USER_AGENT=A string containing your email address
CHECK_INTERVAL_MINUTES=The interval in minutes to check
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
HEALTHCHECKS_IO_TOKEN=Optional healthchecks.io token to monitor the bot
```

- start index.js

```
node index.js
```

Optionally, you can use a node process manager like pm2 to monitor the app and automatically start the bot on boot.

### Docker

The bot can also be run using docker. As of now, no image is provided. To build one yourself execute

```
docker build . -t similicious/berlin-buergeramt-bot
```

Next, create an .env as outlined above and run the container

```
docker run -d --env-file .env --name berlin-buergeramt-bot --restart unless-stopped similicious/berlin-buergeramt-bot
```

### Obtaining a bot token and chat id

It's easiest to use the web / desktop client of Telegram for initial setup. More info on bots [here](https://core.telegram.org/bots/features#creating-a-new-bot).

- Register a new bot using the Telegram bot `BotFather`.
- Send the bot a message
- Open https://api.telegram.org/bot<<BOT_TOKEN>>/getUpdates in a browser and extract the chatId from `result[0].message.chat.id`. You might need to refresh to see the message.

## Run tests

I included some snapshots of appointment pages in various states. Execute test with

```
npm run test
```
