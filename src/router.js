import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Ecourse from '@/components/App'
import Course from '@/components/Course'
import CourseTable from '@/components/CourseTable'

Vue.use(Router)

export default new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [{
        path: '/',
        component: Ecourse,
        children: [{
            name: 'Main',
            path: '/',
            component: Main
        }, {
            name: 'Course',
            path: '/course/:id',
            component: Course
        }, {
            name: 'table',
            path: '/timeTable',
            component: CourseTable
        }]
    }, {
        path: '/*',
        redirect: '/'
    }]
})
