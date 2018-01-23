import * as types from './mutations_type.js'

export const updateUser = ({ commit }, userData) => {
    commit(types.USER, userData)
}

export const updateCourse = ({ commit }, courseList) => {
    commit(types.COURSE, courseList)
}

export const updateAnnounce = ({ commit }, announce) => {
    commit(types.ANNOUNCE, announce)
}

export const updateHomework = ({ commit }, homework) => {
    commit(types.HOMEWORK, homework)
}

export const updateTextbook = ({ commit }, textbook) => {
    commit(types.TEXTBOOK, textbook)
}

export const updateSetting = ({ commit }, setting) => {
    commit(types.SETTING, setting)
}
