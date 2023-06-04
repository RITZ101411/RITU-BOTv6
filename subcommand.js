const cmdCD = require('command-cooldown');
const { EmbedBuilder } = require('discord.js');
const Keyv = require('keyv')
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const prefix = 'c!';

const configuration = new Configuration({
	apiKey: process.env.GPT_KEY,
});
const openai = new OpenAIApi(configuration);

const levels = new Keyv('sqlite://db.sqlite', { table: 'levels' })
levels.on('error', err => console.error('Keyv connection error:', err))

class SubCommand{
async ping(message,client) {
    let cd = await cmdCD.checkCoolDown(message.author.id, "cmd-ping");
    if (cd.res.spam) return;
    if (!cd.res.ready) return message.reply(`${"```"}js\n🤖そのコマンドが使えるまであと ${(cd.res.rem / 1000).toFixed(1)}秒🚀${"```"}`);
    message.reply(`${"```"}ポン！🏓${client.ws.ping}Ms${"```"}`);
    cmdCD.addCoolDown(message.author.id, 5000, "cmd-ping");
}
async level(message) {
    const level = (await levels.get(message.author.id)) || { level: 1, xp: 0, max: 100 };
    const requiredExperience = level.max - level.xp
    const embedMessage = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Level')
	.setDescription('現在のレベルを表示します')
	.addFields(
		{ name: 'Lv', value: `${level.level}Lv` },
		{ name: 'Xp', value: `${level.xp}Xp 次のレベルまで ${requiredExperience}Xp` },
	)
	.setTimestamp();
    message.reply({ embeds: [embedMessage] });
    levels.set(message.author.id, level)
}
async gpt(message) {
    let sendcontent = message.content.substring(6)
    let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: sendcontent}],
      });
    message.reply({content: completion.data.choices[0].message.content});
}
async gptgreeting(member){
    let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `「${member.displayName}」という名前について一言と「${member.displayName}」さんへの挨拶を言ってください`}],
      });
    member.guild.channels.cache.get(`1114068389497933834`).send({content: `# ${member.user.tag}さんよろしく！\n`+completion.data.choices[0].message.content});
}
}

module.exports = SubCommand;