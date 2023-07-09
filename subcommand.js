const cmdCD = require('command-cooldown');
const { EmbedBuilder } = require('discord.js');
const Keyv = require('keyv')
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { config } = require('dotenv');
const { default: axios } = require("axios");
const fs = require("fs");

//axios=通信するやつ
//httpを省略するとうまく接続できなかったのでしっかり書いておく。
const rpc = axios.create({ baseURL: "http://127.0.0.1:50021", proxy: false });

const prefix = 'c!';

const GUILD_ID = process.env.GUILD_ID

const configuration = new Configuration({
    apiKey: process.env.GPT_KEY,
});
const openai = new OpenAIApi(configuration);

const levels = new Keyv('sqlite://db.sqlite', { table: 'levels' })
levels.on('error', err => console.error('Keyv connection error:', err))

class SubCommand {
    async ping(message, client) {
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
            messages: [{ role: "user", content: sendcontent }],
        });
        message.reply({ content: completion.data.choices[0].message.content });
    }
    async gptgreeting(member) {
        let completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `「${member.displayName}」という名前について一言と「${member.displayName}」さんへの挨拶を言ってください` }],
        });
        member.guild.channels.cache.get(`1114068389497933834`).send({ content: `# ${member.user.tag}さんよろしく！\n` + completion.data.choices[0].message.content });
    }
    async vcjoin(message) {
        if (message.member.voice.channelId == null) {
            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('JOIN')
                .setDescription('VCに参加してください')
                .setTimestamp();
            message.channel.send({ embeds: [embedMessage] });
        }
        const connection = joinVoiceChannel({
            selfMute: false,
            channelId: message.member.voice.channelId,
            guildId: GUILD_ID,
            adapterCreator: message.member.voice.guild.voiceAdapterCreator,
        })
        if (message.member.voice.channelId !== null) {
            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('JOIN')
                .setDescription('VCに参加しました')
                .setTimestamp();
            message.channel.send({ embeds: [embedMessage] });
            let completion = await textGenerate("","あなたはdiscordのサーバーのVcに参加したBOTです。名前は「りつ-BOT」です。挨拶をしてください")
            console.log(completion)
            let generateText = completion.data.choices[0].message.content
            console.log(generateText)
            await this.genAudio(generateText,"test.wav")
        }
    }
    async vcleave(message) {
        const connection = getVoiceConnection(message.guild.id);
        if (connection == undefined) return;
        connection.destroy();
        const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('JOIN')
            .setDescription('VCから退出しました')
            .setTimestamp();
        message.channel.send({ embeds: [embedMessage] });
    }
    async gpt(message) {
        let completion = await textGenerate(message.content.substr(5), "user")
        message.reply(completion.data.choices[0].message.content)
    }

    //text:喋ってもらいたい言葉
    //filepath:保存先
    //ex:genAudio("こんにちは","./greeting.wav");
    async genAudio(text, filepath) {

        /* まずtextを渡してsynthesis宛のパラメータを生成する、textはURLに付けるのでencodeURIで変換しておく。*/
        const audio_query = await rpc.post('audio_query?text=' + encodeURI(text) + '&speaker=3');
        console.log(audio_query.data)

        //audio_queryで受け取った結果がaudio_query.dataに入っている。
        //このデータをメソッド:synthesisに渡すことで音声データを作ってもらえる
        //audio_query.dataはObjectで、synthesisに送る為にはstringで送る必要があるのでJSON.stringifyでstringに変換する
        const synthesis = await rpc.post("synthesis?speaker=3", JSON.stringify(audio_query.data), {
            responseType: 'arraybuffer',
            headers: {
                "accept": "audio/wav",
                "Content-Type": "application/json"
            }
        });

        //受け取った後、Bufferに変換して書き出す
        fs.writeFileSync(filepath, new Buffer.from(synthesis.data), 'binary');
    }
}
async function textGenerate(input, systemMsg) {
    let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "system", "content": systemMsg },
            { "role": "user", "content": input }
        ]
    });
    return completion;
}



module.exports = SubCommand;