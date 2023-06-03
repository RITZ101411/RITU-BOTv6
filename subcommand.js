const cmdCD = require('command-cooldown');
const { EmbedBuilder } = require('discord.js');
const Keyv = require('keyv')

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
}

module.exports = SubCommand;