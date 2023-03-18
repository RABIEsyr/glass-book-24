<template>
  <v-card
    class="mx-auto"
    max-width="500"
  >
    <v-toolbar
      color="#1565C0"
      dark
    >

      <v-toolbar-title>Messages</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list subheader>
      <v-subheader>Recent chat</v-subheader>

      <v-list-item
        v-for="chat in recent"
        :key="chat._id"
      >
      
        <v-list-item-avatar>
          <v-img
            :src="'http://localhost:3000/profile-image/' + getAwayImg(chat.from._id, chat.to._id) + '.PNG'"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="chat.text"></v-list-item-title>
        </v-list-item-content>


        <v-list-item-content>
            <v-list-item-title v-text="nameOfSender(chat.from, chat.to)"></v-list-item-title>
            
        </v-list-item-content>
        
        <v-list-item-icon>
          <v-icon :color="chat.active ? 'deep-purple accent-4' : 'grey'" @click="openNewMessage(chat.from._id, chat.to._id)">
            mdi-message-outline
          </v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    
  </v-card>
</template>

<script>
// import {mapActions} from 'vuex'
// import * as types from "../../store/types";
import axios from 'axios';
import io from "socket.io-client";

export default {
  
  data:() => ({
    // recent: [
    //     {
    //       active: true,
    //       avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    //       title: 'Jason Oner',
    //     },
    //     {
    //       active: true,
    //       avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
    //       title: 'Mike Carlson',
    //     },
    //     {
    //       avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
    //       title: 'Cindy Baker',
    //     },
    //     {
    //       avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
    //       title: 'Ali Connors',
    //     },
    //   ],
    socket: io("http://localhost:3000", {
             query: { token: localStorage.getItem("token") },
             }),
    recent: [],
    name: '', 
    from: '',
    to: ''
  }),
  created() {
    // this.getAllMessage()
    this.socket.emit('some', 'some')
     axios.get("http://localhost:3000/get-all-messages",
       {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }).then((res) => {
        var ret = new Array;
        for(var i = res.data.length-1; i >= 0; i--) {
          ret.push(res.data[i]);
         }
         
        this.recent = ret
          this.sortArrayByDate(this.recent)  

        
      });


       this.socket.on("new-msg-list", (msg) => {
        for (let i = 0; i < this.recent.length; i++) {
          if ( (this.recent[i].from._id == msg.from._id && this.recent[i].from == msg.from._id) ||
             (this.recent[i].to._id == msg.to._id && this.recent[i].to._id == msg.to._id) ||
             (this.recent[i].from_id == msg.to._id && this.recent[i].to._id == msg.from._id) ||
            (this.recent[i].to._id == msg.from._id && this.recent[i].from._id== msg.to._id) ) {
              this.recent.splice(i, 1)
             
              }
        }
         this.recent.push(msg)
          this.nameOfSender(msg.from._id, msg.to._id) 
        this.sortArrayByDate(this.recent)
      })

      this.socket.on("new-msg-list2", (msg) => {
        for (let i = 0; i < this.recent.length; i++) {
          if ( (this.recent[i].from._id == msg.from._id && this.recent[i].from == msg.from._id) ||
             (this.recent[i].to._id == msg.to._id && this.recent[i].to._id == msg.to._id) ||
             (this.recent[i].from_id == msg.to._id && this.recent[i].to._id == msg.from._id) ||
            (this.recent[i].to._id == msg.from._id && this.recent[i].from._id== msg.to._id) ) {
              this.recent.splice(i, 1)
             
              }
        }
         this.recent.push(msg)
          this.nameOfSender(msg.from._id, msg.to._id) 
        this.sortArrayByDate(this.recent)
      })
  },

  methods: {
  //   ...mapActions({
  //   getAllMessage: types.GET_ALL_MESSAGES
  // }),
    
    // sendMessage() {
    //   this.$store.dispatch('socketOnConnection', {msg: 'sosa', id: '5fdf3939a083b610dcf547f9'})
    // }

    getAwayImg(first, second) {
      return first == localStorage.getItem('userID') ? second : first
    },
    
      nameOfSender(from, to) {
      if (from._id == localStorage.getItem('userID')) {
         return `you -> ${to.name}`
       
        
      } else {
        return `You <- ${from.name}`
      }
    }, 

    sortArrayByDate(arr) {
      arr.sort(function(a, b) {
            var c = new Date(a.date);
            var d = new Date(b.date);
            return d -c ;
        });   
    },
    openNewMessage(firstId, secondId) {
      if(localStorage.getItem('userID') == secondId) {
        this.$router.push({name:'private-chat', params: {receiverID: firstId}})
      } else {
        this.$router.push({name:'private-chat', params: {receiverID: secondId}})
      }
      
    }
  }


}
</script>

<style>

</style>