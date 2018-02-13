<template lang="pug">
    v-container(align-center)
        v-layout.text-xs-center(wrap ref='layout')
            v-flex(xs12 style='z-index: 3;')
                div.term(@click='term=1') 上學期
                v-btn(flat icon @click='fetch')
                    v-icon(light) mdi-refresh
                div.term(@click='term=2') 下學期

            v-flex(xs2 sm2 md1)
                div.time-item(v-for='(item, index) in hour' :key='item'
                    :style='{"top": `${15 + index * timeHeight}px`}'
                    @click='selected = "none"')
                    span {{ item }} -
            v-flex(xs2 v-for='(day, index) in week' :key='day' @click='selected = "none"')
                div.course-item(@click='selected = "none"') {{ day }}
                template(v-for='course in table[index]')
                    div.course-item(:style='{"top": `${course.distance * height}px`, "height": `${(course.end - course.start) * height}px`}'
                        :class='{"active": selected === course.id}'
                        @click.stop='showInfo(course)')
                        div.course-text-wrapper
                            span.course-title(:class='{"small": course.name.length > 10}') {{ isMobile ? course.name.slice(0, 10) : course.name }}
                            span.course-location(v-if='!isMobile && course.name.length < 10') {{ course.time }}
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
        /* (innerHeight - 128(nav) - 60 - 12(reload btn)) - total time */
        setTimeout(() => { this.height = (window.innerHeight - 188) / 840 }, 300)
        /* (innerHeight - 128(nav) - 31*18 - 12(reload btn) ) / 15gap */
        this.timeHeight = (window.innerHeight - 686) / 15
    },
    data: () => ({
        top: 0,
        height: 0.5,
        timeHeight: 10,
        isMobile: window.innerWidth < 600,
        term: 1,
        selected: null,
        week: ['星期一', '星期二', '星期三', '星期四', '星期五'],
        hour: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
        table: null,
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
            console.log()
            await CourseTable.login()
            this.table = await CourseTable.getData(this.term)
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

<style scoped>
    .container {
        margin-top: 32px!important;
    }
    .term, .time-item, .course-item {
        padding: 5px;
        margin: 5px;
        color: #fafafa;
        transition: .3s;
        position: relative;
        border-radius: 3px;
        user-select: none;
        -webkit-user-drag: none;
    }
    .term, .course-item {
        background: #607d8b;
        font-size: 14px;
    }
    .term {
        display: initial;
        background: #009688;
    }
    .time-item {
        color: #1c1c1c;
    }
    .term:hover,
    .time-item:hover,
    .course-item:hover {
        cursor: pointer;
        background: #587380;
    }
    .course-text-wrapper {
        display: flex;
        max-height: 100%;
        overflow: hidden;
        flex-direction: column;
        justify-content: center;
        min-height: 100%;
    }
    .course-title {
        font-size: 17px;
    }
    .course-title.small {
        font-size: 15px;
    }
    .course-location {
        font-weight: 300;
    }
    .course-dialog {
        background: #fafafa;
        color: #1c1c1c;
        font-size: 18px;
        padding: 20px;
        border-radius: 3px;
    }

    .weather-theme .icon {
        color: white;
    }
    .weather-theme .container {
        margin-top: 0px!important;
    }
    .weather-theme .term, .weather-theme .course-item {
        background: rgba(255, 255, 255, .2);
        font-size: 14px;
    }
    .weather-theme .time-item {
        color: white;
    }
    .weather-theme .time-item:hover,
    .weather-theme .course-item:hover {
        background: rgba(255, 255, 255, .3);
    }
    .weather-theme .course-item.active {
        background: rgba(255, 255, 255, .4);
    }


    @media screen and (max-width:600px) {
        .container {
            margin-top: -32px!important;
        }
        .weather-theme .container {
            margin-top: -48px!important;
        }
        .time-item {
            padding: 6px 0;
            font-size: 13px;
        }       
        .course-item {
            padding: 4px 0;
            margin: 5px 2px;
            font-size: 14px;
        }
        .course-title {
            font-size: 12px!important;
        }
    }
</style>
