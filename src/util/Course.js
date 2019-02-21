import axios from 'axios'
import Util from './Util'
const config = require('./../config.json')
let Decoder = new TextDecoder('big5')

export default class Course {
    static getList (data) {
        try {
            const reg = /login_s\.php\?courseid=[0-9]+_[0-9]+_([0-9]+)" target="_top">(.+?)<\/a>.+?;">([\u4e00-\u9fa5]+)<\/a>/g
            let matches = reg.exec(data)
            let courseList = []
            while (matches) {
                courseList.push({
                    id: matches[1],
                    name: matches[2],
                    professor: matches[3]
                })
                matches = reg.exec(data)
            }
            console.log('CourseList:\n', courseList)
            return {stat: true, data: courseList}
        } catch (e) {
            Util.errHandler(e, 'Parse Course Fail!')
            return {stat: false, data: localStorage.courseList ? JSON.parse(localStorage.courseList) : []}
        }
    }

    static async changeCourse (courseID) {
        let now = new Date()
        let year = now.toISOString().split('T')[0].split('-')[0]
        let term = 1

        // 暫定2/1日 7/1為寒暑假分界點
        // JS月份由0開始 這很工程師
        const winterVacation = new Date(year, 1, 1)
        const summerVacation = new Date(year, 6, 1)

        year = year - 1911
        if (now > winterVacation && now < summerVacation) {
            year = year - 1
            term = 2
        } else if (now <= winterVacation) {
            year = year - 1
        }

        /* prevent the repeat of sending request */
        if (courseID === this.previousID) return false
        this.previousID = courseID

        let temp = await axios.get(config.ecourse.COURSE_SELECT, {responseType: 'arraybuffer', params: {courseid: `${year}_${term}_${courseID}`}})
        .catch(e => Util.errHandler)
        return Decoder.decode(temp.data).indexOf('權限錯誤') === -1
    }
}
