import Vue from 'vue'
import orderBy from 'lodash/orderBy'

const config = require('./config.json')

const Bus = new Vue({
    data: () => ({
        template: [],
        User: {
            loggedIn: false,
            username: '',
            name: '',
            studentId: '',
            department: '',
            classes: ''
        },
        CourseList: [],
        Announce: {},
        Homework: {},
        Textbook: {},
        Score: {},
        Roll: {},
        Setting: {},
        HomeworkFile: {},
        AnnounceNotify: {},
        HomeworkNotify: {},
        Notify: []
    }),
    created () {
        this.$on('updateCourse', (courseList) => {
            this.CourseList = courseList
            localStorage.courseList = JSON.stringify(courseList)
        })

        this.$on('updateUser', (userData) => {
            Object.keys(userData).forEach(key => {
                this.$set(this.User, key, userData[key])
            })
        })

        this.$on('updateAnnounce', ([template, announceData, announceNotify, notice]) => {
            this.Notify = notice
            this.template = template
            this.Announce = announceData
            this.AnnounceNotify = announceNotify
            localStorage.announce = JSON.stringify(announceData)
            localStorage.annNotify = JSON.stringify(announceNotify)
        })

        this.$on('updateHomework', ([homeworkData, hwNotify, notice]) => {
            this.Homework = homeworkData
            this.homeworkNotify = hwNotify
            this.Notify = this.Notify.concat(notice)
            this.Notify = orderBy(this.Notify, ['timeStamp', 'title'], ['desc', 'asc'])
            localStorage.homework = JSON.stringify(homeworkData)
            localStorage.hwNotify = JSON.stringify(hwNotify)
            localStorage.notify = JSON.stringify(this.Notify)
        })

        this.$on('updateTextbook', (obj) => {
            let textbook = obj.textbook
            let chapter = obj.chapter
            let temp = {}
            this.template.forEach((element, index) => {
                temp[element] = {}
                temp[element].list = chapter[index] || {0: {0: '所有教材'}}
                temp[element].content = textbook[index].map(subject => {
                    return subject[0] === null ? null : subject[0].map(item => {
                        return {
                            filename: item[0],
                            path: `${config.ecourse.HOST}${item[1].slice(8)}`,
                            date: item[2],
                            time: item[3],
                            ext: item[4]
                        }
                    })
                })
            })
            this.Textbook = temp
            localStorage.textbook = JSON.stringify(this.Textbook)
        })

        this.$on('updateSetting', (setting) => {
            Object.keys(setting).forEach(key => {
                this.$set(this.Setting, key, setting[key])
            })
            localStorage.setting = JSON.stringify(this.Setting)
        })

        this.$on('updateScore', ([key, data]) => {
            this.$set(this.Score, key, data)
            localStorage.roll = JSON.stringify(this.Score)
        })

        this.$on('updateRoll', ([key, data]) => {
            this.$set(this.Roll, key, data)
            localStorage.roll = JSON.stringify(this.Roll)
        })

        this.$on('updateHwFile', (hwFile) => {
            this.HomeworkFile = hwFile
        })

        this.$on('updateAnnNotify', ([courseID, key]) => {
            this.AnnounceNotify[courseID][key] = false
            for (let index in this.Notify) {
                let item = this.Notify[index]
                if (item.courseID === courseID && item.id === key && item.type === 1) {
                    this.Notify.splice(index, 1)
                }
            }
            localStorage.notify = JSON.stringify(this.Notify)
            localStorage.annNotify = JSON.stringify(this.AnnounceNotify)
        })

        this.$on('updateHwNotify', ([courseID, key]) => {
            this.HomeworkNotify[courseID][key] = false
            for (let index in this.Notify) {
                let item = this.Notify[index]
                if (item.courseID === courseID && item.id === key && item.type === 2) {
                    this.Notify.splice(index, 1)
                }
            }
            localStorage.notify = JSON.stringify(this.Notify)
            localStorage.hwNotify = JSON.stringify(this.HomeworkNotify)
        })

        this.$on('updateNotify', (index) => {
            if (index === null) {
                this.Notify = []
            } else {
                this.Notify.splice(index, 1)
            }
            localStorage.notify = JSON.stringify(this.Notify)
        })

        this.$on('loadLocalData', () => {
            if (!localStorage.annNotify) return
            if (localStorage.announce === 'undefined') return
            if (localStorage.courseList) this.CourseList = JSON.parse(localStorage.courseList)
            if (localStorage.announce) this.Announce = JSON.parse(localStorage.announce)
            if (localStorage.homework) this.Homework = JSON.parse(localStorage.homework)
            if (localStorage.textbook) this.Textbook = JSON.parse(localStorage.textbook)
            if (localStorage.score) this.Score = JSON.parse(localStorage.score)
            if (localStorage.roll) this.Roll = JSON.parse(localStorage.roll)
            if (localStorage.setting) this.Setting = JSON.parse(localStorage.setting)
            if (localStorage.annNotify) this.AnnounceNotify = JSON.parse(localStorage.annNotify)
            if (localStorage.hwNotify) this.HomeworkNotify = JSON.parse(localStorage.hwNotify)
            if (localStorage.notify) this.Notify = JSON.parse(localStorage.notify)
        })
    }
})

export default Bus
