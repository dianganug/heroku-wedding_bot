class Setting {
    constructor() {
        this.isTesting = true;
        // this.adminNumber = '628988888640@c.us';
        this.adminNumber = '6289667668888@c.us';
    }

    setTesting = async (value) => {
        this.isTesting = value;
    }

    getTesting = () => {
        return this.isTesting;
    }

    getAdminNumber = () => {
        return this.adminNumber;
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
module.exports = Setting;