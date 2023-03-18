<template>
<div>
  <div>
    <div class="main">
    <div class="parent">
      <img
        class="image1"
        src="https://picsum.photos/510/300?random"
        aspect-ratio="2"
        cols="12"
      />

      <img
        class="image2"
        :class="{
          width2: windowWidth < 785,
          width3: windowWidth < 309,
          width4: windowWidth < 332,
        }"
        :src="getSchPicture"
      />
    </div>
    <br />
    
    <div class="add-btn">
      
      <v-layout align-center justify-center>
        <span style="color: black">
        {{userName}} 
      </span>
        <v-flex>
          <div class="text-xs-center">
            <div style="margin-left: -20px; display: contents">
              <v-btn
                :class="{
                  'btn-2': windowWidth < 773,
                  'btn-3': windowWidth < 389,
                }"
                v-if="userId !== paramsId.id && !isFriend"
                depressed
                color="primary"
                @click="addRequest(paramsId.id);" 
              >
                {{ isFriendRequestExist }}
              </v-btn>

              <v-btn
                :class="{
                  'btn-1': windowWidth > 773,
                  'btn-2': windowWidth < 773,
                  'btn-3': windowWidth < 389,
                  'btn-4': windowWidth < 662,
                  'btn-5': windowWidth < 660,
                  'btn-6': windowWidth < 365,
                }"
                v-if="isFriend"
                depressed
                color="primary"
              >
               <span style="margin-left: 30%">
                  Friend
               </span>
              <v-btn style="margin-left:100px; color: black;"
              @click.stop="removeFriend()">X</v-btn>
            </v-btn>
            </div>
          </div>
        </v-flex>
      </v-layout>
    
    </div>
  </div>
  </div>
  <div>
    <div v-for="post in posts" :key="post._id"  @click="inPostClick(post)">
      <my-post
        :image="'http://localhost:3000/static/' + post._id + '.PNG'"
        :name="post.text"
        :id="post._id"
        :commentsArr="post.comments"
        :likeNumber="post.likes.length"
        :likesArr="post.likes"
        :owner="post.owner"
        :date="post.date"
        :isEdit2="false"
      >
      </my-post>
    </div>
  </div>
</div>
  
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

import * as types from "../../store/types";

import Post from "../post/post";
import io from "socket.io-client";

global.jQuery = require("jquery");
var $ = global.jQuery;
window.$ = $;

export default {
  props: ["image"],
  data: () => ({
    userId: localStorage.getItem("userID"),
    img: null,
    isFriend: false,
    requestPending: false,
    index: 0,
     socket: io("http://localhost:3000", {
        query: { token: localStorage.getItem("token") },
    }),
    userName: null 
  }),
  
  computed: {
    ...mapGetters({
      initRequest: types.INITIAL_REQUEST,
    }),

    paramsId() {
      return this.$route.params;
    },
    getSchPicture() {
      return this.$store.getters.getUserSrchPic;
    },
    isFriendRequestExist() {
      // let vm = this;
      // vm.$forceUpdate();
      return this.requestPending ? "Request Pending" : "Add Friend";
    },
    posts() {
      let fArr = []
      for(let i =0; i< this.$store.getters.getUserPosgts.length; i++){
      fArr.push(this.$store.getters.getUserPosgts[i][0])
      }
       let unique = [...new Set(fArr)]
       console.log('UserProfile, unique', unique)
      return unique
     
    },
  },

  created() {
    this.socket.on('edit-post', (post) => {
       this.$store.commit(types.EDIT_USER_POST, post)
        for (let i = 0; i <this.posts.length; i++) {
          if (this.posts[i]._id == post.id) {
            this.posts[i].text = post.text 
          }
        }
        console.log('Post.vue edit post socket22222', this.posts)
    });
    this.socket.on('delete-post', (post) => {
      this.$store.commit(types.DELETE_USER_POST, post);
      for (let i = 0; i <this.posts.length; i++) {
          if (this.posts[i]._id == post.postid) {
            this.posts.splice(i, 1) 
            let vm = this;
            vm.$forceUpdate();
            
          }
        }
        console.log('UserProfile, delete-post', this.posts)
    })
    this.isFriendRequestExist;
    this.$store.dispatch("getUserSearchPic", this.$route.params.id);
    //this.initRequest;
    // this.removeSubmitted(this.$route.params.id);
    setTimeout(() => {
      this.submitFriend;
    }, 1000);

    axios
      .post(
        "http://localhost:3000/friend-request/remove-submitted-user",
        { id: this.$route.params.id },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log("UseProfile 0999", res.data.success);
        this.isFriend = res.data.success;
        return this.isFriend;
      });

    axios
      .post(
        "http://localhost:3000/friend-request/request-pending",
        { id: this.$route.params.id },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((value) => {
        console.log("USerProfile 2112: ", value.data);
        this.requestPending = value.data;
      });
      console.log('USerProfile', this.paramsId.id)
       this.$store.dispatch(types.GET_USER_POSTS, {index: 0, id: this.$route.params.id});
       this.$store.dispatch(types.CHECK_MATCH_ID, localStorage.getItem('userID'));

    axios.post('http://localhost:3000/users/get-username-profile/'+this.paramsId.id,
         {1:1},
         {
          headers: {
              authorization: localStorage.getItem("token"),
            },
          })
      .then((res)=> {
        this.userName = res.data
      })
       
  },
  methods: {
    addRequest(id) {
      axios
        .post(
          "http://localhost:3000/friend-request/new-request",
          {
            id: id,
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.success) {
            console.log('frien request response: ', response);
            this.requestPending = true;
            this.socket.emit("new-fr-req", id);
            this.socket.emit("get-fr-req-data", id);
          }
        });
    },
    ...mapActions({
     // addRequest: types.ADD_REQUEST,
    }),
    // reload() {
    //   setTimeout(()=> this.$router.go(`/user/${this.paramsId.id}`),2000)
    // },
    scroll() {
      let t = this;
      $(window).scroll(function () {
        if (
          $(window).scrollTop() + $(window).height() >
          $(document).height() - 100
        ) {
          console.log(" bottom!");
          t.index += 2;
          t.$store.dispatch(types.GET_USER_POSTS, {index: t.index, id: t.$route.params.id});
        }
      });
    },
inPostClick(post) {
      console.log("Posts.vue inPostClick", post);
    },
    removeFriend() {
      this.isFriend = false;
      this.requestPending = false;
        this.socket.emit('remove-friend', {
          id: this.$route.params.id
        });
    }
  },

  mounted() {
  this.scroll();
  },
  components: {
    "my-post": Post,
  },
  beforeDestroy () {
 this.$router.go()
},
};
</script>
 
<style scoped>
.main {
  width: 80%;
  left: 10%;
}
.parent {
  position: relative;
  top: 0;
  left: 0;
}
.image1 {
  position: relative;
  top: 0;
  left: 10%;
  right: 10%;
  width: 100%;
  max-height: 300px;
}
.image2 {
  position: absolute;
  top: 70%;
  left: 50%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px green solid;
}

.width2 {
  left: 30%;
  width: 200px;
  height: 150px;
}

.width3 {
  left: 30%;
  width: 200px;
  height: 150px;
}
.width4 {
  width: 100px;
  height: 101px;
  margin-left: 10px;
}

.img3 {
  margin-left: 2px;
  width: 100px;
  height: 100px;
}

.add-btn {
  margin-top: 90px;
  margin-left: 55%;
}

.btn-1 {
  width: 300px;
  margin-left: -100px;
}
.btn-2 {
  width: 300px;

  margin-left: -200px;
}

.btn-3 {
  margin-left: -50px;
}
.btn-4 {
  margin-left: -70px;
}
.btn-5 {
  margin-left: -150px;
}

.btn-6 {
  /* margin-left: -60px; */
  width: 350px;
}
</style>
