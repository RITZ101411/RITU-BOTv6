const fs = require("fs")
const Keyv = require('keyv')
const cmdCD = require('command-cooldown');
const { EmbedBuilder } = require('discord.js');

const prefix = 'c!';

const keyv = new Keyv('sqlite://db.sqlite');

const moneys = new Keyv('sqlite://db.sqlite', { table: 'moneys' })
moneys.on('error', err => console.error('Keyv connection error:', err))

const userLevels = new Keyv('sqlite://db.sqlite')
userLevels.on('error', err => console.error('Keyv connection error:', err))



class Command {
async balance(message) {
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    const embedMessage = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Balance')
	.setAuthor({ name: 'RITU-BOTv6'})
	.setDescription('現在の所持金を表示します')
	.addFields(
		{ name: '手持ちのお金', value: `${money.cash}円` },
		{ name: '銀行のお金', value: `${money.bank}円` , inline: true },
	)
	.setTimestamp();

    message.reply({ embeds: [embedMessage] });
    moneys.set(message.author.id, money)
}

async deposit(message) {
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    const [a] = args.map(str => Number(str))

    if (a > 1)
        if (money.cash < a) {
            const embedMessage = new EmbedBuilder()
	            .setColor(0x0099FF)
	            .setTitle('Deposit')
                .setDescription('手持ちのお金が足りません')
	            .setTimestamp();

                message.reply({ embeds: [embedMessage] });
            return;
        }

    if (a >= 1) {
        money.bank += a;
        money.cash -= a;
        const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Deposit')
            .setAuthor({ name: 'RITU-BOTv6'})
            .setDescription('入金しました')
            .addFields(
                { name: '入金した金額', value:  `${a}円` },
                { name: '現在の銀行の合計金額', value: `${money.bank}円` , inline: true },
        )       
        .setTimestamp();
        message.reply({ embeds: [embedMessage] });
    }
    else {
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Deposit')
        .setDescription('手持ちの入金したい金額を書いてください(一円以上)\n＊コマンド : c!deposit <入金したい金額>お金が足りません')
        .setTimestamp();

        message.reply({ embeds: [embedMessage] });
    return;
    }
    moneys.set(message.author.id, money)
}

async withdraw(message) {
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    const [a] = args.map(str => Number(str))

    if (money.bank < a) {
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Withdraw')
        .setAuthor({ name: 'RITU-BOTv6'})
        .setDescription('銀行のお金が足りません')  
    .setTimestamp();
    message.reply({ embeds: [embedMessage] });
        return;
    }

    if (a >= 1) {
        money.cash += a;
        money.bank -= a;
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Deposit')
        .setAuthor({ name: 'RITU-BOTv6'})
        .setDescription('出金しました')
        .addFields(
            { name: '出金したお金', value:  `${a}円` },
            { name: '現在の銀行の合計金額', value: `${money.bank}円` , inline: true },
    )       
    .setTimestamp();
    message.reply({ embeds: [embedMessage] });
    }
    else {
        const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Withdraw')
            .setAuthor({ name: 'RITU-BOTv6'})
            .setDescription('出金したい金額を書いてください(一円以上)\n＊コマンド : c!withdraw <出金したい金額>')  
            .setTimestamp();
                message.reply({ embeds: [embedMessage] });
    }
    moneys.set(message.author.id, money)
}

async work(message) {
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    let cd = await cmdCD.checkCoolDown(message.author.id, "cmd-work");
    if (!cd.res.ready) {
        const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Work')
            .setAuthor({ name: 'RITU-BOTv6'})
            .setDescription(`🤖そのコマンドは一時間のクールダウンの後に使えます🚀\n残り${(cd.res.rem / 1000 / 60).toFixed(1)}分`)  
            .setTimestamp();
        message.reply({ embeds: [embedMessage] });
        return
    } 
    var randomwork = 1000 + Math.floor(Math.random() * 5000);
    money.cash += randomwork;
    const embedMessage2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Work')
        .setAuthor({ name: 'RITU-BOTv6'})
        .setDescription(`地下労働して${randomwork}円を手に入れた！💸`)  
        .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
    cmdCD.addCoolDown(message.author.id, 3600000, "cmd-work");
    moneys.set(message.author.id, money)
}

async send(message) {
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    const [a] = args.map(str => Math.floor(Number(str))); console.log(a);
        if (message.mentions.members.size !== 1) {
            const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')
            .setAuthor({ name: 'RITU-BOTv6'})
            .setDescription(`メンバーを一人指定してください`)  
            .setTimestamp();
            message.reply({ embeds: [embedMessage2] });
            return
        } 
    const target = await message.mentions.members.first()
    const targetmoney = (await moneys.get(target.id)) || { cash: 5000, bank: 0 };
        if (Number.isNaN(a)) {
            const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')
            .setAuthor({ name: 'RITU-BOTv6'})
            .setDescription(`相手に渡す金額を指定してください`)  
            .setTimestamp();
            message.reply({ embeds: [embedMessage2] });
            return
        }
        if (a <= 0) {
            const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')
            .setAuthor({ name: 'RITU-BOTv6'})
            .setDescription(`相手に渡す金額を指定してください`)  
            .setTimestamp();
            message.reply({ embeds: [embedMessage2] });
            return
        } 
        if (money.cash < a) {
            const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')
            .setAuthor({ name: 'RITU-BOTv6'})
            .setDescription(`所持金が足りません`)  
            .setTimestamp();
            message.reply({ embeds: [embedMessage2] });
            return
        } 
        money.cash -= a;
        targetmoney.cash += a;

        const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')
            .setAuthor({ name: 'RITU-BOTv6'})
            .setDescription(`送金しました`)  
            .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
    moneys.set(message.author.id, money);
    moneys.set(target.id, targetmoney);
}

async coinflip(message) {
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    const [a, b] = args.map(str => Number(str))
    if (!b == 1 || !b == 2) {
        const embedMessage2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Coinflip')
        .setAuthor({ name: 'RITU-BOTv6'})
        .setDescription(`表か裏を選んでください\n＊コマンド : c!coinflip <BETしたい金額> <表なら1裏なら2>`)  
        .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
        return
    }
    if (Number.isNaN(a)) {
        const embedMessage2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Coinflip')
        .setAuthor({ name: 'RITU-BOTv6'})
        .setDescription(`相手に渡す金額を指定してください`)  
        .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
        return
    }
    if (a <= 0) {
        const embedMessage2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Coinflip')
        .setAuthor({ name: 'RITU-BOTv6'})
        .setDescription(`相手に渡す金額を指定してください`)  
        .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
        return
    }
    if (money.cash < a) {
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Coinflip')
        .setDescription('手持ちのお金が足りません')
        .setTimestamp();

        message.reply({ embeds: [embedMessage] });
    return;
        return
    }
    money.cash -= a;
    const side = Math.floor(Math.random() * 2 + 1);
    if (b == side) {
        money.cash += a * 2;
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Coinflip')
        .setDescription(`表！YOU WIN!🤑\n${a * 2}円を手に入れました！💴`)
        .setTimestamp();

        message.reply({ embeds: [embedMessage] });
    }
    else if (b !== side) {
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Coinflip')
        .setDescription(`裏！YOU LOOSE...${"(´；ω；`)ｳｯ…"}\n${a}円を失いました💸`)
        .setTimestamp();

        message.reply({ embeds: [embedMessage] });
    }
    moneys.set(message.author.id, money)
}
}
module.exports = Command;