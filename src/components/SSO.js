import Qs from 'qs'
import Util from './Util'
import axios from 'axios'
const config = require('./../config.json')

export default class SSO {
    static async login (data) {
        let result = {}
        await axios.post(config.sso.login, Qs.stringify(data))
        .then(response => {
            if (response.data.indexOf('LOGIN_001') !== -1) {
                result.authcode = false
                result.message = '登入失敗: 帳號密碼錯誤'
            }
            if (response.data.indexOf('LOGIN_002') !== -1) {
                result.authcode = true
                result.message = '登入失敗: 驗證碼錯誤'
            }
        })
        .catch(e => Util.errHandler(e, 'SSO Login Error!'))

        return result
    }

    static async logout () {
        let result = {}
        await axios.get(config.sso.logout)
        .then(response => {})
        .catch(e => {
            if (e.message === 'Network Error') {
                result.stat = true
                result.loggedIn = false
                result.message = '登出成功'
                return result
            }
            Util.errHandler(e, 'SSO Logout Error!')
            result.stat = false
            return result
        })
    }
}
