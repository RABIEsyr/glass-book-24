import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import io from "socket.io-client";

import router from "../router/index";
import * as types from "./types";

const socket = io("http://localhost:3000", {
  query: { token: localStorage.getItem("token") },
  transports: ['websocket']
});

const {RTCPeerConnection} = window;
const rtcPeerConnection = new RTCPeerConnection();

Vue.use(Vuex);

const uri = "http://localhost:3000";

export default new Vuex.Store({
  state: {
    auth: {
      id: "",
      token: "",
    },
    windowWidth: window.innerWidth,
    photo: null,
    posts: [],
    searchUserPic: null,
    friendRequestLength: 0,
    // friendRequest: localStorage.getItem("friendRequest"),
    httpFriendRequest: null,
    friendsList: [],
    isFriend: false,
    comments: [],
    messages: [],
    userPosts: [],
    getAllMessages : [],
    isMatchId: false,
    unreadMessage: [],
    encryptChat: [],
    rtcPeerConnection,
    ingoingCall: false,
    animated: true,
    username: null,
  },
  getters: {
    getAuth() {
      return localStorage.getItem("token");
    },
    getPhoto(state) {
      return state.photo;
    },
    getPosts(state) {
      let unique = [...new Set(state.posts)];

      // for (let i = 0; i < unique.length; i++) {
      //   for (let j = 0; j < unique[i].comments.length; j++) {
      //     for (let k = 0; k < unique[i].comments.length - 1; k++) {
      //       if (unique[i].comments[j]._id == unique[i].comments[k]._id) {
      //         unique[i].comments.splice(k, 1);
      //       }
      //     }
      //   }
      // }
      console.log('vuex getPosts getters', unique)
      return unique;
    },
    getUserSrchPic(state) {
      return state.searchUserPic;
    },

    getFriendRequestLength(state) {
      return state.friendRequestLength;
    },
    // [types.ADD_REQUEST]: (state) => {
    //   return state.friendRequest;
    // },
    [types.GET_FRIEND_REQUEST]: (state) => {
      return state.httpFriendRequest;
    },
    [types.GET_FRIENDS_LIST]: (state) => {
      return state.friendsList;
    },
    [types.IS_FRIEND]: (state) => {
      return state.isFriend;
    },
    [types.ADD_COMMENT]: (state) => {
      return state.comments;
    },
    [types.GET_COMMENTS]: (state) => {
      return state.comments;
    },
    [types.GET_CHAT_MESSAGES]: (state) => {
      return state.messages;
    },
    getUserPosgts (state) {
      
      let unique = [...new Set(state.userPosts)];
      console.log(unique)
      return unique;
    },
    getAllMEssages (state)  {
      return state.getAllMessages
    },
    matchId(state) {
      return state.isMatchId
    },
    [types.UNREAD_MESSAGE]: (state) => {
      return state.unreadMessage;
    },
    getEncryptChatList: (state) => {
      return state.encryptChat;
    },
    getRtcPeerConnection(state) {
      return state.rtcPeerConnection;
    },
    getIngoingCall(state) {
      return state.ingoingCall;
    },
    getAnimationStatus(state) {
      return state.animated;
    },
    getUsername(state) {
      return state.username;
    }
  },
  mutations: {
    Signup: (state, payload) => {
      state.auth.id = payload.userId;
    },
    Login: (state, payload) => {
      state.auth.id = payload.userId;
    },
    UploadPhotoToserver: () => {},
    GetPhotoFromServer: (state, payload) => {
      state.photo = payload;
    },
    socketsendMessage: () => {},
    // "get-Posts": (state, payload) => {
    //   //state.posts.push(payload);
    // },
    "new-Post": (state, payload) => {
      //socket.emit('new-post', payload)
      state.posts.push(payload.data.post);
      //this.getPostsHttp();
    },
    "get-Posts-Http": (state, payload) => {
      if (!payload.data.success) {
        for (let i = 0; i < payload.data.length; i++) {
          for (let j = 0; j < state.posts.length; j++) {
            if (payload.data[i]._id == state.posts[j]._id) {
              state.posts.splice(j, 1);
            }
          }
          state.posts.push(payload.data[i]);
        }
      } else {
        console.log("store-index.js get-Posts-Http, exceedded");
      }
    },
    "get-UserSearch-Pic"(state, payload) {
      state.searchUserPic = payload;
    },
    [types.ADD_REQUEST]: (state, id) => {
      console.log("Vuex action id 333444", id);
      let friendRequest = localStorage.getItem("friendRequest");
      if (friendRequest === null) friendRequest = "";
      localStorage.setItem("friendRequest", friendRequest + "," + id);
    },
    
    [types.GET_FRIEND_REQUEST_LENGTH]: (state, payload) => {
      state.friendRequestLength = payload;
    },
    [types.INITIAL_REQUEST]: () => {
      // let friendRequest = localStorage.getItem("friendRequest");
      localStorage.setItem("friendRequest", ",");
    },
    [types.GET_FRIEND_REQUEST]: (state, payload) => {
      state.httpFriendRequest = payload.data.result;
    },
    [types.SUBMIT_FRIEND_REQUEST]: (state, id) => {
      console.log("vuex submit friend request", id);
    },
    [types.GET_FRIENDS_LIST]: (state, friends) => {
      //console.log("vuex GET_FRIEND_LIST", friends);
      state.friendsList = friends;
    },
    [types.REMOVE_SUBMITTED_REQUEST_FRIEND]: (state, payload) => {
      console.log("Vuex mutation 11: ", payload);
      state.isFriend = payload;
    },

    [types.REQUEST_SOCKET]: (state, payload) => {
      console.log("Vuex mutation request socket 345,: ", payload);
      state.friendRequestLength += +0.5;
      console.log(
        "vuex mutatuins request_socket 666",
        state.friendRequestLength
      );
    },
    [types.REMOVE_ADD_REQUEST]: (state, id) => {
      for (let i = 0; i < state.httpFriendRequest.length; i++) {
        if (state.httpFriendRequest[i].id == id) {
          // console.log('index345', id, state.httpFriendRequest)
          state.httpFriendRequest.splice(state.httpFriendRequest.indexOf(i), 1);
          state.friendRequestLength--;
        }

        // state.httpFriendRequest.splice(state.httpFriendRequest.index)
      }
      // console.log('index888', id, state.httpFriendRequest)
    },
    [types.REMOVE_ADD_REQUEST_ONE]: (state, id) => {
      console.log(
        "vuex REMOVE_ADD_REQUEST_ONE:",
        state.httpFriendRequest.indexOf(id)
      );
      state.httpFriendRequest.splice(state.httpFriendRequest.indexOf(id), 1);
      state.friendRequestLength--;
      // console.log('', id)
    },
    [types.GET_FRIEND_POSTS]: (state, payload) => {
      // console.log('vuex mutauion types.GET_FRIEND_POSTS', payload)
      if (!payload.success) {
        state.posts.push(...payload);
      } else {
        return;
      }
    },
    addComment: (state, payload) => { // socket
      console.log('vuex addComment')
      let posts = state.posts;
      for (let i = 0; i < posts.length; i++) {
        if (posts[i]._id == payload.post) {
          if (posts[i].comments.findIndex((el) => el._id === payload._id) === -1) {
            posts[i].comments.push(payload);
          }
        }
      }

      
      let uPost = state.userPosts
      console.log('vuex 88888', uPost)
      for (let i =0; i < uPost.length; i++) {
       
          
          if (uPost[i][0].comments.findIndex((el) => el._id === payload._id) === -1) {
            uPost[i][0].comments.push(payload);
          
          
        }
      }

    },
    [types.GET_COMMENTS]: (state, payload) => {
      console.log("vuex mutation GET_COMMENT", payload);
      state.comments.push(payload);
    },
    addLike: (state, like) => {
      let posts = state.posts;
      for (let i = 0; i < posts.length; i++) {
        if (posts[i]._id == like.post) {
          if (posts[i].likes.findIndex((el) => el._id === like._id) === -1) {
            posts[i].likes.push(like);
          }
        }
      }

      let uPost = state.userPosts
      for (let i =0; i < uPost.length; i++) {
        if ( uPost[i][0]._id == like.post) {
          if (uPost[i][0].likes.findIndex((el) => el._id === like._id) === -1) {
            uPost[i][0].likes.push(like)
          }
          
        }
      }

    },

    removeLike: (state, like) => {
      let posts = state.posts;
      
      for (let i = 0; i < posts.length; i++) {
        if (posts[i]._id == like.post) {
          const likeIndex = posts[i].likes.findIndex((el) => el._id === like._id) 
          if (likeIndex >= 0) {
            posts[i].likes.splice(likeIndex, 1);
          }
          // if (posts[i].likes.findIndex((el) => el._id === like._id) === -1) {
          //   console.log('vuex removeLike', like)
          //   posts[i].likes.splice(posts[i].likes.indexOf(like), 1);
           
          // }
        }
      }
      let uPost = state.userPosts
      for (let i =0; i < uPost.length; i++) {
        if ( uPost[i][0]._id == like.post) {
          const likeIndex = uPost[i][0].likes.findIndex((el) => el._id === like._id) 
          if (likeIndex >= 0) {
            uPost[i][0].likes.splice(likeIndex, 1);
          }
          
          
        }
      }
    },
    [types.GET_CHAT_MESSAGES] : (state, payload) => {
      state.messages.push(payload)
    },
    [types.RESET_CHAT_MESSAGES]: (state) => {
      state.messages = []
    },
    [types.GET_USER_POSTS]: (state, posts) => {
      console.log('vuex .GET_USER_POSTS', posts)
      state.userPosts.push(...posts)
    },
    [types.GET_ALL_MESSAGES]: (state, msgs) => {
      state.getAllMessages = msgs
    },
    [types.CHECK_MATCH_ID]: (state, payload) => {
     state.isMatchId = payload
    },
    [types.EDIT_POST]: (state, payload) => { 
      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i]._id == payload.id) {
          state.posts[i].text = payload.text
        }
      }
    },
    [types.EDIT_USER_POST]: (state, payload) => { 
      
      for (let i = 0; i < state.userPosts.length; i++) {
        if (state.userPosts[i]._id == payload.id) {
          state.userPosts[i].text = payload.text
        }
      }    
    },
    [types.DELETE_POST]: (state, payload) => {
      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i]._id == payload.postid) {
          state.posts.splice(i, 1);
          console.log('veux index.js.vue, delete-post', payload)
        }
      }
    },
    [types.DELETE_USER_POST]: (state, payload) => {
      for (let i = 0; i < state.userPosts.length; i++) {
        if (state.userPosts[i]._id == payload.postid) {
          state.userPosts.splice(i, 1)
        }
      }  
    },
    [types.UNREAD_MESSAGE]: (state, payload) => {
      state.unreadMessage.push(payload);
    },
    setEncryptChatList: (state, payload) => {
      state.encryptChat.push(payload);
    },
    changeOnlineStatus: (state, payload) => {
      console.log('store store store', payload, state.friendsList)
      state.friendsList.map((friend) => {
        console.log('friend', friend)
        if (friend['id'] == payload.userId) {
        if (payload.status == 'offline') {
          friend['status'] = false;
        }
        if (payload.status == 'online') {
          friend['status'] = true;
        }
      }
      })
    },
    IngoingCall(state, payload) {
      state.ingoingCall = payload;
    },
    setAnimation(state, payload) {
      state.animated = payload
    },
    setUsername(state, payload) {
      state.username = payload;
    }
  },

  actions: {
    signup: ({ commit }, payload) => {
      axios.post(uri + "/auth/sign-up", payload).then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userID", res.data.userId);
        router.push({ name: "Home" });
        router.go()
        commit("Signup", res.data);
      });
    },
    login: ({ commit }, payload) => {
      axios.post(uri + "/auth/sign-in", payload).then((res) => {
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userID", res.data.userId);
          router.push({ name: "Home" });
          router.go();
          commit("Login", payload);
        }
      });
    },
    upPhoto() {
      router.push({ name: "upload-photo" });
    },
    upPhotoToServer({ commit }, payload) {
      axios.post(uri + "/upload-photo", payload).then(() => {
        router.go();
        commit("UploadPhotoToserver");
      });
    },
    getPhotoFromServer({ commit }) {
      axios
        .get(uri + "/upload-photo/get-pic", {
          headers: { authorization: localStorage.getItem("token") },
        })
        .then((res) => {
          commit("GetPhotoFromServer", res.data);
        });
    },
    socketOnConnection({ commit }, payload) {
      socket.emit("msg", payload);
      console.log('vuex, mas payload', payload)
      commit("socketsendMessage");
    },
    socketOnReceive() {
      socket.on("msg", (msg) => {
        console.log("msg", msg);
      });
    },
    getPosts({ commit }) {
      socket.on("new-post", (post) => {
        commit("get-Posts", post);
      });
    },
    newPost({ commit }, payload) {
      commit("new-Post", payload);
    },
    getPostsHttp({ commit }, index) {
      return new Promise((resolve) => {
        axios
          .get("http://localhost:3000/post/get-posts", {
            headers: {
              index: index,
              authorization: localStorage.getItem("token"),
            },
          })
          .then((res) => {
            resolve(res);
             console.log('vuex index getposts', res)
            commit("get-Posts-Http", res);
          });
      });
    },
    getUserSearchPic({ commit }, id) {
      axios
        .post(
          "http://localhost:3000/upload-photo/get-search-user-pic",
          { id },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          commit("get-UserSearch-Pic", res.data);
        });
    },
    // [types.ADD_REQUEST]: (_, id) => {
    //   axios
    //     .post(
    //       "http://localhost:3000/friend-request/new-request",
    //       {
    //         id: id,
    //       },
    //       {
    //         headers: {
    //           authorization: localStorage.getItem("token"),
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       if (response) {
    //         //commit(types.ADD_REQUEST, id);
    //         socket.emit("new-fr-req", id);
    //         socket.emit("get-fr-req-data", id);
    //       }
    //     });
    //},

    [types.GET_FRIEND_REQUEST_LENGTH]: ({ commit }) => {
      axios
        .get(
          "http://localhost:3000/friend-request/get-friend-requests-length",
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          commit(types.GET_FRIEND_REQUEST_LENGTH, res.data.length);
        });
    },
    [types.GET_FRIEND_REQUEST]: ({ commit }) => {
      axios
        .get("http://localhost:3000/friend-request/get-friend-requests", {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          commit(types.GET_FRIEND_REQUEST, res);
        });
    },
    [types.SUBMIT_FRIEND_REQUEST]: ({ commit }, id) => {
      axios
        .post(
          "http://localhost:3000/friend-request/submit-friend-request",
          { id },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(() => {
          commit(types.SUBMIT_FRIEND_REQUEST, id);
        });
    },
    [types.GET_FRIENDS_LIST]: ({ commit }) => {
      axios
        .get("http://localhost:3000/friend-request/get-friends", {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          commit(types.GET_FRIENDS_LIST, res.data.result);
        });
    },
    [types.REMOVE_SUBMITTED_REQUEST_FRIEND]: ({ commit }, id) => {
      let storage = localStorage.getItem("friendRequest");
      let arr = storage.split(",");

      axios
        .post(
          "http://localhost:3000/friend-request/remove-submitted-user",
          { id },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            arr.find((item) => {
              if (item == id) {
                arr.splice(arr.indexOf(item), 1);
                arr.join(",");
                localStorage.setItem("friendRequest", arr);
              }
            });
            commit(types.REMOVE_SUBMITTED_REQUEST_FRIEND, res.data.success);
          }
        });
    },
    [types.REMOVE_ADD_REQUEST_ONE]: ({ commit }, id) => {
      axios
        .post(
          "http://localhost:3000/friend-request/remove-request-user-one",
          { id },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          commit(types.REMOVE_ADD_REQUEST_ONE, res.data);
        });
    },
    [types.GET_FRIEND_POSTS]: ({ commit }, index) => {
      axios
        .get("http://localhost:3000/post/friends-post", {
          headers: {
            index2: index,
            authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          commit(types.GET_FRIEND_POSTS, res.data);
        });
    },
    [types.GET_USER_POSTS]: ({ commit }, {index, id}) => {
      axios
        .get("http://localhost:3000/post/user-post/" + id, {
          headers: {
            index2: index,
            authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log('vuex userpost 3333', res.data)
          if (res.data)
          commit(types.GET_USER_POSTS, res.data);
        });
    },
    [types.ADD_COMMENT]: ({ commit }, { comment, postID }) => {
      socket.emit("new-comment", { comment, postID });
      commit(types.ADD_COMMENT, { comment, postID });
    },

    [types.GET_COMMENTS]: ({ commit }, index) => {
      axios
        .get("http://localhost:3000/comment/get-comments", {
          headers: {
            postid: index,
            authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log("vuex types.GET_COMMENTS", res.data);
          commit(types.GET_COMMENTS, res.data);
        });
    },
    [types.GET_CHAT_MESSAGES]: ({ commit }, userID) => {
      axios.get("http://localhost:3000/chat-message/" + userID,
       {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }).then((res) => {
        // console.log('vuex types.GET_CHAT_MESSAGES', res.data)
        commit(types.GET_CHAT_MESSAGES, res.data)
      })
    },
    [types.RESET_CHAT_MESSAGES]: ({commit}) => {
      commit(types.RESET_CHAT_MESSAGES)
    },
    [types.GET_ALL_MESSAGES]: ({commit}) => {
      axios.get("http://localhost:3000/get-all-messages",
       {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }).then((res) => {
        console.log('vuex types.GET_ALL_MESSAGES 99999999', res.data)
        commit(types.GET_ALL_MESSAGES, res.data)
      })
    },
    [types.CHECK_MATCH_ID]: ({commit}, id) => {
      axios.post("http://localhost:3000/check-match-id",
      {id},
      {
       headers: {
         authorization: localStorage.getItem("token"),
       },
     }).then((res) => {
       console.log('vuex matchid', res.data)
       commit(types.CHECK_MATCH_ID, res.data)
     })
    }
      
  },
});
