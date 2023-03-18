<template>
  <v-app>
    <!-- <router-view v-if="!isAuth"></router-view> -->
    <router-view v-if="!isClientAuth"></router-view>
    <div id="app" v-else>
      
      <v-app id="inspire">
        <v-app id="inspire">
           <!-- <v-parallax :src="backgroundgimage" height="100%" width="100%" dark> -->
          <v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            app
            class="my-custom-navigation-drawer"
          >
            <v-list>$
              <template>
                <v-row>
                  <v-col cols="6"> </v-col>
                  <v-col cols="6" class="text-center">
                    <!-- <a
                  href="#!"
                  class="body-2 black--text"
                >EDIT</a> -->
                  </v-col>
                </v-row>
                <!-- <v-list-group
              v-else-if="item.children"
              :key="item.text"
              v-model="item.model"
              :prepend-icon="item.model ? item.icon : item['icon-alt']"
              append-icon=""
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="(child, i) in item.children"
                :key="i"
                link
              >
                <v-list-item-action v-if="child.icon">
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ child.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group> -->

                <router-link to="/chat" style="text-decoration: none; ">
                  <v-list-item style="margin-top:200%">
                    <v-list-item-action>
                      <v-icon color="#1976d2">mdi-message</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title :style="{ color: '#e91e63' }">
                        Messenger
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </router-link>
                <router-link to="/get-friends" style="text-decoration: none">
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon color="#1976d2">mdi-account</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title :style="{ color: '#1976d2' }">
                        Friends
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </router-link>
                <router-link to="/settings" style="text-decoration: none">
                  <v-list-item>
                      <v-icon color="#1976d2">mdi-cog</v-icon>
                  </v-list-item>
                </router-link>
              </template>
            </v-list>
          </v-navigation-drawer>

          <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            color="blue darken-3"
            dark
          >
            <!-- <v-app-bar-nav-icon
              @click.stop="drawer = !drawer"
              class="myApContent"
            ></v-app-bar-nav-icon> -->

             <v-app-bar-nav-icon
              @click.stop="expanddNav = !expanddNav"
              class="myApContent"
            ></v-app-bar-nav-icon>
            
            <CustomNavDrawer :expandd.sync="expanddNav"/>

            <v-toolbar-title
              style="width: 300px; margin-bootom: 5px"
              class="ml-0 pl-4"
            >
              <span
                @click="goHome()"
                style="cursor: pointer"
                v-if="windowWidth > 330"
                class="glassbook"
                >Glass Book
              </span>
              <span style="cursor: pointer" @click="goHome()" v-else>GB</span>
            </v-toolbar-title>
            <v-text-field
              v-if="this.$route.name == 'Posts'"
              flat
              solo-inverted
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
              label="Search"
              filled
              class="hidden-sm-and-down"
              v-model="keywords"
              v-on:keydown="searchUser"
            ></v-text-field>

            <v-spacer></v-spacer>

            <span
              v-if="$route.name == 'Posts'"
              style="margin-right: 10px; cursor: pointer"
              @click="onUsername"
              >{{ username }}</span
            >
            <!-- <v-btn icon>
              <v-icon>mdi-account</v-icon>
            </v-btn> -->
            <v-badge
              :content="chatNotification"
              :value="chatNotification"
              color="blue"
              overlap
            >
              <img
                @click="onChatNotificationKIcon"
                style="cursor: pointer"
                width="40px"
                src="@/assets/chat.png"
              />
            </v-badge>

            <v-badge
              :content="friendRequestlength"
              :value="friendRequestlength"
              color="blue"
              overlap
            >
              <v-icon @click="onFriendRequest" large> mdi-account </v-icon>
            </v-badge>
            <v-btn icon>
              <v-badge
                :content="postNotification"
                :value="postNotification"
                color="blue"
                overlap
              >
                <v-icon @click="onNotificationKIcon" large>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
            <v-btn icon large>
              <v-avatar size="32px" item>
                <v-img
                  :src="pho"
                  alt="Vuetify"
                  id="logo"
                  @click="upPhoto"
                ></v-img
              ></v-avatar>
            </v-btn>
          </v-app-bar>
          <v-main>
            <!-- <div v-if="">aaaaaaaaa</div> -->
            <v-text-field
              v-if="windowWidth < 959 && this.$route.name == 'Posts'"
              flat
              solo-inverted
              color="blue"
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
              v-model="keywords"
              v-on:keydown="searchUser"
            ></v-text-field>
            <v-container fluid>
              <!-- <button @click="sendMsg">Send</button>   center -->
              <v-content>
                <!-- <div 
            v-for="(post, index) in posts" :key="index"
            @click="inPostClick(post)">
             <my-post  
            :image="'http://localhost:3000/static/' + post._id + '.PNG'"  
            :text="post.text"
            >
            </my-post>
           </div> -->

                <v-container v-if="isIngoingCall">
                  <v-row style="justify-content: center">
                    <font-awesome-icon
                      icon="phone"
                      class="fa fa-phone faa-ring animated fa-2x"
                    ></font-awesome-icon>
                  </v-row>
                  <v-row>
                    <v-col><v-btn outlined rounded text color="#1565C0" @click="onAnswer()">answer</v-btn></v-col>
                    <v-col><v-btn outlined rounded text color="#1565C0">reject</v-btn></v-col>
                  </v-row>
                </v-container>

                <v-card v-if="openPostNotification">
                  <v-list-item
                    v-for="post in postNotificationArr"
                    :key="post.data.post._id"
                    @click="onNotifyPost(post)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        <span style="color: #2196f3; font-size: bold">{{
                          post.data.post.owner.name
                        }}</span>
                        added new post: {{ post.data.post.text }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>

                <v-card v-if="openChatNotification">
                  <v-list-item
                    v-for="msg in chatNotificationArr"
                    :key="msg.msgId"
                    @click="onNotifyChat(msg)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        <span style="color: #2196f3; font-size: bold">{{
                          msg.msg
                        }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
                <!-- Search by name -->
                <div v-if="keywords" class="div-search">
                  <v-card
                    style="
                      margin-top: -30px;
                     
                      margin-left: 30px;
                    "
                    :style="
                      windowWidth2 < 957
                        ? 'margin-top: 0px'
                        : 'margin-top:-30px'
                    "
                    class="mx-auto card-scroll"
                    
                    tile
                  >
                    <v-list-item-group
                      
                      v-for="user in searchNewUser"
                      :key="user.id"
                    >
                      <v-list-item
                        @click="onSearchNewUSer(user.id)"
                        style=" marging-bottom:10px; "
                      >
                      <v-list-item-avatar>
                        <v-img
                          max-height="50"
                          max-width="50"
                          style=" border-radius: 50px; height: 60px;"
                          :src="'data:image/PNG;base64,' + user.image"
                        ></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                        <span >{{ user.name }}</span>
                        </v-list-item-content>
                        
                      </v-list-item>
                      <v-divider></v-divider>
                    </v-list-item-group>
                  </v-card>
                </div>
                <router-view> </router-view>
              </v-content>
            </v-container>
          </v-main>
          <v-dialog v-model="dialog2" width="500">
            <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Click Me
        </v-btn>
      </template> -->
            <notify-post
              :image="
                'http://localhost:3000/static/' + notifypostImage + '.PNG'
              "
              :name="notifypostName"
              :id="notifypostId"
              :commentsArr="notifypostCommentsArr"
              :likeNumber="notifypostLikeNumber"
              :likesArr="notifypostLikesArr"
              :owner="notifypostOwner"
              :ownerName="notifypostOwnerName"
            >
            </notify-post>
          </v-dialog>
          <v-btn
            v-if="$route.name == 'Posts'"
            bottom
            color="pink"
            dark
            fab
            fixed
            right
            @click="dialog = !dialog"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-dialog
            scrollable
            v-model="dialog"
            width="800px"
            style="color: red"
            content-class="vdialognew"
            persistent
          >
            <!-- plus button -->
            <v-card style="overflow-y: hidden !important" class="rounded-card">
              <v-card-title class="color dialog-custom darken-2">
                Create A Glass Post
              </v-card-title>
              <v-container fluid>
                <v-row class="mx-2">
                  <v-col class="align-center justify-space-between" cols="12">
                    <v-row align="center" class="mr-0">
                      <v-avatar size="40px" class="mx-3">
                        <img :src="pho" alt="" />
                      </v-avatar>
                      <v-text-field
                        placeholder="What is in your mind"
                        v-model="postText"
                      ></v-text-field>
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <img class="post-image" id="output000" />
                  </v-col>
                  <v-col cols="12">
                    <!-- <label for="upload-photo">Browse...</label> -->
                    <!-- <input
                      type="file"
                      id="upload-photo"
                      @change="onFileSelected($event)"
                    /> -->
                    <div class="image-upload">
                      <label for="file-input00">
                        <i
                          class="material-icons"
                          style="font-size: 48px; color: blue"
                          >collections</i
                        >
                      </label>

                      <input
                        id="file-input00"
                        type="file"
                        @change="onFileSelected($event)"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-container>
              <v-card-actions>
                <!-- <v-btn
              text
              color="primary"
            >More</v-btn> -->
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dialog = false"
                  >Cancel</v-btn
                >
                <v-btn text @click.prevent="savePost">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
       
        <!-- </v-parallax> -->
        </v-app>
   
      </v-app>
      
    </div>
  </v-app>
</template>

<script>
import io from "socket.io-client";
import axios from "axios";
//import router from './router/index';
import { eventBus } from "./main";
import Post from "./components/post/post";
import * as types from "./store/types";
import { mapGetters, mapMutations } from "vuex";
//import cryptico from 'cryptico';
// import  {CometChat} from "@cometchat-pro/chat";
import CustomNavDrawer from './components/customNavdrawer/customNavdrawer';

global.jQuery = require("jquery");
var $ = global.jQuery;
window.$ = $;

export default {
  name: "App",
  data: () => ({
    dialog: false,
    drawer: null,
    selectedFile: null,
    postText: "",
    image: "",
    // items: [
    //   { icon: 'mdi-contacts', text: 'Contacts' },
    //   { icon: 'mdi-history', text: 'Frequently contacted' },
    //   { icon: 'mdi-content-copy', text: 'Duplicates' },
    //   {
    //     icon: 'mdi-chevron-up',
    //     'icon-alt': 'mdi-chevron-down',
    //     text: 'Labels',
    //     model: true,
    //     children: [
    //       { icon: 'mdi-plus', text: 'Create label' },
    //     ],
    //   },
    //   {
    //     icon: 'mdi-chevron-up',
    //     'icon-alt': 'mdi-chevron-down',
    //     text: 'More',
    //     model: false,
    //     children: [
    //       { text: 'Import' },
    //       { text: 'Export' },
    //       { text: 'Print' },
    //       { text: 'Undo changes' },
    //       { text: 'Other contacts' },
    //     ],
    //   },
    //   { icon: 'mdi-cog', text: 'Settings' },
    //   { icon: 'mdi-message', text: 'Messenger', onClick: function() {
    //     console.log('1111 App.vue')
    //     router.push('/chat')
    //   } },
    //   { icon: 'mdi-help-circle', text: 'Help' },
    //   { icon: 'mdi-cellphone-link', text: 'App downloads' },
    //   { icon: 'mdi-keyboard', text: 'Go to the old version' },
    // ],

    // items: [
    //   { icon: 'mdi-message', text: 'Messenger', onClick: function() {
    //     console.log('1111 App.vue')
    //     router.push('/chat')
    //   }
    //   }
    // ],
    socket: io("http://localhost:3000", {
      query: { token: localStorage.getItem("token") },
    }),
    photo: null,
    windowWidth2: window.innerWidth,
    keywords: "",
    isSearch: false,
    searchNewUser: [],
    username: "",
    postNotification: null,
    openPostNotification: false,
    postNotificationArr: [],
    dialog2: false,
    notifypostImage: null,
    notifypostName: null,
    notifypostId: null,
    notifypostCommentsArr: [],
    notifypostLikeNumber: null,
    notifypostLikesArr: [],
    notifypostOwner: null,
    notifypostOwnerName: null,
    messagesNoificationArr: [],
    isClientAuth: false,
    chatNotification: 0,
    chatNotificationArr: [],
    openChatNotification: false,
    isIngoingCall: false,
    callerId: '',
    callerName: '',
    backgroundgimage: null,
    expanddNav: false,
  }),
  computed: {
    ...mapGetters({
      getUnreadMessage: types.UNREAD_MESSAGE,
      // isIngoingCall: 'getIngoingCall'
    }),
    isAuth() {
      if (localStorage.getItem("token")) {
        return true;
      } else {
        return false;
      }
    },

    pho() {
      if (this.photo) {
        return this.photo;
      }
      return this.$store.state.photo;
    },
    posts() {
      return this.$store.getters.getPosts;
    },

    friendRequestlength() {
      return this.$store.getters.getFriendRequestLength;
    },

    currentRouteName() {
      console.log("App.vue current route", this.$route.name);
      return this.$route.name;
    },

    userId() {
      return this.$store.state.auth;
    },
  },
  created() {
    // this.initializeApp()
    const bkImage = require('@/assets/vbanner.jpg');
    this.backgroundgimage = bkImage;

    axios
      .get("http://localhost:3000/check-auth", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((data) => {
        this.isClientAuth = data.data.success;
        console.log("this.isClientAuth", this.isClientAuth);
      });
    // return isClientAuth.data.success;
    /** Begin1 create PUBPLIC KEY and send it to server */

    // if (localStorage.getItem('publicKey') && localStorage.getItem('rsaKey')) {
    //   axios.post('http://localhost:3000/public-key',
    //   { publicKey: localStorage.getItem('publicKey') },
    //   {
    //     headers: {
    //       authorization: localStorage.getItem("token"),
    //     },
    //   })
    // } else {
    // var PassPhrase = "this is a random phrase";
    // var Bits = 1024;
    // var myRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
    // const rsakeysJson = JSON.stringify(myRSAkey.toJSON());
    // console.table('rsa keys',rsakeysJson);
    // var myPublicKeyString = cryptico.publicKeyString(myRSAkey)

    // localStorage.setItem('publicKey', myPublicKeyString);
    // localStorage.setItem('rsaKey', rsakeysJson);
    //var messageText = 'Hello Sam';
    //var encryptionResult = cryptico.encrypt(messageText, myPublicKeyString);
    //encryptionResult = encryptionResult.cipher;
    //console.log('ciper text:', encryptionResult);
    //var decryptionResult = cryptico.decrypt(encryptionResult, myRSAkey);
    //console.log('decryption text:', decryptionResult);
    // }
    /** End1 create PUBPLIC KEY and send it to server */

    this.socket.on("msg", (msg) => {
      if (this.$route.params.receiverID !== msg.senderId) {
        console.log("App.vue current route", this.$route.params);
        console.log("App.vue msg2", msg);
        this.chatNotification++;
        this.chatNotificationArr.push(msg);
        console.log("App.vue this route", this.$route);
      }
    });
    this.socket.on("edit-post", (post) => {
      this.$store.commit(types.EDIT_POST, post);
    });

    this.socket.on("delete-post", (post) => {
      this.$store.commit(types.DELETE_POST, post);
      // this.$store.commit(types.DELETE_USER_POST, post)
    });

    this.drawer = false;
    this.currentRouteName;
    this.socket.on("new-post", (post) => {
      if (localStorage.getItem("userID") != post.data.post.owner._id) {
        this.postNotificationArr.push(post);
        this.postNotification++;
      }
      this.socket.on("delete-post", (post) => {
        for (let i = 0; i < this.postNotificationArr.length; i++) {
          if (this.postNotificationArr[i].data.post._id == post.postid) {
            this.postNotificationArr.splice(i, 1);
            if (this.postNotification > 0) {
              this.postNotification--;
            }
          }
        }
      });
      console.log("App.vue new-post13333333", post);
      this.$store.dispatch("newPost", post);
    });
    this.$store.dispatch("socketOnReceive");

    eventBus.$on("photoChanged", (d) => {
      this.photo = d;
    });

    this.$store.dispatch("getPhotoFromServer");
    this.photo = this.$store.state.photo;

    this.$store.dispatch(types.GET_FRIEND_REQUEST_LENGTH);

    this.socket.on("new-fr-req", (data) => {
      console.log("Appvue socket 990", data);
      this.$store.commit(types.REQUEST_SOCKET, data);
    });

    // axios.post(
    //   "http://localhost:3000/friend-request/request-pending",
    //   { id: "5f9cedeb0dffda56e12df8ae" },
    //   {
    //     headers: {
    //       authorization: localStorage.getItem("token"),
    //     },
    //   }
    // ).then((value) => {console.log('App.vue 34121: ', value)});
    axios
      .get("http://localhost:3000/users/get-username", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        this.username = res.data;
        this.setUsername(this.username);
      });

    axios
      .get("http://localhost:3000/get-all-messages/unread-message", {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("App.vue unread messages", res.data.msgs);

        //  const id = res.data.msgs[0].from._id
        //  const count = res.data.msgs.filter((obj) => obj.from._id === id).length;
        //  console.log(count);
        const t = this;
        this.messagesNoificationArr = res.data.msgs.reduce(function (
          previous,
          next
        ) {
          const id = t.getId(next);
          const index = previous.findIndex((item) => id === t.getId(item));

          if (index !== -1) {
            previous[index]["messageCount"] += 1;
          } else {
            previous.push({
              ...next,
              messageCount: 1,
            });
          }
          return previous;
        },
        []);
        console.log("App.vue 11111", this.messagesNoificationArr);
      });

    var self = this;
    this.socket.on("call-request", function (data) {
      self.$nextTick(function () {
        self.isIngoingCall = true;
        self.callerId = data.sender;
        self.callerName = data.name;
      });
    });
  },

  methods: {
    ...mapMutations({
      setUsername: 'setUsername'
    }),
    initializeApp() {
      // const appId = process.env.VUE_APP_COMMETCHAT_APP_ID;
      // CometChat.init("201567137051b099").then(
      //     () => {
      //         console.log('Initialization completed successfully')
      //     }, error => {
      //         console.log('Inititializing faild, error: ', error)
      //     }
      // )
    },
    getId(item) {
      return item["from"]["_id"];
    },
    // sendMsg() {
    //   // this.socket.emit('msg', {msg: 'sosa', id: '5f6990a54730351e94e1fc11'});
    //   this.$store.dispatch('socketOnConnection', )
    // },
    upPhoto() {
      this.$store.dispatch("upPhoto");
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      var output = document.getElementById("output000");
      output.src = URL.createObjectURL(event.target.files[0]);
      this.isFileSelected = true;
      output.onload = function () {
        URL.revokeObjectURL(output.src);
      };
    },

    savePost() {
      const fd = new FormData();
      fd.append("file", this.selectedFile, this.selectedFile.name);
      fd.append("data", this.postText);
      this.dialog = false;
      try {
        axios
          .post("http://localhost:3000/post/new-post", fd, {
            headers: { authorization: localStorage.getItem("token") },
          })
          .then((res) => {
            this.socket.emit("new-post", res);
          });
      } catch (error) {
        console.log("App.vue, error: ", error);
      }
    },
    onResize() {
      console.log("App.vue-onResize()", this.windowWidth2);
      this.windowWidth2 = window.innerWidth;
       
    },
    searchUser() {
      $("document").ready(function () {
        $(window).scrollTop(0);
      });
      axios
        .post(
          "http://localhost:3000/users/search-user",
          { name: this.keywords },
          {
            headers: { authorization: localStorage.getItem("token") },
          }
        )
        .then((res) => {
          if (res.data["success"]) this.searchNewUser = res.data.users;
        });
    },
    onSearchNewUSer(id) {
      this.searchNewUser.find((user) => {
        user.id = id;
        eventBus.shareImageSearchUser(user.image);
        this.searchNewUser = null;
        this.$router.push("/user/" + id).catch(() => {});
      });
    },
    onFriendRequest() {
      this.$router.push("/friend-requests").catch(() => {});
      this.friendRequestlength = 0;
    },
    goHome() {
      this.$router.push("/posts");
    },
    onNotifyPost(post) {
      console.log("App.vue onNotifyPost", post);
      // this.dialog2 = true;
      this.notifypostImage = post.data.post._id;
      this.notifypostName = post.data.post.text;
      this.notifypostId = post.data.post._id;
      this.notifypostCommentsArr = post.data.post.comments;
      this.notifypostLikeNumber = post.data.post.likes.length;
      this.notifypostLikesArr = post.data.post.likes;
      this.notifypostOwner = post.data.post.owner;
      this.notifypostOwnerName = post.data.post.owner.name;
      console.log("postNotificationArr", this.postNotificationArr);
      for (let i = 0; i < this.postNotificationArr.length; i++) {
        if (this.postNotificationArr[i].data.post._id == post.data.post._id) {
          this.postNotificationArr.splice(i, 1);
        }
      }
      eventBus.onNavPost(post);
    },
    onNotifyChat(msg) {
      this.$router.push({
        name: "private-chat",
        params: { receiverID: msg.senderId },
      });
    },
    onUsername() {
      let uid = localStorage.getItem("userID");
      this.$router.push({
        name: "userProfile",
        params: { id: uid },
      });
    },
    onNotificationKIcon() {
      this.openPostNotification = !this.openPostNotification;
      this.postNotification = null;
      if (this.postNotificationArr.length > 0) window.scrollTo(0, 0);
    },
    onChatNotificationKIcon() {
      this.openChatNotification = !this.openChatNotification;
      this.chatNotification = null;
      if (this.chatNotificationArr.length > 0) window.scrollTo(0, 0);
    },
    onAnswer() {
      this.$nextTick(function() {
        this.isIngoingCall = false;
      })
      this.socket.emit('start-video', {id: this.callerId});
      // const self = this;
      // setTimeout(function() {
        this.$router.push({name: 'video-call', params: {id: this.callerId, name: this.callerName, calle: true}});
      // }, 1000);
    }
  },
  watch: {
    windowWidth2(oldWidth, newWidth) {
      this.txt = `it changed to ${newWidth} from ${oldWidth}`;
      eventBus.onGlobalResize(newWidth)
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  destroyed() {
    // this.socket.disconnect();
  },
  components: {
    "notify-post": Post,
    CustomNavDrawer
  },
};
</script>

<style scoped>
.v-main .v-content {
  padding: 0 !important;
}
.color {
  background-color: #1565c0 !important;
}
.v-card > *:first-child:not(.v-btn):not(.v-chip) {
  color: white;
}

.dialog-custom {
  overflow-y: hidden !important;
}

.vdialognew {
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: red;
}

.post-image {
  max-height: 100px;
}

.card-scroll {
  overflow-y: scroll;
}

.div-search {
  z-index: 10;
}

@media screen and(max-width: 957px) {
  .div-search {
    margin-top: 1300px !important;
  }
}
.image-upload > input {
  display: none;
}

.v-btn--absolute.v-btn--right,
.v-btn--fixed.v-btn--right {
  right: 50px !important;
}

#app {
  overflow-x: hidden;
}

.my-custom-navigation-drawer {
  width: 70px !important;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  position: absolute;
  z-index: 1;
}

/* begin (ring) */
.ringing-bell {
  position: absolute;
  left: 50%;
  top: 50%;
  transition: translate(-50%, -50%);
}

.faa-ring {
  color: red;
}

@-webkit-keyframes ring {
  0% {
    -webkit-transform: rotate(-15deg);
    transform: rotate(-15deg);
  }

  2% {
    -webkit-transform: rotate(15deg);
    transform: rotate(15deg);
  }

  4% {
    -webkit-transform: rotate(-18deg);
    transform: rotate(-18deg);
  }

  6% {
    -webkit-transform: rotate(18deg);
    transform: rotate(18deg);
  }

  8% {
    -webkit-transform: rotate(-22deg);
    transform: rotate(-22deg);
  }

  10% {
    -webkit-transform: rotate(22deg);
    transform: rotate(22deg);
  }

  12% {
    -webkit-transform: rotate(-18deg);
    transform: rotate(-18deg);
  }

  14% {
    -webkit-transform: rotate(18deg);
    transform: rotate(18deg);
  }

  16% {
    -webkit-transform: rotate(-12deg);
    transform: rotate(-12deg);
  }

  18% {
    -webkit-transform: rotate(12deg);
    transform: rotate(12deg);
  }

  20% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}

@keyframes ring {
  0% {
    -webkit-transform: rotate(-15deg);
    -ms-transform: rotate(-15deg);
    transform: rotate(-15deg);
  }

  2% {
    -webkit-transform: rotate(15deg);
    -ms-transform: rotate(15deg);
    transform: rotate(15deg);
  }

  4% {
    -webkit-transform: rotate(-18deg);
    -ms-transform: rotate(-18deg);
    transform: rotate(-18deg);
  }

  6% {
    -webkit-transform: rotate(18deg);
    -ms-transform: rotate(18deg);
    transform: rotate(18deg);
  }

  8% {
    -webkit-transform: rotate(-22deg);
    -ms-transform: rotate(-22deg);
    transform: rotate(-22deg);
  }

  10% {
    -webkit-transform: rotate(22deg);
    -ms-transform: rotate(22deg);
    transform: rotate(22deg);
  }

  12% {
    -webkit-transform: rotate(-18deg);
    -ms-transform: rotate(-18deg);
    transform: rotate(-18deg);
  }

  14% {
    -webkit-transform: rotate(18deg);
    -ms-transform: rotate(18deg);
    transform: rotate(18deg);
  }

  16% {
    -webkit-transform: rotate(-12deg);
    -ms-transform: rotate(-12deg);
    transform: rotate(-12deg);
  }

  18% {
    -webkit-transform: rotate(12deg);
    -ms-transform: rotate(12deg);
    transform: rotate(12deg);
  }

  20% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}

.faa-ring.animated,
.faa-ring.animated-hover:hover,
.faa-parent.animated-hover:hover > .faa-ring {
  -webkit-animation: ring 2s ease infinite;
  animation: ring 2s ease infinite;
  transform-origin-x: 50%;
  transform-origin-y: 0px;
  transform-origin-z: initial;
}
/* end (ring) */
.myApContent {
  filter: drop-shadow(5px 5px 5px #e91e63);
  box-shadow: 3px 3px 3px #e91e63; 
  margin-top: 10px  !important;
}

.v-sheet.theme--dark.v-toolbar.v-app-bar.v-app-bar--fixed.blue.darken-3 {
  height: 50px !important;
}

.glassbook {
  display: inline-block;
    animation: skew 3s infinite;
  transform: skew(20deg);
  animation-direction: alternate;

}

@keyframes skew {
  0% {
    transform: skewX(20deg);
  }
  100% {
    transform: skewX(-20deg);
  }
}
</style>
