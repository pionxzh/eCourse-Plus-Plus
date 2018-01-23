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
                    v-list-tile(avatar v-for='(item, index) in AnnounceList.list' :key='item.title' @click='showAnnounce(index)')
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
                    v-list-tile(avatar v-for='(item, index) in HomeworkList.list' :key='item.title' @click='showHomework(index)')
                        v-list-tile-avatar
                            v-icon(v-if='item.timeStamp') assignment
                        v-list-tile-content 
                            v-list-tile-title {{ item.title }}
                            v-list-tile-sub-title(v-if='item.timeStamp') {{ item.timeStamp }} / {{ item.percentage }}
                        v-list-tile-action(v-if='item.timeStamp && homeworkFile[index]')
                            v-btn(icon ripple @click.stop='downloadQuestion(item.id, homeworkFile[index].type)')
                                v-icon(large color='grey lighten-1') {{ fileType[homeworkFile[index].type] || 'mdi-file' }}
        v-flex.pl-2(xs12 sm4)
            v-card.elevation-1(color='grey lighten-5' flat)
                v-toolbar(dark color='orange' flat)
                    v-toolbar-side-icon
                    v-toolbar-title 教材
                    v-spacer
                    v-btn(icon)
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
                            v-list-tile(:key='nitem[0]' @click='downloadTextbook(nitem[1])')
                                v-list-tile-avatar
                                    v-icon(medium) {{ fileType[nitem[4]] || 'mdi-file' }}
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
        v-dialog(:persistent='lockDialog' v-model='homework.flag' max-width=490)
            v-card.announce-dialog-box
                v-card-title.headline: div.text-xs-center {{ homework.title }}
                v-card-text(v-html='homework.content')
                v-btn(color='blue' dark @click.stop='selectFile') 選擇檔案
                input(type='file' ref='uploadInput' multiple='false' @change='updateFile')
                v-card-actions
                    v-spacer
                    v-btn(color='green darken-1' flat='flat' @click.native='homework.flag = false') 關閉
                    v-spacer

</template>

<script>
import axios from 'axios'
import Homework from '../Homework'
import { mapGetters } from 'vuex'

let Decoder = new TextDecoder('big5')
const config = require('../../config.json')

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
        homeworkFile: {},
        lockDialog: false,
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
    activated () {
        console.log('yo')
        this.getFileList()
    },
    computed: {
        ...mapGetters({
            User: 'getUser',
            CourseList: 'getCourseList',
            Announce: 'getAnnounce',
            Homework: 'getHomework',
            Textbook: 'getTextbook',
            Setting: 'getSetting'
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
        async showHomework (key) {
            this.homework.flag = true
            this.homework.title = this.HomeworkList.list[key].title
            this.homework.content = this.HomeworkList.list[key].content
            this.homeworkFile[key] = await Homework.getQuestion(this.courseID, this.HomeworkList.list[key].id)
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
        async getScore () {
            await axios.get(config.ecourse.COURSE_SELECT + '106_1_' + this.courseID)
            .then(response => {
                // console.log(response.data)
            })
            .catch(e => this.errHandler)

            let score = await axios.get(config.ecourse.COURSE_SCORE, {responseType: 'arraybuffer'}).catch(e => this.errHandler(e))
            let scoreData = $.parseHTML(Decoder.decode(score.data))
            let scoreNode = $(scoreData).find('tr[bgcolor="#4d6eb2"], tr[bgcolor="#E6FFFC"], tr[bgcolor="#F0FFEE"], tr[bgcolor="B0BFC3"]').get()
            console.log('length: ', scoreNode.length)
            scoreNode.forEach(element => {
                let row = $(element).find('td')
                let scoreItem = {
                    name: $(row[0]).text(),
                    percent: $(row[1]).text(),
                    score: $(row[2]).text(),
                    rank: $(row[3]).text()
                }
                console.log(scoreItem)
            })
        },
        getFileList () {
            this.Homework[this.courseID].list.forEach(async (element, index) => {
                this.homeworkFile[index] = await Homework.getQuestion(this.courseID, element.id)
            })
        },
        downloadQuestion (id, type) {
            window.open(`https://ecourse.ccu.edu.tw/${this.courseID}/homework/${id}/teacher/Question.${type}`)
        },
        selectFile () {
            this.lockDialog = true
            this.$refs.uploadInput.click()
            this.lockDialog = false
            // return false
        },
        updateFile (e) {
            console.log(e)
        }
    }
}
</script>
