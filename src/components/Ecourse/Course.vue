<template lang='pug'>
    v-layout(row wrap :key='$route.params.id')
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
                            v-list-tile-sub-title(v-if='item.timeStamp') {{ item.timeStamp }} / {{ item.percentage }}
                        v-list-tile-action(v-if='item.timeStamp')
                            v-btn(icon ripple @click.stop='showUpload(item.id)')
                                v-icon(medium color='grey') mdi-upload
                        v-list-tile-action(v-if='item.timeStamp && HomeworkFileList[item.id]')
                            v-tooltip(top)
                                v-btn(icon ripple v-if='!!HomeworkFileList[item.id].type' 
                                    @click.stop='downloadQues(item.id, HomeworkFileList[item.id].type)' slot='activator')
                                    v-icon(large color='grey lighten-1') {{ fileType[HomeworkFileList[item.id].type] || 'mdi-file' }}
                                span 作業題目
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
                                    v-list-tile-sub-title {{ nitem[3] }}
                            
                        
        v-dialog(v-model='announce.flag' max-width=490)
            v-card.announce-dialog-box
                v-card-title.headline
                    div.text-xs-center {{ announce.title }}
                    v-spacer
                    v-tooltip(top)
                        v-btn.right(icon slot='activator'): v-icon mdi-content-copy
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
        v-dialog(v-model='uploadHw.flag' max-width=600 persistent)
            v-card.announce-dialog-box
                v-card-title.headline: div.text-xs-center 上傳
                v-layout(row wrap)
                    v-flex(xs12)
                        div(v-for='(file, index) in homeworkAns[uploadHw.id]')
                            v-text-field(append-icon='close' readonly v-model='file.name' :label='file.size' :append-icon-cb='removeAns(index)')
                    v-flex(xs12 md6)
                        v-container(fluid)
                            v-layout(wrap)
                                v-flex(xs12)
                                    v-text-field(label="直接上傳文字" textarea)
                                    v-btn(color='blue' dark style='margin-left: 90px') 送出
                    v-flex(xs12 md6)
                        v-container(fluid)
                            v-card.upload-type(color='blue' style='margin-top: 18px;' @click.native='$refs.uploadInput.click()' dark)
                                p.text-xs-center 
                                    v-icon(dark) mdi-upload
                                    | 單一檔案
                                input(type='file' ref='uploadInput' :multiple='false' @change='uploadFile')
                            v-card.upload-type(color='green darken-1' style='margin-top: 6px;' @click.native='$refs.uploadMulInput.click()' dark)
                                p.text-xs-center
                                    v-icon(dark) mdi-upload-multiple
                                    | 多個檔案
                                input(type='file' ref='uploadMulInput' :multiple='true' @change='uploadFile')
                v-card-actions
                    v-spacer
                    v-btn(color='green darken-1' flat='flat' @click.native='uploadHw.flag = false') 關閉
                    v-spacer

</template>

<script>
import Score from '../Score'
import Homework from '../Homework'
import { mapGetters } from 'vuex'

export default {
    data: () => ({
        announce: {
            flag: false,
            title: '',
            contnet: ''
        },
        homework: {
            flag: false,
            title: '',
            contnet: ''
        },
        textbook: {
            flag: false
        },
        uploadHw: {
            workID: null,
            stat: false,
            flag: false,
            uploaded: false
        },
        homeworkAns: [],
        fileType: {
            pdf: 'mdi-file-pdf-box',
            ppt: 'mdi-file-powerpoint-box',
            pptx: 'mdi-file-powerpoint-box',
            doc: 'mdi-file-word-box',
            docx: 'mdi-file-word-box',
            xls: 'mdi-file-excel-box',
            xlsx: 'mdi-file-excel-box',
            xml: 'mdi-file-xml',
            jpg: 'mdi-image',
            png: 'mdi-image',
            jpeg: 'mdi-image',
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
        }
    },
    methods: {
        errHandler (e) {
            console.log(e.message)
            this.loading = false
        },
        showAnnounce (key) {
            let content = this.AnnounceList.list[key].content.replace(/\r\n/g, '<br>')

            if (this.Setting.detectUrl) {
                let urlDetect = /(((?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+)[\w\-._~:/?#[\]@!$&'*+,;=.]+)/g
                content = content.replace(urlDetect, ' <a href="$1" target="_blank">$2...</a> ')
            }

            if (this.Setting.detectDate) {
                let dateDetect = /(([\d]{1,4}\/)?[\d]{1,4}\/[\d]{1,4})(\([\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u65e5\u661f\u671f]{1,3}\))?/g
                content = content.replace(dateDetect, '<u class="date-padding">$1</u>')
            }

            this.announce.flag = true
            this.announce.title = this.AnnounceList.list[key].title
            this.announce.content = content
        },
        async showHomework (index) {
            this.homework.flag = true
            this.homework.title = this.HomeworkList.list[index].title
            this.homework.content = this.HomeworkList.list[index].content
            console.log(await Homework.getMyAnswer(this.courseID, this.HomeworkList.list[index].id))
        },
        dayDiff (time) {
            let old = new Date(time)
            let now = Date().now
            let timeDiff = Math.abs(now - old)
            return timeDiff < 1000 * 3600 * 24 * 200
        },
        downloadTextbook (link) {
            window.open(`/ec${link.slice(8)}`)
        },
        downloadQues (id, type) {
            let link = document.createElement('a')
            if (this.Setting.isDownloadQuestion) link.download = true
            link.target = '_blank'
            link.href = `https://ecourse.ccu.edu.tw/${this.courseID}/homework/${id}/teacher/Question.${type}`
            link.click()
            link.remove()
        },
        getScore () {
            Score.getScore()
        },
        showUpload (id) {
            this.uploadHw.workID = id
            this.uploadHw.flag = true
        },
        uploadFile (e) {
            let result = Homework.uploadFile(e, this.courseID, this.uploadHw.workID)
            this.uploadHw.uploaded = true
            this.uploadHw.stat = result.stat
            this.homeworkAns = result.list
        },
        removeAns (fileName) {
            let result = Homework.removeAns(this.courseID, this.uploadFile.id, fileName)
            console.log(result)
        }
    }
}
</script>
