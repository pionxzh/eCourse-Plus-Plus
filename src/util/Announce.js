import axios from 'axios'
import Util from './Util'
import orderBy from 'lodash/orderBy'
const config = require('./../config.json')

export default class Announce {
    static async getData (data) {
        let announce = await axios.get(config.ecourse.ANNOUNCE).catch(e => Util.errHandler(e, 'Get Announce Error!'))
        try {
            if (announce.data.indexOf('沒有修課') > -1) return {stat: true, data: [[], [], [], []]}
            let result = /var js\s=\s(.+)/.exec(announce.data)[1]
            let announceData = JSON.parse(result.slice(0, -1))
            console.log('Announce:\n', announceData)
            return {stat: true, data: this.parseData(announceData)}
        } catch (e) {
            Util.errHandler(e, 'Parse Announce Fail!')
            /* Prevent 'Parse Fail' clear the content */
            return {stat: false, data: [[], [], [], []]}
        }
    }

    static parseData (announce) {
        let now = new Date()
        let notice = localStorage.notify ? JSON.parse(localStorage.notify) : []
        let announceNotify = localStorage.annNotify ? JSON.parse(localStorage.annNotify) : {}
        let template = announce.map(item => item[0], [])
        let announceData = announce.reduce((result, item) => {
            let courseID = item[0]
            let courseName = item[1]
            if (!announceNotify[courseID]) announceNotify[courseID] = {}
            item[2] = item[2] || []
            result[courseID] = !item[2].length ? [{title: '暫無公告'}] : item[2].reduce((temp, nItem) => {
                let key = nItem[0]
                /* time difference less than 5 days => New */
                if (announceNotify[courseID][key] === undefined) {
                    let isNew = Math.abs(now - new Date(nItem[2])) < 8.64e7 * 4
                    announceNotify[courseID][key] = isNew
                    if (isNew) {
                        let abbr = courseName.split(/[^A-Za-z]/)[0].substring(0, 4) || courseName.substring(0, 2)
                        notice.push({
                            // 1: 公告
                            type: 1,
                            id: key,
                            abbr: abbr,
                            title: nItem[8],
                            course: courseName,
                            courseID: courseID,
                            timeStamp: nItem[2]
                        })
                    }
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
        return [template, announceData, announceNotify, notice]
    }
}
