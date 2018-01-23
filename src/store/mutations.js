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
    [types.ANNOUNCE] (state, announce) {
        state.template = announce.map(item => item[0], [])
        state.announceData = announce.reduce((result, item) => {
            result[item[0]] = {}
            result[item[0]].name = item[1]
            item[2] = item[2] || []
            result[item[0]].list = !item[2].length ? [{title: '暫無公告'}] : item[2].reduce((temp, nItem) => {
                temp.push({
                    title: nItem[8],
                    content: nItem[9] || '沒有內容',
                    important: !!nItem[8],
                    timeStamp: nItem[2]
                })
                return orderBy(temp, ['timeStamp', 'title'], ['desc', 'asc'])
            }, [])
            return result
        }, {})
    },
    [types.HOMEWORK] (state, homework) {
        state.homeworkData = homework.reduce((result, item) => {
            result[item[0]] = {}
            result[item[0]].name = item[1]
            result[item[0]].list = item[2] === null ? [{title: '暫無作業'}] : item[2].reduce((temp, nItem) => {
                temp.push({
                    id: nItem[1],
                    title: nItem[0],
                    content: nItem[4] || '沒有內容',
                    percentage: `${nItem[2]}%`,
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
        console.log(setting)
        Object.keys(setting).forEach(key => {
            state.settingData[key] = setting[key]
        })
    }
}
