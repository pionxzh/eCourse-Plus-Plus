<template lang="pug">
    v-container(align-center)
        v-layout.text-xs-center(wrap ref='layout')
            v-flex(xs12)
                v-btn(flat icon color='primary' @click='fetch' style='margin-top: 2.5px;')
                    v-icon(dark) mdi-refresh
            v-flex(xs2 sm2 md1)
                div.time-item(v-for='(item, index) in hour' :key='item' :style='{"top": `${15 + index * timeHeight}px`}' @click='selected = "none"')
                    span {{ item }}
            v-flex(xs2 v-for='(day, index) in week' :key='day' @click='selected = "none"')
                div.course-item(@click='selected = "none"') {{ day }}
                template(v-for='course in table[index]')
                    div.course-item(:style='{"top": `${course.distance * height}px`, "height": `${(course.end - course.start) * height}px`}' :class='{"active": selected === course.id}' @click.stop='selected = course.id')
                        span.course-name {{ course.name }}
                        p {{ course.location }}
                        p {{ course.time }}
            v-dialog(width='300px' v-model='flag')
</template>

<script>
import CourseTable from '../CourseTable'

export default {
    async created () {
        if (localStorage.courseTable) this.table = JSON.parse(localStorage.courseTable)
        else this.fetch()
    },
    mounted () {
        this.height = (window.innerHeight - 178) / 840
        /* window.innerHeight - nav height - 31 * 18 */
        this.timeHeight = (window.innerHeight - 686) / 15
    },
    data: () => ({
        flag: false,
        top: 0,
        height: 800,
        timeHeight: 10,
        selected: null,
        week: ['星期一', '星期二', '星期三', '星期四', '星期五'],
        hour: ['7: 00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
        table: null
    }),
    methods: {
        async fetch () {
            console.log()
            await CourseTable.login()
            this.table = await CourseTable.getData()
        }
    }
}
</script>

<style scoped>
    .time-item, .course-item {
        padding: 5px;
        margin: 5px;
        color: #fafafa;
        transition: .3s;
        position: relative;
        border-radius: 3px;
    }
    .course-item {
        background: rgba(255, 255, 255, .2)
    }
    .course-title {
        font-size: 17px
    }
    .time-item:hover, .course-item:hover {
        cursor: pointer;
        background: rgba(255, 255, 255, .3)
    }
    .course-item.active {
        height: 18vh!important;
        background: rgba(255, 255, 255, .4)
    }
    .course-item p {
        display: none;
        opacity: 0;
        transition: .3s;
    }
    .course-item.active p {
        display: block;
        opacity: 1;
    }
    @media screen and (max-width:600px) {
        .container {
            margin-top: -25px!important;
        }
        .course-item {
            font-size: 12px;
        }
    }
</style>
