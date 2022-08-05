const exec = require('child_process').exec

function isRunning(win, mac, linux){
    return new Promise(function(resolve, reject){
        const plat = process.platform
        const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
        const proc = plat == 'win32' ? win : (plat == 'darwin' ? mac : (plat == 'linux' ? linux : ''))
        if(cmd === '' || proc === ''){
            resolve(false)
        }
        exec(cmd, function(err, stdout, stderr) {
            if (plat == 'win32') {
                resolve(stdout.toLowerCase().indexOf(proc.toLowerCase()) > -1)
            } else if  (plat == 'darwin') {
                resolve(stdout.length > 0)
            }
        })
    })
}

module.exports = { isRunning }
