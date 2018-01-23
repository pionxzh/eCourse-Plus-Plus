import Vue from 'vue'
import Router from 'vue-router'
import Ecourse from '@/components/Ecourse/App'
import Course from '@/components/Ecourse/Course'
import CourseMain from '@/components/Ecourse/CourseMain'

Vue.use(Router)

export default new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [{
        path: '/',
        name: 'Ecourse',
        component: Ecourse,
        children: [{
            path: '/course',
            name: 'Course',
            component: CourseMain
        }, {
            path: '/course/:id',
            component: Course
        }]
    }, {
        path: '/*',
        redirect: '/'
    }]
})
