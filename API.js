// const axios = require('axios');
// const md5 = require('md5');

// const host = "https://api.digiflazz.com/v1";
// const mkprod = "f8994208-7dd1-58eb-b67f-b322626088fd";
// const username = "degudioJbj6o";
// axios.post(host + '/price-list', {
//     cmd: "prepaid",
//     username: username,
//     sign: md5(username + mkprod + "pricelist")
// })
//     .then((response) => {
//         console.log(response.data);
//     }, (error) => {
//         console.log(error);
//     });

// ----------------------------------------------------------------------------------

var mysql = require('mysql');
var pool = mysql.createPool({
    host: "83.136.216.71",
    user: "u6042185_pakpulsapak",
    password: "AlexMintaPulsa5000!",
    database: "u6042185_pakpulsapak",
    port: 3306
});

// var con = mysql.createConnection({
//     host: "83.136.216.71",
//     user: "u6042185_pakpulsapak",
//     password: "AlexMintaPulsa5000!",
//     database: "u6042185_pakpulsapak",
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

var sql = `select * from wa_whitelist where phone = '628988888320'`
// con.query(sql, function (err, result) {
//     if (err) throw err;
//     if (result != '') {
//         console.log("Result: " + result);
//         result.map((item, index) => {
//             console.log("item: ", item);
//             // item.map((item2, index2) => {
//             //     console.log("item2: " + item2);
//             // })
//         })
//     } else {
//         console.log("Else");
//     }
// });
pool.getConnection(function (err, conn) {
    if (err) console.log("POOL ==> " + err);

    conn.query(sql, function (err, rows) {
        if (err) console.log(err);
        for (var i in rows) {
            console.log(rows[i]);
        }
        conn.release();
    });
});
pool.getConnection(function (err, conn) {
    if (err) console.log("POOL ==> " + err);

    conn.query(sql, function (err, rows) {
        if (err) console.log(err);
        for (var i in rows) {
            console.log(rows[i]);
        }
        conn.release();
    });
});
// con.end();