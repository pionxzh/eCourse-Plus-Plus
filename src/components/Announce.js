import axios from 'axios'
const config = require('./../config.json')

export default class Announce {
    static async getData (data) {
        let announce = await axios.get(config.ecourse.ANNOUNCE).catch(e => this.errHandler(e))
        let result = $($.parseHTML(announce.data, true)).filter('script:not([src])')[0].innerHTML
        try {
            let announceData = JSON.parse(result.substring(result.indexOf('js =') + 5, result.indexOf('//console') - 10))
            console.log('Announce:\n', announceData)
            return {stat: true, data: announceData}
        } catch (e) {
            console.log('Get Announce Fail!\n', e)
            return {stat: false, data: []}
        }
    }
}
