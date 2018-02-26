import axios from 'axios'
import Util from './Util'
const config = require('./../config.json')
let Decoder = new TextDecoder('big5')

export default class Course {
    static getList (data) {
        try {
            let reg = /login_s\.php\?courseid=[0-9]+_[0-9]+_([0-9]+)" target="_top">([\u4e00-\u9fa5 a-zA-Z0-9\s()（：）]+)<\/a>.+?;">([\u4e00-\u9fa5]+)<\/a>/g
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
        /* prevent the repeat of sending request */
        if (courseID === this.previous) return false
        this.previous = courseID

        let temp = await axios.get(config.ecourse.COURSE_SELECT, {responseType: 'arraybuffer', params: {courseid: `106_2_${courseID}`}})
        .catch(e => Util.errHandler)
        return Decoder.decode(temp.data).indexOf('權限錯誤') === -1
    }
}
