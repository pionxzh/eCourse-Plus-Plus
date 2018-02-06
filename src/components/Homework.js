import Qs from 'qs'
import axios from 'axios'
import Util from './Util'

let Decoder = new TextDecoder('big5')
const config = require('./../config.json')

export default class Homework {
    static async getData (data) {
        let homework = await axios.get(config.ecourse.HOMEWORK)
        .catch(e => Util.errHandler(e, 'Get Homework Error!'))
        let result = /var js\s=\s(.+)/.exec(homework.data)[1]
        try {
            let homeworkData = JSON.parse(result.slice(0, -1))
            console.log('Homework:\n', homeworkData)
            return {stat: true, data: homeworkData}
        } catch (e) {
            Util.errHandler(e, 'Parse Homework Fail!')
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
        let question = await axios.get(config.ecourse.UNDER_DIR_FILE, {params: {
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
        }
        return result
    }

    static async getAnswer (courseID, workID) {
        let question = await axios.get(config.ecourse.UNDER_DIR_FILE, {params: {
            action: 'seemywork',
            courseid: courseID,
            workid: workID
        }}).catch(e => Util.errHandler(e, 'Get Answer Error!'))
        let result = []
        if (Array.isArray(question.data)) {
            question.data.pop()
            for (let item of question.data) {
                result.push({
                    id: Math.random() * 1000,
                    name: item[0],
                    size: Util.getSize(item[1]),
                    timeStamp: item[2]
                })
            }
        } else {
            result[0] = {
                name: 'homework.html',
                size: '? bytes',
                content: question.data.work,
                timeStamp: question.data.mtime
            }
        }
        console.log(result)
        return result
    }

    static async removeAnswer (courseID, workID, fileName) {
        let result = await axios.get(config.ecourse.SHOW_WORK, {params: {
            action: 'del',
            work_id: workID,
            filename: fileName
        }})
        return result.data
    }

    static async uploadText (content, workID) {
        let data = Qs.stringify({
            ans: content,
            work_id: workID,
            action: 'handinwork'
        })
        let result = await axios.post(config.ecourse.SHOW_WORK, data, {responseType: 'arraybuffer'})
        return Decoder.decode(result.data).indexOf('成功') !== -1
    }

    static async uploadFile (files, multiple, courseID, workID) {
        let formData = new FormData()
        formData.append('work_id', workID)

        if (!multiple) {
            formData.append('action', 'uploadstuwork')
            formData.append('uploadfile1', files[0], files[0].name)
        } else {
            formData.append('action', 'uploadotherwork')
            for (let index = 0; index < files.length; index++) {
                const file = files[index]
                formData.append(`uploadfile${index}`, file)
            }
        }
        let result = await axios.post(config.ecourse.SHOW_WORK, formData, {responseType: 'arraybuffer'})
        return Decoder.decode(result.data).indexOf('成功') !== -1
    }
}
