const {
    default: got
} = require('got')



got.post('http://elma.man2kotakediri.sch.id/login/do_login', {body: 'ajaran=2021&username=ss&password=s!', headers: {
        Accept: '*/*',
'Accept-Encoding': 'gzip, deflate',
'Accept-Language': 'en-US,en;q=0.5',
'Connection': 'keep-alive',
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
'Host': 'elma.man2kotakediri.sch.id',
'Origin': 'http://elma.man2kotakediri.sch.id',
'Referer': 'http://elma.man2kotakediri.sch.id/',
'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0',
    }
}).then((a) => {
    console.log(a.statusCode)
})