import axios from 'axios'
import Util from './Util'

const config = require('./../config.json')
let Decoder = new TextDecoder('big5')

export default class Score {
    static async getScore () {
        let score = await axios.get(config.ecourse.COURSE_SCORE, {responseType: 'arraybuffer'}).catch(e => Util.errHandler(e, 'Get Score Error'))
        let parser = new DOMParser()
        let dom = parser.parseFromString(Decoder.decode(score.data), 'text/html')
        let scoreNode = dom.querySelectorAll('tr[bgcolor="#4d6eb2"], tr[bgcolor="#E6FFFC"], tr[bgcolor="#F0FFEE"], tr[bgcolor="#B0BFC3"]')
        let result = {}
        let title = ''
        scoreNode.forEach(element => {
            let row = element.childNodes
            switch (element.getAttribute('bgcolor')) {
                case '#4d6eb2':
                    title = row[0].textContent.replace('(名稱)', '')
                    result[title] = []
                    break
                case '#B0BFC3':
                    if (result['總成績'] !== undefined) result['總成績'][0].score = `${row[1].textContent}分`
                    else result['總成績'] = [{ name: '總成績', rank: row[1].textContent }]
                    break
                default:
                    let score = row[2].textContent ? `${row[2].textContent}分` : '-'
                    let rank = row[3].textContent.replace('你沒有成績', '-')
                    let bits = rank.split('/')
                    let num = 1 - (bits[0] / bits[1])
                    let color = Util.hslToRgb(num * 1.2 / 3.6, 1, 0.5)
                    result[title].push({
                        name: row[0].textContent,
                        percentage: row[1].textContent,
                        score: score,
                        rank: rank,
                        color: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                    })
            }
        })
        // console.log(result)
        return result
    }

    static async getRoll () {
        let roll = await axios.get(config.ecourse.ROLL, {responseType: 'arraybuffer'}).catch(e => Util.errHandler(e, 'Get Roll Error'))
        let rollData = Decoder.decode(roll.data)
        let reg = /<TD\scolspan="2">([0-9/出缺席]*?)<\/TD>\s*?<TD\scolspan="2">([0-9/出缺席]*?)<\/TD>/g
        let result = []
        let temp
        do {
            temp = reg.exec(rollData)
            if (temp) result.push([temp[1], temp[2]])
        } while (temp)
        return result
    }
}
