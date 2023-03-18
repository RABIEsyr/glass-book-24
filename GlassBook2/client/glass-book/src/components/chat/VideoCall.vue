<template>
    <div class="video-container">
        <!-- <div>
            <font-awesome-icon icon="phone" class='fa fa-phone faa-ring animated fa-2x'></font-awesome-icon>
        </div> -->
        <button @click="callUser()">Call</button>
           <div>
            <div style="position: absolute; width:50px; height: 50px; z-index: 11">
               <!-- <h1 style="position: absolute; z-index: 11">YOU</h1> -->
               <video style="position: absolute; width: 250px" autoplay class="local-video" id="local-video"></video>
            </div>
            <div style="position: absolute">
                <h1 style="position: absolute; z-index: 11; margin-left: 500px">{{calleName}}</h1>
                <video style="position: absolute" autoplay muted class="remote-video" id="remote-video"></video>
            </div>
           </div>
         </div>
</template>

<script>
import io from "socket.io-client";
import {mapGetters} from 'vuex';
 const {  RTCSessionDescription } = window;
//  const peerConnection = new RTCPeerConnection();

//  let isAlreadyCalling = false;
export default {
   data: () => ({
       socket: io("http://localhost:3000", {
        query: { token: localStorage.getItem("token") },
    }),
    calleName: '',
   }),
   computed: {
       ...mapGetters({
           peerConnectionState: 'getRtcPeerConnection'
       })
   }, 
   async created() {
      this.calleName = this.$route.params.name;
      
      let stream = null;
      try {
          stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
          const localVideo = document.getElementById('local-video');
          if (localVideo)
             localVideo.srcObject = stream;
          stream.getTracks().forEach((track) => this.peerConnectionState.addTrack(track, stream))
      } catch (error) {
          alert(error)
      }

    
        this.peerConnectionState.ontrack = function({streams: [stream]}) {
           const remoteVideo = document.getElementById('remote-video');
           if (remoteVideo) {
                remoteVideo.srcObject = stream;
           }
       } 
       
       this.socket.on('call-made', async (data) => {
        //    this.setIngoingCall(true);
           await this.peerConnectionState.setRemoteDescription(new RTCSessionDescription(data.offer));
           const answer = await this.peerConnectionState.createAnswer();
           await this.peerConnectionState.setLocalDescription(new RTCSessionDescription(answer));
           this.socket.emit('make-answer', {
               answer,
               to: data.socket
           });
       })

       this.socket.on('answer-made', async data => {
           await this.peerConnectionState.setRemoteDescription(new RTCSessionDescription(data.answer));
        //    if (!isAlreadyCalling) {
                this.callUser();
        //        isAlreadyCalling = true;
        //    }
       })
       if (this.$route.params.caller) {
            const self = this;
            setTimeout(function() {
                self.callUser();
            }, 4000)
        }  
   },
   methods: {
    //    ...mapMutations({
    //        setIngoingCall: 'IngoingCall'
    //    }),
       async callUser() {
           const offer = await this.peerConnectionState.createOffer();
           await this.peerConnectionState.setLocalDescription(new RTCSessionDescription(offer));
           this.socket.emit('call-user', {
               offer,
               to: this.$route.params.id
           })
       },

   }
}
</script>

<style scoped>

</style>