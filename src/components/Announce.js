import axios from 'axios'
import Util from './Util'
const config = require('./../config.json')

export default class Announce {
    static async getData (data) {
        let announce = await axios.get(config.ecourse.ANNOUNCE).catch(e => Util.errHandler(e, 'Get Announce Error!'))
        let result = /var js\s=\s(.+)/.exec(announce.data)[1]
        try {
            let announceData = JSON.parse(result.slice(0, -1))
            console.log('Announce:\n', announceData)
            return {stat: true, data: announceData}
        } catch (e) {
            Util.errHandler(e, 'Parse Announce Fail!')
            return {stat: false, data: []}
        }
    }
}
