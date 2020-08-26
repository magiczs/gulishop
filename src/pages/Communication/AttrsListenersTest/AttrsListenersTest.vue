<template>
  <div>
    <h2>自定义带Hover提示的按钮</h2>
    <Child aaa="bbb" :xxx="'zzz'" mmm="nnn" @click.native="handle"></Child>

    <el-button type="primary" size="" icon="el-icon-plus" @click="handle">增加</el-button>
    <el-button type="danger" size="" icon="el-icon-delete" @click="handle">删除</el-button>
    <el-button type="warning" size="" icon="el-icon-edit" @click="handle">修改</el-button>
    <br /><br />
    <HintButton
      type="primary"
      size="mini"
      icon="el-icon-plus"
      title="增加"
      @click="handle"
    ></HintButton>
    <HintButton
      type="danger"
      size="mini"
      icon="el-icon-delete"
      title="删除"
      @click="handle"
    ></HintButton>
    <HintButton
      type="warning"
      size="mini"
      icon="el-icon-edit"
      title="修改"
      @click="handle"
    ></HintButton>

    <!-- <el-button
      type="primary"
      size="mini"
      icon="el-icon-plus"
      @click="handle"
    ></el-button>
    <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
    <el-button
      type="warning"
      size="mini"
      icon="el-icon-edit"
      @dblclick.native="handle"
    ></el-button>
    <br /><br />
    <HintButton
      type="primary"
      size="mini"
      icon="el-icon-plus"
      title="增加"
      @hehe="haha"
    ></HintButton>
    <HintButton
      type="danger"
      size="mini"
      icon="el-icon-delete"
      title="删除"
      @hehe="haha"
    ></HintButton>
    <HintButton
      type="warning"
      size="mini"
      icon="el-icon-edit"
      title="修改"
      @hehe="haha"
    ></HintButton> -->
  </div>
</template>

<script type="text/ecmascript-6">
import Child from './Child'
import HintButton from './HintButton'
  export default {
    name: 'AttrsListenersTest',
    components:{
      Child,
      HintButton
    },

    methods: {
      handle(){
        alert('你点我干嘛!')
      }
    },
  }
</script>
