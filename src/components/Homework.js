import axios from 'axios'
import Util from './Util'
const config = require('./../config.json')

export default class Homework {
    static async getData (data) {
        let homework = await axios.get(config.ecourse.HOMEWORK)
        .catch(e => Util.errHandler(e, 'Get Homework Error'))
        let result = $($.parseHTML(homework.data, true)).filter('script:not([src])')[0].innerHTML
        try {
            let homeworkData = JSON.parse(result.substring(result.indexOf('js =') + 5, result.indexOf('function') - 7))
            console.log('Homework:\n', homeworkData)
            return {stat: true, data: homeworkData}
        } catch (e) {
            console.log('Get Homework Fail!\n', e)
            return {stat: false, data: []}
        }
    }

    static async getQuestion (courseId, workId) {
        let question = await axios.get(`${config.ecourse.GET_FILE}?action=Question&courseid=${courseId}&workid=${workId}`)
        .catch(e => Util.errHandler(e, 'Get Question Error!'))
        let result = {}
        if (question.data.size && !question.data.status) {
            result.name = 'Question.pdf'
            result.size = question.data.size
            result.type = question.data.type.slice(1)
            // result.word = question.data.word || '暫無內容'
            console.log(question.data, result)
            return result
        }
        return null
    }

    static uploadFile () {}
}
