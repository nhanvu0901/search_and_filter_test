import {createApp, h} from 'vue/dist/vue.esm-bundler';
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import 'bootstrap'
import {createApp as createAppBridge} from '@shopify/app-bridge';

var app = createApp({
    name: 'App',
    render: () => {
        return <App/>
    }
})
let url = new URL(location.href);
let hasPassword = url.searchParams.has('password_master');

if (hasPassword) {
    if (url.searchParams.get('password_master') === window.nb_current_time) {
        app.mount('#nestbundle-app')
    }
} else {
    const appBridge = createAppBridge({
        apiKey: nb_settings.k,
        host: new URLSearchParams(location.search).get("host"),
        forceRedirect: true
    });
    appBridge.getState().then(() => {
        app.mount('#nestbundle-app')
    })
}
window.nb_current_time = Date.now()
