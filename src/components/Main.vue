<template lang='pug'>
    v-layout.text-xs-center(align-center wrap)
        v-flex.no-select(xs12)
            v-avatar.grey.lighten-4(:size='isMobile ? 174 : 194' :class='{"mt-4": isMobile}')
                img(src='../../static/icon.png' alt='Logo')
                div(:class='{mobile: isMobile}').img-circle
            h1.head-name eCourse+
            div.headline.mb-3.mx-3 輕鬆瀏覽公告、作業、教材與成績
            div.mb-5
                v-tooltip(top)
                    v-btn.mx-3(icon large color='white' href='https://fb.me/EcourseP' target='_blank' rel='noopener' slot='activator')
                        v-icon(color='primary') mdi-facebook
                    span Facebook
                v-tooltip(top)
                    v-btn.mx-3(icon large color='white' slot='activator')
                        v-icon(color='primary') mdi-twitter
                    span 其實沒有twitter
                v-tooltip(top)
                    v-btn.mx-3(icon large color='white' href='https://github.com/pionxzh/eCourse-Plus-Plus' target='_blank' rel='noopener' slot='activator')
                        v-icon(color='primary') mdi-github-circle
                    span GitHub
            v-btn.mb-2.white--text(style='background-color: #e91e63;' v-if='!User.loggedIn' :loading='User.loading' :disabled='User.loading' @click='showLogin' large)
                strong 開始使用
            v-btn.mb-2.primary--text(color='white' v-if='User.loggedIn && isMobile && !isApp' @click='showpPrompt' large)
                | #[v-icon mdi-apps] #[strong 添加為App]
            v-btn.mb-2(color='pink' v-if='User.loggedIn && (!isMobile | isApp)' to='/timeTable' large)
                | #[v-icon mdi-apps] #[strong 查看課表]
            div.mt-3 v1.0.13
            div - 教材現在可以選擇排序規則了
            div -「授課大綱」、「教師資訊」移到卡片的右上角囉 (PC版)
</template>

<script>
import Bus from '../eventBus.js'

export default {
    name: 'Ecourse',
    data: () => ({
        isApp: window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches,
        deferredPrompt: null,
        isMobile: window.innerWidth < 800
    }),
    created () {
        if (this.isMobile) {
            window.addEventListener('beforeinstallprompt', this.onInstall, false)
        }
    },
    computed: {
        User () {
            return Bus.User
        }
    },
    methods: {
        onInstall (event) {
            event.preventDefault()
            window.removeEventListener('beforeinstallprompt', this.onInstall, false)
            this.deferredPrompt = event
            return false
        },
        showpPrompt () {
            if (this.deferredPrompt) this.deferredPrompt.prompt()
            else alert('呼叫失敗，可在瀏覽器設定中找到"添加至桌面"選項')
        },
        showLogin () {
            Bus.User.modal = true
        }
    }
}
</script>
