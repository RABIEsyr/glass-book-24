<template>
  <v-container>
    <v-row>
      <v-col :cols="width > 500 ? postCol : 12" >
        <!-- <div v-for="post in posts" :key="post._id" @click="inPostClick(post)"> -->
      <div v-for="post in posts" :key="post._id" >
        <my-post
          :image="'http://localhost:3000/static/' + post._id + '.PNG'"
          :name="post.text"
          :id="post._id"
          :commentsArr="post.comments"
          :likeNumber="post.likes.length"
          :likesArr="post.likes"
          :owner="post.owner"
          :ownerName="post.owner.name"
          :ownerId="post.owner._id"
          :date="post.date"
          :ref="post._id"
        >
        </my-post>
    </div>
      </v-col>
      <v-col v-if="width > 940">
        <v-btn
          fab
          dark
          small
          color="pink"
          @click="onEditSize()" class="togglePostReview" :style="{'margin-top': marginTop + 'px'}">
          <v-icon  class="icon">{{mdiIcon}}</v-icon>
        </v-btn
         >
        <CustomNewPost  :maxWidth.sync="maxWidth2" :marginLeft.sync="marginLeft"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Post from "./post";
// import { mapActions } from "vuex";
import * as types from "../../store/types";
// import axios from "axios";
import io from "socket.io-client";
 import { eventBus } from "../../main";
import CustomNewPost from '../custom-new-post/stepperNewPost.vue';

global.jQuery = require("jquery");
var $ = global.jQuery;
window.$ = $;

export default {
  data: () => ({
    postCol: 9,
    index: 0,
    width: window.innerWidth,
    // posts: [],
     socket: io("http://localhost:3000", {
        query: { token: localStorage.getItem("token") },
    }),
    maxWidth2: 200,
    mdiIcon: 'mdi-chevron-left',
    marginLeft: '12%',
    marginTop: 3,
  }),
  computed: {
    posts() {
      console.log("Posts.vue 1211", this.$store.getters.getPosts)
      return this.$store.getters.getPosts;
    },
    comments() {
      return ["aa", "bb"];
    },
    getWidth() {
      return window.innerWidth > 940 ? true : false;
    }
  },
  created() {
    console.log('eeee', this.width)
    this.$store.dispatch(types.GET_FRIEND_POSTS, 0);

    this.socket.on('edit-post', (post) => {
      console.log('Post.vue esit post socket1111111', post)
    });
    
    
    eventBus.$on("marginTopCus", (mar) => {
       this.marginTop = mar;
       console.log('marrr', mar)
    });

    eventBus.$on("onGlobalResize", (width) => {
       this.width = width
    });
  },

  methods: {
    scroll() {
      let t = this;
      $(window).scroll(function () {
        if (
          $(window).scrollTop() + $(window).height() >
          $(document).height() - 100
        ) {
          console.log(" bottom!");
          t.index += 2;
          t.$store.dispatch(types.GET_FRIEND_POSTS, t.index);
        }
      });
    },
    onEditSize() {
      this.postCol == 9 ? this.postCol = 6 : this.postCol = 9;
      this.maxWidth2 == 200  ? this.maxWidth2 = 400 : this.maxWidth2 = 200;
      this.mdiIcon == 'mdi-chevron-left'  ? this.mdiIcon = 'mdi-chevron-right' : this.mdiIcon = 'mdi-chevron-left';
      this.marginLeft == '12%'  ? this.marginLeft = '35%' : this.marginLeft = '12%';
    }
  },
  mounted() {
    this.scroll();
  },
  components: {
    "my-post": Post,
    CustomNewPost
  },
beforeDestroy () {
 this.$router.go()
},
};
</script>

<style scoped>
.v-stepper__step__step.primary > .mdi-pencil::before {
    content: "\F012C" !important;
}

.v-stepper__step.v-stepper__step--active.v-stepper__step--editable.v-stepper__step--error.error--text > .v-stepper__step__step > .mdi-check::before {
  content: '\F0026';
}

.togglePostReview{
    position: absolute;
    z-index: 1;
    margin-top: -10px;
    margin-left: -10px;
}

.v-btn--fab.v-size--small {
  height: 20px !important;
  width: 20px !important;
}
</style>
