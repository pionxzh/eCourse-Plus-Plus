// 存放 state 與 mutation 函式
import Vue from 'vue'
import * as types from './mutations_type.js'

// mutations
export const mutations = {
    [types.USER] (state, userData) {
        Object.keys(userData).forEach(key => {
            Vue.set(state.userData, key, userData[key])
        })
    },
    [types.TABLE] (state, timeTable) {
        state.timeTable = timeTable
        localStorage.timeTable = JSON.stringify(timeTable)
    },
    [types.COURSE] (state, courseList) {
        state.courseList = courseList
        localStorage.courseList = JSON.stringify(courseList)
    },
    [types.ANNOUNCE] (state, [template, announceData, announceNotify]) {
        state.template = template
        state.announceData = announceData
        state.announceNotify = announceNotify
        localStorage.announce = JSON.stringify(announceData)
        localStorage.annNotify = JSON.stringify(announceNotify)
    },
    async [types.HOMEWORK] (state, homework) {
        state.homeworkData = homework
        localStorage.homework = JSON.stringify(state.homeworkData)
    },
    [types.TEXTBOOK] (state, obj) {
        let textbook = obj.textbook
        let chapter = obj.chapter
        let temp = {}
        state.template.forEach((element, index) => {
            temp[element] = {}
            temp[element].list = chapter[index] || {0: {0: '所有教材'}}
            temp[element].content = textbook[index]
        })
        state.textbookData = temp
        localStorage.textbook = JSON.stringify(state.textbookData)
    },
    [types.SETTING] (state, setting) {
        Object.keys(setting).forEach(key => {
            Vue.set(state.settingData, key, setting[key])
        })
        localStorage.setting = JSON.stringify(state.settingData)
    },
    [types.SCORE] (state, [key, data]) {
        Vue.set(state.scoreData, key, data)
        localStorage.score = JSON.stringify(state.scoreData)
    },
    [types.ROLL] (state, [key, data]) {
        Vue.set(state.rollData, key, data)
        localStorage.roll = JSON.stringify(state.rollData)
    },
    [types.HWFILE] (state, hwFile) {
        state.homeworkFile = hwFile
    },
    [types.ANNOUNCE_NOTIFY] (state, [courseID, key]) {
        state.announceNotify[courseID][key] = false
        localStorage.annNotify = JSON.stringify(state.announceNotify)
    },
    [types.LOAD] (state) {
        // 有annNotify表示其他人有被記錄
        if (!localStorage.annNotify) return
        state.courseList = JSON.parse(localStorage.courseList)
        state.announceData = JSON.parse(localStorage.announce)
        state.homeworkData = JSON.parse(localStorage.homework)
        state.textbookData = JSON.parse(localStorage.textbook)
        state.homeworkData = JSON.parse(localStorage.homework)
        if (localStorage.score) state.scoreData = JSON.parse(localStorage.score)
        if (localStorage.roll) state.rollData = JSON.parse(localStorage.roll)
        state.announceNotify = JSON.parse(localStorage.annNotify)
    },
    [types.CLEAR] (state) {
        state.userData.loggedIn = false
        state.courseList = []
        state.announceData = {}
        state.homeworkData = {}
        state.textbookData = {}
        state.announceNotify = {}
        /* prevent autoLogin active */
        localStorage.removeItem('user')
        /* prevent new user use the same data */
        localStorage.removeItem('annNotify')
        /* other localStorage item will automatically be overwrite */
    }
}
