import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'
import router from './router'
import Vuetify from 'vuetify'
import TopProgress from './components/TopProgress'

import App from './Layout'

Vue.config.devtools = true
Vue.config.performance = true
Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.component(TopProgress.name, TopProgress)

new Vue({
    el: '#app',
    router,
    store,
    render: create => create(App)
})
