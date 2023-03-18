<template>
  <div>
    <v-container>
      <v-row>
       
          <v-text-field
            label="Search"
            v-model="searchByName"
          ></v-text-field>
      </v-row>
    </v-container>
   <div v-if="searchByName == ''">
      <div v-for="user in friends" :key="user.id">
      <v-card class="mx-auto" max-width="700" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="mb-4">
              <span style="color: #1565C0"> <router-link :to="'/user/' + user.id" >{{ user.name }}</router-link></span>
            </div>
          </v-list-item-content>

          <!-- <v-img
            :alt="`${user.name} avatar`"
            :src="'data:image/PNG;base64,' + user.image"
            height="100"
            width="50"
            style="border-top-right-radius: 14px;"
          ></v-img> -->
          
          <v-badge
              :content="user.status ? 'ONLINE' : 'OFFLINE'"
              :value="user.status ? 'ONLINE' : 'OFFLINE'"
              :color="user.status ? 'green' : 'red'"
              overlap
              left
            >
             <v-img 
             :alt="`${user.name} avatar`"
            :src="'data:image/PNG;base64,' + user.image"
            height="100"
            width="150"
            style="border-top-right-radius: 14px;"></v-img>
            </v-badge>
        </v-list-item>

        <!-- <v-card-actions>
          <v-btn outlined rounded text color="#1565C0" @click="createNewMessage(user.id)"> chat </v-btn>
           STATUS: {{isOnline(user.id)}} {{user.status}}
        </v-card-actions> -->
        <v-card-actions>
          <v-btn outlined rounded text color="#1565C0" @click="createNewMessage(user.id)"> chat </v-btn>
          <v-btn
          :disabled="!user.status" 
           outlined rounded text color="#1565C0"
           @click="onNavVideoCall(user.id, user.name)">
            <font-awesome-icon icon="phone" ></font-awesome-icon>
           </v-btn>
          <!-- <div :class="[user.status ? 'status-online': 'status-offline', 'status']">
             <span :style="[{color: 'white'}]">{{user.status ? 'ONLINE' : 'OFFLINE'}}</span>
          </div> -->
           
        </v-card-actions>
        
      </v-card>
      <br />
    </div>
   </div>
   <div v-else>
      <div v-for="user in friendsFilter" :key="user.id">
      <v-card class="mx-auto" max-width="700" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="mb-4">
              <span style="color: #1565C0">{{ user.name }}</span>
            </div>
          </v-list-item-content>

          <!-- <v-img
            :alt="`${user.name} avatar`"
            :src="'data:image/PNG;base64,' + user.image"
            height="100"
            width="50"
          ></v-img> -->
           <v-badge
              :content="user.status ? 'ONLINE' : 'OFFLINE'"
              :value="user.status ? 'ONLINE' : 'OFFLINE'"
              :color="user.status ? 'green' : 'red'"
              overlap
              left
            >
             <v-img 
             :alt="`${user.name} avatar`"
            :src="'data:image/PNG;base64,' + user.image"
            height="100"
            width="150"
            style="border-top-right-radius: 14px;"></v-img>
            </v-badge>
        </v-list-item>

        <v-card-actions>
          <v-btn outlined rounded text color="#1565C0" @click="createNewMessage(user.id)"> chat </v-btn>
           <v-btn outlined rounded text color="#1565C0" @click="onNavVideoCall(user.id, user.name)"><font-awesome-icon icon="phone" ></font-awesome-icon></v-btn>
          <!-- <div :class="[user.status ? 'status-online': 'status-offline', 'status']">
            <span :style="[{color: 'white'}]">{{user.status ? 'ONLINE' : 'OFFLINE'}}</span>
          </div> -->
        </v-card-actions>
        
      </v-card>
      <br />
    </div>
   </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import { mapActions, mapGetters } from "vuex";

import * as types from "../../store/types";
import { eventBus } from "../../main";
export default {
  data() {
    return {
      socket: io("http://localhost:3000", {
        query: { token: localStorage.getItem("token") },
      }),
      searchByName: '',
      onlineFriends: [],
    };
  },
  computed: {
    ...mapGetters({
      friends: types.GET_FRIENDS_LIST,
    }),
    friendsFilter() {
      let result = this.friends
      const filter = event => 
      event.name.includes(this.searchByName)
      return result.filter(filter)
    },
    
  },
  methods: {
    ...mapActions({
      getFiriend: types.GET_FRIENDS_LIST,
    }),
    createNewMessage(id) {
      this.$router.push({name:'private-chat', params: {receiverID: id}})
    },
    myLog() {
      for (let i = 0; i < arguments.length; i += 1) {
        if (typeof (arguments[i]) === 'object') {
          try {
            arguments[i] = JSON.parse(JSON.stringify(arguments[i]));
          } catch (e) {
            console.error(e);
          }
        }
      }
      console.log(...arguments);
   },
  // isOnline(userId) {
     //this.onlineFriends.__ob__.value.forEach(element => {
      //console.log('this.onlineFriends111111', element);
     //});

    //  const uniqueOnline = [...new Set(JSON.parse(JSON.stringify(this.onlineFriends)))]
    //  const firends = (JSON.parse(JSON.stringify(this.friends)));
    //  const isFriendOnline = firends.some(r => uniqueOnline.includes(r['id']));
    //  console.log('uniqueOnline', uniqueOnline);
 // },
    onNavVideoCall(id, name) {
      this.socket.emit('call-request', id);
      const self = this;
      this.socket.on('start-video', function() {
        self.$router.push({name: 'video-call', params: {id: id, name: name, caller: true}})
      })
      
    }
  },
   created() {
     this.socket.emit('some', 'some');
    this.getFiriend();
      console.log('friends 777888', this.friends);
    
    this.socket.on('online-users', (onlineUsers) => {
      this.onlineFriends.push(onlineUsers);
       this.$store.commit('changeOnlineStatus', {status: 'online', userId: onlineUsers})
      console.log('new online_users', onlineUsers);
     //this.isOnline(onlineUsers)
    });

  
    this.socket.on('friend-leave2', (userId) => {
      console.log('disconnected-friends-list', userId);
      this.$store.commit('changeOnlineStatus', {status: 'offline', userId: userId})
      this.onlineFriends.splice(this.onlineFriends.indexOf(userId), 1);
    })
    // this.socket.on("get-fr-req-data", (data) => {
    //   console.log("friendReqeust.vue 7676", data);
    // });
  },
  mounted() {
    eventBus.$on('onNavPost', () => {
      this.$router.push('/')
    })
 },

  destroyed() {
    //  this.socket.disconnect();
  }
  
};
</script>

<style scoped>
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  padding-right: 0 !important;
}
.v-sheet.v-card {
    border-radius: 14px;
}
.status {
  margin-left: 50%;
  border-radius: 10%;
}
.status-online {
  background-color: green;
}
.status-offline {
  background-color: red;
}
</style>