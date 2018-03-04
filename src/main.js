import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'
import router from './router'
import Vuetify from 'vuetify'

import App from './Layout'

Vue.config.devtools = true
Vue.config.performance = true
Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Vuetify)

new Vue({
    el: '#app',
    router,
    store,
    render: create => create(App)
})
