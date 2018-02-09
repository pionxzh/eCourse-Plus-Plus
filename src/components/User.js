import Qs from 'qs'
import axios from 'axios'
import Util from './Util'
const config = require('./../config.json')
let Decoder = new TextDecoder('big5')

export default class User {
    static async getIndex () {
        let index = await axios.get(config.ecourse.INDEX, {responseType: 'arraybuffer'}).catch(e => Util.errHandler(e, 'Get MainPage Error!'))
        let result = Decoder.decode(index.data)
        return result
    }

    static getData (data) {
        let result = { name: '匿名用戶', classes: '抓取資料', studentId: '', department: '錯誤' }
        try {
            let reg = /：([\u4e00-\u9fa5 a-zA-Z0-9\s()]+).{15}：([0-9]+).{15}：([\u4e00-\u9fa5/a-zA-Z0-9]+).{15}：([a-zA-Z0-9]+)/
            let temp = [...(reg.exec(data))]
            result.name = temp[1]
            result.classes = temp[4]
            result.studentId = temp[2]
            result.department = temp[3]
            return result
        } catch (e) {
            Util.errHandler(e, 'Parse User Fail!')
            return result
        }
    }

    static async login (data) {
        let result = {}
        let wrongFlag = false
        data = Qs.stringify(data)
        /* finding way to figure out the CORS error... */
        await axios.post(config.ecourse.LOGIN, data)
        .then(response => { wrongFlag = true })
        .catch(e => { result.stat = this.crossHandler(e) })

        await axios.post(config.ecourse.MOBILE, data)
        .then(response => { wrongFlag = true })
        .catch(e => { result.stat = this.crossHandler(e) })

        if (wrongFlag) {
            result.stat = false
            result.message = '登入失敗: 帳號密碼錯誤'
        }

        return result
    }
    static async logout () {
        await axios.get(config.ecourse.LOGOUT).catch(e => Util.errHandler(e, 'Logout Error!'))
    }

    static async ping () {
        await axios.get(config.ecourse.PING).catch(e => Util.errHandler(e, 'Ping Error!'))
    }

    static crossHandler (e) {
        if (e.message !== 'Network Error') {
            Util.errHandler(e, 'Login Error!')
            return false
        }
        return true
    }
}
