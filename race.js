let raceStatus = "開始可能"
const Keyv = require('keyv')

const { EmbedBuilder } = require('discord.js');
const { randomBytes } = require('tweetnacl');

const prefix = 'c!';

const keyv = new Keyv('sqlite://db.sqlite');

const moneys = new Keyv('sqlite://db.sqlite', { table: 'moneys' })
moneys.on('error', err => console.error('Keyv connection error:', err))

class raceclass {
    async racePreparation(message) {
        if (raceStatus !== "開始可能") {
            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Race')
                .setDescription(`現在レースは${raceStatus}です`)
                .setTimestamp();
            message.channel.send({ embeds: [embedMessage] });
            return;
        }
        raceStatus = "準備中"

        const races = [
            "皐月賞",
            "東京優駿",
            "菊花賞",
            "有馬記念",
            "桜花賞",
            "優駿牝馬",
            "秋華賞",
            "イギリスダービー",
            "凱旋門",
            "ジャパンカップ",
            "フェブラリーＳ",
            "高松宮記念",
            "大阪杯",
            "宝塚記念",
            "ジュベナイルフィリーズ",
            "フューチュリティステークス",
            "ホープフルステークス",
            "毎日王冠",
            "新潟千直",
            "G1",
        ]

        // 25頭の馬のリスト
        const horses = [
            { name: "ピーチィカトウ", type: "追い込み" },
            { name: "ファンキーヤマダ", type: "先行" },
            { name: "サイコソガワ", type: "自在" },
            { name: "クレイジータナカ", type: "差し" },
            { name: "バナナイトウ", type: "逃げ" },
            { name: "グリンピースカネコ", type: "先行" },
            { name: "ミステリアスナカムラ", type: "差し" },
            { name: "ピースフルヤマグチ", type: "自在" },
            { name: "グリーングラスコバヤシ", type: "追い込み" },
            { name: "ダンシングゴリキー", type: "逃げ" },
            { name: "ピクシーパンケーキ", type: "差し" },
            { name: "フライングレーザー", type: "自在" },
            { name: "ホップスキッパーヤマグチ", type: "追い込み" },
            { name: "スプリンクルレーサー", type: "先行" },
            { name: "チョコスプラッシュナカムラ", type: "差し" },
            { name: "ミラクルスピーカツ", type: "逃げ" },
            { name: "ダイナミックサワキ", type: "差し" },
            { name: "グリーンテレポートナカムラ", type: "先行" },
            { name: "シャイニングツバサヨシダ", type: "自在" },
            { name: "イリュージョンヒカリ", type: "追い込み" },
            { name: "ファイアマツダ", type: "逃げ" },
            { name: "ブリリアントソウガワ", type: "差し" },
            { name: "ゴールデンショウジョウ", type: "先行" },
            { name: "スリリングサノ", type: "自在" },
            { name: "レインボーピースカネコ", type: "追い込み" }
        ];

        const horseTypeMap = new Map();
        for (const horse of horses) {
            horseTypeMap.set(horse.name, horse.type);
        }

        const randomHorses = [];
        const randomRaces = [];
        while (randomHorses.length < 10) {
            const randomIndex = Math.floor(Math.random() * horses.length);
            const randomHorse = horses[randomIndex];

            if (!randomHorses.includes(randomHorse)) {
                randomHorses.push(randomHorse);
            }
        }
        while (randomRaces.length < 1) {
            const randomIndex = Math.floor(Math.random() * races.length);
            const randomRace = races[randomIndex];

            if (!randomRaces.includes(randomRace)) {
                randomRaces.push(randomRace);
            }
        }

        const horseListString = randomHorses.map((horse, index) => `${index + 1}. ${horse.name} (${horseTypeMap.get(horse.name)})`).join('\n');

        const startEmbedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('# まもなくレースが開始します！')
            .setDescription(`現在レースは${raceStatus}です\n残り5分で開始`)
            .setTimestamp();
        message.channel.send({ embeds: [startEmbedMessage] });

        await wait(5000);

        const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`レース : ${randomRaces[0]}`)
            .setDescription(`出場馬一覧\n${horseListString}`)
            .setTimestamp();
        message.channel.send({ embeds: [embedMessage] });

        await wait(5000);

        raceStatus = "馬券購入"

        const ticketBuyMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`馬券購入`)
            .setDescription(`c!ticket-buy <金額> <馬券のナンバー> <単勝 or 複勝>`)
            .setTimestamp();
        message.channel.send({ embeds: [ticketBuyMessage] });
        await this.raceStart(randomHorses)
        console.log(randomHorses)
        return randomHorses = [randomHorses];
    }
    async ticketBuy(message) {
        if (raceStatus !== "馬券購入") {
            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Race')
                .setDescription(`現在レースは${raceStatus}です`)
                .setTimestamp();
            message.channel.send({ embeds: [embedMessage] });
            return;
        }
        console.log(randomHorses)
        const [command, ...args] = message.content.slice(prefix.length).split(/\s+/)
        const money = (await moneys.get(message.author.id)) || { cash: 5000, bank: 0 };
        const [bet, name] = args.map(str => Number(str))

        if (0 > bet) {
            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Race')
                .setDescription(`正しい金額を指定してください`)
                .setTimestamp();
            message.channel.send({ embeds: [embedMessage] });
        }
        if (money.cash <= bet) {
            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Race')
                .setDescription(`所持金が足りません`)
                .setTimestamp();
            message.channel.send({ embeds: [embedMessage] });
        }
        if (name !== randomHorses.name) {
            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Race')
                .setDescription(`正しい名前を指定してください`)
                .setTimestamp();
            message.channel.send({ embeds: [embedMessage] });
        }
        const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('馬券の購入が完了しました')
            .setDescription(`馬の名前${name}\n金額${bet}`)
            .setTimestamp();
        message.channel.send({ embeds: [embedMessage] });
    }
    async raceStart(randomHorses) {

        await wait(30000);

        raceStatus = "レース開始"
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = raceclass;