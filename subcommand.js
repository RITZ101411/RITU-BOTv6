const cmdCD = require('command-cooldown');

class SubCommand{
async ping(message,client) {
    let cd = await cmdCD.checkCoolDown(message.author.id, "cmd-ping");
    if (cd.res.spam) return;
    if (!cd.res.ready) return message.reply(`${"```"}js\n🤖そのコマンドが使えるまであと ${(cd.res.rem / 1000).toFixed(1)}秒🚀${"```"}`);
    message.reply(`${"```"}ポン！🏓${client.ws.ping}Ms${"```"}`);
    cmdCD.addCoolDown(message.author.id, 5000, "cmd-ping");
}
}

module.exports = SubCommand;