<template>
  <v-layout row wrap align-center @click="onPostClick(id)" :ref="id">
    <v-flex xs12 sm10 md9 lg12 xlg12 >
      <div>
        <transition name='post' appear>
          <v-card class="my-3" hover style="border-top-right-radius: 10px; border-top-left-radius: 10px;">
            <div style="background-color: #e91e63; border-top-right-radius: 10px; border-top-left-radius: 10px;">
             <router-link :to="'/user/' + ownerId" style="text-decoration: none">
              <span style="margin-left: 36%; color: white"> {{ownerName}} </span>
             </router-link>
            <span style="color: white">at </span>
            <span style="margin-left:auto; color: white"> {{postDate(date)}}</span>
            </div>
            <v-layout>
              <v-flex  xs12 offset-xs11 offset-xlg12 align-end>
                <v-menu
                transition="slide-y-transition"
                bottom
              >
            

        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="purple"
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            :class="{'custom-v-button': true}"
            v-if="postOwner(owner)"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list style="margin-top: 25px;">
          <v-list-item
            v-for="(item, i) in icons"
            :key="i"
          >
            <v-list-item-title><v-icon @click.prevent="editorRemove(i, id, name, owner)">{{item}}</v-icon>
            <v-divider></v-divider>
            
          </v-list-item-title>
            
          </v-list-item>
        </v-list>
        


        <!-- <v-btn
              bottom
              color="pink"
              dark
              fab
              fixed
              right
              @click="dialogDelete = !dialogDelete"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn> -->
      </v-menu>



    <v-dialog v-if="isEdit"
              scrollable
              v-model="dialogDelete"
              width="800px"
              style="color: red"
              content-class="vdialognew"
              persistent
            >
              <!-- plus button -->
              <v-card style="overflow-y: hidden !important" class="rounded-card">
                <v-card-title class="color dialog-custom darken-2">
                  Edit the content
                </v-card-title>
                <v-container fluid>
                  <v-row class="mx-2">
                    <v-col class="align-center justify-space-between" cols="12">
                      <v-row align="center" class="mr-0">
                        <!-- <v-avatar size="40px" class="mx-3">
                          <img :src="pho" alt="" />
                        </v-avatar> -->
                        <v-text-field
                          placeholder="What is in your mind"
                          v-model="postText"
                        ></v-text-field>
                      </v-row>
                    </v-col>

                    <v-col cols="12">
                      <img class="post-image" id="output" />
                    </v-col>
                    <v-col cols="12">
                      <!-- <label for="upload-photo">Browse...</label> -->
                      <input
                      v-if="isEdit2"
                        type="file"
                        id="upload-photo"
                        @change="onFileSelected($event)"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-card-actions>
                  <!-- <v-btn
                text
                color="primary"
              >More</v-btn> -->
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogDelete = false"
                    >Cancel</v-btn
                  >
                  <v-btn text @click="EditPost(owner)">Edit</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
              
          </v-flex>
            </v-layout>
            <v-img height="350px" :src="image" alt="no image"></v-img>
            <v-container fill-height fluid>
              <v-layout>
                <v-flex xs12 align-end d-flex>
                  <b style="width: 100%">{{name}}</b>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-text> 
              <v-row class="custom-row">
              <v-col cols="11">
                <v-icon :style="{color: likeColor, transform: `rotate(${likeDigree}deg)`}" class="like" @click="addRemoveLike({postID: id})">mdi-thumb-up</v-icon> 
              </v-col>
              <v-col cols="1">
                {{likeNumber}}
              </v-col>
              </v-row> 
            
            </v-card-text>
            <v-card-actions>
              <v-row style="padding: 10px">
                <v-dialog v-model="dialog" persistent max-width="600px">
                  <template v-slot:activator="{ on, attrs }">
                    <transition >
                      <v-btn color="primary" dark v-bind="attrs" v-on="on" @click="slideComment()" :class="{comment }"
                      :style="{transform: `translateX(${slidePercent}%)`}">
                      Comment
                    </v-btn>
                    </transition>
                  </template>
                  <transition name="popup-comment" appear>
                    <v-card>
                    <!-- <v-card-title>
                      <span class="headline">comment</span>
                    </v-card-title> -->
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              label="leave comment"
                              required
                              v-model="comment"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialog = false; closeComment()">
                        Close
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="
                          addComment({ comment: comment, postID: id });
                          dialog = false;
                          closeComment()
                        "
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                  </transition>
                </v-dialog>
              </v-row>
              <!--  -->
              <v-spacer></v-spacer>
              <v-btn icon class="red--text">
                <v-icon small>fa-reddit</v-icon>
              </v-btn>
              <v-btn icon class="light-blue--text">
                <v-icon small>fa-twitter</v-icon>
              </v-btn>
              <v-btn icon class="blue--text text--darken-4">
                <v-icon small>fa-facebook</v-icon>
              </v-btn>
              <v-btn icon class="red--text">
                <v-icon small>fa-google-plus</v-icon>
              </v-btn>
              <v-btn icon class="blue--text text--darken-4">
                <v-icon small>fa-linkedin</v-icon>
              </v-btn>
              <v-spacer></v-spacer>

              <!-- <v-btn small replace color="info" href="'image.url'" target="_blank"
                >Read More</v-btn
              > -->
            </v-card-actions>

            <v-row align="center">
              <v-col cols="12">
                <div id="root">
                  <v-card @click.prevent="showPosts" class="mx-auto">
                    <v-toolbar color="#1976d2" dark>
                      <v-app-bar-nav-icon></v-app-bar-nav-icon>

                      <v-toolbar-title>Comments</v-toolbar-title>

                      <v-spacer></v-spacer>

                      <!-- <v-btn icon>
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn> -->
                    </v-toolbar>

                    <v-list style="padding-bottom: 0" v-if="showHidePosts" three-line>
                      <template v-if="commentsArr.length == 0">
                        <span style="margin-left: 40%">
                          No Comments Yet
                        </span>
                      </template>
                      <transition-group v-else name="comment-accordion" appear>
                        <div  v-for="(item, index) in commentsArr" :key="item._id">
                        <v-subheader
                          v-if="item.header"
                          :key="item.header"
                          v-text="item.header"
                        ></v-subheader>

                        <v-divider :key="index" :inset="item.inset" v-if="index > 0"></v-divider>

                        <v-list-item :key="item.title">
                          <v-list-item-avatar>
                            <v-img
                            @click.prevent="onUserProfile(item.user)"
                              :src="
                                'http://localhost:3000/profile-image/' +
                                item.user +
                                '.PNG'"
                            ></v-img>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title
                              v-html="item.content"
                            ></v-list-item-title>
                          
                              {{ toLocalData(item.date)}}
                          
                          </v-list-item-content>
                        </v-list-item>
                      </div>
                      </transition-group>
                    </v-list>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </transition>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import types from '../../store/types'
import io from "socket.io-client";

import * as Types from "../../store/types";

import { eventBus } from "../../main";
global.jQuery = require("jquery");
var $ = global.jQuery;
window.$ = $;

import {
    mdiPencil,
    mdiDelete,
} from '@mdi/js'
import moment from 'moment'

export default {
  // props: {
  //   id: String,
  //   name: String,
  //   image: String,
  //   commentsArr: Array,
  //   items: [],
  //   likeNumber: Number,
  //   likesArr: Array,
  //   owner: String,
  //   isEdit2: Boolean,
  //   ownerName: String
    // },
  
  props: [
    'id',
    'name',
    'image',
    'commentsArr',
    'items',
    'likeNumber',
    'likesArr',
    'owner',
    'isEdit2',
    'ownerName',
    'date',
    'ownerId'
  ],
  data() {
    return {
        icons: [
        mdiPencil,
        mdiDelete,
        ],
      dialog: false,
      dialogDelete: false,
      postText:"",
      isEdit: false,
      pho: "",
      comment: "",
      showHidePosts: false,
       socket: io("http://localhost:3000", {
        query: { token: localStorage.getItem("token") },
    }),
    likeColor: 'gray',
    likeDigree: 0,
    slidePercent: 0,
    };
  },

  computed: {
    ...mapGetters({
      // getCommentsGetter: Types.GET_COMMENTS,
    }),
    
  },
  methods: {
    ...mapActions({
      // addComment: Types.ADD_COMMENT,
      getCommets: Types.GET_COMMENTS,
     
    }),
    onPostClick(id) {
      console.log('post.vue id', id)
    },
    postOwner(owner) {
      return owner == localStorage.getItem('userID')
    },
     addComment(data) {
       this.socket.emit('new-comment', data)
          // console.log('App.vue addComment555', data)
      },
    showPosts() {
      this.showHidePosts = !this.showHidePosts;
      this.$store.getters.getPosts
    },
    addRemoveLike(postID) {
      this.likeColor = this.likeColor == 'gray' ? this.likeColor = '#1976d2': this.likeColor = 'gray';
      this.likeDigree += this.likeColor == 'gray' ? -360 : 360;
      this.socket.emit('add-remove-like', postID)
    }, 
    EditPost(owner) {
      console.log('post.vue, owner', this.owner)
      this.socket.emit('edit-post', {text: this.postText, id: this.id, owner: owner})
      this.dialogDelete = false
    },
    editorRemove(index, id, text, owner) {
      if (index == 0) {
        this.dialogDelete = !this.dialogDelete
        this.isEdit = true
        this.postText = text
        console.log('name', text, 'owner _id', owner)
        
      }
      if (index == 1) {
        //console.log('post.vue delete', text, 'post id', id, 'owner', owner)
        this.socket.emit('delete-post', {postid: id, ownerid: owner})
      }
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      var output = document.getElementById("output");
      output.src = URL.createObjectURL(event.target.files[0]);
      this.isFileSelected = true;
      output.onload = function () {
        URL.revokeObjectURL(output.src);
      };
    },
    onUserProfile(id) {
      this.$router.push({
        name: 'userProfile',
        params: {id: id}
      })
    },
    postDate(date) {
      console.log(`date is: ${date}`);
      moment.locale(this.$i18n.locale)  
      return moment(date).format('MM/DD/YYYY');
     // return moment(date).format('llll')
    },
    slideComment() {
      this.slidePercent = 250;
    },
    closeComment() {
      this.slidePercent = 0;
    },
    toLocalData(date) {
      const d = new Date(date)
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' +  + d.getUTCDate() +  ' ' + d.toLocaleTimeString();
    }
  },
 created() {
   
   for (let i = 0; i < this.likesArr.length; i++){
      console.log('post.vue craeter likesArr', this.likesArr[i])
      if (localStorage.getItem('userID') == this.likesArr[i].user) {
        this.likeColor = '#1976d2'
      }
   }  
   this.socket.on('new-comment-posted',  data => {
     this.$store.commit('addComment', data)
   })

  this.socket.on('add-like', like => {
    console.log('like addeddddddd')
    this.$store.commit('addLike', like)
  })

  this.socket.on('remove-like', like => {
    this.$store.commit('removeLike', like)
  })

 
 },
 mounted() {
    eventBus.$on('onNavPost', post => {
      let id = post.data.post._id
      var element = this.$refs[id];
      var top = element.offsetTop;
      window.scrollTo(0, top);
    })
 },
     // console.log('Posts.vue on nav post', this.$refs[id], 'post id',  post.data.post._id)

 updated(){              
  
},
};
</script>

<style scoped>
.col-12 {
    flex: 0 0 100%;
    max-width: 100%;
    padding-bottom: 0 !important;
}

.custom-row {
  flex-wrap: inherit
}
.custom-v-button {
  position: absolute;
  z-index: 12;
  margin-left: -5px;
  margin-top: -30px;
}

.post-enter-active {
  animation: post 1.5s;
}

@keyframes post {
  0% {
    transform: scale(0)
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}

/* .like {
  transition: transform 3s ease-in-out;
}

.comment {
  transition: transform 1s ease-in-out;
} */

.popup-comment-enter-active {
  animation: showcomment 0.5s ease-in;
}

.popup-comment-leave-active {
  animation: hidecomment 1s ease-out;
}
@keyframes showcomment {
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes hidecomment {
  0% {
    transform: translate3d(0, 100%, 0);
  }
  50% {
    transform: translate3d(0, 50%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

.comment-accordion-enter {
  transform: translateY(30px);
}
.comment-accordion-enter-active {
  transition: all 1s;
}

.v-btn:not(.v-btn--round).v-size--default {
    height: 36px;
    min-width: 70px !important;
    padding: 0 16px;
}
</style>