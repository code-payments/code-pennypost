import {
    createMemoryHistory,
    createRouter as _createRouter,
    createWebHistory,
} from "vue-router";

import PageHome from './components/pages/PageHome.vue'
import PageEditor from './components/pages/PageEditor.vue'
import PageArticle from './components/pages/PageArticle.vue'
import PageShare from './components/pages/PageShare.vue';
import PageCatchLogin from './components/pages/PageCatchLogin.vue'
import PageCatchPayment from './components/pages/PageCatchPayment.vue'
import PageSettings from './components/pages/PageSettings.vue';

const intent = `:intent`;
const offset = `:offset`;
const post = `:slug/:title`;

const routes = [
    { path: `/`, name: 'home', component: PageHome },

    { path: `/p/${post}`, name: 'post', props: true, component: PageArticle },
    { path: `/p/${post}/${offset}`, name: 'post-with-offset', props: true, component: PageArticle },

    { path: `/write`, name: 'write', component: PageEditor },
    { path: `/share/${post}`, name: 'share', props: true, component: PageShare },

    { path: `/redirect/login/${intent}`, name: 'catch-login', props: true, component: PageCatchLogin },
    { path: `/redirect/payment/${intent}/post/${post}/${offset}`, name: 'catch-payment', props: true, component: PageCatchPayment },

    { path: '/account-settings', name: 'account-settings', component: PageSettings },
]

export const createRouter = () =>
    _createRouter({
        history: import.meta.env.SSR
            ? createMemoryHistory("/")
            : createWebHistory("/"),
        routes,
    });