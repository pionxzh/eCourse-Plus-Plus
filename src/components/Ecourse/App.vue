<template lang='pug'>
    v-app#ccu
        v-navigation-drawer.gray-bg(persistent v-model='flag.drawer' enable-resize-watcher app)
            v-toolbar.personal-info.pa-3(flat)
                v-list.pa-0(dense two-line)
                    v-list-tile.px-4(v-if='!User.loggedIn')
                        v-list-tile-content
                            v-btn(color='primary' @click='flag.login = true' dark) 登入
                    v-list-tile.px-4(avatar ripple v-if='User.loggedIn')
                        v-list-tile-avatar
                            img(src='https://i.imgur.com/KDLeUaq.jpg')
                        v-list-tile-content
                            v-list-tile-title {{User.name}}
                            v-list-tile-sub-title.blue-grey--text.lighten-1--text
                                v-icon.blue-grey--text.lighten-1--text.body-1 place
                                span {{User.department}}, {{User.classes}}
                    
            v-list.pt-0.striped.course-list(dense three-line)
                v-divider
                v-list-tile
                    v-list-tile-action
                    v-list-tile-content
                        v-list-tile-title.course-head
                            span 課程列表
                v-list-tile(v-for='(item, index) in CourseList' :key='item.id' :to="{ path: '/course/' + item.id }" ripple)
                    v-list-tile-action
                    v-list-tile-content
                        v-list-tile-title.course-list-name
                            span {{item.name}}
                        v-list-tile-sub-title
                            span {{item.professor}}
        v-toolbar.color-nav(dark color='primary' fixed app)
            v-toolbar-side-icon(@click.stop='flag.drawer = !flag.drawer')
            v-toolbar-title.white--text.ecourse-logo eCourse+
            v-spacer
            v-menu
                v-btn.mr-5(icon slot='activator')
                    v-icon settings
                v-list
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='flag.setting = true') &nbsp;&nbsp;設定&nbsp;&nbsp;
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='flag.about = true') &nbsp;&nbsp;關於本站&nbsp;&nbsp;
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='fetchData') &nbsp;&nbsp;強制刷新&nbsp;&nbsp;
                    v-divider
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='logout') &nbsp;&nbsp;登出&nbsp;&nbsp;
                v-dialog(v-model='flag.setting' max-width=450)
                    v-tabs(fixed centered)
                        v-toolbar.cyan(extended dark)
                            v-toolbar-title.display-2.mb-5(slot='extension') 設定
                        v-list.tile-hover(two-line subheader)
                            v-subheader 公告
                            v-list-tile(avatar)
                                v-list-tile-action
                                    v-checkbox(v-model='setting.detectDate' @change='changeSetting({detectDate: setting.detectDate})')
                                v-list-tile-content
                                    v-list-tile-title 偵測日期
                                    v-list-tile-sub-title 公告日期添加底線
                            v-list-tile(avatar)
                                v-list-tile-action
                                    v-checkbox(v-model='setting.detectUrl' @change='changeSetting({detectUrl: setting.detectUrl})')
                                v-list-tile-content
                                    v-list-tile-title 偵測網址
                                    v-list-tile-sub-title 公告網址變為可點之連結
                            v-divider
                            v-subheader 作業
                            v-list-tile(avatar)
                                v-list-tile-action
                                    v-checkbox(v-model='setting.isDownloadQuestion' @change='changeSetting({isDownloadQuestion: setting.isDownloadQuestion})')
                                v-list-tile-content
                                    v-list-tile-title 強制下載題目
                                    v-list-tile-sub-title 點擊下載按鈕後會強制下載而非打開新視窗(Safari無效)
                            v-divider
                            v-subheader 教材
                            v-list-tile(avatar)
                                v-list-tile-action
                                    v-checkbox(v-model='setting.showIntro' @change='changeSetting({showIntro: setting.showIntro})')
                                v-list-tile-content
                                    v-list-tile-title 授課大綱
                                    v-list-tile-sub-title 是否顯示授課大綱
                            v-list-tile(avatar)
                                v-list-tile-action
                                    v-checkbox(v-model='setting.expandFirstFolder' @change='changeSetting({expandFirstFolder: setting.expandFirstFolder})')
                                v-list-tile-content
                                    v-list-tile-title 自動展開首項
                                    v-list-tile-sub-title 教材第一個資料夾會自動打開
                            v-list-tile(avatar)
                                v-list-tile-action
                                    v-checkbox(v-model='setting.isDownloadTextbook' @change='changeSetting({isDownloadTextbook: setting.isDownloadTextbook})')
                                v-list-tile-content
                                    v-list-tile-title 強制下載教材
                                    v-list-tile-sub-title 點擊下載按鈕後會強制下載而非打開新視窗(Safari無效)
                            v-divider
                            v-subheader 成績

                v-dialog(v-model='flag.login')
                    v-card.dialog-box
                        v-card-title.headline: div.text-xs-center 登入帳號
                        v-card-text 請輸入
                            b 單一入口帳號密碼
                            v-container(grid-list-md)
                                v-layout(wrap)
                                    v-flex(xs12)
                                        v-text-field(label='帳號' required v-model='username')
                                    v-flex(xs12)
                                        v-text-field(label='密碼' required type='password' v-model='password' @keyup.enter='login(false)')
                                    v-flex(xs4 v-if='flag.authcode')
                                        img(:src='authcodeImg' ref='authcode' @click.stop="$refs.authcode.src = authcodeImg + '?rnd=' + Math.random()" style='margin-top: 19px;')
                                    v-flex(xs8 v-if='flag.authcode')
                                        v-text-field(label='驗證碼' v-model='authcode' required)
                        v-card-actions
                            v-spacer
                            v-btn(color='green darken-1' flat='flat' @click.native='login(false)') 登入
                            v-spacer

        main
            v-content
                v-container(fluid fill-height)
                    transition(name='slide' mode='out-in')
                        keep-alive
                            router-view
                    v-snackbar(:timeout='toast.timeout' :top='toast.top' :left='toast.left' :right='toast.right' :bottom='toast.bottom' :color='toast.color' v-model='toast.show') {{toast.message}}
        v-footer(app)
            v-spacer
            span © 2018 @Copyright by Pionxzh
            v-spacer

</template>

<script>
import User from './../User'
import Course from './../Course'
import Announce from './../Announce'
import Homework from './../Homework'
import Textbook from './../Textbook'
import { mapGetters, mapActions } from 'vuex'
const config = require('../../config.json')
window.$ = window.jQuery = $

export default {
    name: 'Ecourse',
    data: () => ({
        loading: false,
        isScroll: false,
        username: '',
        password: '',
        authcode: '',
        authcodeImg: config.sso.authcode,
        flag: {
            drawer: true,
            setting: false,
            login: false,
            about: false,
            authcode: false
        },
        setting: {
            showIntro: true,
            detectUrl: true,
            detectDate: true,
            expandFirstFolder: true,
            isDownloadQuestion: false,
            isDownloadTextbook: false
        },
        toast: {
            show: false,
            timeout: 3000,
            top: true,
            right: false,
            bottom: false,
            left: false,
            color: 'error',
            message: ''
        }
    }),
    computed: {
        ...mapGetters({
            User: 'getUser',
            HomeworkData: 'getHomework',
            CourseList: 'getCourseList'
        }),
        loginData () {
            return {
                id: this.username,
                pass: this.password,
                ver: 'C'
            }
        }
    },
    watch: {
        '$route' (target) {
            User.changeCourse(target.params.id)
        }
    },
    async created () {
        await this.autoLogin()
        if (this.$route.params.id) await User.changeCourse(this.$route.params.id)
        if (localStorage.setting) this.setting = JSON.parse(localStorage.setting)
        this.updateSetting(this.setting)
    },
    methods: {
        ...mapActions([
            'updateUser',
            'updateCourse',
            'updateAnnounce',
            'updateHomework',
            'updateTextbook',
            'updateSetting',
            'updateHwFile'
        ]),
        showToast ({message = '', top = true, right = false, bottom = false, left = false, color = 'error', timeout = 3000} = {}) {
            this.toast.show = true
            this.toast.top = top
            this.toast.right = right
            this.toast.bottom = bottom
            this.toast.left = left
            this.toast.color = color
            this.toast.timeout = timeout
            this.toast.message = message
        },
        changeSetting (data) {
            localStorage.setting = JSON.stringify(this.setting)
            this.updateSetting(data)
        },
        async autoLogin () {
            if (!localStorage.user) return

            let mainPage = await User.getIndex()
            if (mainPage.indexOf('權限錯誤') === -1) {
                this.updateUser({username: JSON.parse(localStorage.user).username, loggedIn: true})
                await this.fetchData()
                return
            }
            await this.login(true)
        },
        async login (remember) {
            let data = remember ? JSON.parse(localStorage.user) : this.loginData

            let result = await User.login(data)
            if (!result.stat) return this.showToast({message: result.message, color: 'error'})

            if (!remember) localStorage.user = JSON.stringify(this.loginData)
            this.flag.login = false
            this.showToast({message: '登入成功', color: 'success'})
            this.updateUser({username: data.username, loggedIn: true})
            await this.fetchData()
        },
        async logout () {
            await User.logout()
            this.updateUser({loggedIn: false})
            this.showToast({message: '登出成功', color: 'success'})
        },
        async fetchData () {
            let mainPage = await User.getIndex()
            let user = User.getData(mainPage)
            let courrseList = Course.getList(mainPage)
            this.updateUser(user)
            this.updateCourse(courrseList.data)

            let announce = await Announce.getData()
            let annNotify = localStorage.annNotify ? JSON.parse(localStorage.annNotify) : {}
            this.updateAnnounce([announce.data, annNotify])

            let homework = await Homework.getData()
            this.updateHomework(homework.data)

            let homeworkFile = await Homework.getAllQuestion(this.HomeworkData)
            this.updateHwFile(homeworkFile.data)

            let textbook = await Textbook.getData()
            this.updateTextbook(textbook.data)

            let isError = !announce.stat || !homework.stat || !homeworkFile.stat || !textbook.stat
            if (isError) this.showToast({message: '取得資料錯誤', color: 'error'})
            else this.showToast({message: '取得資料成功', color: 'info'})
        }
    }
}
</script>

