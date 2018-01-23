// import axios from 'axios'
// const config = require('../../config.json')
// let Decoder = new TextDecoder('big5')

export default class User {
    static getList (data) {
        try {
            let reg = /login_s\.php\?courseid=[0-9]+_[0-9]+_([0-9]+)" target="_top">([\u4e00-\u9fa5 a-zA-Z0-9\s()（）]+)<\/a>.+?;">([\u4e00-\u9fa5]+)<\/a>/g
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
            console.log('Parse Course Fail!\n', e)
            return {stat: false, data: []}
        }
    }
}
