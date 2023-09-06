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
/**
 * 現在の所持金を表示します
 * @param {Message<boolean>} message 
 */
async balance(message) {    
    if(message.mentions.members.size == 0){
        const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Balance')
        .setDescription('現在の所持金を表示します')
        .addFields(
            { name: '手持ちのお金', value: `${money.cash}円` },
            { name: '銀行のお金', value: `${money.bank}円` , inline: true },
        )
        .setTimestamp();
        message.reply({ embeds: [embedMessage] });
    }
    if (message.mentions.members.size == 1) {
    const target = await message.mentions.members.first()
    const targetDisplayName = message.mentions.members.first().user.username;
    const targetmoney = (await moneys.get(target.id)) || { cash: 5000, bank: 0 };
    console.log(message.mentions.members)
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Balance')
        .setDescription(`${target}の所持金を表示します`)
        .addFields(
            { name: `${targetDisplayName}のお金`, value: `${targetmoney.cash}円` },
            { name: `${targetDisplayName}銀行のお金`, value: `${targetmoney.bank}円` , inline: true },
        )
        .setTimestamp();
        message.reply({ embeds: [embedMessage] });
    }   
}
/**
 * 銀行にお金を預ける
 * @param {Message<boolean>} message 
 * @returns NaN
 */
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
/**
 * 銀行からお金を引き出す
 * @param {Message<boolean>} message 
 * @returns NaN
 */
async withdraw(message) {
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    const [a] = args.map(str => Number(str))

    if (money.bank < a) {
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Withdraw')

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

            .setDescription('出金したい金額を書いてください(一円以上)\n＊コマンド : c!withdraw <出金したい金額>')  
            .setTimestamp();
                message.reply({ embeds: [embedMessage] });
    }
    moneys.set(message.author.id, money)
}
/**
 * お金を稼ぐ
 * @param {Message<boolean>} message 
 * @returns 
 */
async work(message) {
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    let cd = await cmdCD.checkCoolDown(message.author.id, "cmd-work");
    if (!cd.res.ready) {
        const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Work')

            .setDescription(`🤖そのコマンドは一時間のクールダウンの後に使えます🚀\n残り${(cd.res.rem / 1000 / 60).toFixed(1)}分`)  
            .setTimestamp();
        message.reply({ embeds: [embedMessage] });
        return
    } 
    var randomwork = 3000 + Math.floor(Math.random() * 7000);
    money.cash += randomwork;
    const embedMessage2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Work')

        .setDescription(`地下労働して${randomwork}円を手に入れた！💸`)  
        .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
    cmdCD.addCoolDown(message.author.id, 3600000, "cmd-work");
    moneys.set(message.author.id, money)
}
async shortWork(message) {
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    let scd = await cmdCD.checkCoolDown(message.author.id, "scmd-work");
    if (!scd.res.ready) {
        const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('ShortWork')

            .setDescription(`🤖そのコマンドは一時間のクールダウンの後に使えます🚀\n残り${(scd.res.rem / 1000 / 60).toFixed(1)}分`)  
            .setTimestamp();
        message.reply({ embeds: [embedMessage] });
        return
    } 
    var randomwork = 100 + Math.floor(Math.random() * 1000);
    money.cash += randomwork;
    const embedMessage2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Work')

        .setDescription(`自販機の下から${randomwork}円を手に入れた！💸`)  
        .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
    cmdCD.addCoolDown(message.author.id, 300000, "scmd-work");
    moneys.set(message.author.id, money)
}
/**
 * 相手に指定した金額を渡す
 * @param {Message<boolean>} message 
 * @returns 
 */
async send(message) {
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    const [a] = args.map(str => Math.floor(Number(str))); console.log(a);
        if (message.mentions.members.size !== 1) {
            const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')

            .setDescription(`メンバーを一人指定してください`)  
            .setTimestamp();
            message.reply({ embeds: [embedMessage2] });
            return
        } 
    const target = await message.mentions.members.first()
    const targetmoney = (await moneys.get(target.id)) || { cash: 5000, bank: 0 };
        if (Number.isNaN(a)) { //相手に渡す金額が数字であるか
            const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')

            .setDescription(`相手に渡す金額を指定してください`)  
            .setTimestamp();
            message.reply({ embeds: [embedMessage2] });
            return
        }
        if (a <= 0) {
            const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')

            .setDescription(`相手に渡す金額を指定してください`)  
            .setTimestamp();
            message.reply({ embeds: [embedMessage2] });
            return
        } 
        if (money.cash < a) {
            const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')

            .setDescription(`所持金が足りません`)  
            .setTimestamp();
            message.reply({ embeds: [embedMessage2] });
            return
        } 
        if (target == message.author.id){
            const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')

            .setDescription(`自分以外の人にしか送金できません`)  
            .setTimestamp();
            message.reply({ embeds: [embedMessage2] });
            return
        }
        money.cash -= a;
        targetmoney.cash += a;
        const embedMessage2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Send')

            .setDescription(`送金しました`)  
            .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
    moneys.set(message.author.id, money);
    moneys.set(target.id, targetmoney);
}
/**
 * coinflipでお金を稼ぐ
 * @param {Message<boolean>} message 
 * @returns 
 */
async coinflip(message) {
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
    const [a, b] = args.map(str => Number(str))
    if (!b == 1 || !b == 2) {
        const embedMessage2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Coinflip')

        .setDescription(`表か裏を選んでください\n＊コマンド : c!coinflip <BETしたい金額> <表なら1裏なら2>`)  
        .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
        return
    }
    if (Number.isNaN(a)) {
        const embedMessage2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Coinflip')

        .setDescription(`相手に渡す金額を指定してください`)  
        .setTimestamp();
        message.reply({ embeds: [embedMessage2] });
        return
    }
    if (a <= 0) {
        const embedMessage2 = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Coinflip')

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
async slot(message) {
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
    const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };

    moneys.set(message.author.id, money)
}
}
module.exports = Command;