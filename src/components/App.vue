<template lang='pug'>
    v-app#ccu(:class='{"weather-theme": setting.weatherTheme}')
        v-navigation-drawer.gray-bg(persistent v-model='flag.drawer' enable-resize-watcher app)
            v-toolbar#personal-info.pa-3(flat)
                v-list.pa-0(two-line)
                    v-list-tile.px-4(v-if='!User.loggedIn')
                        v-list-tile-content
                            v-btn(color='primary' aria-label='login' @click='flag.login = true' :loading='loading' :disabled='loading' dark) 登入
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
                    
            v-list.pt-0.striped.course-list(dense :two-line='isMobile' :three-line='!isMobile')
                v-list-tile
                    v-list-tile-action
                    v-list-tile-content
                        v-list-tile-title#course-head
                            span 課程列表
                    v-list-tile-action
                        v-tooltip(right)
                            v-btn(icon aria-label='table' slot='activator' :to='{ name: "table"}')
                                v-icon mdi-table-large
                            span 課表
                v-list-tile(v-for='(item, index) in CourseList' :key='item.id' :to="{name: 'Course', params: {id: item.id}}" :ripple='!isMobile')
                    v-list-tile-action
                    v-list-tile-content
                        v-list-tile-title.course-list-name
                            span {{item.name}}
                        v-list-tile-sub-title
                            span {{item.professor}}
        v-toolbar#color-nav(dark color='primary' fixed app :class='{"is-scroll": isScroll}')
            v-toolbar-side-icon(@click.stop='flag.drawer = !flag.drawer'): v-icon mdi-menu
            router-link.cursor-p(tag='div' :to="{ path: '/' }"): v-toolbar-title#ecourse-logo.no-select eCourse+
            v-spacer
            v-menu
                v-btn#setting-btn(icon aria-label='setting' slot='activator')
                    v-icon mdi-settings
                v-list
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='flag.theme = true') &nbsp;&nbsp;主題
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='flag.setting = true') &nbsp;&nbsp;設定
                    v-list-tile.list__tile--link
                        v-list-tile-title(@click='flag.about = true') &nbsp;&nbsp;關於本站
                    //v-list-tile.list__tile--link
                        v-list-tile-title(@click='fetchData') &nbsp;&nbsp;強制刷新&nbsp;&nbsp;
                    v-divider
                    v-list-tile.list__tile--link(v-if='!User.loggedIn')
                        v-list-tile-title(@click='flag.login = true')
                            | &nbsp;
                            v-icon mdi-logout-variant
                            | &nbsp;登入
                    v-list-tile.list__tile--link(v-if='User.loggedIn')
                        v-list-tile-title(@click='logout')
                            | &nbsp;
                            v-icon mdi-logout-variant
                            | &nbsp;登出
        v-snackbar.short(:timeout='toast.timeout' :top='toast.top' :left='toast.left' :right='toast.right' :bottom='toast.bottom' :color='toast.color' v-model='toast.show' :multi-line='toast.multi') {{toast.message}}
        div.theme-wrapper
            svg.bg-mask(v-if='setting.weatherTheme' :class='currWeather' viewBox='0 0 1 1' preserveAspectRatio='xMidYMid slice')
                defs
                    mask#mask(fill='url(#gradient)')
                        rect(x='0' y='0' width='1' height='1')
                    linearGradient#gradient(x1='0' y1='0' x2='100%' y2='0' spreadMethod='pad' gradientTransform='rotate(45)')
                        stop(offset='0%' stop-color='#fff' stop-opacity='1')
                        stop(offset='100%' stop-color='#fff' stop-opacity='0')
                rect.gradient-bg(x='0' y='0' width='100' height='100')
                rect.gradient-fg(x='0' y='0' width='100' height='100' mask='url(#mask)')
            div#mountain(v-if='setting.weatherTheme' :class='{"horizon": $route.path === "/"}')
        v-content(:class='{"mb-5": $route.params.id, "mb-0": !$route.params.id}')
            transition(name='slide' mode='out-in')
                v-jumbotron.main-card(v-if='$route.path === "/"' gradient='to right top, #1867c0, #19e5f4' height='auto' dark)
                    v-container(fill-height align-center :class='{"py-5": !isMobile}')
                        v-layout.text-xs-center(align-center wrap)
                            v-flex.no-select(xs12)
                                v-avatar.grey.lighten-4(:size='isMobile ? 174 : 194' :class='{"mt-4": isMobile, "mt-5": !isMobile}')
                                    img(src='../../static/icon.png' alt='Logo')
                                    div(:class="{mobile: isMobile}").img-circle
                                h1.display-3.head-name eCourse+
                                div.headline.mb-3.mx-3 輕鬆瀏覽公告、作業、教材與成績
                                div.mb-5
                                    v-tooltip(top)
                                        v-btn.mx-3(icon large color='white' href='https://fb.me/EcourseP' target='_blank' rel='noopener' slot='activator')
                                            v-icon(color='primary') mdi-facebook
                                        span Facebook
                                    v-tooltip(top)
                                        v-btn.mx-3(icon large color='white' slot='activator')
                                            v-icon(color='primary') mdi-twitter
                                        span 別按了 沒有twitter
                                    v-tooltip(top)
                                        v-btn.mx-3(icon large color='white' href='https://github.com/pionxzh/eCourse-Plus-Plus' target='_blank' rel='noopener' slot='activator')
                                            v-icon(color='primary') mdi-github-circle
                                        span GitHub
                                v-btn.mb-2.white--text(style='background-color: #e91e63;' v-if='!User.loggedIn' :loading='loading' :disabled='loading' @click='flag.login = true' large)
                                    strong 開始使用
                                v-btn.mb-2.primary--text(color='white' v-if='User.loggedIn && isMobile && !isApp' @click='showpPrompt' large)
                                    v-icon mdi-apps
                                    strong &nbsp;添加為App
                                v-btn.mb-2.primary--text(color='white' v-if='User.loggedIn && (!isMobile | isApp)' :to='{ name: "table"}' large)
                                    v-icon mdi-apps
                                    strong &nbsp;查看課表
                                div Version 1.0.4
                                div - 新增天色主題
                                div - 修復若干介面錯誤
                v-container(fluid v-else)
                    transition(name='slide' mode='out-in')
                        keep-alive
                            router-view(:tab.sync='tag')

        v-bottom-nav.hidden-md-and-up(app fixed shift :active.sync='tag' :color='bottomNavColor' v-if='$route.params.id')
            v-btn(flat dark value='announce')
                span 公告
                v-icon mdi-calendar-text
            v-btn(flat dark value='homework')
                span 作業
                v-icon mdi-clipboard-text
            v-btn(flat dark value='textbook')
                span 教材
                v-icon mdi-book-open-variant
            v-btn(flat dark value='score')
                span 成績
                v-icon mdi-chart-line
        v-footer#footer.hidden-sm-and-down(absolute v-if='$route.path === "/"')
            v-spacer
            span © 2018 Developed by Pionxzh
            v-spacer
        v-fab-transition
            v-btn.hidden-sm-and-down(fixed aria-label='fab' bottom right dark fab color='red' v-show='isScroll' v-scroll='onScroll' @click='toTop' style='margin: 6px 8px;') 
                v-icon mdi-chevron-up
        v-fab-transition.hidden-sm-and-down
            v-speed-dial.hidden-sm-and-down(fixed bottom right :open-on-hover='!isMobile' transition='slide-x-transition' v-show='$route.params.id && !isScroll' style='z-index: 10;')
                v-btn(slot='activator' aria-label='close' color='red' dark fab)
                    v-icon mdi-rocket
                v-tooltip(left)
                    v-btn(fab dark aria-label='setting' color='blue darken-2' slot='activator' @click='flag.setting = true')
                        v-icon mdi-settings
                    span 設定
                v-tooltip(left)
                    v-btn(fab dark aria-label='score' color='pink' slot='activator' @click='tag = "score"')
                        v-icon mdi-chart-line
                    span 成績
        v-dialog(v-model='flag.theme' max-width=450)
            v-toolbar.cyan.no-select(dark)
                v-icon mdi-brightness-6
                v-toolbar-title 主題
                v-spacer
                v-btn.mr-3(icon @click='flag.theme = false'): v-icon mdi-close
            v-card.dialog-box
                v-container(fluid grid-list-md)
                    v-layout(row wrap)
                        v-flex(xs6)
                            v-card.theme-card(@click.native='setting.weatherTheme=false')
                                v-card-media(:src="require('../assets/nav.png')" height='200px')
                                v-card-text 預設主題
                        v-flex(xs6)
                            v-card.theme-card(@click.native='setting.weatherTheme=true')
                                v-card-media(:src="require('../assets/weather.png')" height='200px')
                                v-card-text 天色主題
                
        v-dialog(v-model='flag.setting' max-width=450 :fullscreen='isMobile' scroll)
            v-toolbar.blue.no-select(dark :fixed='isMobile')
                v-icon mdi-wrench
                v-toolbar-title 設定
                v-spacer
                v-btn.mr-3(icon @click='flag.setting = false'): v-icon mdi-close
            v-list.tile-hover(two-line subheader :class='{"mt-5": isMobile}')
                template(v-for='(item, key) in settingData')
                    v-subheader.no-select(:key='key') {{ key }}
                    v-list-tile(v-for='subItem in item' :key='subItem.title' ripple avatar @click='')
                        v-list-tile-action
                            v-switch(color='blue darken-1' v-model='setting[subItem.field]')
                        v-list-tile-content(@click='setting[subItem.field] = !setting[subItem.field]')
                            v-list-tile-title {{ subItem.title }}
                            v-list-tile-sub-title {{ subItem.description }}
                    v-divider
        v-dialog(v-model='flag.about' max-width=450)
            v-toolbar.red.no-select(dark)
                v-icon mdi-flash-circle
                v-toolbar-title 關於
                v-spacer
                v-btn.mr-3(icon @click='flag.about = false'): v-icon mdi-close
            v-list.tile-hover(two-line subheader)
                v-subheader.no-select 關於
                v-list-tile(ripple avatar @click='')
                    v-list-tile-action
                        v-icon mdi-code-array
                    v-list-tile-content
                        v-list-tile-title eCourse+ 
                        v-list-tile-sub-title v1.0.3
                v-list-tile(ripple avatar @click='')
                    v-list-tile-action
                        v-icon mdi-account-circle
                    v-list-tile-content
                        v-list-tile-title 作者
                        v-list-tile-sub-title @Pionxzh  ← 歡迎找我吃雞 ID一樣
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
                        v-list-tile-sub-title 如果你覺得我的作品不錯，歡迎贊助我一杯咖啡:D
        v-dialog(width='300px' v-model='flag.login')
            v-card.dialog-box
                v-card-title.headline: div.text-xs-center 登入帳號
                v-card-text(style='font-size: 15px;') ※請輸入
                    b 單一入口帳號密碼
                    v-container(grid-list-md)
                        v-layout(wrap)
                            v-flex(xs12)
                                v-text-field(label='帳號' required v-model='username')
                            v-flex(xs12)
                                v-text-field(label='密碼' required type='password' v-model='password' @keyup.enter='login(false)')
                v-card-actions
                    v-spacer
                    v-btn(color='blue darken-1' aria-label='login' :loading='loading' @click='login(false)' large dark)
                        v-icon mdi-flash
                        | 登入
                    v-spacer

</template>

<script>
import User from '../util/User'
import Course from '../util/Course'
import Announce from '../util/Announce'
import Homework from '../util/Homework'
import Textbook from '../util/Textbook'
import debounce from 'lodash/debounce'
// import NotifyManager from './../NotifyManager'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Ecourse',
    data: () => ({
        loading: false,
        isScroll: false,
        isApp: false,
        isMobile: window.innerWidth < 800,
        deferredPrompt: null,
        tag: 'announce',
        username: '',
        password: '',
        avatar: '',
        weather: ['dawn', 'sunrise', 'golden-hour', 'golden-hour-end', 'sunset', 'dusk', 'night'],
        currWeather: null,
        flag: {
            drawer: true,
            theme: false,
            setting: false,
            login: false,
            about: false
        },
        setting: {
            showDivider: false,
            weatherTheme: false,
            enableNotify: false,
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
            '通知': [{
                field: 'enableNotify',
                title: '啟用通知功能',
                description: '自動檢查新公告、新作業，顯示在右上小鈴鐺'
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
                title: '切換成績風格',
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
            top: true,
            right: false,
            bottom: false,
            left: false,
            color: 'success',
            message: '',
            multi: false
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
        },
        bottomNavColor () {
            switch (this.tag) {
                case 'announce': return 'blue'
                case 'homework': return 'green'
                case 'textbook': return 'orange'
                case 'score': return 'red'
            }
        }
    },
    async created () {
        if (this.isMobile) this.flag.drawer = false
        this.isApp = this.isWebApp()
        this.currWeather = this.weather[Math.floor(Math.random() * 100 % 8)]
        if (localStorage.setting) this.setting = JSON.parse(localStorage.setting)
        this.updateSetting(this.setting)

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault()
            this.deferredPrompt = event
            return false
        })

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
        ...mapActions([
            'updateUser',
            'updateCourse',
            'updateAnnounce',
            'updateHomework',
            'updateTextbook',
            'updateSetting',
            'updateHwFile',
            'loadLocalData',
            'clearData'
        ]),
        onScroll: debounce(function () {
            this.isScroll = window.scrollY > 100
        }, 100),
        toTop () {
            window.scroll({ top: 0, behavior: 'smooth' })
        },
        isWebApp () {
            return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches
        },
        showToast ({message = '', top = true, right = false, bottom = false, left = false, color = 'success', multi = false, timeout = 1500} = {}) {
            this.toast.show = true
            this.toast.top = top
            this.toast.right = right
            this.toast.bottom = bottom
            this.toast.left = left
            this.toast.color = color
            this.toast.multi = multi
            this.toast.timeout = timeout
            this.toast.message = message
        },
        showpPrompt () {
            if (this.deferredPrompt) this.deferredPrompt.prompt()
            else this.showToast({message: '呼叫失敗，可在瀏覽器設定中找到"添加至桌面"選項', color: 'error', multi: true})
        },
        uploadAvatar (e) {
            let file = e.target.files[0]
            if (!file) return
            let reader = new FileReader()
            reader.onloadend = () => {
                this.avatar = reader.result
                localStorage[`avatar${this.User.studentId}`] = reader.result
            }
            reader.readAsDataURL(file)
        },
        keepAlive () {
            /* Ping server every 5min to avoid session expired (expired time = 6min ?) */
            setInterval(() => User.ping(), 1000 * 60 * 5)
        },
        async autoLogin () {
            if (!localStorage.user) {
                this.flag.drawer = false
                return
            }
            this.loadLocalData()
            this.loading = true
            let mainPage = await User.getIndex()
            if (mainPage.indexOf('權限錯誤') === -1) {
                /* 考慮移除updateUser，可以存在這個instance裡頭就好 */
                this.updateUser({username: JSON.parse(localStorage.user).id, loggedIn: true})
                await this.fetchData()
                return
            }
            await this.login(true)
        },
        async login (remember) {
            let data = remember ? JSON.parse(localStorage.user) : this.loginData

            let result = await User.login(data)
            /* 登入失敗 */
            if (!result.stat) return this.showToast({message: result.message, color: 'error'})

            if (!remember) localStorage.user = JSON.stringify(this.loginData)
            this.flag.login = false
            this.showToast({message: '登入成功', color: 'success'})
            this.updateUser({username: data.username, loggedIn: true})
            await this.fetchData()
        },
        async logout () {
            await User.logout()
            this.clearData()
            this.flag.drawer = false
            this.$router.push({path: '/'})
            this.showToast({message: '登出成功', color: 'success'})
        },
        async fetchData () {
            this.loading = true
            this.flag.drawer = true

            let mainPage = await User.getIndex()
            let user = User.getData(mainPage)
            let courrseList = Course.getList(mainPage)
            this.updateUser(user)
            this.updateCourse(courrseList.data)
            if (localStorage[`avatar${this.User.studentId}`]) {
                this.avatar = localStorage[`avatar${this.User.studentId}`]
            }

            let [announce, homework, textbook] = await Promise.all([Announce.getData(), Homework.getData(), Textbook.getData()])
            this.updateAnnounce(announce.data)
            this.updateHomework(homework.data)
            this.updateTextbook(textbook.data)

            let homeworkFile = await Homework.getAllQuestion(this.HomeworkData)
            this.updateHwFile(homeworkFile.data)

            let isError = !announce.stat || !homework.stat || !homeworkFile.stat || !textbook.stat
            if (isError) this.showToast({message: '取得資料錯誤', color: 'error'})
            else this.showToast({message: '資料更新成功', color: 'info'})

            this.loading = false
            if (this.$route.params.id) await Course.changeCourse(this.$route.params.id)

            this.keepAlive()
        }
    }
}
</script>

