<template>
  <div>
    <h2>深入v-model</h2>

    <input type="text" v-model="msg" />
    <span>我爱你{{ msg }}</span>
    <br /><br />
    <input type="text" :value="msg" @input="msg = $event.target.value" />
    <span>我爱你{{ msg }}</span>
    <br />
    <CustomInput :value="msg1" @input="msg1 = $event"></CustomInput>
    <span>我爱你{{ msg1 }}</span>
    <CustomInput v-model="msg1"></CustomInput>
    <span>我爱你{{ msg1 }}</span>
  </div>
</template>

<script type="text/ecmascript-6">
import CustomInput from './CustomInput.vue'
export default {
  name: 'ModelTest',
  data() {
    return {
      msg:'赵丽颖',
      msg1:'戚薇'
    }
  },
  components: {
    CustomInput
  }
}
</script>
