import axios from 'axios'
import Util from './Util'

const config = require('./../config.json')
let Decoder = new TextDecoder('big5')

export default class Score {
    static async getData (data) {
    }

    static async getScore (courseID) {
        let score = await axios.get(config.ecourse.COURSE_SCORE, {responseType: 'arraybuffer'}).catch(e => Util.errHandler(e))
        let scoreData = $.parseHTML(Decoder.decode(score.data))
        let scoreNode = $(scoreData).find('tr[bgcolor="#4d6eb2"], tr[bgcolor="#E6FFFC"], tr[bgcolor="#F0FFEE"], tr[bgcolor="B0BFC3"]').get()
        console.log('length: ', scoreNode.length)
        scoreNode.forEach(element => {
            let row = $(element).find('td')
            let scoreItem = {
                name: $(row[0]).text(),
                percent: $(row[1]).text(),
                score: $(row[2]).text(),
                rank: $(row[3]).text()
            }
            console.log(scoreItem)
        })
    }
}
