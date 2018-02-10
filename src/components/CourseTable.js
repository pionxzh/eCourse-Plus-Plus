import Qs from 'qs'
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

    static async getData () {
        let temp = await axios.get(config.kiki.TABLE, {params: {year: '106', term: 1, session_id: this.session}})
        .catch(e => { Util.errHandler(e, 'Kiki getData Error') })
        let parser = new DOMParser()
        let dom = parser.parseFromString(temp.data, 'text/html')
        let node = [...dom.querySelectorAll('table:nth-child(6) > tbody > tr:not(:nth-child(1)) > th')]
        node = node.map(item => item.textContent)
        let table = []
        for (let i = 0; i < node.length; i += 10) {
            table.push({
                id: node[i + 1],
                name: node[i + 3],
                professor: node[i + 4],
                required: node[i + 6],
                time: node[i + 7],
                location: node[i + 8]
            })
        }
        console.log(table)
        return table
        // await axios.get(config.kiki.LOGOUT, {params: {session_id: this.session}})
    }
}
