import Vue from 'vue'
import App from './Layout'
import router from './router'

// import Vuetify from 'vuetify'
import {
    Vuetify,
    VApp,
    VAlert,
    VAvatar,
    VBtn,
    VBadge,
    VBottomNav,
    VCard,
    VDialog,
    VDivider,
    VGrid,
    VImg,
    VIcon,
    VJumbotron,
    VList,
    VMenu,
    VSwitch,
    VSnackbar,
    VSubheader,
    VToolbar,
    VTooltip,
    VTextarea,
    VTextField,
    VNavigationDrawer,
    transitions
} from 'vuetify'
import { Scroll, Ripple } from 'vuetify/es5/directives'

Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.config.performance = process.env.NODE_ENV !== 'production'
Vue.config.productionTip = false

// Vue.use(Vuex)
// Vue.use(Vuetify)
Vue.use(Vuetify, {
    components: {
        VApp,
        VAlert,
        VAvatar,
        VBtn,
        VBadge,
        VBottomNav,
        VCard,
        VDialog,
        VDivider,
        VGrid,
        VImg,
        VIcon,
        VJumbotron,
        VList,
        VMenu,
        VSubheader,
        VSnackbar,
        VSwitch,
        VToolbar,
        VTooltip,
        VTextarea,
        VTextField,
        VNavigationDrawer,
        transitions
    },
    directives: {
        Ripple,
        Scroll
    }
})

new Vue({
    el: '#app',
    router,
    render: create => create(App)
})
