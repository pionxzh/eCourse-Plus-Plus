import axios from 'axios'
import Util from './Util'
import orderBy from 'lodash/orderBy'
const config = require('./../config.json')

export default class Announce {
    static async getData (data) {
        let announce = await axios.get(config.ecourse.ANNOUNCE).catch(e => Util.errHandler(e, 'Get Announce Error!'))
        try {
            let result = /var js\s=\s(.+)/.exec(announce.data)[1]
            let announceData = JSON.parse(result.slice(0, -1))
            console.log('Announce:\n', announceData)
            return {stat: true, data: this.parseData(announceData)}
        } catch (e) {
            Util.errHandler(e, 'Parse Announce Fail!')
            /* Prevent 'Parse Fail' clear the content */
            return {stat: false, data: []}
        }
    }

    static parseData (announce) {
        let now = new Date()
        let announceNotify = localStorage.annNotify ? JSON.parse(localStorage.annNotify) : {}
        let template = announce.map(item => item[0], [])
        let announceData = announce.reduce((result, item) => {
            let courseID = item[0]
            if (!announceNotify[courseID]) announceNotify[courseID] = {}
            item[2] = item[2] || []
            result[courseID] = {}
            result[courseID].name = item[1]
            result[courseID].list = !item[2].length ? [{title: '暫無公告'}] : item[2].reduce((temp, nItem) => {
                let key = nItem[0]
                /* Decide isNew by is time's difference less than 7 days */
                // change to 14 days for testing, remember to change it back
                if (announceNotify[courseID][key] === undefined) {
                    announceNotify[courseID][key] = Math.abs(now - new Date(nItem[2])) < 8.64e7 * 14
                }
                temp.push({
                    id: key,
                    title: nItem[8],
                    content: nItem[9] || '沒有內容',
                    timeStamp: nItem[2]
                })
                return orderBy(temp, ['timeStamp', 'title'], ['desc', 'asc'])
            }, [])
            return result
        }, {})
        return [template, announceData, announceNotify]
    }
}
