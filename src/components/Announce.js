import axios from 'axios'
import Util from './Util'
const config = require('./../config.json')

export default class Announce {
    static async getData (data) {
        let announce = await axios.get(config.ecourse.ANNOUNCE).catch(e => Util.errHandler(e, 'Get Announce Error!'))
        let result = $($.parseHTML(announce.data, true)).filter('script:not([src])')[0].innerHTML
        try {
            let announceData = JSON.parse(result.substring(result.indexOf('js =') + 5, result.indexOf('//console') - 10))
            console.log('Announce:\n', announceData)
            return {stat: true, data: announceData}
        } catch (e) {
            Util.errHandler(e, 'Parse Announce Fail!')
            return {stat: false, data: []}
        }
    }
}
