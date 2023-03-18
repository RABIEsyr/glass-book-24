<template>
    <div>
        <div  :style="{'margin-left': marginLeft,  'margin-top': '-55px',  'position': 'absolute','z-index': 1}">
         <v-btn v-if="!isPosting"
            class="ma-2"
            outlined
            large
            fab
            color="indigo"
            style="background-color: #e91e63;"
            @click="startSteps()"
       >
         <v-icon>mdi-pencil</v-icon>
        </v-btn>
         <v-hover v-slot="{ hover }" v-else>
            <v-progress-circular 
            :rotate="180"
            :size="100"
            :width="15"
            :value="value"
            :color="value == 100 ? 'teal': 'pink'"
            >
            <span v-if="!hover">{{ value }}</span>
            <v-btn fab color="purple" v-else @click.prevent="isPosting = false">reset</v-btn>
            </v-progress-circular>

         </v-hover>
        </div>
      <div >
          <v-sheet
                class="custom-sheet"
                 color="grey lighten-3"
                elevation="24">
            <v-stepper
            v-model="e6"
            vertical
             color="grey lighten-3"
            >
        <v-stepper-step
        :complete="e6 > 1"
        step="1"
        editable
        :rules="[testStep1]"
        id="stepid1"
        >
        Title    
        </v-stepper-step>

        <v-stepper-content step="1">
        <v-text-field
        color="#e91e63"
        counter="25"
        :rules="[testTextField]"
        label="Glass Title"
        v-model="postTitle"
        
    ></v-text-field>
        <v-btn
            color="primary"
            @click="e6 = 2, isComplete1()"
        >
            Continue
        </v-btn>
        </v-stepper-content>

        <v-stepper-step
         :complete="e6 > 2"
         step="2"
         :rules="[testStep2]"
         id="stepid2"
        >
        Image
        </v-stepper-step>

        <v-stepper-content step="2">
        <v-card
            color="grey lighten-1"
            class="mb-12"
            height="200px"
        >
       
          <img  v-show="selectedFile" class="post-image" id="output2" style="width: 100%; height: 200px" @click="$refs.myFile.click()"/>
                      <label for="file-input" v-if="!selectedFile" >
                        <i
                          class="material-icons"
                          style="font-size: 48px; color: blue; margin-top: 25%; margin-left: 40%;"
                          >collections</i
                        >
                      </label>

                      <input
                      
                        id="file-input"
                        type="file"
                        ref="myFile"
                        style="width: 100px; display:none"
                        @change="onFileSelected01($event)"
                      />
                    
        </v-card>
        <v-btn
            color="primary"
            @click="e6 = 3, isComplete2()"
        >
            Continue
        </v-btn>
        <v-btn 
            text
            @click="e6 = 1, previousStep2()">
            Previous
        </v-btn>
        </v-stepper-content>

        <v-stepper-step
        :complete="e6 > 3"
        step="3"
        editable
        :rules="[testStep3]" 
        id="stepid3"
        >
        Preview
        </v-stepper-step>

        <v-stepper-content step="3" :style="{'max-width': maxWidth + 'px'}">
        <PostReview :image="image" :name="postTitle" :ownerName="username"/>
        <v-btn
            color="primary"
            @click="isComplete3()"
        >
            Continue
        </v-btn>
        <v-btn 
         text
         @click="e6 = '2', previousStep3()">
            Previous
        </v-btn>
        </v-stepper-content>

        <v-stepper-step step="4">
        View setup instructions
        </v-stepper-step>
        <v-stepper-content step="4">
        <v-card
            color="grey lighten-1"
            class="mb-12"
            height="200px"
        ></v-card>
        <v-btn
            color="primary"
            @click="e6 = 1"
        >
            Continue
        </v-btn>
        <v-btn text>
            Cancel
        </v-btn>
        </v-stepper-content>
     </v-stepper>
          </v-sheet>
    </div>  
 </div>
</template>

<script>
import PostReview from '../post/postReview.vue';
import {mapGetters} from 'vuex';
import { eventBus } from '../../main';

var step1Element, step2Element, step3Element;
var div1Border, div2Border, div3Border;
export default {
    props: [
        "position",
        "maxWidth",
        "marginLeft",
    ],
data () {
    const myData = {
        e6: 0,
        postTitle: '',
        step0: 0,
        step2: 0,
        selectedFile: null,
        image: null,
        isPosting: false,
        value: 0,
        exutdedFunction1: false,
        exutdedFunction10: false,
      }
    
      return { ...myData }
        
 },
 methods: {
     isComplete1() {
        if (this.postTitle == '' || this.postTitle.length > 25 ) {          
                 this.step0 = 1;
                const el = document.querySelectorAll('span.v-stepper__step__step');
                el[0].innerHTML = `<i aria-hidden="true" class="v-icon notranslate mdi mdi-alert theme--light"></i>`
                div1Border.style.borderLeft = '1px solid red'

                if (this.exutdedFunction1) {
                    this.exutdedFunction1 = false;
                     this.value -= 50;
                }
        }
        else {
                this.step0 = 0;
                var x = document.querySelectorAll('span.v-stepper__step__step, span.primary');
                x[0].innerHTML =  `<i aria-hidden="true" class="v-icon notranslate mdi mdi-check theme--light"></i>`
                div1Border.style.borderLeft = '1px solid blue';
            if (!this.exutdedFunction1) {
                 this.exutdedFunction1 = true
                 this.value += 50;
            }
            }
        //    const image = require('@/assets/gallery.png')
        //    step2Element.innerHTML = `<img style="height: 40px; width: 32px; " src=${image}>`; 
            const image2 = `<svg style="width:15px;height:15px;" viewBox="0 0 24 24">
                        <path fill="#ffffff"  d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6"></path>
                    </svg>`  
            step2Element.innerHTML = image2;

           this.scrollToStep('stepid2')
        },
        isComplete2() {
            if (this.selectedFile){
                this.step2 = 0;
                div2Border.style.borderLeft = '1px solid blue'
                var x = document.querySelectorAll('span.v-stepper__step__step, span.primary');
                x[1].innerHTML =  `<i aria-hidden="true" class="v-icon notranslate mdi mdi-check theme--light"></i>`
                console.log('vvvv22', this.value)
                if (!this.exutdedFunction10) {
                 this.exutdedFunction10 = true
                 this.value += 50;
            }
                
            } else {
                const el = document.querySelectorAll('span.v-stepper__step__step');
                el[1].innerHTML = `<i aria-hidden="true" class="v-icon notranslate mdi mdi-alert theme--light"></i>`
                div2Border.style.borderLeft = '1px solid red'
                this.step2 = 1;
            }
            // const preview = require('@/assets/preview.png')
            // step3Element.innerHTML = `<img style="height: 40px; width: 32px; " src=${preview}>`;

            const preview2 = `<svg style="width:15px;height:15px;" viewBox="0 0 24 24">
                        <path fill="#ffffff" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"></path>
                    </svg>`
            step3Element.innerHTML = preview2;
        
                this.scrollToStep('stepid3')
               
                eventBus.marginTopCustomPost(300);
        },
        isComplete3() {
            if (this.step0 == 0 && this.step2 == 0) {
                var x = document.querySelectorAll('span.v-stepper__step__step, span.primary');
                x[2].innerHTML =  `<i aria-hidden="true" class="v-icon notranslate mdi mdi-check theme--light"></i>`;
                this.e6 = 4;
                div3Border.style.borderLeft = '1px solid blue'
            }
            if (this.step0 == 1) {
                this.e6 = 1;
                this.scrollToStep('stepid1')

                eventBus.marginTopCustomPost(0);
               
               return;

                
            }
            if (this.step2 == 1) {
                this.scrollToStep('stepid2')
                this.e6 = 2;
            }
            
        },
        testStep1() {
            if (this.e6 == 0) {
                return true;
            }               
            if (this.step0 == 0 ) {
                return true
            }
            return false;
            },
        testStep2() {              
            if (this.step2 == 0 ) {
                    return true
            }
            return false;
        },
        testStep3() {
            if (this.e6 < 3)
                return true;
            if (this.step0 == 0 && this.step2 == 0 ) {
                    return true
            }
            return false;
        },
         testTextField(v) {
             this.postTitle = v;
            if (v) {
                if (v.length <= 25) {
                 this.step0 = 0;
                 this.postTitle = v;
                  return true;
            }
            this.step0 = 1;
            return "Max 25 charachters"
            }
             this.step0 = 1;
            return ''
        },
        startSteps() {
            this.e6 = 1;
            this.isPosting = true;
        },
        previousStep2() {
            // const text = require('@/assets/text.png')
            // step1Element.innerHTML = `<img style="height: 40px; width: 32px; " src=${text}>`;

            const text2 = `<svg style="width:15px;height:15px;" viewBox="0 0 24 24">
                        <path fill="#FFFFFF"  d="M22,22H2V20H22V22M6.2,17.3L4.8,15.9L6.2,14.5L5.5,13.8L4.1,15.2L2.7,13.8L2,14.5L3.4,15.9L2,17.3L2.7,18L4.1,16.6L5.5,18L6.2,17.3M20.5,3L21.7,7.4L20.7,7.7C20.2,6.8 19.8,6 19.3,5.5C18.7,5 18.1,5 17.5,5H15V15.5C15,16 15,16.5 15.3,16.7C15.6,16.9 16.3,16.9 17,16.9V17.9H11V16.9C11.7,16.9 12.3,16.9 12.7,16.7C13,16.5 13,16 13,15.5V5H10.5C9.9,5 9.3,5 8.7,5.4C8.2,5.8 7.7,6.7 7.3,7.6L6.3,7.3L7.5,3H20.5Z"></path>
                    </svg>`
            step1Element.innerHTML = text2;        
        },
        previousStep3() {
            // const image = require('@/assets/gallery.png')
            // step2Element.innerHTML = `<img style="height: 40px; width: 32px; " src=${image}>`;
            const image2 = `<svg style="width:15px;height:15px;" viewBox="0 0 24 24">
                        <path fill="#ffffff"  d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6"></path>
                    </svg>`
            step2Element.innerHTML = image2;
        },
        onFileSelected01(event) {
            this.selectedFile = event.target.files[0];
            var output = document.getElementById("output2");
            output.src = URL.createObjectURL(event.target.files[0]);
            this.image = URL.createObjectURL(event.target.files[0]);
            this.isFileSelected = true;
            output.onload = function () {
            URL.revokeObjectURL(output.src);
      };
    },    
     scrollToStep(id) {
          const node = document.getElementById(id);
          if (id !== 'stepid3') {
           node.scrollIntoView(true);
          } else {
              setTimeout(function() {
                  node.scrollIntoView(true);
              }, 1000)
          }
          let scrolledY = window.scrollY;
          if (scrolledY) {
              window.scroll(0, scrolledY - 400 )
          }
     },   
       
 },
 watch: {
    e6(val) {
        if (val == 1) {
            // const text = require('@/assets/text.png')
            // step1Element.innerHTML = `<img style="height: 40px; width: 32px; " src=${text}>`;

             const text2 = `<svg style="width:15px;height:15px;" viewBox="0 0 24 24">
                        <path fill="#FFFFFF"  d="M22,22H2V20H22V22M6.2,17.3L4.8,15.9L6.2,14.5L5.5,13.8L4.1,15.2L2.7,13.8L2,14.5L3.4,15.9L2,17.3L2.7,18L4.1,16.6L5.5,18L6.2,17.3M20.5,3L21.7,7.4L20.7,7.7C20.2,6.8 19.8,6 19.3,5.5C18.7,5 18.1,5 17.5,5H15V15.5C15,16 15,16.5 15.3,16.7C15.6,16.9 16.3,16.9 17,16.9V17.9H11V16.9C11.7,16.9 12.3,16.9 12.7,16.7C13,16.5 13,16 13,15.5V5H10.5C9.9,5 9.3,5 8.7,5.4C8.2,5.8 7.7,6.7 7.3,7.6L6.3,7.3L7.5,3H20.5Z"></path>
                    </svg>` 
            step1Element.innerHTML = text2;
        }
    }
 },
 
 mounted() {
     var x = document.querySelectorAll('span.v-stepper__step__step');
     
    //   const text = require('@/assets/text.png')
    //   const image = require('@/assets/gallery.png');
    //   const preview = require('@/assets/preview.png');
      
      const text2 = `<svg style="width:15px;height:15px;" viewBox="0 0 24 24">
                        <path fill="#FFFFFF"  d="M22,22H2V20H22V22M6.2,17.3L4.8,15.9L6.2,14.5L5.5,13.8L4.1,15.2L2.7,13.8L2,14.5L3.4,15.9L2,17.3L2.7,18L4.1,16.6L5.5,18L6.2,17.3M20.5,3L21.7,7.4L20.7,7.7C20.2,6.8 19.8,6 19.3,5.5C18.7,5 18.1,5 17.5,5H15V15.5C15,16 15,16.5 15.3,16.7C15.6,16.9 16.3,16.9 17,16.9V17.9H11V16.9C11.7,16.9 12.3,16.9 12.7,16.7C13,16.5 13,16 13,15.5V5H10.5C9.9,5 9.3,5 8.7,5.4C8.2,5.8 7.7,6.7 7.3,7.6L6.3,7.3L7.5,3H20.5Z"></path>
                    </svg>` 
      const image2 = `<svg style="width:15px;height:15px;" viewBox="0 0 24 24">
                        <path fill="#ffffff"  d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6"></path>
                    </svg>`
      const preview2 = `<svg style="width:15px;height:15px;" viewBox="0 0 24 24">
                        <path fill="#ffffff" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"></path>
                    </svg>`  
      const puplish = `<svg style="width:15px;height:15px;" viewBox="0 0 24 24">
                        <path fill="#ffffff"  d="M5,4V6H19V4H5M5,14H9V20H15V14H19L12,7L5,14Z"></path>
                    </svg>`                                       
        
    //   x[0].innerHTML = `<img style="height: 30px; width: 30px; " src=${text}>`;
    //   step1Element = x[0];
       x[0].innerHTML = text2; 
      step1Element = x[0];
      
    //   x[1].innerHTML = `<img style="height: 40px; width: 32px; " src=${image}>`;
    //   step2Element = x[1];
      x[1].innerHTML = image2;
      step2Element = x[1];  


    //   x[2].innerHTML = `<img style="height: 40px; width: 32px; " src=${preview}>`;
    //   step3Element = x[2]

      x[2].innerHTML = preview2;
      step3Element = x[2]

      x[3].innerHTML = puplish;


      const divBorder = document.querySelectorAll('div.v-stepper__content');
      div1Border = divBorder[0];
      div2Border = divBorder[1];
      div3Border = divBorder[2];


      

 },
 beforeCreate() {
    this.$nextTick().then(() => document.body.classList.remove('.v-application--is-ltr.theme--light.v-stepper--vertical.v-stepper__content'))
},
computed: {
    ...mapGetters({
       username: 'getUsername'
    })
},
 components: {
     PostReview
 },
}
</script>

<style scoped>
.mdi-pencil::before {
    color: white !important;
}
.v-btn--fab.v-size--large {
    border: 5px solid #1565c0;
}

.theme--light.v-stepper {
    background: transparent !important;
    border-top-right-radius: 70px !important; 
}
.custom-sheet {
    border-top-right-radius: 70px;
}
.v-progress-circular {
  margin: 1rem;
}
</style>