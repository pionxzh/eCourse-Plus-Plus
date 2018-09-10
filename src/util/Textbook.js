import axios from 'axios'
import Util from './Util'
const config = require('./../config.json')

export default class Textbook {
    static async getData (data) {
        let textbook = await axios.get(config.ecourse.TEXTBOOK).catch(e => Util.errHandler(e, 'Get Textbook Error!'))
        try {
            if (textbook.data.indexOf('沒有修課') > -1) return {stat: true, data: {textbook: [], chapter: []}}
            let result1 = /var Textbook\s=\s(.+)/.exec(textbook.data)[1]
            let result2 = /var ChapTitle\s=\s(.+)/.exec(textbook.data)[1]
            const textbookData = JSON.parse(result1.slice(0, -1))
            const chapterTitle = JSON.parse(result2.slice(0, -1))
            console.log('Textbook:\n', textbookData)
            // console.log('ChapterTitle:\n', chapterTitle)

            return {stat: true, data: {textbook: textbookData, chapter: chapterTitle}}
        } catch (e) {
            Util.errHandler(e, 'Parse Textbook Fail!')
            return {stat: false, data: {textbook: [], chapter: []}}
        }
    }
}
