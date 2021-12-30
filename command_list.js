const config = require('./config')
const all_command = []

function add_command(info, cb) {
    var arguments = {
        onlyGc: info.onlyGc == undefined ? false : true,
        onlyPm: info.onlyPm == undefined ? false : true,
        hint: info.hint == undefined ? 'Tidak Ada Petunjuk!' : info.hint,
        desc: info.desc == undefined ? 'Tidak Ada Deskripsi' : info.desc,
        hide_cmd: info.hide_cmd == undefined ? false : true,
        disable_cmd: info.disable_cmd == undefined ? false : true,
        name: info.name == undefined ? null : info.name.replace(/[^a-zA-Z0-9]/g, ''),
        prefix: info.cust_prefix == undefined ? config.PREFIX : info.prefix,
        callb : cb,
        fromMe: info.fromMe == undefined ? false : true
    };

    if (info.name == null) {
        delete arguments.name;
        arguments['on'] = info.on;
        arguments.hide_cmd = true
    } else if (info.name != null){
        arguments['command'] = arguments.prefix+arguments.name;
        
    }

    all_command.push(arguments);
    return arguments
}

module.exports = {
    addCmd: add_command,
    Allcmd: all_command
}