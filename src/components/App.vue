<template lang='pug'>
    v-app#ccu(:class='{"weather-theme": setting.weatherTheme}' style='background-color: #FFF;' dark)
        v-navigation-drawer.gray-bg(persistent v-model='flag.drawer' enable-resize-watcher app)
            v-toolbar#personal-info.pa-3(flat)
                v-list.pa-0(two-line)
                    v-list-tile.px-4(v-if='!User.loggedIn')
                        v-list-tile-content
                            v-btn(color='primary' aria-label='login' @click='showLogin' :loading='User.loading' :disabled='User.loading') 登入
                    v-list-tile.px-4(avatar ripple v-else)
                        v-list-tile-avatar(size=58)
                            div#avatar-overlay(@click='$refs.avatar.click()')
                                v-icon(dark) mdi-cloud-upload
                                input(type='file' ref='avatar' multiple=false @change='uploadAvatar')
                            img.avatar-wrapper.elevation-1(v-if='!avatar.length' src='../assets/nav.png')
                            img.avatar-wrapper.elevation-1(v-else style='object-fit: cover;' :src='avatar')
                        v-list-tile-content.ml-3
                            v-list-tile-title {{User.name}}
                            v-list-tile-sub-title.blue-grey--text.lighten-1--text
                                v-icon.blue-grey--text.lighten-1--text.body-1 mdi-map-marker
                                span {{User.department}} | {{User.classes}}

            v-list.pt-0.striped.course-list(dense :two-line='isMobile' :three-line='!isMobile' light)
                v-list-tile
                    v-list-tile-action: div
                    v-list-tile-content
                        v-list-tile-title#course-head
                            span 課程列表
                    v-list-tile-action
                        v-tooltip(right)
                            v-btn(icon color='green lighten-3' aria-label='table' slot='activator' :to='{ name: "table"}' light)
                                v-icon mdi-table-large
                            span 課表
                v-list-tile(v-for='(item, index) in CourseList' :key='item.id' :to="{name: 'Course', params: {id: item.id}}" :ripple='!isMobile')
                    v-list-tile-action
                        div
                    v-list-tile-content
                        v-list-tile-title.course-list-name
                            span {{item.name}}
                        v-list-tile-sub-title
                            span {{item.professor}}
        v-toolbar#color-nav(dark color='primary' fixed app :class='{"is-scroll": isScroll}')
            v-toolbar-side-icon(@click.stop='flag.drawer = !flag.drawer'): v-icon mdi-menu
            router-link.cursor-p(tag='div' to='/')
                v-toolbar-title#ecourse-logo.no-select.ml-2 eCourse+
            v-spacer
            v-menu#notify-menu.mr-1(left offset-y nudge-top='-10' min-width=200 :max-width='isMobile ? 340:600' :max-height='isMobile ? 500:500')
                v-btn#notification-btn(icon aria-label='notify' slot='activator')
                    v-badge(overlap v-show='Notify.length' :color='setting.weatherTheme ? "red darken-1" : "blue"')
                        span(slot='badge') {{Notify.length}}
                        v-icon mdi-bell
                    v-icon(v-show='!Notify.length') mdi-bell
                v-card#notify-card.elevation-8(light)
                    v-card-title 通知
                        v-spacer
                        a(v-show='Notify.length>0' @click='updateNotify(null)') 清除全部
                    v-list.tile-hover.pa-0(two-line subheader)
                        transition-group(name='slide' tag='div')
                            template(v-for='(hw, cid) in HomeworkData')
                                template(v-for='(item,index) in hw' v-if='item.timeStamp&&item.timeStamp===today')
                                    v-divider(:key='cid+index')
                                    v-list-tile(ripple avatar :key='cid+index+1')
                                        v-list-tile-avatar
                                            v-avatar.notify-avatar(:class='notifyColor[index%6]')
                                                v-icon(dark) mdi-alarm
                                        v-list-tile-content
                                            v-list-tile-title 作業#[b 《{{ item.title }}》] 今天到期，去看看吧
                                            v-list-tile-sub-title {{ item.timeStamp }}
                            template(v-for='(item, index) in Notify')
                                v-divider(:key='item.course+item.title+item.type')
                                v-list-tile(ripple avatar :key='item.courseID+item.title+item.type' @click.native='toNotify(item)')
                                    v-list-tile-avatar
                                        v-avatar.notify-avatar(:class='notifyColor[index%6]')
                                            span.white--text {{item.abbr || item.course.substring(0, 2) }}
                                    v-list-tile-content
                                        v-list-tile-title #[b {{ item.course }}]{{ item.type === 1 ? '發布了新公告' : '發布了新作業' }}#[b 《{{ item.title }}》]
                                        v-list-tile-sub-title
                                            v-icon {{ item.type === 1 ? 'mdi-bullhorn' : 'mdi-clipboard-text' }}
                                            | &nbsp;{{ item.timeStamp }}
                                    v-list-tile-action
                                        v-btn(small icon @click.stop='updateNotify(index)'): v-icon(small) mdi-close
                        template(v-if='Notify.length===0')
                            v-divider
                            v-list-tile(ripple avatar)
                                v-list-tile-avatar
                                    v-avatar.notify-avatar.red
                                        span.white--text No~
                                v-list-tile-content
                                    v-list-tile-title 目前沒有通知 ┐( ´ д ` )┌

            v-menu(left offset-y nudge-top='-10')
                v-btn#setting-btn(icon aria-label='setting' slot='activator')
                    v-icon mdi-settings
                v-list(light)
                    v-list-tile.list__tile--link(@click='flag.setting = true')
                        v-list-tile-title.fix-icon
                            v-icon mdi-settings
                            | &nbsp;&nbsp;設定
                    v-list-tile.list__tile--link(@click='flag.theme = true')
                        v-list-tile-title
                            v-icon mdi-brightness-6
                            | &nbsp;&nbsp;主題
                    v-list-tile.list__tile--link(@click='flag.about = true')
                        v-list-tile-title
                            v-icon mdi-flash-circle
                            | &nbsp;&nbsp;關於本站
                    v-divider
                    v-list-tile.list__tile--link(v-if='!User.loggedIn' @click='User.modal = true')
                        v-list-tile-title
                            v-icon mdi-logout-variant
                            | &nbsp;&nbsp;登入
                    v-list-tile.list__tile--link(v-if='User.loggedIn' @click='logout')
                        v-list-tile-title
                            v-icon mdi-logout-variant
                            | &nbsp;&nbsp;登出
        v-snackbar.short(:timeout='toast.timeout' top :color='toast.color' v-model='toast.show' :multi-line='toast.multi') {{toast.message}}
        div.theme-wrapper
            svg.bg-mask(v-if='setting.weatherTheme' :class='currWeather' viewBox='0 0 1 1' preserveAspectRatio='xMidYMid slice')
                defs
                    mask#mask(fill='url(#gradient)')
                        rect(x='0' y='0' width='1' height='1')
                    linearGradient#gradient(x1='0' y1='0' x2='100%' y2='0' spreadMethod='pad' gradientTransform='rotate(45)')
                        stop(offset='0%' stop-color='#fff' stop-opacity='1')
                        stop(offset='100%' stop-color='#fff' stop-opacity='0')
                rect.gradient-bg(x='0' y='0' width='1' height='1')
                rect.gradient-fg(x='0' y='0' width='1' height='1' mask='url(#mask)')
            div#mountain(v-if='setting.weatherTheme' :class='{"horizon": $route.path === "/"}')
        v-content(:class='{"mb-5": $route.params.id, "mb-0": !$route.params.id}')
            v-container(fluid fill-height align-center :class='{"py-5": !isMobile, "main-page": $route.path === "/"}')
                transition(name='slide' mode='out-in')
                    keep-alive
                        router-view(:tab.sync='tag' :focusItem.sync='focusItem')

        v-bottom-nav.hidden-md-and-up(app fixed shift :active.sync='tag' :color='bottomNavColor' v-if='$route.params.id')
            v-btn(dark value='announce')
                span 公告
                v-icon mdi-calendar-text
            v-btn(dark value='homework')
                span 作業
                v-icon mdi-clipboard-text
            v-btn(dark value='textbook')
                span 教材
                v-icon mdi-book-open-variant
            v-btn(dark value='score')
                span 成績
                v-icon mdi-chart-line
        v-fab-transition
            v-btn.hidden-sm-and-down(fixed aria-label='fab' bottom right dark fab color='red' v-show='isScroll' v-scroll='onScroll' @click='toTop' style='margin: 6px 8px;')
                v-icon mdi-chevron-up
        v-dialog(v-model='flag.theme' max-width=450)
            v-toolbar.cyan.no-select(dark)
                v-icon mdi-brightness-6
                v-toolbar-title 主題
                v-spacer
                v-btn(icon @click='flag.theme = false'): v-icon mdi-close
            v-card.dialog-box(light)
                v-container(fluid grid-list-md)
                    v-layout(row wrap)
                        v-flex(xs6)
                            v-card.theme-card(@click.native='setting.weatherTheme=false')
                                v-img(:src="require('../assets/nav.png')" height='200px')
                                v-card-text 預設主題<br class='hidden-md-and-up'> ( • ̀ω•́ )

                        v-flex(xs6)
                            v-card.theme-card(@click.native='setting.weatherTheme=true')
                                v-img(:src="require('../assets/weather.png')" height='200px')
                                v-card-text 天色主題<br class='hidden-md-and-up'> ε≡ﾍ( ´∀`)ﾉ

        v-dialog(v-model='flag.setting' max-width=450 :fullscreen='isMobile' scroll)
            v-toolbar.blue.no-select(dark :fixed='isMobile')
                v-icon mdi-wrench
                v-toolbar-title 設定
                v-spacer
                v-btn(icon @click='flag.setting = false'): v-icon mdi-close
            v-list.tile-hover(two-line subheader :class='{"mt-5": isMobile}' light)
                template(v-for='(item, key) in settingData')
                    v-subheader.no-select(:key='key') {{ key }}
                    v-list-tile(v-for='subItem in item' :key='subItem.title' ripple avatar @click='')
                        v-list-tile-action
                            v-switch(color='blue darken-1' v-model='setting[subItem.field]')
                        v-list-tile-content(@click='setting[subItem.field] = !setting[subItem.field]')
                            v-list-tile-title {{ subItem.title }}
                            v-list-tile-sub-title {{ subItem.description }}
                    v-divider
                v-subheader.no-select 其他
                v-list-tile(ripple avatar @click='clearAll')
                    v-list-tile-action
                        v-icon(large) mdi-delete-forever
                    v-list-tile-content
                        v-list-tile-title 清除資料
                        v-list-tile-sub-title 如發生異常，通常清除資料可以解決大部分問題

        v-dialog(v-model='flag.about' max-width=450)
            v-toolbar.red.no-select(dark)
                v-icon mdi-flash-circle
                v-toolbar-title 關於
                v-spacer
                v-btn(icon @click='flag.about = false'): v-icon mdi-close
            v-list.tile-hover(two-line subheader light)
                v-subheader.no-select 關於
                v-list-tile(ripple avatar @click='')
                    v-list-tile-action
                        v-icon mdi-code-array
                    v-list-tile-content
                        v-list-tile-title eCourse+
                        v-list-tile-sub-title v1.0.11
                v-list-tile(ripple avatar @click='')
                    v-list-tile-action
                        v-icon mdi-account-circle
                    v-list-tile-content
                        v-list-tile-title @Pionxzh
                        v-list-tile-sub-title 歡迎+Steam好友 ID一樣
                v-list-tile(ripple avatar href='mailto:pionxzh@csie.io')
                    v-list-tile-action
                        v-icon mdi-email
                    v-list-tile-content
                        v-list-tile-title 聯絡信箱 / 問題回報
                        v-list-tile-sub-title pionxzh@csie.io
                v-divider
                v-subheader.no-select GitHub
                v-list-tile(ripple avatar href='https://github.com/pionxzh/eCourse-Plus-Plus' target='_blank' rel='noopener')
                    v-list-tile-action
                        v-icon mdi-github-circle
                    v-list-tile-content
                        v-list-tile-title eCourse-Plus-Plus
                        v-list-tile-sub-title 歡迎Star, 發PR
                v-divider
                v-subheader.no-select 斗內
                v-list-tile(ripple avatar href='https://paypal.me/pionxzh' target='_blank' rel='noopener')
                    v-list-tile-action
                        v-icon mdi-credit-card
                    v-list-tile-content
                        v-list-tile-title Paypal
                        v-list-tile-sub-title 如果你覺得我的作品不錯，歡迎贊助我一杯咖啡☕

        v-dialog(v-model='User.modal' width='300px')
            v-card.dialog-box(light)
                v-card-title.headline: div.text-xs-center 登入帳號
                v-card-text(style='font-size: 15px;') ※請輸入#[b 單一入口帳號密碼]
                    v-container(grid-list-md)
                        v-layout(wrap)
                            v-flex(xs12)
                                v-text-field(label='帳號' v-model='account.username')
                            v-flex(xs12)
                                v-text-field(label='密碼' type='password' v-model='account.password' @keyup.enter='login(false)')
                v-card-actions
                    v-spacer
                    v-btn(color='blue darken-1' aria-label='login' :loading='User.loading' @click='login(false)' large dark)
                        | #[v-icon mdi-flash] 登入
                    v-spacer

        v-dialog(v-model='flag.error' width='500px')
            v-card.dialog-box(light)
                v-card-title.headline 哎呀! 發生錯誤了 _(´ཀ`」 ∠)_
                v-card-text(style='font-size: 16px;')
                    p 錯誤類型: #[b {{ err.title }}]
                    p 錯誤訊息: #[b {{ err.message }}]
                    p.mt-5 1. 若問題重複出現，可嘗試在右上角#[b 設定]底部選擇#[b 清除資料]
                    p 2. #[b Ping error]就不要理他了 不重要
                    p 2. 若問題仍無改善，請回報至 #[b #[u pionxzh@csie.io]]<br/>信件標題以#[b 【問題回報】]為開頭，包含螢幕截圖(錯誤訊息)、錯誤所需重作步驟。

</template>

<script>
import Bus from '../eventBus.js'
import Util from '../util/Util'
import User from '../util/User'
import Course from '../util/Course'
import Announce from '../util/Announce'
import Homework from '../util/Homework'
import Textbook from '../util/Textbook'

import debounce from 'lodash/debounce'

export default {
    name: 'Ecourse',
    data: () => ({
        isScroll: false,
        focusItem: null,
        today: Util.getToday(),
        isMobile: window.innerWidth < 800,
        tag: 'announce',
        account: {
            username: '',
            password: ''
        },
        err: {
            title: '',
            message: ''
        },
        avatar: '',
        currWeather: null,
        notifyColor: ['red darken-1', 'blue', 'orange', 'cyan', 'purple', 'brown'],
        weather: ['dawn', 'golden-hour', 'golden-hour-end', 'sunset', 'dusk', 'night'],

        flag: {
            about: false,
            drawer: true,
            error: false,
            login: false,
            setting: false,
            theme: false
        },
        setting: {
            showDivider: false,
            weatherTheme: true,
            detectDate: true,
            detectUrl: true,
            isDownloadQuestion: false,
            showIntro: true,
            showTeacherInfo: true,
            expandFirstFolder: false,
            isDownloadTextbook: true,
            scoreStyle2: false,
            rankColorBlock: true
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
                description: '強制下載文件而非打開新視窗(Safari無效)'
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
                description: '強制下載文件而非打開新視窗(Safari無效)'
            }],
            '成績': [{
                field: 'scoreStyle2',
                title: '切換成績顯示風格',
                description: '變一塊一塊，適合手機端'
            }, {
                field: 'rankColorBlock',
                title: '顯示排名色塊',
                description: '成績前依據排名顯示色塊'
            }]
        },
        toast: {
            show: false,
            timeout: 3000,
            color: 'success',
            message: '',
            multi: false
        }
    }),
    computed: {
        loginData () {
            return {
                id: this.account.username,
                pass: this.account.password,
                ver: 'C'
            }
        },
        bottomNavColor () {
            switch (this.tag) {
                case 'announce': return 'blue'
                case 'homework': return 'green'
                case 'textbook': return 'orange'
                case 'score': return 'red'
            }
        },
        User () {
            return Bus.User
        },
        Notify () {
            return Bus.Notify
        },
        HomeworkData () {
            return Bus.Homework
        },
        CourseList () {
            return Bus.CourseList
        }
    },
    async created () {
        this.flag.drawer = !this.isMobile
        this.currWeather = this.weather[Math.floor(Math.random() * 100 % 7)]
        window.addEventListener('err', this.onError)

        if (localStorage.setting) this.setting = JSON.parse(localStorage.setting)
        this.updateSetting(this.setting)

        if (navigator.onLine) await this.autoLogin()
        else {
            this.loadLocalData()
            this.showToast({message: '當前處於離線狀態', color: 'info', multi: true})
        }
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
        onScroll: debounce(function () {
            this.isScroll = window.scrollY > 100
        }, 100),
        toTop () {
            window.scroll({ top: 0, behavior: 'smooth' })
        },
        showToast ({message = '', color = 'success', multi = false} = {}) {
            this.toast.show = true
            this.toast.color = color
            this.toast.multi = multi
            this.toast.message = message
        },
        uploadAvatar (e) {
            let file = e.target.files[0]
            if (!file) return
            let reader = new FileReader()
            reader.onloadend = () => {
                this.avatar = reader.result
                localStorage[`avatar${this.User.studentId}`] = reader.result
                this.showToast({message: '設定頭貼成功'})
            }
            reader.readAsDataURL(file)
        },
        updateNotify (item) {
            Bus.$emit('updateNotify', item)
        },
        toNotify (item) {
            this.updateNotify(item)
            this.$router.push({name: 'Course', params: {id: item.courseID}})
            this.focusItem = `${item.type}${item.id}`
            setTimeout(() => { this.focusItem = null }, 1300)
        },
        clearAll () {
            if (!confirm('確定清除所有資料?')) return

            localStorage.clear()
            location.reload()
        },
        onError (e) {
            console.log(e)
            this.err = e.detail
            this.flag.error = true
        },
        keepAlive () {
            /* Ping server every 5min to avoid session expired (expired time = 6min ?) */
            setInterval(() => User.ping(), 1000 * 60 * 5)
        },
        updateSetting (setting) {
            Object.keys(setting).forEach(key => {
                this.$set(this.setting, key, setting[key])
            })
            Bus.$emit('updateSetting', this.setting)
        },
        showLogin () {
            Bus.User.modal = true
        },
        async autoLogin () {
            if (!localStorage.user) {
                this.flag.drawer = false
                return
            }

            Bus.$emit('loadLocalData')
            Bus.User.loading = true
            const mainPage = await User.getIndex()
            if (mainPage.indexOf('權限錯誤') === -1) {
                Bus.$emit('updateUser', {username: JSON.parse(localStorage.user).id, loggedIn: true})
                await this.fetchData()
                return
            }
            await this.login(true)
        },
        async login (remember) {
            let data = remember ? JSON.parse(localStorage.user) : this.loginData

            const result = await User.login(data)
            /* 登入失敗 */
            if (!result.stat) return this.showToast({message: result.message, color: 'error'})

            if (!remember) localStorage.user = JSON.stringify(this.loginData)
            Bus.User.modal = false
            this.showToast({message: '登入成功', color: 'success'})
            Bus.$emit('updateUser', {username: data.username, loggedIn: true})
            await this.fetchData()
        },
        async logout () {
            await User.logout()
            /* prevent autoLogin active */
            localStorage.removeItem('user')
            /* prevent new user use the same data */
            localStorage.removeItem('notify')
            localStorage.removeItem('annNotify')
            localStorage.removeItem('hwNotify')
            /* other localStorage item will be automatically overwrite */
            this.flag.drawer = false
            this.$router.push({path: '/'})
            this.showToast({message: '登出成功', color: 'success'})
            setTimeout(() => { location.href = '/' }, 1000)
        },
        async fetchData () {
            Bus.User.loading = true
            this.flag.drawer = true

            let mainPage = await User.getIndex()
            let user = User.getData(mainPage)
            let courrseList = Course.getList(mainPage)
            Bus.$emit('updateUser', user)

            Bus.$emit('updateCourse', courrseList.data)

            if (localStorage[`avatar${this.User.studentId}`]) {
                this.avatar = localStorage[`avatar${this.User.studentId}`]
            }

            let [announce, homework, textbook] = await Promise.all([Announce.getData(), Homework.getData(), Textbook.getData()])
            Bus.$emit('updateAnnounce', announce.data)
            Bus.$emit('updateHomework', homework.data)
            Bus.$emit('updateTextbook', textbook.data)

            let homeworkFile = await Homework.getAllQuestion(this.HomeworkData)
            Bus.$emit('updateHwFile', homeworkFile.data)

            let isError = !announce.stat || !homework.stat || !homeworkFile.stat || !textbook.stat
            if (isError) this.showToast({message: '取得資料錯誤', color: 'error'})
            else this.showToast({message: '資料更新成功', color: 'info'})

            Bus.User.loading = false
            if (this.$route.params.id) await Course.changeCourse(this.$route.params.id)

            this.keepAlive()
        }
    }
}
</script>

