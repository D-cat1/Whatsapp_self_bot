const {
    saveState,
    startSock,
    lengthdb,
    getMBsize,
    cektipe,
    load_temp_state
} = require('./Wasettings');

const {
    DisconnectReason,
    isJidGroup,
    isJidUser,
    useSingleFileAuthState,
    generateWAMessageFromContent,
    proto,
    prepareWAMessageMedia
} = require('@adiwajshing/baileys-md')
const fs = require('fs')
const comandtes = require('./command_list')
const path = require('path')
const config = require('./config')
const saveName = []
const sudo = config.OTUSER




function cek_admin(array_admin, numb) {
    return new Promise((resolve) => {
        array_admin.forEach(a => {
            if (a.id === numb && a.admin != null) {
                resolve(true)
            } else if (a.id === numb) {
                resolve(false)
            };
        });
    })
}

function checker_reply(msg) {
    if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage != null || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage != undefined) {
        return true
    } else {
        return false
    }
}

function cek_admin(array_admin, numb) {
    return new Promise((resolve) => {
        array_admin.forEach(a => {
            if (a.id === numb && a.admin != null) {
                resolve(true)
            } else if (a.id === numb) {
                resolve(false)
            };
        });
    })
}

console.log('memuat add-on..')
fs.readdirSync('./add_on').forEach(plugin => {
    if (path.extname(plugin).toLowerCase() == '.js') {
        require('./add_on/' + plugin);
    }
})
console.log('add-on dimuat!')

async function mainWa() {
    const CekSesi = await lengthdb()
    if (CekSesi) {
        if (!fs.existsSync('./temp.json')) {
            await load_temp_state()
        };
        const jsonsesi = useSingleFileAuthState('./temp.json')
        const startWA = startSock(jsonsesi.state);
        startWA.ev.on('connection.update', async (updates) => {
            const {
                connection,
                lastDisconnect
            } = updates;
            
            console.log('[Info] ' + connection)
            if (connection === 'connecting') {
                console.log('menghubungkan....')
            } else if (connection === 'open') {
                console.log('connected')
            } else if (connection === 'close') {
                // akan langsung rekonek jika tidak logout
                console.log(lastDisconnect)
                if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                    startWA()
                } else {
                    console.log('connection closed');
                };
            };
        });

        startWA.ev.on('creds.update', async () => await saveState(startWA.authState));
        startWA.ev.on('messages.upsert', async (m) => {   
            const msg = m.messages[0];
            const to = msg.key.remoteJid;
            const get_numb = msg.key.participant == '' ? to:msg.key.participant;
            console.log(saveName)
            const addname = saveName.filter(data => data.jid === get_numb)
            if (addname.length == 0 && !msg.key.fromMe){
                saveName.push({name: msg.pushName, jid: get_numb})
            }
            let dataconv
            if (msg.message != null){
            if (msg.message.conversation != '') {
                dataconv = msg.message.conversation
            } else if (msg.message.extendedTextMessage != null) {
                dataconv = msg.message.extendedTextMessage.text
            } else if (msg.message.listResponseMessage != null){
                dataconv = msg.message.listResponseMessage.singleSelectReply.selectedRowId
            } else if (msg.message.buttonsResponseMessage != null){
                dataconv = msg.message.buttonsResponseMessage.selectedButtonId
            } else {
                dataconv = 'terserah AU'
            }
            } else {
               dataconv = 'terserah AU' 
            }
            const commandh = dataconv.split(' ')
            const alltext = dataconv.split(commandh[0] + ' ');
            const isNoArgs = () => {
                if (alltext.length == 1) {
                    return true
                }
            }
            
            const isName = (jid) => {
                const addname = saveName.filter(data => data.jid === jid)
                if (addname.length == 0){
                    return null
                } else {
                    if (addname[0].name == ''){
                        return null
                    } else {
                        return addname[0].name
                    }
                }
            }
            function replyMsg(text){
                startWA.sendMessage(to, {text : text}, {quoted: msg})
            }
            const all_func = {
                isAdmin: cek_admin,
                message: msg,
                noArgs: isNoArgs(),
                to: to,
                isReply: checker_reply(msg),
                NewPushName: isName,
                reply: replyMsg
            }
            comandtes.Allcmd.map(async (mesej) => {
                if (msg.message?.conversation != '' || msg.message.extendedTextMessage != null) {
                    if (mesej.on == undefined && !mesej.disable_cmd) {
                        if (mesej.command == commandh[0]) {
                            if (mesej.onlyGc) {
                                if (isJidGroup(msg.key.remoteJid) && (msg.key.fromMe === mesej.fromMe || mesej.fromMe === sudo.includes(get_numb))) {
                                    mesej.callb(startWA, all_func, alltext[1])
                                    
                                } else {
                                    startWA.sendMessage(to, {
                                        text: 'Ini Bukan Grup!'
                                    })
                                }
                            } else if (mesej.onlyPm && (msg.key.fromMe === mesej.fromMe || mesej.fromMe === sudo.includes(get_numb))) {
                                if (isJidUser(msg.key.remoteJid)) {
                                    mesej.callb(startWA, all_func, alltext[1])
                                } else {
                                    startWA.sendMessage(to, {
                                        text: 'Via PM aja boss'
                                    })
                                }
                            } else if (msg.key.fromMe === mesej.fromMe || mesej.fromMe === sudo.includes(get_numb)){
                                mesej.callb(startWA, all_func, alltext[1])
                            }
                        }
                    } else if (mesej.on == 'message'){
                        mesej.callb(startWA, all_func, alltext[1]) 
                    }
                } else if (msg.message.listResponseMessage != null){
                    if (mesej.on == undefined && mesej.disable_cmd) {
                        if (mesej.name == commandh[0]) {
                            if (msg.key.fromMe === mesej.fromMe || mesej.fromMe === sudo.includes(get_numb)){
                                mesej.callb(startWA, all_func, alltext[1])
                            }
                        }
                    }
                } else if (msg.message.buttonsResponseMessage != null){
                    if (mesej.on == undefined && mesej.disable_cmd) {
                        if (mesej.name == commandh[0]) {
                            if (msg.key.fromMe === mesej.fromMe || mesej.fromMe === sudo.includes(get_numb)){
                                mesej.callb(startWA, all_func, alltext[1])
                            }
                        }
                    }
                }
            })

        })
    } else {
        console.log('please scan qr on repl.it !');
    };
};

mainWa();
