const command = require("./command.js")
const subcommand = require("./subcommand.js")
const commandclass = new command();
const subcommandclass = new subcommand(); 
const { Client, GatewayIntentBits, Partials, EmbedBuilder, MessageActivityType } = require('discord.js');
require('dotenv').config();
const Keyv = require('keyv')
const { token } = process.env;

const prefix = 'c!';
const levels = new Keyv('sqlite://db.sqlite', { table: 'levels' })
levels.on('error', err => console.error('Keyv connection error:', err))

textReadingChannel = null;

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
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
});

client.once('ready', () => {
	console.log('起動完了');
});

client.on('guildMemberAdd', async member => {
	 console.log(member.displayName)
	 //subcommandclass.gptgreeting(member);
	})

	client.on('messageCreate', async (message) => {
		if (message.author.id == client.user.id || message.author.bot){
			return;
		  }
		  if (message.channel.id == message.member.voice.channelId || 
			(message.channel.id == textReadingChannel && textReadingChannel !== null)){
				if (message.content.startsWith(prefix)){
					return
				}
				if (message.content == "消えてもらおうかッ！"){
					await subcommandclass.voicePlay("cc.mp3")
					return
				}
				subcommandclass.chatreading(message)
		  }
		  if (message.channel.id === '1114068389497933834') {
			const level = (await levels.get(message.author.id)) || { level: 1, xp: 0, max: 100 };
			var randomXp = Math.random() * ( 16 - 5) + 5;
			level.xp += Math.floor(randomXp)
			console.log(level.xp)
			levels.set(message.author.id, level)
			if (level.xp >= level.max){
				level.max += 150
				level.xp = 0
				level.level += 1
				const embedMessage = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('LevelUp!🎉')
				.addFields(
					{ name: '現在のレベル', value: `${level.level}Lv` },
					{ name: '次のレベルまで', value: `${level.max}Xp` },
				)
				.setTimestamp();
				message.reply({ embeds: [embedMessage] });
			}
		  }
		  else return;
		}
)

client.on('messageCreate', async (/**メンバーが送信したMessage*/message) => {
	if (message.author.id == client.user.id || message.author.bot){
		return;
	  }

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
		//level
		if (command === `level` || command === `rank`){
			subcommandclass.level(message);
		}
		//vcjoin
		if (command === `join`){
			textReadingChannel = await subcommandclass.vcjoin(message);
		}
		//vcjoin
		if (command === `leave`){
			subcommandclass.vcleave(message);
		}
<<<<<<< Updated upstream
		//chatgpt
		if (command === `gpt`){
			subcommandclass.gpt(message,member);
		}
		//voice
		if (command === `voice`){
			subcommandclass.voice(message);
=======
		//voice
		if (command === `vc`){
			subcommandclass.vctest(message);
		}
		//speakerset
		if (command === `vcset`){
			subcommandclass.speakerset(message);
		}
		//gptask
		if (command === `gpt`){
			subcommandclass.gpt(message);
		}
		//shortWork
		if (command === `short-work` || command === `swork`){
			commandclass.shortWork(message);
		} 
		//slot
		if (command === `slot`){
			commandclass.slot(message);
		}
		//fishing
		if (command === `fishing`){
			commandclass.fishing(message);
>>>>>>> Stashed changes
		}
	}
)


client.login(token);