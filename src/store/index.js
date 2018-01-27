import Vue from 'vue'
import Vuex from 'vuex'
import {mutations} from './mutations.js'
import * as getters from './getters.js'
import * as actions from './actions.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userData: {
            loggedIn: false,
            username: '',
            name: '',
            studentId: '',
            department: '',
            classes: ''
        },
        template: {},
        courseList: [],
        announceData: {},
        homeworkData: {},
        textbookData: {},
        settingData: {},
        homeworkFile: {},

        announceNotify: {},
        homeworkNotify: {}
    },
    mutations,
    getters,
    actions,
    // 嚴格模式，禁止直接修改 state
    strict: process.env.NODE_ENV !== 'production'
})
