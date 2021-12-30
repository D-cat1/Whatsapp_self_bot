const whatscmd = require('../command_list')

const exec = require('child_process').exec;
const os = require("os");

whatscmd.addCmd({name : 'term', desc:'eval terminal', hint: '.term ls'}, async (client, msg, args) => {
    var user = os.userInfo().username;
    if (msg.noArgs) return await client.sendMessage(msg.to, {text: 'Arguments Dibutuhkan'});

    exec(args, async (err, stdout, stderr) => {
        if (err) {
             await client.sendMessage(msg.to, {text: '```'+ user +':~# ' + args + '\n' + err + '```'});
        }
         await client.sendMessage(msg.to, {text: '```'+ user +':~# ' + args + '\n' + stdout + '```'});
      });
})

whatscmd.addCmd({on: 'message'}, async (client, msg, args) => {
    if (msg.message.message.conversation == 'helo'){
        msg.reply('hai')
    }
})