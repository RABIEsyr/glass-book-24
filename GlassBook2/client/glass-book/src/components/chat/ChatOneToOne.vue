<template>
  <div>
    <v-container>
      <v-row no-gutters>
        <v-col 
          cols="12"
          class="pa-2"
          >
          <router-link :to="'/user/' + receiverId"> <h1 class="head">{{receiverName}}</h1> </router-link>
          <main id="ap">
            <section ref="chatArea" class="chat-area">
              <p v-for="message in messages" :key="message._id" class="message"
              :style="{'word-wrap': 'break-word'}"
              :class="{ 'message-out': message.author === 'you', 'message-in': message.author !== 'you' }"
              >
              
                {{ message.body}}
                
              </p>
            </section>

            <section class="chat-inputs">
              <form @submit.prevent="sendMessage()" id="person1-form">
                <label for="person1-input"></label>
                <input v-model="bobMessage" id="person1-input" type="text" placeholder="Type your message" required>
                <button type="submit">Send<i class="material-icons" style="font-size:16px;color:blue">navigate_next</i></button>
              </form>
            </section>
          </main>
        </v-col>
      </v-row>
    </v-container>
     

    <router-link :to="'/encr-private-chat/'+ $route.params.receiverID">
    E-E encryption
    </router-link>
  </div>
</template>

<script>
import io from "socket.io-client";
import { mapActions, mapGetters } from "vuex";
import * as types from "../../store/types";
import axios from "axios";

export default {
    data() {
        return {
            socket: io("http://localhost:3000", {
             query: { token: localStorage.getItem("token") },
             }),
        bobMessage: '',
        youMessage: '',
        receiverName: '',
        receiverId: this.$route.params.receiverID,
        messages: [
        // {
        //     body: 'Welcome to the chat, I\'m Bob!',
        //     author: 'bob'
        // },
        // {
        //     body: 'Thank you Bob',
        //     author: 'you'
        // },
        // {
        //     body: 'You\'re most welcome',
        //     author: 'bob'
        // }
        ]
  }
},
methods: {
  //   sendMessage(direction) {
  //     if (!this.youMessage && !this.bobMessage) {
  //       return
  //     }
  //     if (direction === 'out') {
  //       this.messages.push({body: this.youMessage, author: 'you'})
  //       this.youMessage = ''
  //     } else if (direction === 'in') {
  //       this.messages.push({body: this.bobMessage, author: 'bob'})
  //       this.bobMessage = ''
  //     } else {
  //       alert('something went wrong')
  //     }
  //     this.nextTick(() => {
  //       let messageDisplay = this.$refs.chatArea
  //       messageDisplay.scrollTop = messageDisplay.scrollHeight
  //     })
  // },
    sendMessage() {
      // if (!this.youMessage && !this.bobMessage) {
      //   return
      // }
      // if (direction === 'out') {
      //   this.messages.push({body: this.youMessage, author: 'you'})
      //   this.youMessage = ''
      // } else if (direction === 'in') {
      //   this.messages.push({body: this.bobMessage, author: 'bob'})
      //   this.bobMessage = ''
      // } else {
      //   alert('something went wrong')
      // }
      this.messages.push({body: this.bobMessage, author: 'bob'})
      
      this.$store.dispatch('socketOnConnection', {msg: this.bobMessage, id: this.$route.params.receiverID})
      // this.nextTick(() => {
      //   let messageDisplay = this.$refs.chatArea
      //   messageDisplay.scrollTop = messageDisplay.scrollHeight
      // })
      this.$nextTick(() => {
     document.getElementsByClassName('chat-area')[0].scrollTop = '11111';                      
  }) 
  },
  ...mapActions({
    getChatMessage: types.GET_CHAT_MESSAGES
  })
},
computed: {
  ...mapGetters({
    getMessages: types.GET_CHAT_MESSAGES
  })
},
created() {
  // this.getChatMessage(this.$route.params.receiverID).then(() => {
  //   const msgs = this.getMessages;
  //   console.log('222', msgs)
  // })
  

      axios.get("http://localhost:3000/chat-message/" + this.$route.params.receiverID,
       {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }).then((res) => {
        var msgs = res.data;
        msgs.map((m) => {
          if (m.from == localStorage.getItem('userID')) {
            console.log('0000', localStorage.getItem('userID'), '0000', m.from )
            this.messages.push({body: m.text, author: 'bob'})
            this.$nextTick(() => {
              document.getElementsByClassName('chat-area')[0].scrollTop = '11111';                      
              }) 
            return {
              body: m.text,
              author: 'bob'
            }
          } else {
             this.messages.push({body: m.text, author: 'you'})
            
           return {
              body: m.text,
              author: 'you'
            }
          }
        })
        console.log('33333', this.messages)
      })
  
  this.socket.on('msg', (msg) => {
    console.log('ChatOneToOne', msg)
    if (msg.senderId ==  this.$route.params.receiverID ) {
      this.messages.push({body: msg.msg, author: 'you'})
       this.$nextTick(() => {
              document.getElementsByClassName('chat-area')[0].scrollTop = '11111';                      
        }) 
    } 
   
  })
  axios.post('http://localhost:3000/users/get-name-chat', 
  {id: this.$route.params.receiverID },
  {
        headers: {
          authorization: localStorage.getItem("token"),
        }
  }).then(res => {
    this.receiverName = res.data.name
  })

  if (this.$route.params.receiverID == localStorage.getItem('userID')) {
      this.$router.push('/')
  }

  axios.post("http://localhost:3000/get-all-messages/read-message", 
          {receiverId: this.$route.params.receiverID }, {
            headers: { authorization: localStorage.getItem("token") },
          })
          .then((res) => {
            
            this.socket.emit("new-post", res);
          });

          this.socket.emit('some', 'some')
}, 
destroyed() {
 this.messages = []
 this.$store.dispatch(types.RESET_CHAT_MESSAGES)
}
}
</script>

<style scoped>
.headline {
  text-align: center;
  font-weight: 100;
  color: white;
}
.chat-area {
/*   border: 1px solid #ccc; */
  background: white;
  height: 50vh;
  padding: 1em;
  overflow: auto;
  max-width: 100%;
  margin: 0 auto 2em auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3)
}
.message {
  width: 45%;
  border-radius: 10px;
  padding: .5em;
/*   margin-bottom: .5em; */
  font-size: .8em;
}
.message-out {
  background: #407FFF;
  color: white;
  margin-left: 50%;
  /* float: right; */
}
.message-in {
  background: #F1F0F0;
  color: black;
}
.chat-inputs {
  display: flex;
  justify-content: space-between;
}
#person1-input {
  padding: .5em;
}
#person2-input {
  padding: .5em;  
}

#person1-form {
  margin: auto;
  padding: 10px;
}
.head {
  margin: auto;
  padding: 10px;
}
/* .msg-content {
  display: inline;
} */
</style>