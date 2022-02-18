const axios = require('axios');
const SendChat = require('../../components/sendChat');
const md5 = require('md5');


const host = "https://api.digiflazz.com/v1";
const username = "degudioJbj6o";
let mk = "";

class Api {
    constructor({ client, message, type = 'dev' }) {
        this.sendChat = new SendChat({ client, message });
        if (type.toUpperCase() == 'DEV') {
            mk = "dev-1c366fb0-1c3c-11ec-ac95-dd99fbb66582";
        } if (type.toUpperCase() == 'LIVE') {
            mk = "f8994208-7dd1-58eb-b67f-b322626088fd";
        }
    }

    pricelist = async () => {
        return new Promise((resolve, reject) => {
            axios.post(host + '/price-list', {
                cmd: "prepaid",
                username: username,
                sign: md5(username + mk + "pricelist")
            })
                .then((response) => {
                    resolve({ error: [], result: response.data });
                }, (error) => {
                    console.log('Error Promise Reject Api@pricelist : ', error);
                    reject(Error("Promise Reject :", error));
                });
        })
    }

    // topup (pulsa,dll)
    topup = async ({ skuCode, customerNo, refId, testing = true }) => {
        if (customerNo.startsWith("+62")) {
            customerNo = customerNo.toString().replace("+62", "0")
        }
        if (customerNo.startsWith("62")) {
            customerNo = customerNo.toString().replace("62", "0")
        }
        if (refId == '' || refId == undefined || refId == null) {
            const d = new Date();
            refId = skuCode + '__' + customerNo + '__' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '__' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ':' + d.getMilliseconds();
        }

        const params = {
            username: username,
            buyer_sku_code: skuCode,
            customer_no: customerNo,
            ref_id: refId,
            testing: testing,
            sign: md5(username + mk + refId)
        }
        console.log('param', params)

        return new Promise((resolve, reject) => {
            axios.post(host + '/transaction', params)
                .then((response) => {
                    console.log('API response', response);
                    resolve({ error: [], result: response.data });
                }, (error) => {
                    // console.error('Error Api@topup: ', error.response.data); //return object error
                    this.sendChat.rejectHandler('Api@topup', { adminText: error.response.data.data.message })
                    reject(Error("Promise Reject :", error.response.data));
                });
        });
    }

    payPasca = async ({ skuCode, customerNo, refId, testing = true }) => {
        if (refId == '' || refId == undefined || refId == null) {
            const d = new Date();
            refId = skuCode + '__' + customerNo + '__' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '__' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ':' + d.getMilliseconds();
        }

        console.log('param', {
            commands: "pay-pasca",
            username: username,
            buyer_sku_code: skuCode,
            customer_no: customerNo,
            ref_id: refId,
            testing: testing,
            sign_string: (username + mk + refId),
            sign: md5(username + mk + refId)
        })

        return new Promise((resolve, reject) => {
            axios.post(host + '/transaction', {
                commands: "pay-pasca",
                username: username,
                buyer_sku_code: skuCode,
                customer_no: customerNo,
                ref_id: refId,
                testing: testing,
                sign: md5(username + mk + refId)
            })
                .then((response) => {
                    console.log('API response', response);
                    resolve({ error: [], result: response.data });
                }, (error) => {
                    console.error('Error Api@payPasca: ', error.response.data); //return object error
                    reject(Error("Promise Reject :", error.response.data));
                });
        });
        // return new Promise((resolve, reject) => {
        //     resolve({
        //         error: [], result: {
        //             "data": {
        //                 "ref_id": refId,
        //                 "customer_no": customerNo,
        //                 "customer_name": "Nama Pelanggan Pertama",
        //                 "buyer_sku_code": "hp",
        //                 "admin": 2500,
        //                 "message": "Transaksi Sukses",
        //                 "status": "Sukses",
        //                 "rc": "00",
        //                 "sn": "H1234554321P",
        //                 "buyer_last_saldo": 89000,
        //                 "price": 11000,
        //                 "selling_price": 12500,
        //                 "desc": {
        //                     "lembar_tagihan": 1,
        //                 }
        //             }
        //         }
        //     });
        // });
    }
}
module.exports = Api;