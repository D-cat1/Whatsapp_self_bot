const allpg = require('../command_list')


allpg.addCmd({
    name: 'help',
    desc: 'menampilkan Semua Plugin'
}, async (client, msg, args) => {
    if (msg.noArgs) {
        let all_pg = '*📚 Daftar Modul* :\n\n'
        var count = 0
        allpg.Allcmd.map((a) => {
            if (!a.hide_cmd && !a.disable_cmd){
            all_pg += '[```' + a.name + '```]  '
            count += 1
            }
        })

        all_pg += '\n\n*Petunjuk* : ```.help <nama Modul>```\n*Total Modul* : '+count
        client.sendMessage(msg.to, {
            text: all_pg
        })
    } else {
        const info_plugin = allpg.Allcmd.filter(a => a.name === args)
        if (info_plugin.length == 0){
            client.sendMessage(msg.to, {
                text: `Tidak Ada Plugin dengan nama "${args}"`
            })
        } else {
            msg.reply(`*Command* : ${info_plugin[0].command}\n*Keterangan* : ${info_plugin[0].desc}\n*Contoh* : ${info_plugin[0].hint}`)
        }
    }
})