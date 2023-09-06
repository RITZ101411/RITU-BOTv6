const cmdCD = require('command-cooldown');
const { EmbedBuilder } = require('discord.js');
const Keyv = require('keyv')
require('dotenv').config();
<<<<<<< Updated upstream
const { Configuration, OpenAIApi } = require("openai");
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
=======
const { OpenAI } = require("openai");
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');
>>>>>>> Stashed changes
const { config } = require('dotenv');

const prefix = 'c!';
var speakerNumber = 3;
let speakerName = "ずんだもん"

<<<<<<< Updated upstream
const GUILD_ID = process.env.GUILD_ID

const configuration = new Configuration({
	apiKey: process.env.GPT_KEY,
=======
let connection = null;

const GUILD_ID = process.env.GUILD_ID

const openai = new OpenAI({
    apiKey: process.env.GPT_KEY,
>>>>>>> Stashed changes
});

const levels = new Keyv('sqlite://db.sqlite', { table: 'levels' })
levels.on('error', err => console.error('Keyv connection error:', err))

<<<<<<< Updated upstream
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
async vcjoin(message){
    if(message.member.voice.channelId == null){
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
    if(message.member.voice.channelId !== null){
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('JOIN')
        .setDescription('VCに参加しました')
        .setTimestamp();
        message.channel.send({ embeds: [embedMessage] });
    }
}
async vcleave(message){
    const connection = getVoiceConnection(message.guild.id);
    if(connection == undefined) return;
    connection.destroy();
    const embedMessage = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('JOIN')
    .setDescription('VCから退出しました')
    .setTimestamp();
    message.channel.send({ embeds: [embedMessage] });
}
async gpt(message){
    let completion = await textGenerate(message.content.substr( 5 ),"user")
    message.reply(completion.data.choices[0].message.content)
}
async voice(message){
    let completion = await textGenerate(message.content.substr( 5 ),"語尾に'★'をつけてください")
    message.reply(completion.data.choices[0].message.content)
}
}
async function textGenerate(input,systemMsg){
    let completion = await openai.createChatCompletion({
        model : "gpt-3.5-turbo",
        messages : [
            {"role": "system", "content": systemMsg},
            {"role": "user", "content": input}
        ]                    
    });
    return completion;
}

=======
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
        let sendcontent = message.content.substring(5)
        await this.textGenerate(sendcontent,"日本語で返答してください")
        message.reply(completion)
    }
    async gptgreeting(member) {
        member.guild.channels.cache.get(`1114068389497933834`).send({ content: `# ${member.user.tag}さんよろしく！\nうおおお！新規が来たぞっ！みんなっ！挨拶しろよな！！`})
    }
    async chatreading(message){
        if (connection == null) return;
        console.log(message.content)
        await this.genAudio(message.content,"message.mp3")
        await this.voicePlay("message.mp3")
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
        connection = joinVoiceChannel({
            selfMute: false,
            channelId: message.member.voice.channelId,
            guildId: message.member.guild.id,
            adapterCreator: message.member.voice.guild.voiceAdapterCreator,
        })
        connection.on(VoiceConnectionStatus.Disconnected,() => {
            connection.destroy();
            connection = null;
        })
        if (message.member.voice.channelId !== null) {
            const embedMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('JOIN')
                .setDescription('VCに参加しました')
                .setTimestamp();
            message.channel.send({ embeds: [embedMessage] });
            await this.genAudio("接続しました","test.mp3")
            await this.voicePlay("test.mp3")
            return message.channelId;
        } return null;
    }
    async voicePlay(filepath) {
        let resource = createAudioResource(filepath,
        {
          inputType: StreamType.Arbitrary,
        });
        const player = createAudioPlayer();
        player.on('error', error => {
            console.error('Error:', error.message, 'with track', error.resource.metadata.title);
        });
        player.stop()
        player.play(resource)
        connection.subscribe(player);
    }
    async vcleave(message) {
        if (connection == null) return;
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
        const audio_query = await rpc.post('audio_query?text=' + encodeURI(text) + `&speaker=${speakerNumber}`);

        //audio_queryで受け取った結果がaudio_query.dataに入っている。
        //このデータをメソッド:synthesisに渡すことで音声データを作ってもらえる
        //audio_query.dataはObjectで、synthesisに送る為にはstringで送る必要があるのでJSON.stringifyでstringに変換する
        const synthesis = await rpc.post(`synthesis?speaker=${speakerNumber}`, JSON.stringify(audio_query.data), {
            responseType: 'arraybuffer',
            headers: {
                "accept": "audio/wav",
                "Content-Type": "application/json"
            }
        });

        //受け取った後、Bufferに変換して書き出す
        fs.writeFileSync(filepath, new Buffer.from(synthesis.data), 'binary');
    }
    async vctest(message){
        let sendcontent = message.content.substring(5)
        if (connection == null){
            message.reply("接続されてません")
        }
        else{
            await this.genAudio(sendcontent,"test.mp3")
            let resource = createAudioResource('./test.mp3',
            {
              inputType: StreamType.Arbitrary,
            });
>>>>>>> Stashed changes

            const player = createAudioPlayer();
            player.on('error', error => {
                console.error('Error:', error.message, 'with track', error.resource.metadata.title);
            });
            player.stop()
            player.play(resource)
            connection.subscribe(player);
        }
    }
    /**
     * 
     * @param {*} message 
     * @returns {int}喋るVOICEROIDの番号
     */
    async speakerset(message){
        let speaker = message.content.substring(8)
        if(speaker == "1"){
            speakerNumber = 3
            speakerName = "ずんだもん"
        }
        if(speaker == "2"){
            speakerNumber = 2
            speakerName = "四国めたん"
        }
        if(speaker == "3"){
            speakerNumber = 47
            speakerName = "ナースロボ＿タイプＴ"
        }
        if(speaker == "4"){
            speakerNumber = 8
            speakerName = "春日部つむぎ"
        }
        if(speaker >= 5){
            const embedMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('SET')
            .setDescription(`Speakerは1~4で設定してください`)
            .setTimestamp();
            message.channel.send({ embeds: [embedMessage] });  
        }
        else{
        const embedMessage = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('SET')
        .setDescription(`Speakerを${speakerName}に設定しました`)
        .setTimestamp();
        message.channel.send({ embeds: [embedMessage] });
        return speakerNumber;
    }
    } 
}
// async function textGenerate(input, systemMsg) {
//     let completion = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [
//             { "role": "system", "content": systemMsg },
//             { "role": "user", "content": input }
//         ]
//     });
//     return completion;
// }

module.exports = SubCommand;