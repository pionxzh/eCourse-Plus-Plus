// 存放 state 與 mutation 函式
import Vue from 'vue'
import orderBy from 'lodash/orderBy'
import * as types from './mutations_type.js'

// mutations
export const mutations = {
    [types.USER] (state, userData) {
        Object.keys(userData).forEach(key => {
            Vue.set(state.userData, key, userData[key])
        })
    },
    [types.COURSE] (state, courseList) {
        state.courseList = courseList
        localStorage.courseList = JSON.stringify(courseList)
    },
    [types.ANNOUNCE] (state, announce) {
        let now = new Date()
        let announceNotify = localStorage.annNotify ? JSON.parse(localStorage.annNotify) : {}
        state.template = announce.map(item => item[0], [])
        state.announceData = announce.reduce((result, item) => {
            let courseID = item[0]
            if (!announceNotify[courseID]) announceNotify[courseID] = {}
            item[2] = item[2] || []
            result[courseID] = {}
            result[courseID].name = item[1]
            result[courseID].list = !item[2].length ? [{title: '暫無公告'}] : item[2].reduce((temp, nItem) => {
                let key = nItem[0]
                /* Decide isNew by is time's difference less than 7 days */
                // change to 14 days for testing, remember to change it back
                if (announceNotify[courseID][key] === undefined) {
                    announceNotify[courseID][key] = Math.abs(now - new Date(nItem[2])) < 8.64e7 * 14
                }
                temp.push({
                    id: key,
                    title: nItem[8],
                    content: nItem[9] || '沒有內容',
                    timeStamp: nItem[2]
                })
                return orderBy(temp, ['timeStamp', 'title'], ['desc', 'asc'])
            }, [])
            return result
        }, {})
        state.announceNotify = announceNotify
        localStorage.announce = JSON.stringify(state.announceData)
        localStorage.annNotify = JSON.stringify(announceNotify)
    },
    async [types.HOMEWORK] (state, homework) {
        state.homeworkData = homework.reduce((result, item) => {
            let courseID = item[0]
            result[courseID] = {}
            result[courseID].name = item[1]
            result[courseID].list = item[2] === null ? [{title: '暫無作業'}] : item[2].reduce((temp, nItem) => {
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
        // console.log('Setting\n', setting)
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
        state.scoreData = JSON.parse(localStorage.score)
        state.rollData = JSON.parse(localStorage.roll)
        state.announceNotify = JSON.parse(localStorage.annNotify)
    },
    [types.CLEAR] (state) {
        state.courseList = []
        state.announceData = {}
        state.homeworkData = {}
        state.textbookData = {}
        state.announceNotify = {}
    }
}
