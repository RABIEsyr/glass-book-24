import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Vuelidate from "vuelidate";
import VueWindowSize from "vue-window-size";
import i18n from './i18n'
import CountryFlag from 'vue-country-flag'
import Chat from 'vue-beautiful-chat'
import VueScrollTo from 'vue-scrollto'
//import io from "socket.io-client";

import {library} from '@fortawesome/fontawesome-svg-core';
import {faPhone} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
library.add(faPhone);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(VueWindowSize);
Vue.use(CountryFlag);
Vue.use(VueScrollTo)
Vue.use(Chat)

Vue.filter('date', function (value) {
  let a = new Date(value);
  console.log('data filter')
  let c = new Date();
  if (a.getTime() == c.getTime()) {
    return 'today'
  }
  else {
    return value;
  }
})

export const eventBus = new Vue({

  methods: {
    passPhoto(photo) {
      this.$emit("photoChanged", photo);
    },
    openPostDialog() {
      this.$emit("openPostDialog", true);
    },
    shareImageSearchUser(image) {
      this.$emit("searchUserImage", image);
    },
    onNavPost(post) {
      this.$emit('onNavPost', post)
    },
    onUnreadMessage(msg) {
      this.$emit('onUnreadMessage', msg)
    },
    marginTopCustomPost(top) {
      this.$emit('marginTopCus', top)
    },
    onGlobalResize(width) {
      this.$emit('onGlobalResize', width);
    }
  }
});
new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
