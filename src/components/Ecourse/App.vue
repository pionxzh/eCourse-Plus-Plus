<template lang='pug'>
    v-app#ccu
        v-navigation-drawer.gray-bg(persistent v-model='flag.drawer' enable-resize-watcher app)
            v-toolbar.personal-info.pa-3(flat)
                v-list.pa-0(dense two-line)
                    v-list-tile.px-4(v-if='!User.loggedIn')
                        v-list-tile-content
                            v-btn(color='primary' aria-label='login' @click='flag.login = true' dark) 登入
                    v-list-tile.px-4(avatar ripple v-else)
                        v-list-tile-avatar(size=48)
                            img(src='../../assets/nav.png')
                        v-list-tile-content
                            v-list-tile-title {{User.name}}
                            v-list-tile-sub-title.blue-grey--text.lighten-1--text
                                v-icon.blue-grey--text.lighten-1--text.body-1 mdi-map-marker
                                span {{User.department}}, {{User.classes}}
                    
            v-list.pt-0.striped.course-list(dense three-line)
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
            v-toolbar-side-icon(@click.stop='flag.drawer = !flag.drawer'): v-icon mdi-menu
            v-toolbar-title.white--text.ecourse-logo eCourse+
            v-spacer
            v-menu
                v-btn.setting-btn(icon aria-label='setting' slot='activator')
                    v-icon mdi-settings
                v-list
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='flag.setting = true') &nbsp;&nbsp;設定
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='flag.about = true') &nbsp;&nbsp;關於本站
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='fetchData') &nbsp;&nbsp;強制刷新&nbsp;&nbsp;
                    v-divider
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='logout')
                            | &nbsp;
                            v-icon mdi-logout-variant
                            | &nbsp;登出
 
                v-dialog(v-model='flag.setting' max-width=450 scroll)
                    v-toolbar.blue(dark)
                        v-icon mdi-wrench
                        v-toolbar-title 設定
                    v-list.tile-hover(two-line subheader)
                        template(v-for='(item, key) in settingData')
                            v-subheader(:key='key') {{ key }}
                            v-list-tile(v-for='subItem in item' :key='subItem.title' ripple avatar @click='')
                                v-list-tile-action
                                    v-switch(color='blue darken-1' v-model='setting[subItem.field]')
                                v-list-tile-content(@click='setting[subItem.field] = !setting[subItem.field]')
                                    v-list-tile-title {{ subItem.title }}
                                    v-list-tile-sub-title {{ subItem.description }}
                            v-divider

                v-dialog(width='300px' v-model='flag.login')
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
                                    //v-flex(xs4 v-if='flag.authcode')
                                        img(:src='authcodeImg' ref='authcode' @click.stop="$refs.authcode.src = authcodeImg + '?rnd=' + Math.random()" style='margin-top: 19px;')
                                    //v-flex(xs8 v-if='flag.authcode')
                                        v-text-field(label='驗證碼' v-model='authcode' required)
                        v-card-actions
                            v-spacer
                            v-btn(color='blue darken-1' aria-label='login' @click.native='login(false)' large dark)
                                v-icon mdi-flash
                                | 登入
                            v-spacer

        v-content.mb-5
            v-container(fluid)
                transition(name='slide' mode='out-in')
                    keep-alive
                        router-view
                v-snackbar(:timeout='toast.timeout' :top='toast.top' :left='toast.left' :right='toast.right' :bottom='toast.bottom' :color='toast.color' v-model='toast.show') {{toast.message}}
        v-footer(absolute)
            v-spacer
            span © 2018 Copyright by Pionxzh
            v-spacer
        v-fab-transition
            v-btn(fixed aria-label='fab' bottom right dark fab color='red' v-show='isScroll' v-scroll='onScroll' @click='toTop' style='margin: 6px 8px;') 
                v-icon mdi-chevron-up
        v-fab-transition
            v-speed-dial(fixed bottom right :open-on-hover='!isMobile' transition='slide-x-transition' v-show='!isScroll' style='z-index: 10;')
                v-btn(slot='activator' aria-label='close' color='red' dark fab)
                    v-icon mdi-rocket
                v-tooltip(left)
                    v-btn(fab dark aria-label='setting' color='green' slot='activator' @click='flag.setting = true')
                        v-icon mdi-settings
                    span 設定
                v-tooltip(left)
                    v-btn(fab dark aria-label='score' color='pink' slot='activator' @click='')
                        v-icon mdi-chart-line
                    span 成績

</template>

<script>
import User from './../User'
import Course from './../Course'
import Announce from './../Announce'
import Homework from './../Homework'
import Textbook from './../Textbook'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'
// const config = require('../../config.json')
window.$ = window.jQuery = $

export default {
    name: 'Ecourse',
    data: () => ({
        loading: false,
        isScroll: false,
        isMobile: window.innerWidth < 800,
        username: '',
        password: '',
        // authcode: '',
        // authcodeImg: config.sso.authcode,
        flag: {
            drawer: true,
            setting: false,
            login: false,
            about: false
            // authcode: false
        },
        setting: {
            detectUrl: true,
            detectDate: true,
            showDivider: false,
            expandFirstFolder: true,
            isDownloadQuestion: false,
            isDownloadTextbook: false,
            showIntro: true,
            showTeacherInfo: true
        },
        settingData: {
            '外觀': [{
                field: 'showDivider',
                title: '顯示格線',
                description: '在每個項目之間添加分隔線'
            }],
            '公告': [{
                field: 'detectDate',
                title: '日期偵測',
                description: '公告日期添加底線'
            }, {
                field: 'detectUrl',
                title: '偵測網址',
                description: '公告網址變為可點之連結'
            }],
            '作業': [{
                field: 'isDownloadQuestion',
                title: '強制下載題目',
                description: '點擊後會強制下載而非打開新視窗(Safari無效)'
            }],
            '教材': [{
                field: 'showIntro',
                title: '授課大綱',
                description: '是否顯示授課大綱'
            }, {
                field: 'showTeacherInfo',
                title: '教師資訊',
                description: '是否顯示教師資訊'
            }, {
                field: 'expandFirstFolder',
                title: '自動展開首項',
                description: '教材第一個資料夾會自動打開'
            }, {
                field: 'isDownloadTextbook',
                title: '強制下載教材',
                description: '點擊後會強制下載而非打開新視窗(Safari無效)'
            }],
            '成績': []
        },
        toast: {
            show: false,
            timeout: 3000,
            top: true,
            right: false,
            bottom: false,
            left: false,
            color: 'success',
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
    async created () {
        if (this.isMobile) this.flag.drawer = false
        if (localStorage.setting) this.setting = JSON.parse(localStorage.setting)
        this.updateSetting(this.setting)
        await this.autoLogin()
        if (this.$route.params.id) await Course.changeCourse(this.$route.params.id)
    },
    watch: {
        setting: {
            handler () {
                this.updateSetting(this.setting)
            },
            deep: true
        }
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
        onScroll: debounce(function () {
            this.isScroll = window.scrollY > 200
        }, 100),
        toTop () {
            window.scroll({ top: 0, behavior: 'smooth' })
        },
        showToast ({message = '', top = true, right = false, bottom = false, left = false, color = 'success', timeout = 3000} = {}) {
            this.toast.show = true
            this.toast.top = top
            this.toast.right = right
            this.toast.bottom = bottom
            this.toast.left = left
            this.toast.color = color
            this.toast.timeout = timeout
            this.toast.message = message
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
        },
        doNothing () {
        }
    }
}
</script>

