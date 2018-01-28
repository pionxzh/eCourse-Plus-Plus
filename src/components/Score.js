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
        let scoreNode = $(scoreData).find('tr[bgcolor="#4d6eb2"], tr[bgcolor="#E6FFFC"], tr[bgcolor="#F0FFEE"], tr[bgcolor="#B0BFC3"]').get()
        let result = {}
        let title = ''
        scoreNode.forEach(element => {
            let row = $(element).children()
            switch ($(element).attr('bgcolor')) {
                case '#4d6eb2':
                    title = $(row[0]).text().replace('(名稱)', '')
                    result[title] = []
                    break
                case '#B0BFC3':
                    if (result['總成績'] !== undefined) result['總成績'][0].score = `${$(row[1]).text()}分`
                    else result['總成績'] = [{ name: '總成績', rank: $(row[1]).text() }]
                    break
                default:
                    let score = $(row[2]).text() ? `${$(row[2]).text()}分` : '-'
                    let rank = $(row[3]).text().replace('你沒有成績', '-')
                    result[title].push({
                        name: $(row[0]).text(),
                        percentage: $(row[1]).text(),
                        score: score,
                        rank: rank
                    })
            }
        })
        // console.log(result)
        return result
    }
}
