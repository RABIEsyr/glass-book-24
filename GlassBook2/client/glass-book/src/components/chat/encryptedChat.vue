<template>
  <div>
    <v-container>
      <v-row no-gutters>
        <v-col 
          cols="12"
          class="pa-2"
          >
          <main id="ap">
            <section ref="chatArea" class="chat-area">
              <p v-for="message in messages" :key="message._id" class="message" 
              :class="{ 'message-out': message.author === 'you', 'message-in': message.author !== 'you' }"
              >
                {{ message.body }}
              </p>
            </section>

            <section class="chat-inputs">
              <form @submit.prevent="sendMessage()" id="person1-form">
                <label for="person1-input"></label>
                <input v-model="bobMessage" id="person1-input" type="text" placeholder="Type your message" required>
                <button type="submit">Send<i class="material-icons" style="font-size:16px;color:blue">navigate_next</i></button>
              </form>
            </section>

            <section>
              <button @click="closeChat()">
                Close
                </button> 
            </section>
          </main>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import io from "socket.io-client";
import { mapGetters } from "vuex";
// import * as types from "../../store/types";
import axios from "axios";
import cryptico from 'cryptico';

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
        receiverPublicKey: '',
        messages: [
        ],
        // isEncryptedChat: false
  }
},
methods: {
  RSAParse(rsaString) {
    var json = JSON.parse(rsaString);
    var rsa = new cryptico.RSAKey();
    rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);

    return rsa;
  },
  closeChat() {
    this.$router.replace({name: 'private-chat', params: {receiverID: this.$route.params.receiverID}})
  },
   encryptChat() {
      // this.addToEncryptChat({receiverId: this.$route.params.receiverID});
      // this.isEncryptedChat = true;
      var PassPhrase = "this is a random phrase";
      var Bits = 1024;
      var myRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);
      const rsakeysJson = JSON.stringify(myRSAkey.toJSON());
      var myPublicKeyString = cryptico.publicKeyString(myRSAkey)

      localStorage.setItem('publicKey', myPublicKeyString);
      localStorage.setItem('rsaKey', rsakeysJson);
    //console.log('this.getEncryptChatList;', this.getEncryptChatList.__ob__.value[0]['receiverId']);
  },
  
    sendMessage() {
      this.messages.push({body: this.bobMessage, author: 'bob'})
      
      if (this.receiverPublicKey) {
        const cipherMsg = cryptico.encrypt(this.bobMessage, this.receiverPublicKey)
        if (cipherMsg.status == 'success') {
            this.socket.emit('enc-msg', {msg: cipherMsg.cipher, id: this.$route.params.receiverID})
        }
      }
      this.$nextTick(() => {
     document.getElementsByClassName('chat-area')[0].scrollTop = '11111';                      
  }) 
  },

},
computed: {
  ...mapGetters({
    getEncryptChatList: 'getEncryptChatList'
  })
},
async created() {
  this.encryptChat()
  let data = await axios.post("http://localhost:3000/public-key/get-receiver-public-key", 
    {
      id: this.$route.params.receiverID
    }
    ,
    {
      headers:  {
        authorization: localStorage.getItem("token"),
      }
    }
  );
   this.receiverPublicKey = data.data;

      
  
  this.socket.on('enc-msg', (msg) => {
    console.log('encrypted msg', msg)
    if (msg.senderId ==  this.$route.params.receiverID ) {
      const rsaKey = this.RSAParse(localStorage.getItem('rsaKey'));
      
      const message = msg.msg
      const decryptedMesg = cryptico.decrypt(message, rsaKey);
      console.log('decrypted', decryptedMesg)
      this.messages.push({body: decryptedMesg.plaintext, author: 'you'})
       this.$nextTick(() => {
              document.getElementsByClassName('chat-area')[0].scrollTop = '11111';                      
        }) 
    } 
   
  })

  if (this.$route.params.receiverID == localStorage.getItem('userID')) {
      this.$router.push('/')
  }

}, 
destroyed() {
 this.messages = []
},
beforeRouteLeave(to, from , next) {
  console.log('to', to, 'from', from)
  const answer = window.confirm('You are about to leave');
  console.log(answer)
  if (answer) {
    next()
  } else {
    next(false)
  }
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
</style>