<template lang="pug">
    v-container#course-table(align-center)
        v-layout.text-xs-center(wrap ref='layout')
            v-flex(xs12 style='z-index: 3;')
                div.term(@click='changeTerm(107, 1)') 上學期
                v-btn(flat icon :loading='loading' @click='fetch')
                    v-icon#reload-table(light) mdi-refresh
                div.term(@click='changeTerm(106, 2)') 下學期

            v-flex(xs2 sm2 md1)
                div.time-item(v-for='(item, index) in hour' :key='item'
                    :style='{"top": `${15 + index * timeHeight}px`}'
                    @click='selected = "none"')
                    span {{ item }} -
            v-flex(xs2 v-for='(day, index) in week' :key='day' @click='selected = "none"')
                div.course-item(@click='selected = "none"') {{ day }}
                template(v-for='course in table[index]')
                    div.course-item(:style='{"top": `${course.distance * height}px`, "height": `${(course.end - course.start) * height}px`}'
                        :class='{"active": selected === course.id, "pa-0": course.end-course.start<60}'
                        @click.stop='showInfo(course)')
                        div.course-text-wrapper
                            span.course-title(:class='{"small": course.name.length > 7 && (course.end - course.start)<76}') {{ isMobile ? course.name.slice(0, 10) : course.name }}
                            span(v-if='!isMobile && (course.name.length < 10 || course.end-course.start > 75)') {{ course.time }}
            v-dialog(width='300px' v-model='dialog.flag')
                div.text-xs-center.course-dialog
                    p(style='font-size: 24px;padding-bottom: 20px;') {{ dialog.name }}
                    p 授課教授:&nbsp;
                        b {{ dialog.professor }}
                    p 上課地點:&nbsp;
                        b {{ dialog.location }}
                    p 上課時間:&nbsp;
                        b {{ dialog.time }}
</template>

<script>
import CourseTable from '../util/CourseTable'

export default {
    async created () {
        if (localStorage.courseTable) this.table = JSON.parse(localStorage.courseTable)
        else this.fetch()
    },
    mounted () {
        /* ( innerHeight - 128(nav) - 60 ) - total time */
        setTimeout(() => { this.height = (window.innerHeight - 188) / 840 }, 300)
        /* ( innerHeight - 128(nav) - 31*18 ) / 15gap */
        this.timeHeight = (window.innerHeight - 686) / 15
    },
    data: () => ({
        top: 0,
        height: 0.5,
        timeHeight: 10,
        isMobile: window.innerWidth < 600,
        year: 107,
        term: 1,
        selected: null,
        loading: false,
        week: ['星期一', '星期二', '星期三', '星期四', '星期五'],
        hour: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
        table: [],
        dialog: {
            flag: false,
            name: null,
            professor: null,
            location: null,
            time: null
        }
    }),
    methods: {
        async fetch () {
            if (!localStorage.user) return alert('請先登入')
            this.loading = true
            await CourseTable.login()
            let result = await CourseTable.getData(this.year, this.term)
            if (result) this.table = result
            else alert('更新失敗!選課系統維護中')
            this.loading = false
        },
        async changeTerm (year, term) {
            this.year = year
            this.term = term
            await this.fetch()
        },
        showInfo (course) {
            this.selected = course.id
            this.dialog.name = course.name
            this.dialog.professor = course.professor
            this.dialog.location = course.location
            this.dialog.time = course.time
            this.dialog.flag = true
        }
    }
}
</script>
