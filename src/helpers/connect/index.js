var mysql = require('mysql');

class Connection {
    constructor() {
        this.connection = mysql.createPool({
            host: "45.143.81.87",
            user: "u1085401_u6042185_pakpulsapak",
            password: "u1085401_u6042185_pakpulsapak",
            database: "u1085401_botwa",
            port: 3306
        });

        // this.connection.connect(function (err) {
        //     if (err) throw err;
        // });
    }

    query = async (sql) => {
        return new Promise((resolve, reject) => {
            //  // cara 1
            // this.connection.query(sql, function (err, rs) {
            //     if (err) {
            //         reject(Error("Promise Reject :", err));
            //     }
            //     if (rs) {
            //         rs.map((item, index) => {
            //             // console.log("item: ", item);
            //         });
            //         resolve({ error: err, result: rs });
            //     }
            // })
            // this.connection.destroy();

            //  // cara 2
            this.connection.getConnection(function (err, conn) {
                if (err) console.error("POOL Error ==> " + err);
                conn.query(sql, function (err, rows) {
                    if (err) reject(Error("Promise Reject :", err));

                    // for (var i in rows) {
                    //     console.log(rows[i]);
                    // }
                    resolve({ error: err, result: rows });

                    conn.release();
                });
            });
        });
    }


}
module.exports = Connection;