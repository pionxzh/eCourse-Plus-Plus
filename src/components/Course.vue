<template lang='pug'>
    v-layout(row wrap :key='$route.params.id')
        transition(name='slide-x-transition')
            v-flex.pl-2(xs12 md4 v-if='(isMobile && tag === "announce") || (!isMobile && tag !== "score")')
                v-card.main-card.elevation-1(color='grey lighten-5' flat)
                    v-toolbar(dark color='primary' flat style='overflow: hidden')
                        v-toolbar-side-icon(v-show='search.title'): v-icon mdi-menu
                        v-toolbar-title.no-select(v-show='search.title') 公告
                        v-spacer
                        v-btn(:ripple='false' icon aria-label='search' v-show='!search.flag' @click='toggleSearch')
                            v-icon mdi-magnify
                        v-text-field.exp-search(type='text' label='搜尋標題' ref='search' solo
                            prepend-inner-icon='mdi-magnify' @blur='toggleSearch' light
                            v-model='search.keyword' :class='{"open": search.flag}')
                    v-list.tile-hover.pa-0(two-line subheader light)
                        v-subheader(v-show='search.keyword') 搜尋結果
                        template(v-for='(item, index) in AnnounceList')
                            v-list-tile(avatar :key='item.id' v-show='item.title.indexOf(search.keyword) > -1'
                                @click.native='showAnnounce(index)' :class='{"yellow": focusItem === `1${item.id}`}')
                                v-list-tile-avatar
                                    v-badge.notify(overlap color='red' v-if='item.timeStamp' v-model='AnnNotify[item.id]')
                                        span(slot='badge')
                                        v-icon(medium) mdi-widgets
                                v-list-tile-content
                                    v-list-tile-title {{ item.title }}
                                    v-list-tile-sub-title {{ item.timeStamp }}
                            v-divider(v-if='Setting.showDivider')

        transition(:name='isMobile ? "slide-x-transition" : "slide-y-transition"')
            v-flex.pl-2(xs12 md4 v-if='(isMobile && tag === "homework") || (!isMobile && tag !== "score")')
                v-card#homework.main-card.elevation-1(color='grey lighten-5' flat)
                    v-toolbar(color='green' flat dark)
                        v-toolbar-side-icon: v-icon mdi-menu
                        v-toolbar-title.no-select 作業
                        v-spacer
                        v-tooltip.mr-0.hidden-sm-and-down(left)
                            v-btn(icon aria-label='score' slot='activator' @click='showScore')
                                v-icon mdi-chart-line
                            span 成績
                    v-list.tile-hover.pa-0(two-line subheader light)
                        template(v-for='(item, index) in HomeworkList')
                            v-alert(type='error' icon='mdi-alert' transition='scale-transition' :value='true' v-if='item.timeStamp === today')
                                span(style='font-size: 16px;') ▼▼▼ 作業今日到期 😱
                            v-list-tile(ripple avatar :key='index' :class='{"yellow": focusItem === `2${item.id}`}' @click.native='showHomework(index)')
                                template(v-if='item.id')
                                    v-list-tile-avatar
                                        v-badge.notify(overlap color='red' v-if='item.timeStamp' v-model='HwNotify[item.id]')
                                            span(slot='badge')
                                            v-icon(medium) mdi-clipboard-text
                                    v-list-tile-content
                                        v-list-tile-title {{ item.title }}
                                        v-list-tile-sub-title {{ item.timeStamp }} / {{ item.percentage }}%
                                    v-list-tile-action(v-if='HwFile[item.id] && !!HwFile[item.id].type')
                                        v-tooltip(top)
                                            v-btn(icon aria-label='type' :href='item.url+HwFile[item.id].type' target='_blank' slot='activator')
                                                v-icon(large color='grey lighten-1') {{ fileType[HwFile[item.id].type] || 'mdi-file' }}
                                            span 作業題目
                                    v-list-tile-action(v-if='!isMobile')
                                        v-btn(icon aria-label='upload' @click.stop='showUpload(item.id)')
                                            v-icon(large color='grey') mdi-upload
                                template(v-else)
                                    v-list-tile-avatar
                                    v-list-tile-content
                                        v-list-tile-title {{ item.title }}
                            v-divider(v-if='Setting.showDivider')

        transition(:name='isMobile ? "slide-x-transition" : "slide-x-reverse-transition"')
            v-flex.pl-2(xs12 md4 v-if='(isMobile && tag === "textbook") || (!isMobile && tag !== "score")')
                v-card#textbook.main-card.elevation-1(color='grey lighten-5' flat light)
                    v-toolbar(color='orange' flat dark)
                        v-toolbar-side-icon: v-icon mdi-menu
                        v-toolbar-title.no-select 教材
                        //v-spacer
                        //v-btn(aria-label='search' icon): v-icon mdi-magnify
                    v-list.pa-0(two-line subheader)
                        v-list-tile(v-if='Setting.showIntro' @click='getIntro')
                            v-list-tile-avatar
                                v-icon(large) mdi-file-account
                            v-list-tile-content
                                v-list-tile-title 授課大綱
                        v-divider(v-if='Setting.showDivider')
                        v-list-tile(v-if='Setting.showTeacherInfo' @click='getTeacherInfo')
                            v-list-tile-avatar
                                v-icon(large) mdi-file-account
                            v-list-tile-content
                                v-list-tile-title 教師資訊
                        v-divider(v-if='Setting.showDivider')
                        template(v-for='(item, index) in TextbookList.list')
                            v-list-group(:key='item[0]' :value='index === 0 && Setting.expandFirstFolder' prepend-icon='mdi-folder' append-icon='mdi-chevron-down' v-if='TextbookList.content[index]')
                                v-list-tile(slot='activator' ripple)
                                    v-list-tile-content
                                        v-list-tile-title {{ item[0] }}
                                template(v-for='nitem in TextbookList.content[index]')
                                    v-list-tile(:key='nitem.filename' :title='nitem.filename' :href='nitem.path' target='_blank')
                                        v-list-tile-action
                                            v-icon(large) {{ fileType[nitem.ext] || 'mdi-file' }}
                                        v-list-tile-content
                                            v-list-tile-title {{ nitem.filename }}
                                            v-list-tile-sub-title {{ nitem.time.split(' ')[0] }}
                                    v-divider(v-if='Setting.showDivider')
                            v-divider(v-if='Setting.showDivider')
        transition(:name='isMobile ? "slide-x-transition" : "slide-y-reverse-transition"')
            v-flex.pl-2(xs12 md6 offset-md1 v-if='tag === "score"')
                v-card#score-card.main-card(color='grey lighten-5' flat :class='{"elevation-1": !Setting.scoreStyle2}' light)
                        v-toolbar(color='red' flat dark)
                            v-toolbar-side-icon.ml-2: v-icon mdi-menu
                            v-toolbar-title.no-select 成績
                            v-spacer
                            v-tooltip.mr-0.hidden-sm-and-down(left)
                                v-btn(icon aria-label='score' slot='activator' @click='tag="yo~~"')
                                    v-icon mdi-clipboard-text
                                span 作業
                        template(v-for='(item, key) in ScoreData' v-if='item && item.length')
                            v-list.tile-hover.pa-0(subheader :class='{"stripe": !Setting.scoreStyle2, "block-score": Setting.scoreStyle2}')
                                v-subheader {{ key }}
                                v-list-tile(ripple avatar v-for='slime in item' :key='slime.name + slime.percentage' :class='{"yellow lighten-1": key === "總成績", "color-indicator": Setting.rankColorBlock, "score-item": Setting.scoreStyle2, "elevation-1": Setting.scoreStyle2}' @click='' :style='{"border-color": slime.color}')
                                    v-list-tile-content
                                        v-list-tile-title {{ slime.name }}
                                        v-list-tile-sub-title {{ slime.percentage }}
                                    v-list-tile-action
                                        v-btn.score-block(flat aria-label='rank' outline) {{ slime.rank }}
                                    v-list-tile-action
                                        v-btn.score-block(flat aria-label='score' outline) {{ slime.score }}
        transition(:name='isMobile ? "slide-x-transition" : "slide-y-reverse-transition"')
            v-flex.pl-2(xs12 md4 v-if='tag === "score"')
                v-card#roll-card.main-card.elevation-1(color='grey lighten-5' flat light)
                    v-toolbar(color='purple' flat dark)
                        v-toolbar-side-icon.ml-2: v-icon mdi-menu
                        v-toolbar-title.no-select 點名
                    v-layout.fix-flex(row wrap)
                        template(v-for='item in RollData')
                            v-flex.fix-flex-item.roll-wrapper(xs3 sm3 md2)
                                div.roll-item
                                    div.text(style='font-weight: 800') {{ item[0] }}
                                    div.checkmark(v-if='item[1] === "出席"')
                        v-flex(xs12 v-if='!RollData.length')
                            v-card(flat)
                                v-card-title 沒有點名資料


        v-dialog(v-model='announce.flag' :max-width='isMobile ? 350 : 490')
            v-card#announce.announce-dialog-box(light)
                v-snackbar(:timeout='1000' top=true bottom=false absolute=true color='success' v-model='announce.toastShow') {{announce.message}}
                v-card-title.headline
                    div.text-xs-center(:class='{"hidden-more-text": isMobile}')
                        span {{ announce.title }}
                    v-spacer
                    v-tooltip(top)
                        v-btn(icon aria-label='copy' slot='activator' @click='copyAnnounce')
                            v-icon mdi-content-copy
                        span 複製
                v-card-text(v-html='announce.content')
                v-card-actions
                    v-spacer
                    v-btn(flat aria-label='close' color='green darken-1' @click.native='announce.flag = false') 關閉
                    v-spacer
        v-dialog(v-model='homework.flag' max-width=490)
            v-card#hw.announce-dialog-box(light)
                v-card-title.headline
                    div.text-xs-center(:class='{"hidden-more-text": isMobile}')
                        span {{ homework.title }}
                    v-spacer
                    v-btn(icon aria-label='upload' v-if='isMobile' @click='showUpload(homework.id)')
                        v-icon(color='grey darken-2') mdi-upload
                v-card-text(v-html='homework.content')
                v-card-actions
                    v-spacer
                    v-btn(flat aria-label='close' color='green darken-1' @click.native='homework.flag = false') 關閉
                    v-spacer
        v-dialog(v-model='uploadHW.flag' max-width=600 persistent)
            v-card#file-upload.announce-dialog-box(light style='background-color: #f2f2f2;')
                v-snackbar(:timeout='1000' top=true bottom=false :color='uploadHW.toastColor'
                    v-model='uploadHW.toastShow' absolute=true) {{uploadHW.message}}
                div.headline.text-xs-center.pa-3 作業上傳
                    v-btn.right.ma-0(icon ripple aria-label='close' @click='uploadHW.flag = false')
                        v-icon(medium) mdi-close
                v-layout(row wrap)
                    v-container(fluid)
                        v-subheader(style='color: rgba(0,0,0,0.54)' v-if='uploadHW.list.length') 已交作業
                        v-layout(row wrap)
                            v-flex.upload-wrapper(xs12 sm6 v-for='(file, index) in uploadHW.list' :key='index' v-if='file')
                                div.white.upload-item.elevation-2
                                    v-text-field(
                                        :append-icon='file.success ? "mdi-check-circle" : file.loading ? "mdi-auto-fix" : "mdi-delete"'
                                        :append-icon-cb='() => removeAnswer(index, file.name)'
                                        :color='file.success ? "green" : "gray"'
                                        :class='{"input-group--focused" : file.success}'
                                        loading readonly v-model='file.fName || file.name' :label='file.size'
                                        @click.native='downloadAns(file.name)')
                                        v-progress-linear(v-if='file.loading' slot='progress'
                                        :indeterminate='true'
                                        :value='1' height='4')
                        v-subheader(style='color: rgba(0,0,0,0.54)') 上傳檔案&nbsp;&nbsp;&nbsp;&nbsp;
                            span.red--text ※檔案上限為20mb
                        v-flex(xs12)
                            v-layout(row wrap)
                                v-flex(xs8 sm9 md10)
                                    v-textarea#send-text-input.white-text-field(outline v-model='uploadHW.content' label='直接上傳答案文字' auto-grow)
                                v-flex.pl-2(xs4 sm3 md2)
                                    v-tooltip(left)
                                        v-btn#send-text-btn.mt-0(aria-label='send' color='red darken-1' @click='uploadText($event)' slot='activator' block dark)
                                            v-icon mdi-send
                                        span 送出
                        v-flex(xs12)
                            v-layout(row wrap)
                                v-flex(xs6)
                                    v-card.upload-type(color='blue darken-1' style='margin-right: 5px;' @click.native='$refs.uploadInput.click()' dark)
                                        p.text-xs-center
                                            v-icon(dark) mdi-upload
                                            | 上傳檔案
                                        input(type='file' ref='uploadInput' :multiple='false' @change='uploadFile($event, false)')
                                v-flex(xs6)
                                    v-card.upload-type(color='green darken-1' style='margin-left: 5px;' @click.native='$refs.uploadMulInput.click()' dark)
                                        p.text-xs-center
                                            v-icon(dark) mdi-upload-multiple
                                            | 相關檔案
                                        input(type='file' ref='uploadMulInput' :multiple='true' @change='uploadFile($event, true)')


</template>

<script>
import Bus from '../eventBus.js'

import Util from '../util/Util'
import Score from '../util/Score'
import Course from '../util/Course'
import Homework from '../util/Homework'

const config = require('../config.json')

export default {
    props: ['tab', 'focusItem'],
    data: () => ({
        tag: 'announce',
        isScroll: false,
        today: Util.getToday(),
        isMobile: window.innerWidth < 800,
        search: {
            flag: false,
            title: true,
            keyword: ''
        },
        announce: {
            flag: false,
            text: '',
            title: '',
            content: '',
            toastShow: false,
            toastColor: 'success',
            message: ''
        },
        homework: {
            id: null,
            flag: false,
            title: '',
            content: ''
        },
        scoreUpdate: {},
        uploadHW: {
            flag: false,
            workID: 0,
            content: '',
            list: {},
            toastShow: false,
            toastColor: 'success',
            message: ''
        },
        homeworkAns: {},
        fileType: {
            pdf: 'mdi-file-pdf-box',
            ppt: 'mdi-file-powerpoint-box',
            pptx: 'mdi-file-powerpoint-box',
            doc: 'mdi-file-word-box',
            docx: 'mdi-file-word-box',
            xls: 'mdi-file-excel-box',
            xlsx: 'mdi-file-excel-box',
            txt: 'mdi-file-document-box',
            xml: 'mdi-file-xml',
            jpg: 'mdi-image',
            png: 'mdi-image',
            jpeg: 'mdi-image',
            gif: 'mdi-image-multiple',
            ogg: 'mdi-music-box',
            mp3: 'mdi-music-box',
            mp4: 'mdi-video',
            mpeg: 'mdi-video',
            zip: 'mdi-zip-box',
            rar: 'mdi-zip-box',
            js: 'mdi-language-javascript',
            php: 'mdi-language-php',
            py: 'mdi-language-python-text'
        }
    }),
    computed: {
        courseID () {
            return this.$route.params.id
        },
        AnnounceList () {
            return Bus.Announce[this.$route.params.id] || []
        },
        HomeworkList () {
            return Bus.Homework[this.$route.params.id] || []
        },
        TextbookList () {
            return Bus.Textbook[this.$route.params.id] || {list: {}}
        },
        ScoreData () {
            return Bus.Score[this.$route.params.id] || {'目前沒有成績': null}
        },
        RollData () {
            return Bus.Roll[this.$route.params.id] || []
        },
        HwFile () {
            return Bus.HomeworkFile[this.$route.params.id] || {}
        },
        HwAns () {
            return Bus.homeworkAns[this.$route.params.id] || {}
        },
        AnnNotify () {
            return Bus.AnnouceNotify[this.$route.params.id] || {}
        },
        HwNotify () {
            return Bus.HomeworkNotify[this.$route.params.id] || {}
        },
        Setting () {
            return Bus.Setting
        }
    },
    watch: {
        async tab (newValue) {
            this.tag = 'middle'
            setTimeout(() => { this.tag = newValue }, 300)
            if (newValue === 'score') await this.showScore()
        },
        async courseID (target) {
            if (this.tag === 'score') await this.showScore()
        }
    },
    /* temp fix for mobile device pressing back navigation */
    beforeRouteLeave: function (to, from, next) {
        if (this.announce.flag) {
            this.announce.flag = false
            return next(false)
        }
        if (this.homework.flag) {
            this.homework.flag = false
            return next(false)
        }
        next()
    },
    beforeRouteUpdate: function (to, from, next) {
        if (this.announce.flag) {
            this.announce.flag = false
            return next(false)
        }
        if (this.homework.flag) {
            this.homework.flag = false
            return next(false)
        }
        next()
    },
    methods: {
        toggleSearch () {
            if (this.search.flag) {
                this.search.flag = false
                setTimeout(() => {
                    this.search.title = true
                }, 200)
            } else {
                this.search.flag = true
                this.search.title = false
                setTimeout(() => {
                    this.$refs.search.focus()
                }, 300)
            }
        },
        showUploadToast (message, color) {
            this.uploadHW.toastShow = true
            this.uploadHW.toastColor = color
            this.uploadHW.message = message
        },
        showAnnounce (index) {
            let key = this.AnnounceList[index].id
            if (!this.AnnounceList[index].content) return
            let content = this.AnnounceList[index].content.replace(/\r\n/g, '<br>')
            this.announce.text = content

            if (this.Setting.detectUrl) {
                let urlDetect = /(((?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+)[\w\-._~:/?#[\]@!$&'*+,;=.]+)/g
                content = content.replace(urlDetect, ' <a href="$1" target="_blank">$2...</a> ')
            }

            if (this.Setting.detectDate) {
                let dateDetect = /(([\d]{1,4}\/)?[\d]{1,4}\/[\d]{1,4})(\([\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u65e5\u661f\u671f]{1,3}\))?/g
                content = content.replace(dateDetect, '<u class="date-padding">$1</u>$3')
            }

            this.announce.title = this.AnnounceList[index].title
            this.announce.content = content
            this.announce.flag = true
            if (this.AnnNotify[key]) {
                // this.updateAnnNotify([this.courseID, key])
                Bus.$emit('updateAnnNotify', [this.courseID, key])
            }
        },
        showHomework (index) {
            let key = this.HomeworkList[index].id
            if (!this.HomeworkList[index].content) return

            this.homework = {
                id: key,
                title: this.HomeworkList[index].title,
                content: this.HomeworkList[index].content,
                flag: true
            }
            if (this.HwNotify[this.HomeworkList[index].id]) {
                // this.updateHwNotify([this.courseID, key])
                Bus.$emit('updateHwNotify', [this.courseID, key])
            }
        },
        copyAnnounce () {
            if (!Util.copyToClipboard(this.announce.text)) return

            this.announce.message = '已將內容複製到剪貼簿。'
            this.announce.toastShow = true
        },
        async getIntro () {
            await Course.changeCourse(this.courseID)
            Util.openLink(config.ecourse.INTRO, false)
        },
        async getTeacherInfo () {
            await Course.changeCourse(this.courseID)
            Util.openLink(config.ecourse.TEACHER_INFO, false)
        },
        async downloadAns (fileName) {
            await Course.changeCourse(this.courseID)
            const link = `${config.ecourse.SHOW_WORK}?action=downloadFile&work_id=${this.uploadHW.workID}&filename=${fileName}`
            Util.openLink(link, false)
        },
        async showScore () {
            this.tag = 'score'
            if (this.scoreUpdate[this.courseID]) return
            this.scoreUpdate[this.courseID] = true

            // prevent courseID change when requesting score data
            let courseID = this.courseID
            await Course.changeCourse(courseID)

            let [score, roll] = await Promise.all([Score.getScore(), Score.getRoll()])
            // this.updateScore([courseID, score])
            Bus.$emit('updateScore', [courseID, score])
            // this.updateRoll([this.courseID, roll])
            Bus.$emit('updateRoll', [courseID, roll])
        },
        async showUpload (workID) {
            this.uploadHW.workID = workID
            this.uploadHW.flag = true
            if (!this.homeworkAns[this.courseID]) this.homeworkAns[this.courseID] = {}
            this.uploadHW.list = await Homework.getAnswer(this.courseID, workID)
        },
        async uploadText () {
            await Course.changeCourse(this.courseID)
            let stat = await Homework.uploadText(this.uploadHW.content, this.uploadHW.workID)
            this.uploadHW.list = await Homework.getAnswer(this.courseID, this.uploadHW.workID)
            stat ? this.showUploadToast('上傳成功', 'success') : this.showUploadToast('上傳失敗，請注意上傳日期限制', 'error')
        },
        async uploadFile (e, multiple) {
            await Course.changeCourse(this.courseID)
            const files = e.target.files || e.dataTransfer.files
            if (!files.length) return

            let fileKeys = []
            for (const file of files) {
                fileKeys.push(this.uploadHW.list.length)
                this.uploadHW.list.push({
                    name: file.name,
                    size: Util.getSize(file.size),
                    loading: true
                })
            }

            let result = await Homework.uploadFile(files, multiple, this.courseID, this.uploadHW.workID)
            if (result) {
                for (let key of fileKeys) {
                    this.uploadHW.list[key].loading = false
                    this.uploadHW.list[key].success = true
                }
                this.showUploadToast('上傳成功', 'success')
            } else {
                for (let key of fileKeys) {
                    this.uploadHW.list[key] = null
                }
                return this.showUploadToast('上傳失敗! 請檢查網路狀態或注意上傳日期限制', 'error')
            }
        },
        async removeAnswer (index, fileName) {
            if (!confirm('確定要刪除這個檔案?')) return

            this.uploadHW.list[index] = null
            this.showUploadToast('刪除成功', 'success')
            await Course.changeCourse(this.courseID)
            await Homework.removeAnswer(this.courseID, this.uploadHW.workID, fileName)
        }
    }
}
</script>
