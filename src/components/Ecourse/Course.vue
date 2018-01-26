<template lang='pug'>
    v-layout(row wrap :key='$route.params.id')
        v-snackbar(:timeout='toast.timeout' :top='toast.top' :left='toast.left' :right='toast.right' :bottom='toast.bottom' :color='toast.color' v-model='toast.show') {{toast.message}}
        v-flex.pl-2(xs12 sm4)
            v-card.elevation-1(color='grey lighten-5' flat)
                v-toolbar(dark color='primary' flat)
                    v-toolbar-side-icon
                    v-toolbar-title 公告
                    v-spacer
                    v-btn(icon @click='getScore')
                        v-icon search
                v-list(two-line subheader)
                    v-list-tile.cursor-p(avatar v-for='(item, index) in AnnounceList.list' :key='item.id' @click.native='showAnnounce(index)')
                        v-list-tile-avatar
                            v-icon(medium :class='[item.stat]') widgets
                        v-list-tile-content 
                            v-list-tile-title {{ item.title }}
                            v-list-tile-sub-title {{ item.timeStamp }}
                        v-list-tile-action
                            v-btn(icon ripple)
                                v-icon(color='grey lighten-1') info
        v-flex.pl-2(xs12 sm4)
            v-card.elevation-1(color='grey lighten-5' flat)
                v-toolbar(dark color='green' flat)
                    v-toolbar-side-icon
                    v-toolbar-title 作業
                v-list(two-line subheader)
                    v-list-tile.cursor-p(avatar v-for='(item, index) in HomeworkList.list' :key='item.id' @click.native='showHomework(index)')
                        v-list-tile-avatar
                            v-icon(medium v-if='item.timeStamp') assignment
                        v-list-tile-content 
                            v-list-tile-title {{ item.title }}
                            v-list-tile-sub-title(v-if='item.timeStamp') {{ item.timeStamp }} / {{ item.percentage }}%
                        v-list-tile-action(v-if='item.timeStamp && HomeworkFileList[item.id]')
                            v-tooltip(top)
                                v-btn(icon ripple v-if='!!HomeworkFileList[item.id].type' 
                                    @click.stop='downloadQues(item.id, HomeworkFileList[item.id].type)' slot='activator')
                                    v-icon(large color='grey lighten-1') {{ fileType[HomeworkFileList[item.id].type] || 'mdi-file' }}
                                span 作業題目
                        v-list-tile-action(v-if='item.timeStamp')
                            v-btn(icon ripple @click.stop='showUpload(item.id)')
                                v-icon(large color='grey') mdi-upload
                        
        v-flex.pl-2(xs12 sm4)
            v-card.elevation-1(color='grey lighten-5' flat)
                v-toolbar(dark color='orange' flat)
                    v-toolbar-side-icon
                    v-toolbar-title 教材
                    v-spacer
                    v-btn(icon @click='$forceUpdate')
                        v-icon search
                v-list(two-line subheader)
                    v-list-group(v-for='(item, index) in TextbookList.list' :key='item[0]' :value='index === 0 && Setting.expandFirstFolder')
                        v-list-tile(slot='item')
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
            v-card.announce-dialog-box
                div.headline.text-xs-center.pa-3 檔案上傳
                v-layout(row wrap)
                    v-flex(xs12)
                        div.upload-wrapper
                            v-text-field(v-if='!!uploadHW.list' v-for='file in uploadHW.list' :key='file.timeStamp' :append-icon='file.success ? "mdi-check-circle" : "close"' :color='file.success ? "green" : "gray"' :class='{"input-group--focused" : file.success}' loading readonly v-model='file.name' :label='file.size' :append-icon-cb='() => removeAnswer(file.name)')
                                v-progress-linear(slot='progress' :indeterminate='file.progress !== 100' :value='file.progress' height='4')
                    v-flex(xs12)
                        v-container(fluid)
                            v-layout(row wrap)
                                v-flex(xs10)
                                    v-text-field(v-model='uploadHW.content' label="直接上傳答案文字" textarea auto-grow)
                                v-flex(xs2 style='padding-left: 10px;')
                                    v-tooltip(bottom)
                                        v-btn(color='red darken-1' dark block style='margin-top: 18px;height: 158px;font-size: 18px;' @click='uploadText($event)' slot='activator') 
                                            v-icon send
                                        span 送出
                    v-flex(xs12)
                        v-container(fluid)
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
                v-card-actions
                    v-spacer
                    v-btn(color='green darken-1' flat='flat' @click='uploadHW.flag = false') 關閉
                    v-spacer


</template>

<script>
import Score from '../Score'
import Util from '../Util'
import Homework from '../Homework'
import { mapGetters } from 'vuex'

export default {
    data: () => ({
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
            stat: false,
            flag: false,
            uploaded: false,
            list: {},
            toastShow: false,
            toastColor: 'success',
            toastMessage: ''
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
            HomeworkFile: 'getHomeworkFile'
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
        HomeworkFileList () {
            return this.HomeworkFile[this.$route.params.id] || localStorage.homeworkFile ? JSON.parse(localStorage.homeworkFile)[this.$route.params.id] : {}
        },
        HomeworkAnsList () {
            return this.homeworkAns[this.$route.params.id] || {}
        }
    },
    methods: {
        errHandler (e) {
            console.log(e.message)
            this.loading = false
        },
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
            let link = `https://ecourse.ccu.edu.tw${url.slice(8)}`
            Util.openLink(link, this.Setting.isDownloadTextbook)
        },
        downloadQues (id, type) {
            let link = `https://ecourse.ccu.edu.tw/${this.courseID}/homework/${id}/teacher/Question.${type}`
            Util.openLink(link, this.Setting.isDownloadQuestion)
        },
        async getScore () {
            await Score.getScore()
        },
        async showUpload (workID) {
            this.uploadHW.workID = workID
            this.uploadHW.flag = true
            if (!this.homeworkAns[this.courseID]) this.homeworkAns[this.courseID] = {}
            this.uploadHW.list = await Homework.getMyAnswer(this.courseID, workID)
            // this.homeworkAns[this.courseID][workID] = result
        },
        async uploadText () {
            await Homework.uploadText(this.uploadHW.content, this.uploadHW.workID)
            this.uploadHW.list = await Homework.getMyAnswer(this.courseID, this.uploadHW.workID)
        },
        async uploadFile (e) {
            const files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            this.uploadHW.list.push({
                name: files[0].name,
                size: Util.getSize(files[0].size),
                progress: 1
            })
            let result = await Homework.uploadFile(files, this.courseID, this.uploadHW.workID)
            console.log(result)
            this.uploadHW.uploaded = true
            this.uploadHW.stat = result
            if (!result) return
            this.showToast({message: '上傳成功', color: 'success'})
            this.uploadHW.list = await Homework.getMyAnswer(this.courseID, this.uploadHW.workID)
            this.uploadHW.list[this.uploadHW.list.length - 1].success = true
        },
        async removeAnswer (fileName) {
            if (!confirm('確定要刪除這個檔案?')) return
            await Homework.removeAnswer(this.courseID, this.uploadHW.workID, fileName)
            this.showToast({message: '刪除成功', color: 'success'})
            this.uploadHW.list = await Homework.getMyAnswer(this.courseID, this.uploadHW.workID)
        }
    }
}
</script>
