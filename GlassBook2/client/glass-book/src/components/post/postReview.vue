<template>

      <!-- <v-container fluid style="max-width:200px">  -->
        <transition name='post' appear>
          <v-card class="mb-12" >
            <div style="background-color: #e91e63; border-top-right-radius: 10px; border-top-left-radius: 10px;">
              <span style="margin-left: 36%; color: white; font-size:8px"> {{ownerName}} </span>
            <span style="color: white; font-size:8px">at </span>
            <span style="margin-left:auto; color: white; font-size:8px"> {{postDate(date)}}</span>
            </div>
            <v-layout>
            </v-layout>
            <v-img :src="image" alt="no image"  style="height: 100px"></v-img>
            <v-container>
              
                  <b >{{name}}</b>
             
            </v-container>
            <v-card-text> 
                  <v-row >
              <v-col >
                <v-icon :style="{color: likeColor, width: '10px', margin: '0', padding: '0'}" >mdi-thumb-up</v-icon> 
              </v-col>
              <v-col  style="margin-left: 30%;">
               0
              </v-col>
              </v-row>
            
            </v-card-text>
            <v-card-actions>
              <v-row style="padding: 10px">
                <v-dialog  persistent max-width="200px">
                  <template v-slot:activator="{ attrs }">
                    <transition >
                      <v-btn color="primary" dark v-bind="attrs" style="width:50px"  :class="{comment }"
                     >
                      <span style="font-size: 9px;">Comment</span> 
                    </v-btn>
                    </transition>
                  </template>
               
                </v-dialog>
              </v-row>

            </v-card-actions >

                        <v-toolbar color="#1976d2" dark style="height:55px"> 
                      <v-app-bar-nav-icon ></v-app-bar-nav-icon>

                      <v-toolbar-title style="font-size: 13px; padding-left: 0;">Comments</v-toolbar-title>

                    </v-toolbar>

                  
          </v-card>
        </transition>
      <!-- </v-container> -->
 

</template>

<script>
import moment from 'moment'

export default {
  
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
      dialog: false,
      dialogDelete: false,
      postText:"",
      isEdit: false,
      pho: "",
      comment: "",
      showHidePosts: false,
      
    likeColor: 'gray',
    likeDigree: 0,
    slidePercent: 0,
    };
  },

  
  methods: {
    
    
    postOwner(owner) {
      return owner == localStorage.getItem('userID')
    },
     
    showPosts() {
      this.showHidePosts = !this.showHidePosts;
      this.$store.getters.getPosts
    },
    
    
    
    postDate(date) {
      console.log(`date is: ${date}`);
      moment.locale(this.$i18n.locale)  
      return moment(date).format('MM/DD/YYYY');
     // return moment(date).format('llll')
    },
    
    toLocalData(date) {
      const d = new Date(date)
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' +  + d.getUTCDate() +  ' ' + d.toLocaleTimeString();
    }
  },
 created() {
   

 
 },
 };
</script>

<style scoped>
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
    /* min-width: 70px !important; */
    padding: 0 16px;
}
</style>