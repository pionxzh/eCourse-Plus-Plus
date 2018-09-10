import Qs from 'qs'
import sortBy from 'lodash/sortBy'
import axios from 'axios'
import Util from './Util'

const config = require('./../config.json')

export default class CourseTable {
    static async login () {
        let user = JSON.parse(localStorage.user)
        let data = Qs.stringify({ id: user.id, password: user.pass })
        let result = await axios.post(config.kiki.LOGIN, data).catch(e => { Util.errHandler(e, 'Kiki login Error') })
        this.session = /session_id=([\w\d]+)/.exec(result.request.responseURL)[1]
    }

    static async getData (year, term) {
        const temp = await axios.get(config.kiki.TABLE, {params: {year: year, term: term, session_id: this.session}})
        .catch(e => { Util.errHandler(e, 'Kiki getData Error') })
        if (temp.data.indexOf('暫時關閉') > -1) return false

        const parser = new DOMParser()
        const dom = parser.parseFromString(temp.data, 'text/html')

        const firstCol = dom.querySelector('table:nth-child(6) > tbody > tr:nth-child(1) > th:nth-child(1) > font').textContent
        const offset = firstCol === '篩選狀態' ? 1 : 0

        let node = [...dom.querySelectorAll('table:nth-child(6) > tbody > tr:not(:nth-child(1)) > th')]
        node = node.map(item => item.textContent)
        let table = [[], [], [], [], []]
        for (let i = 0; i < node.length; i += (9 + offset)) {
            /* 一8,9 、二C 四C、三E,F => replace all white space and comma */
            let arr = node[i + 6 + offset].replace(/\s/g, '').match(/[^\w^,]+|[\w,]+/ig)
            let date = arr.filter((val, index) => !(index % 2))
            let time = arr.filter((val, index) => index % 2)
            time = time.map(item => {
                item = item.split(',')
                if (/[a-zA-Z]/.test(item[0])) {
                    /* 435 = 7:15  510 = 8:30 */
                    let start = 435 + (item[0].toLowerCase().charCodeAt(0) - 97) * 90
                    let end = 510 + (item[item.length - 1].toLowerCase().charCodeAt(0) - 97) * 90
                    return Util.getFormatTime(start, end)
                } else {
                    /* 430 = 7:10 480 = 8:00 */
                    let start = 370 + parseInt(item[0]) * 60
                    let end = 420 + parseInt(item[item.length - 1]) * 60
                    return Util.getFormatTime(start, end)
                }
            })
            date.forEach((item, index) => {
                let day = '一二三四五'.indexOf(item)
                if (index < 0) return
                table[day].push({
                    id: node[i + offset + 0],
                    name: node[i + offset + 2],
                    professor: node[i + offset + 3],
                    required: node[i + offset + 5],
                    start: time[index][0],
                    end: time[index][1],
                    time: time[index][2],
                    location: node[i + offset + 7]
                })
            })
        }
        table = table.map(item => sortBy(item, ['start']))
        table.map(day => {
            day.forEach((item, index) => {
                if (index === 0) day[0].distance = item.start - 430
                else day[index].distance = item.start - day[index - 1].end + day[index - 1].distance - 10
            })
            return day
        })
        // console.log(table)
        localStorage.courseTable = JSON.stringify(table)
        return table
        // await axios.get(config.kiki.LOGOUT, {params: {session_id: this.session}})
    }
}
