import Vue from "vue";
import VueRouter from "vue-router";

import axios from 'axios'

// import Signup from "../components/auth/Signup";
// import Login from "../components/auth/Login";
// import Chat from "../components/chat/Chat";
// import UploadPhoto from "../components/uploadPhoto/UploadPhoto";
// import Posts from "../components/post/Posts";
// import UserProfile from "../components/user/UserProfile";
// import FriendRequest from "../components/friendRequest/friendRequest.vue";
// import Friends from "../components/friendRequest/friends.vue";
// import ChatOneToOne from '../components/chat/ChatOneToOne.vue';
// import EncrptedChat from '../components/chat/encryptedChat'

// import CustomNavdrawer from '../components/customNavdrawer/customNavdrawer'

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    beforeEnter: (async(to, from, next) => {
      if (await checkAuth()) {
        next('/')
      } else {
        next({name: 'login'})
      }
    })
  },
  {
    path: "/signup",
    name: "signup",
    // component: Signup,
     component: () => import('../components/auth/Signup'),
    beforeEnter: async (to, from, next) => {
      if (await checkAuth()) {
        next("/");
      } else {
        next();
      }
    },
  },
  {
    path: "/login",
    name: "login",
    //component: Login,
    component: () => import('../components/auth/Login'),
    beforeEnter: async (to, from, next) => {
      if (await checkAuth()) {
        next("/");
      } else {
        next();
      }
    }
  },
  {
    path: "/",
    name: "Home",
    redirect: "posts",
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/posts",
    name: "Posts",
    // component: Posts,
    component: () => import('../components/post/Posts'),
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/chat",
    name: "chat",
    // component: Chat,
    component: () => import('../components/chat/Chat'),
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/upload-photo",
    name: "upload-photo",
    // component: UploadPhoto,
    component: () => import('../components/uploadPhoto/UploadPhoto'),
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/user/:id",
    name: "userProfile",
    // component: UserProfile,
    component: () => import('../components/user/UserProfile'),
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/friend-requests",
    name: "friendRequest",
    // component: FriendRequest,
    component: () => import('../components/friendRequest/friendRequest'),
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/get-friends",
    name: "getFriends",
    // component: Friends,
    component: () => import('../components/friendRequest/friends'),
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/private-chat/:receiverID",
    name: "private-chat",
    // component: ChatOneToOne,
    component: () => import('../components/chat/ChatOneToOne'),
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/encr-private-chat/:receiverID",
    name: "encr-private-chat",
    // component: EncrptedChat,
    component: () => import('../components/chat/encryptedChat'),
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/video-call",
    name: "video-call",
    component: () => import('../components/chat/VideoCall'),
    beforeEnter: async(to, from, next) => {
      if (await checkAuth()) {
      //   if (to.params.calle || to.params.caller) {
      //     next();
      //   } else {
      //   if (from.name != 'getFriends') {
      //     next('/get-friends')
      //   }
      // }
      next();
      } else {
        next("/login");
      }
    },
  },
  // {
  //   path: '/nav',
  //   component: CustomNavdrawer
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    window.scrollTo(0, 0)
  }
});

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'signup'  && !localStorage.getItem('token')) next({ name: 'signup' })
//   else next()
// });

// router.beforeEach(async (to, from, next) => {
//   if ( to.name !== 'signup' || to.name !== 'login' ) {
//     if (await checkAuth()) {
//      next()
//     } else {
//       next({name: 'login'})
//     } 
//   } else {
//     next()
//   } 
// })

// router.beforeEach( async(to, from, next) => {
//   if (to.name == 'signup' && !await checkAuth()) {
//     next() 
//   } else {
//       next({name: 'signup'})
//     }
//   if (to.name == 'login' && !await checkAuth()) {
//       next() 
//   } else {
//         next({name: 'login'})
//     } if( (to.name !== 'login' || to.name !== 'signup') && !await checkAuth()) {
//       next({name: 'login'})
//     } else {
//       next()
//     }    
// })

async function checkAuth() {
  let isAuth = await axios.get('http://localhost:3000/check-auth', {
    headers: {
      authorization: localStorage.getItem('token')
    }
  })
  return isAuth.data.success;
}

export default router;
