﻿const command = require("./command.js")
const subcommand = require("./subcommand.js")
const commandclass = new command();
const subcommandclass = new subcommand(); 
const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const Keyv = require('keyv')
const { token } = process.env;

const prefix = 'c!';
const levels = new Keyv('sqlite://db.sqlite', { table: 'levels' })
levels.on('error', err => console.error('Keyv connection error:', err))

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
});

client.once('ready', () => {
	console.log('起動完了');
});

client.on('messageCreate', async (message) => {
	const level = (await levels.get(message.author.id)) || { level: 1, xp: 0, max: 10 };
	var randomXp = Math.random() * ( 16 - 5) + 5;
	level.xp += randomXp.toFixed(2) 
	console.log(level.xp)
	if (!message.content.startsWith(prefix)) return

	const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)

		//balance
		if (command === `balance` || command === `bal`) {
			commandclass.balance(message);
		}

		//deposit
		if (command === `deposit` || command === `dep`) {
			commandclass.deposit(message);
		}

		//withdraw
		if (command === `withdraw` || command === `with`) {
			commandclass.withdraw(message);
		}

		//ping
		if (command === `ping`) {
			subcommandclass.ping(message,client);
		}
		//work
		if (command === `work`) {
			commandclass.work(message);
		}
		//give
		if (command === `send`) {
			commandclass.send(message);
		}
		//coinflip
		if (command === `coinflip` || command === `cf`) {
			commandclass.coinflip(message);
		}
	}
)


client.login(token);