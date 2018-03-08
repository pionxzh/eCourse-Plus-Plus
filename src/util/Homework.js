import Qs from 'qs'
import axios from 'axios'
import Util from './Util'
import orderBy from 'lodash/orderBy'

let Decoder = new TextDecoder('big5')
const config = require('./../config.json')

export default class Homework {
    static async getData (data) {
        let homework = await axios.get(config.ecourse.HOMEWORK)
        .catch(e => Util.errHandler(e, 'Get Homework Error!'))
        try {
            if (homework.data.indexOf('沒有修課') > -1) return {stat: true, data: [[], [], []]}
            let result = /var js\s=\s(.+)/.exec(homework.data)[1]
            let homeworkData = JSON.parse(result.slice(0, -1))
            console.log('Homework:\n', homeworkData)
            return {stat: true, data: this.parseData(homeworkData)}
        } catch (e) {
            Util.errHandler(e, 'Parse Homework Fail!')
            return {stat: false, data: [[], [], []]}
        }
    }

    static parseData (homework) {
        let notice = []
        let now = new Date()
        let hwNotify = localStorage.hwNotify ? JSON.parse(localStorage.hwNotify) : {}
        let homeworkData = homework.reduce((result, item) => {
            let courseID = item[0]
            if (!hwNotify[courseID]) hwNotify[courseID] = {}
            result[courseID] = {}
            result[courseID].name = item[1]
            result[courseID].list = item[2] === null ? [{title: '暫無作業'}] : item[2].reduce((temp, nItem) => {
                let key = nItem[1]
                if (hwNotify[courseID][key] === undefined) {
                    let isNew = Math.abs(now - new Date(nItem[3])) < 8.64e7 * 5
                    hwNotify[courseID][key] = isNew
                    if (isNew) {
                        let abbr = item[1].split(/[^A-Za-z]/)[0].substring(0, 4) || item[1].substring(0, 2)
                        notice.push({
                            // 2: 作業
                            type: 2,
                            id: key,
                            abbr: abbr,
                            title: nItem[0],
                            course: item[1],
                            courseID: courseID,
                            timeStamp: nItem[3]
                        })
                    }
                }
                temp.push({
                    id: nItem[1],
                    title: nItem[0],
                    content: nItem[4] || '沒有內容',
                    percentage: nItem[2],
                    timeStamp: nItem[3]
                })
                return orderBy(temp, ['timeStamp', 'title'], ['desc', 'asc'])
            }, [])
            return result
        }, {})
        return [homeworkData, hwNotify, notice]
    }

    static async getAllQuestion (homeworkData) {
        let now = Date.now()
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
                let isSkip = !!oldHwFile[key] && !!oldHwFile[key][cid] && (today > item.timeStamp || now < oldHwFile[key][cid].timeStamp + 8.64e7)
                if (isSkip) this.homeworkFile[key][cid] = oldHwFile[key][cid]
                else queuePromise.push(this.getQuestion(key, cid, now))
            }
        }
        /* using Promise.all for parallel request */
        await Promise.all(queuePromise)

        // console.log('HwFile:\n', this.homeworkFile)
        localStorage.homeworkFile = JSON.stringify(this.homeworkFile)
        return {stat: true, data: this.homeworkFile}
    }

    static async getQuestion (courseID, workID, now) {
        let question = await axios.get(config.ecourse.UNDER_DIR_FILE, {params: {
            action: 'Question',
            courseid: courseID,
            workid: workID
        }}).catch(e => Util.errHandler(e, 'Get Question Error!'))
        let result = { type: null, timeStamp: now }
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
                    name: item[0],
                    size: Util.getSize(item[1]),
                    timeStamp: item[2]
                })
            }
            return result
        } else {
            if (!answer.data.work) return []
            return [{
                id: Math.random() * 1000,
                name: 'homework.html',
                fName: '文字答案',
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
        return Decoder.decode(result.data).indexOf('完成繳交作業') > -1
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
