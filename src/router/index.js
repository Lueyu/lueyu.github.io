import Vue from 'vue'
import Router from 'vue-router'
import Feedback from '../components/Feedback.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/feedback/',
    routes: [
        {
            path: '/',
            name: 'Feedback',
            component: Feedback
        }
    ]
})
