<template>
  <div>
    <h1>EventTest组件</h1>
    <button @click="test1">test1</button>
    <Event1 @click.native="test2">test2</Event1>

    <button @heihei="test3">test3</button>
    <Event2 @heihei="test3" @click="test4"></Event2>
    <!-- <Event2 ></Event2> -->
  </div>
</template>

<script type="text/ecmascript-6">
import Event1 from './Event1.vue'
import Event2 from './Event2.vue'

export default {
  name: 'EventTest',

  components: {
    Event1,
    Event2,
  },

  methods: {
   test1(event){
     console.log(event.target.innerHTML);
   },
   test2(event){
     console.log(event.target.innerHTML);
   },
   test3(event){
     console.log(event);
   },
   test4(event){
     console.log(event);
   }
  }
}
</script>
