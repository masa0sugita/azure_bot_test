// app.js 
let express = require('express');
let Twitter = require('twitter');
let CronJob = require("cron").CronJob;

let app = express();
let mysql = require('mysql');

let connectionString = process.env.MYSQLCONNSTR_localdb;
let host = /Data Source=([0-9\.]+)\:[0-9]+\;/g.exec(connectionString)[1];
let port = /Data Source=[0-9\.]+\:([0-9]+)\;/g.exec(connectionString)[1];
let database = /Database=([0-9a-zA-Z]+)\;/g.exec(connectionString)[1];
let username = /User Id=([a-zA-z0-9\s]+)\;/g.exec(connectionString)[1];
let password = /Password=(.*)/g.exec(connectionString)[1];

let connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'azure_bot_test',
    // password: 'azure_bot_test',
    // database: 'azure_bot_test'
    host: host,
    port: port,
    user: username,
    password: password,
    database: database
});

let twitter = new Twitter({
    consumer_key: process.env['CONSUMER_KEY'],
    consumer_secret: process.env['CONSUMER_SECRET'],
    access_token_key: process.env['ACCESS_TOKEN_KEY'],
    access_token_secret: process.env['ACCESS_TOKEN_SECRET']
});

let cronTime = '0,30 * * * * *';
new CronJob({
    cronTime: cronTime,
    onTick: function () {
        cycleTweet()
    },
    start: true
});

let tips = {};
function cycleTweet() {
    // let tips = tipsArray[Math.floor(Math.random() * tipsArray.length)];
    connection.query('select tips from tips order by rand() limit 1', function (err, rows) {
        if (err) {
            return console.log(err);
        } else {
            tips = {
                'value': rows[0]['tips']
            };

            //自動投稿 
            twitter.post('statuses/update', {status: tips}, (err, tweet, response) => {
                if (err) {
                    return console.log(err);
                } else {
                    return console.log(tweet);
                }
            });
        }
    }).on('end', () => {
        console.log(`DBから取得した値：${tips.value}`);
    });
}



app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.send('Hello World')
});
app.get('/bye', function (req, res) {
    res.send('さよなら');
});

app.get('/mysql', function (req, res) {
    connection.query('select * from tips', function (error, results, fields) {
        if (error) throw error;
        res.send(results[0].tips);
    });
});

app.listen(app.get('port'), function () {
    console.log("Node app is runnning at localhost:" + app.get('port'))
});



