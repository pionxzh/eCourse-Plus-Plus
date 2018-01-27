<template lang='pug'>
    v-layout(row wrap :key='$route.params.id')
        v-snackbar(:timeout='3000' :top='toast.top' :left='toast.left' :right='toast.right' :bottom='toast.bottom' :color='toast.color' v-model='toast.show') {{toast.message}}
        v-flex.pl-2(xs12 md4)
            v-card.elevation-1(color='grey lighten-5' flat)
                v-toolbar(dark color='primary' flat style='overflow: hidden')
                    v-toolbar-side-icon
                    v-toolbar-title(v-show='!search') 公告
                    v-spacer
                    v-btn.mr-3(icon v-show='!search' @click='expandSearch')
                        v-icon search
                    v-text-field.exp-search(type='text' label='搜尋標題' ref='search' solo
                        prepend-icon='search'
                        @blur='search = false'
                        :class='{"open": search}'
                        v-model='searchText')
                v-list.tile-hover(two-line subheader)
                    v-list-tile.cursor-p(avatar v-for='(item, index) in AnnounceList.list'
                    :key='item.id'
                    v-if='item.title.indexOf(searchText) !== -1'
                    @click.native='showAnnounce(index)')
                        v-list-tile-avatar
                            v-badge.notify(overlap color='red' v-model='AnnNotify[item.id]')
                                span(slot='badge')
                                v-icon(medium :class='[item.stat]') widgets
                        v-list-tile-content
                            v-list-tile-title {{ item.title }}
                            v-list-tile-sub-title {{ item.timeStamp }}
                        
        v-flex.pl-2(xs12 md4)
            v-card.elevation-1(color='grey lighten-5' flat)
                v-toolbar(dark color='green' flat)
                    v-toolbar-side-icon
                    v-toolbar-title 作業
                    v-spacer
                    v-tooltip.mr-0(left)
                        v-btn(icon slot='activator' @click='showScore')
                            v-icon mdi-chart-line
                        span 成績
                v-list.tile-hover(two-line subheader)
                    v-list-tile.cursor-p(avatar v-for='(item, index) in HomeworkList.list' :key='item.id' @click.native='showHomework(index)')
                        v-list-tile-avatar
                            v-icon(medium v-if='item.id') assignment
                        v-list-tile-content 
                            v-list-tile-title {{ item.title }}
                            v-list-tile-sub-title(v-if='item.id') {{ item.timeStamp }} / {{ item.percentage }}%
                        v-list-tile-action(v-if='item.id && HwFile[item.id] && !!HwFile[item.id].type')
                            v-tooltip(top)
                                v-btn(icon ripple @click.stop='downloadQues(item.id, HwFile[item.id].type)' slot='activator')
                                    v-icon(large color='grey lighten-1') {{ fileType[HwFile[item.id].type] || 'mdi-file' }}
                                span 作業題目
                        v-list-tile-action(v-if='item.id')
                            v-btn(icon ripple @click.stop='showUpload(item.id)')
                                v-icon(large color='grey') mdi-upload
                        
        v-flex.pl-2(xs12 md4)
            v-card.elevation-1(color='grey lighten-5' flat)
                v-toolbar(dark color='orange' flat)
                    v-toolbar-side-icon
                    v-toolbar-title 教材
                    v-spacer
                    v-btn(icon)
                        v-icon search
                v-list(two-line subheader)
                    v-list-tile.cursor-p.fix-hover(v-if='Setting.showIntro' @click.native='downloadIntro')
                        v-list-tile-avatar
                            v-icon(large) mdi-file-account
                        v-list-tile-content 
                            v-list-tile-title 授課大綱
                    v-list-group(v-for='(item, index) in TextbookList.list' :key='item[0]' :value='index === 0 && Setting.expandFirstFolder')
                        v-list-tile(v-if='TextbookList.content[index][0]' slot='item')
                            v-list-tile-avatar
                                v-icon folder
                            v-list-tile-content 
                                v-list-tile-title {{ item[0] }}
                                v-list-tile-sub-title
                            v-list-tile-action
                                v-btn(icon ripple)
                                    v-icon(color='grey lighten-1') keyboard_arrow_down
                        template(v-for='(nitem, nindex) in TextbookList.content[index][0]')
                            //v-subheader {{ item[index][nindex] }}
                            v-list-tile.cursor-p(:key='nitem[0]' @click.native='downloadTextbook(nitem[1])')
                                v-list-tile-avatar
                                    v-icon(large) {{ fileType[nitem[4]] || 'mdi-file' }}
                                v-list-tile-content 
                                    v-list-tile-title {{ nitem[0] }}
                                    v-list-tile-sub-title {{ nitem[3].split(' ')[0] }}

        v-dialog(v-model='announce.flag' max-width=490)
            v-card.announce-dialog-box
                v-snackbar(:timeout='3000' :top='true' :bottom='false' color='success' v-model='announce.toastShow' :absolute='true') {{announce.message}}
                v-card-title.headline
                    div.text-xs-center {{ announce.title }}
                    v-spacer
                    v-tooltip(top)
                        v-btn.right(icon slot='activator' @click='copyAnnounce')
                            v-icon mdi-content-copy
                        span 複製
                    v-tooltip(top)
                        v-btn.right(icon slot='activator'): v-icon mdi-camera
                        span 截圖
                v-card-text(v-html='announce.content')
                v-card-actions
                    v-spacer
                    v-btn(color='green darken-1' flat='flat' @click.native='announce.flag = false') 關閉
                    v-spacer
        v-dialog(v-model='homework.flag' max-width=490)
            v-card.announce-dialog-box
                v-card-title.headline: div.text-xs-center {{ homework.title }}
                v-card-text(v-html='homework.content')
                v-card-actions
                    v-spacer
                    v-btn(color='green darken-1' flat='flat' @click.native='homework.flag = false') 關閉
                    v-spacer
        v-dialog(v-model='uploadHW.flag' max-width=600 persistent)
            v-card.announce-dialog-box(style='background-color: #f2f2f2;')
                v-snackbar(:timeout='3000' :top='true' :bottom='false' :color='uploadHW.toastColor' v-model='uploadHW.toastShow' :absolute='true') {{uploadHW.message}}
                div.headline.text-xs-center.pa-3 作業上傳
                    v-btn.right.ma-0(icon ripple @click='uploadHW.flag = false') 
                        v-icon(medium) close
                v-layout(row wrap)
                    v-container(fluid)
                        v-subheader(style='color: rgba(0,0,0,0.54)') 已交作業
                        v-layout(row wrap)
                            v-flex.upload-wrapper(xs6 v-for='file in uploadHW.list' :key='file.id')
                                div.white.upload-item.elevation-2.cursor-p
                                    v-text-field(:append-icon='file.success ? "mdi-check-circle" : file.new ? "none" : "delete"' :color='file.success ? "green" : "gray"' :class='{"input-group--focused" : file.success}' loading readonly v-model='file.name' :label='file.size' :append-icon-cb='() => removeAnswer(file.name)' @click.native='downloadAns(file.name)')
                                        v-progress-linear(v-if='file.new' slot='progress' :indeterminate='true' :value='1' height='4')
                        v-subheader(style='color: rgba(0,0,0,0.54)') 上傳檔案
                        v-flex(xs12)
                            v-layout(row wrap)
                                v-flex(xs10)
                                    v-text-field.white-text-field.pt-0(v-model='uploadHW.content' label="直接上傳答案文字" textarea auto-grow)
                                v-flex.pl-2(xs2)
                                    v-tooltip(bottom)
                                        v-btn.mt-0.send-text-btn(color='red darken-1' dark block @click='uploadText($event)' slot='activator') 
                                            v-icon send
                                        span 送出
                        v-flex(xs12)
                            v-layout(row wrap)
                                v-flex(xs6)
                                    v-card.upload-type(color='blue darken-1' style='margin-right: 5px;' @click.native='$refs.uploadInput.click()' dark)
                                        p.text-xs-center 
                                            v-icon(dark) mdi-upload
                                            | 上傳檔案
                                        input(type='file' ref='uploadInput' :multiple='false' @change='uploadFile')
                                v-flex(xs6)
                                    v-card.upload-type(color='green darken-1' style='margin-left: 5px;' @click.native='$refs.uploadMulInput.click()' dark)
                                        p.text-xs-center
                                            v-icon(dark) mdi-upload-multiple
                                            | 相關檔案
                                        input(type='file' ref='uploadMulInput' :multiple='true' @change='uploadFile')
        v-fab-transition
            v-btn(fixed bottom right dark fab color='red' v-show='isScroll' v-scroll='onScroll' @click='toTop' style='margin: 6px 8px;') 
                v-icon mdi-chevron-up
        v-fab-transition
            v-speed-dial(fixed bottom right hover transition='slide-x-transition' v-show='!isScroll')
                v-btn(slot='activator' color='red' dark fab hover)
                    v-icon add
                    v-icon mdi-rocket
                v-tooltip(left)
                    v-btn(fab dark color='green' @click='flag.setting = true' slot='activator')
                        v-icon mdi-settings
                    span 設定
                v-tooltip(left)
                    v-btn(fab dark color='pink' slot='activator')
                        v-icon mdi-chart-line
                    span 成績


</template>

<script>
import Score from '../Score'
import Util from '../Util'
import Homework from '../Homework'
import { mapGetters, mapActions } from 'vuex'

const config = require('../../config.json')

export default {
    data: () => ({
        isScroll: false,
        search: false,
        searchText: '',
        announce: {
            flag: false,
            text: '',
            title: '',
            contnet: '',
            toastShow: false,
            toastColor: 'success',
            message: ''
        },
        homework: {
            flag: false,
            title: '',
            contnet: ''
        },
        textbook: {
            flag: false
        },
        uploadHW: {
            workID: 0,
            content: '',
            flag: false,
            list: {},
            toastShow: false,
            toastColor: 'success',
            message: ''
        },
        homeworkAns: {},
        toast: {
            show: false,
            timeout: 3000,
            top: true,
            right: false,
            bottom: false,
            left: false,
            color: 'success',
            message: ''
        },
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
        },
        loading: false
    }),
    created () {
    },
    computed: {
        ...mapGetters({
            User: 'getUser',
            CourseList: 'getCourseList',
            Announce: 'getAnnounce',
            Homework: 'getHomework',
            Textbook: 'getTextbook',
            Setting: 'getSetting',
            HomeworkFile: 'getHomeworkFile',
            AnnouceNotify: 'getAnnNotify',
            HomeworkNotify: 'getHwNotify'
        }),
        courseID () {
            return this.$route.params.id
        },
        AnnounceList () {
            return this.Announce[this.$route.params.id] || {name: 'QAO找不到', list: {}}
        },
        HomeworkList () {
            return this.Homework[this.$route.params.id] || {name: 'QAO找不到', list: {}}
        },
        TextbookList () {
            return this.Textbook[this.$route.params.id] || {name: 'QAO找不到', list: {}}
        },
        HwFile () {
            return this.HomeworkFile[this.$route.params.id] || localStorage.homeworkFile ? JSON.parse(localStorage.homeworkFile)[this.$route.params.id] : {}
        },
        HwAns () {
            return this.homeworkAns[this.$route.params.id] || {}
        },
        AnnNotify () {
            return this.AnnouceNotify[this.$route.params.id] || {}
        },
        HwNotify () {
            return this.HomeworkNotify[this.$route.params.id] || {}
        }
    },
    methods: {
        ...mapActions([
            'updateAnnNotify',
            'updateHwNotify'
        ]),
        onScroll () {
            this.isScroll = window.scrollY > 200
        },
        toTop () {
            window.scroll({ top: 0, behavior: 'smooth' })
        },
        expandSearch () {
            this.search = true
            setTimeout(() => {
                this.$refs.search.focus()
            }, 300)
        },
        showToast ({message = '', top = true, right = false, bottom = false, color = 'success'} = {}) {
            this.toast.show = true
            this.toast.top = top
            this.toast.right = right
            this.toast.bottom = bottom
            this.toast.color = color
            this.toast.message = message
        },
        showAnnounce (key) {
            let content = this.AnnounceList.list[key].content.replace(/\r\n/g, '<br>')
            this.announce.text = content

            if (this.Setting.detectUrl) {
                let urlDetect = /(((?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+)[\w\-._~:/?#[\]@!$&'*+,;=.]+)/g
                content = content.replace(urlDetect, ' <a href="$1" target="_blank">$2...</a> ')
            }

            if (this.Setting.detectDate) {
                let dateDetect = /(([\d]{1,4}\/)?[\d]{1,4}\/[\d]{1,4})(\([\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u65e5\u661f\u671f]{1,3}\))?/g
                content = content.replace(dateDetect, '<u class="date-padding">$1</u>$3')
            }
            this.updateAnnNotify([this.courseID, this.AnnounceList.list[key].id])
            this.announce.flag = true
            this.announce.title = this.AnnounceList.list[key].title
            this.announce.content = content
        },
        showHomework (index) {
            this.homework.flag = true
            this.homework.title = this.HomeworkList.list[index].title
            this.homework.content = this.HomeworkList.list[index].content
        },
        copyAnnounce () {
            if (!Util.copyToClipboard(this.announce.text)) return
            this.announce.toastShow = true
            this.announce.message = '已將內容複製到剪貼簿。'
        },
        downloadTextbook (url) {
            let link = `${config.ecourse.HOST}${url.slice(8)}`
            Util.openLink(link, this.Setting.isDownloadTextbook)
        },
        downloadIntro () {
            Util.openLink(config.ecourse.INTRO, false)
        },
        downloadQues (id, type) {
            let link = `${config.ecourse.HOST}/${this.courseID}/homework/${id}/teacher/Question.${type}`
            Util.openLink(link, this.Setting.isDownloadQuestion)
        },
        downloadAns (fileName) {
            let link = `${config.ecourse.HOST}/php/Testing_Assessment/show_allwork.php?action=downloadFile&work_id=${this.uploadHW.workID}&filename=${fileName}`
            Util.openLink(link, false)
        },
        async showScore () {
            await Score.getScore()
        },
        async showUpload (workID) {
            this.uploadHW.workID = workID
            this.uploadHW.flag = true
            if (!this.homeworkAns[this.courseID]) this.homeworkAns[this.courseID] = {}
            let result = await Homework.getAnswer(this.courseID, workID)
            this.uploadHW.list = result.map(item => {
                item.new = false
                return item
            })
        },
        async uploadText () {
            await Homework.uploadText(this.uploadHW.content, this.uploadHW.workID)
            this.uploadHW.list = await Homework.getAnswer(this.courseID, this.uploadHW.workID)
            this.uploadHW.toastShow = true
            this.uploadHW.toastColor = 'success'
            this.uploadHW.message = '上傳成功'
        },
        async uploadFile (e) {
            const files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            this.uploadHW.list.push({
                id: Math.random() * 1000,
                name: files[0].name,
                size: Util.getSize(files[0].size),
                new: true
            })
            let result = await Homework.uploadFile(files, this.courseID, this.uploadHW.workID)
            if (!result) return
            this.uploadHW.list = await Homework.getAnswer(this.courseID, this.uploadHW.workID)
            this.uploadHW.list[this.uploadHW.list.length - 1].success = true
            this.uploadHW.toastShow = true
            this.uploadHW.toastColor = 'success'
            this.uploadHW.message = '上傳成功'
        },
        async removeAnswer (fileName) {
            if (!confirm('確定要刪除這個檔案?')) return
            await Homework.removeAnswer(this.courseID, this.uploadHW.workID, fileName)
            this.uploadHW.list = await Homework.getAnswer(this.courseID, this.uploadHW.workID)
            this.uploadHW.toastShow = true
            this.uploadHW.toastColor = 'success'
            this.uploadHW.message = '刪除成功'
        }
    }
}
</script>
