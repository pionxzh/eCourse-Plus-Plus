import axios from 'axios'
import Util from './Util'
const config = require('./../config.json')

export default class Homework {
    static async getData (data) {
        let homework = await axios.get(config.ecourse.HOMEWORK)
        .catch(e => Util.errHandler(e, 'Get Homework Error!'))
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

    static async getAllQuestion (homeworkData) {
        let homeworkFile = {}
        let oldHwFile = localStorage.homeworkFile ? JSON.parse(localStorage.homeworkFile) : {}
        for (let key in homeworkData) {
            let list = homeworkData[key].list
            homeworkFile[key] = {}
            for (let item of list) {
                if (!item.id) continue
                let cid = item.id
                let isSkip = !!oldHwFile[key] && !!oldHwFile[key][cid] && Date.now() < oldHwFile[key][cid].timeStamp + 1000 * 60 * 60 * 24
                homeworkFile[key][cid] = isSkip ? oldHwFile[key][cid] : await this.getQuestion(key, cid)
            }
        }
        console.log('HwFile:\n', homeworkFile)
        localStorage.homeworkFile = JSON.stringify(homeworkFile)
        return {stat: true, data: homeworkFile}
    }

    static async getQuestion (courseID, workID) {
        let question = await axios.get(config.ecourse.GET_FILE, {params: {
            action: 'Question',
            courseid: courseID,
            workid: workID
        }}).catch(e => Util.errHandler(e, 'Get Question Error!'))
        let result = {
            type: null,
            timeStamp: Date.now()
        }
        if (question.data.size && !question.data.status) {
            result.type = question.data.type.slice(1)
            // result.size = question.data.size
            // result.word = question.data.word || '暫無內容'
        }
        // console.log(result)
        return result
    }

    static async getMyAnswer (courseID, workID) {
        let question = await axios.get(config.ecourse.GET_FILE, {params: {
            action: 'seemywork',
            courseid: courseID,
            workid: workID
        }}).catch(e => Util.errHandler(e, 'Get Question Error!'))
        let result = {
            type: null,
            timeStamp: Date.now()
        }
        if (question.data.size && !question.data.status) {
            result.type = question.data.type.slice(1)
                // result.size = question.data.size
            // result.word = question.data.word || '暫無內容'
        }
        // console.log(result)
        return result
    }

    static removeAnswer (courseID, workID, fileName) {
        axios.post(config.ecourse.ASSIGNMENT, {params: {
            action: 'delete',
            courseid: courseID,
            workid: workID,
            filename: fileName
        }})
    }

    static uploadFile (e, courseID, workID) {
        const files = e.target.files || e.dataTransfer.files
        console.log(files)
        let data = new FormData()
        data.append('work_id', workID)
        if (!files.length) return
        if (files.length === 1) {
            data.append('action', 'uploadstuwork')
            data.append('uploadfile1', files[0], files[0].name)
        } else {
            data.append('action', 'uploadotherwork')
            for (let index = 0; index < files.length; index++) {
                const file = files[index]
                data.append(`uploadfile${index}`, file)
            }
        }
        // axios.get(config.ecourse.ASSIGNMENT, {params: {action: 'seemywork', work_id: workID}})
        axios.post(config.ecourse.ASSIGNMENT, data).then(response => {
            let result = this.getMyAnswer(courseID, workID)
            console.log(result)
            return {stat: true}
        })
        return {stat: false}
    }

    static async uploadMultipleFile (e, courseID, workID) {}
}
