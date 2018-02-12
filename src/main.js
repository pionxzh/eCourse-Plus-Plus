import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'
import router from './router.js'
import Vuetify from 'vuetify'
import CourseTable from './components/Ecourse/CourseTable.vue'

import App from './Layout'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(Vuetify)
Vue.component('course-table', CourseTable)

new Vue({
    el: '#app',
    router,
    store,
    render: create => create(App)
})
