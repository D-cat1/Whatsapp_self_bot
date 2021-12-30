const whats = require('../command_list')

const {
    default: got
} = require('got')
const config = require('../config')


async function accid() {
    return new Promise(async (resolve) => {
        const data = await got.get('https://api.heroku.com/account', {
            headers: {
                "Accept": "application/vnd.heroku+json; version=3",
                "Authorization": `Bearer ${config.HEROKU_APP_KEY}`
            }
        }).json()
        resolve(data.id)
    })
}

async function getdyno_size(){
    return new Promise(async (resolve) => {
        const idacc = await accid()
        const data = await got.get(`https://api.heroku.com/accounts/${idacc}/actions/get-quota`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0",
                "Accept": "application/vnd.heroku+json; version=3.account-quotas",
                "Authorization": `Bearer ${config.HEROKU_APP_KEY}`
            }
        }).json()
        const dyno = {}
        dyno['used'] = (data.quota_used/3600).toFixed(2)
        dyno['total'] = (data.account_quota/3600).toFixed(2)
        dyno['remain'] = ((data.account_quota - data.quota_used)/3600).toFixed(2)
        resolve(dyno)

    })
}

async function reboot_apps(nama){
    return new Promise(async (resolve) => {
    const data = await got.delete(`https://api.heroku.com/apps/${nama}/dynos`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/vnd.heroku+json; version=3",
            "Authorization": `Bearer ${config.HEROKU_APP_KEY}`
        }
    }).json()
    resolve(data)
})
}

async function getformation(nama){
    return new Promise(async (resolve) => {
    const data = await got.get(`https://api.heroku.com/apps/${nama}/formation`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/vnd.heroku+json; version=3",
            "Authorization": `Bearer ${config.HEROKU_APP_KEY}`
        }
    }).json()
    resolve(data)
})
}


async function offapps(nama){
    return new Promise(async (resolve) => {
    const fomrs = await getformation(nama)
    const data = await got.patch(`https://api.heroku.com/apps/${fomrs[0].app.id}/formation/${fomrs[0].id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/vnd.heroku+json; version=3",
            "Authorization": `Bearer ${config.HEROKU_APP_KEY}`
        }, json : {
            type: fomrs[0].type,
            size: fomrs[0].size,
            quantity: 0
        }
    }).json()
    resolve(data)
})
}

async function onapps(nama){
    return new Promise(async (resolve) => {
    const fomrs = await getformation(nama)
    const data = await got.patch(`https://api.heroku.com/apps/${fomrs[0].app.id}/formation/${fomrs[0].id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/vnd.heroku+json; version=3",
            "Authorization": `Bearer ${config.HEROKU_APP_KEY}`
        }, json : {
            type: fomrs[0].type,
            size: fomrs[0].size,
            quantity: 1
        }
    }).json()
    resolve(data)
})
}


async function infoapp(){
    return new Promise(async (resolve) => {
    const data = await got.get(`https://particleboard.heroku.com/quick-jump`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json, text/javascript",
            "Authorization": `Bearer ${config.HEROKU_APP_KEY}`,
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0"
        }
    }).json()
    const appdata = []
    data.forEach(a => {
        if (a.id != 'personalappshomeid'){
            appdata.push(a)
        }
    });
    resolve(appdata)
})
}

whats.addCmd({name: 'dyno', hint: '.dyno', desc: 'cek masa aktif heroku'}, async (whatsapp, msg, args)=>{
   const cekdyno = await getdyno_size()
   msg.reply('⬢ *Dyno Pada Akun Ini :*\n\nDigunakan : ```'+cekdyno.used+'```\nTotal : ```'+cekdyno.total+'```\nSisa : ```'+cekdyno.remain+'```')
   console.log(cekdyno)
})

whats.addCmd({name: 'herokuch', hint: '.herokuch', desc: 'heroku account control'}, async (whatsapp, msg, args)=>{
    const app_list = await infoapp()
    const arow = []
    app_list.forEach(a => {
        arow.push({title: a.name, rowId: `hkctl ${a.name}`})
    })
    const sections = [
        {
        title: "Pilih app yang akan dikontrol :",
        rows: arow
        }]
    await whatsapp.relayMessage(msg.to, {
        listMessage: {
            buttonText: 'Pilih app',
            description: `Ditemukan ${app_list.length} app :`,
            sections: sections,
            listType: 1
        }
    }, msg.message.key.id)
})

whats.addCmd({name: 'hkctl', disable_cmd: true}, async (whatsapp, msg, args)=>{
    const buttons = [
        {buttonId: 'hkoff '+args, buttonText: {displayText: 'Matikan App'}, type: 1},
        {buttonId: 'hkon '+args, buttonText: {displayText: 'Hidupkan App'}, type: 1},
        {buttonId: 'hkreb '+args, buttonText: {displayText: 'Restart App'}, type: 1}
      ]
      
      const buttonMessage = {
          text: `*⬢ ${args} Dipilih!*`,
          footer: 'Akan diapakan App Ini ?',
          buttons: buttons,
          headerType: 1
      }
      
      await whatsapp.sendMessage(msg.to, buttonMessage)
})

whats.addCmd({name: 'hkoff', disable_cmd: true}, async (whatsapp, msg, args)=>{
    const hkoff = await offapps(args)
    if (hkoff.quantity == 0){
        whatsapp.sendMessage(msg.to, {text: `*⬢ ${args} Telah dimatikan*`})
    }
})

whats.addCmd({name: 'hkon', disable_cmd: true}, async (whatsapp, msg, args)=>{
    const hkon = await onapps(args)
    if (hkon.quantity == 1){
        whatsapp.sendMessage(msg.to, {text: `*⬢ ${args} Telah dinyalakan*`})
    }
})

whats.addCmd({name: 'hkreb', disable_cmd: true}, async (whatsapp, msg, args)=>{
    await reboot_apps(args)
    whatsapp.sendMessage(msg.to, {text: `*⬢ ${args} Telah direstart*`})
})