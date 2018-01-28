// 存放 state 與 mutation 函式
import orderBy from 'lodash/orderBy'
import * as types from './mutations_type.js'

// mutations
export const mutations = {
    [types.USER] (state, userData) {
        Object.keys(userData).forEach(key => {
            state.userData[key] = userData[key]
        })
    },
    [types.COURSE] (state, courseList) {
        state.courseList = courseList
    },
    [types.ANNOUNCE] (state, [announce, announceNotify]) {
        let now = new Date()
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
                if (announceNotify[courseID][key] === undefined) {
                    announceNotify[courseID][key] = Math.abs(now - new Date(nItem[2])) < 8.64e7 * 7
                }
                temp.push({
                    id: key,
                    title: nItem[8],
                    content: nItem[9] || '沒有內容',
                    // important: !!nItem[8],
                    timeStamp: nItem[2]
                })
                return orderBy(temp, ['timeStamp', 'title'], ['desc', 'asc'])
            }, [])
            return result
        }, {})
        // console.log('annNotify', announceNotify)
        localStorage.annNotify = JSON.stringify(announceNotify)
        state.announceNotify = announceNotify
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
    },
    [types.SETTING] (state, setting) {
        console.log('Setting\n', setting)
        Object.keys(setting).forEach(key => {
            state.settingData[key] = setting[key]
        })
        localStorage.setting = JSON.stringify(state.settingData)
    },
    [types.HWFILE] (state, hwFile) {
        state.homeworkFile = hwFile
    },
    [types.ANNOUNCE_NOTIFY] (state, [courseID, key]) {
        state.announceNotify[courseID][key] = false
        localStorage.annNotify = JSON.stringify(state.announceNotify)
    },
    [types.HOMEWORK_NOTIFY] (state, [courseID, key]) {
        state.homeworkNotify[courseID][key] = false
        localStorage.homeworkNotify = JSON.stringify(state.homeworkNotify)
    }
}
