import axios from 'axios'
const config = require('./../config.json')

export default class Textbook {
    static async getData (data) {
        let textbook = await axios.get(config.ecourse.TEXTBOOK).catch(e => this.errHandler(e))
        let result = $($.parseHTML(textbook.data, true)).filter('script:not([src])')[0].innerHTML
        try {
            let textbookData = JSON.parse(result.substring(result.indexOf('Textbook') + 11, result.indexOf('CourseName') - 8))
            console.log('Textbook:\n', textbookData)

            let chapterTitle = JSON.parse(result.substring(result.indexOf('ChapTitle') + 11, result.indexOf('$(CourseName)') - 4))
            console.log('ChapterTitle:\n', chapterTitle)
            return {stat: true, data: {textbook: textbookData, chapter: chapterTitle}}
        } catch (e) {
            console.log('Get Textbook Fail!\n', e)
            return {stat: false, data: []}
        }
    }
}
