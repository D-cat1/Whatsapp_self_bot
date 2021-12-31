const {
    default: simple_git
} = require('simple-git')
const git = simple_git()
const config = require('../config')
const {
    default: got
} = require('got')
const whats = require('../command_list')

async function git_urls() {
    return new Promise(async (resolve) => {
        const data = await got.get(`https://api.heroku.com/apps/${config.HEROKU_APP_NAME}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/vnd.heroku+json; version=3",
                "Authorization": `Bearer ${config.HEROKU_APP_KEY}`
            }
        }).json()
        resolve(data.git_url.replace(
            "https://", "https://api:" + config.HEROKU_APP_KEY + "@"
        ))
    })
}


whats.addCmd({
    name: 'update',
    desc: 'mengupdate self bot'
}, async (whatsapp, msg, args) => {
    await git.fetch();
    var log_comm = await git.log([config.BRANCH + '..origin/' + config.BRANCH]);
    if (log_comm.total === 0) {
        msg.reply('tidak ada update!')
    } else {
        let update = '⬆ Update Tersedia :\n\n'
        log_comm.all.forEach((data) => {
            update += data.message + '\nOleh :' + data.author_name + '\n\n'
        });
        const templateButtons = [{
                index: 2,
                urlButton: {
                    displayText: 'Go to GitHub!',
                    url: 'https://github.com/D-cat1/Whatsapp_self_bot.git'
                }
            },
            {
                index: 1,
                quickReplyButton: {
                    displayText: 'Update Sekarang!',
                    id: 'updtnow'
                }
            },
        ]

        const templateMessage = {
            text: update,
            footer: 'Hello World',
            templateButtons: templateButtons
        }

        await whatsapp.sendMessage(msg.to, templateMessage)
    }
})

whats.addCmd({
    name: 'updtnow',
    disable_cmd: true
}, async (whatsapp, msg, args) => {
    msg.reply('🔄 memulai update...')
    const heroku_git = await git_urls()
    try {
        await git.addRemote('udhe', heroku_git);
    } catch {
        console.log('heroku remote terinstal')
    }
    git.fetch('origin', config.BRANCH)
    git.reset('hard', ['FETCH_HEAD'])
    await git.push('udhe', config.BRANCH)

    await msg.reply('update berhasil\nmerestart....')
})