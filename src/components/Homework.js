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
        let today = Util.getToday()
        this.homeworkFile = {}
        let queuePromise = []
        let oldHwFile = localStorage.homeworkFile ? JSON.parse(localStorage.homeworkFile) : {}
        for (let key in homeworkData) {
            let list = homeworkData[key].list
            this.homeworkFile[key] = {}
            for (let item of list) {
                if (!item.id) continue
                let cid = item.id
                /* 24小時檢查一次 過期的作業不予理會 減少request */
                let isSkip = !!oldHwFile[key] && !!oldHwFile[key][cid] && today > item.timeStamp && Date.now() < oldHwFile[key][cid].timeStamp + 36e5 * 24
                if (isSkip) this.homeworkFile[key][cid] = oldHwFile[key][cid]
                else queuePromise.push(this.getQuestion(key, cid))
            }
        }
        /* using Promise.all for parallel request */
        await Promise.all(queuePromise)

        console.log('HwFile:\n', this.homeworkFile)
        localStorage.homeworkFile = JSON.stringify(this.homeworkFile)
        return {stat: true, data: this.homeworkFile}
    }

    static async getQuestion (courseID, workID) {
        let question = await axios.get(config.ecourse.UNDER_DIR_FILE, {params: {
            action: 'Question',
            courseid: courseID,
            workid: workID
        }}).catch(e => Util.errHandler(e, 'Get Question Error!'))
        let result = { type: null, timeStamp: Date.now() }
        if (question.data.size) {
            result.type = question.data.type.slice(1)
        }
        this.homeworkFile[courseID][workID] = result
    }

    static async getAnswer (courseID, workID) {
        let answer = await axios.get(config.ecourse.UNDER_DIR_FILE, {params: {
            action: 'seemywork',
            courseid: courseID,
            workid: workID
        }}).catch(e => Util.errHandler(e, 'Get Answer Error!'))
        if (Array.isArray(answer.data)) {
            let result = []
            answer.data.pop()
            for (let item of answer.data) {
                result.push({
                    // id: Math.random() * 1000,
                    name: item[0],
                    size: Util.getSize(item[1]),
                    timeStamp: item[2]
                })
            }
            return result
        } else {
            return [{
                id: Math.random() * 1000,
                name: 'homework.html',
                size: '',
                timeStamp: answer.data.mtime
            }]
        }
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
        let temp = await axios.post(config.ecourse.SHOW_WORK, formData, {responseType: 'arraybuffer'})
        return Decoder.decode(temp.data).indexOf('成功') > -1
    }

    static async removeAnswer (courseID, workID, fileName) {
        await axios.get(config.ecourse.UNDER_DIR_FILE, {params: {
            action: 'delete',
            courseid: courseID,
            workid: workID,
            filename: fileName
        }})
    }
}
