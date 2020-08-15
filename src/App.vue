<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer v-if="!$route.meta.isHide"></Footer>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mapActions } from "vuex";
export default {
  name: "App",
  mounted() {
    this.getCategoryList();
  },
  methods: {
    ...mapActions(["getCategoryList"]),
  },
  components: {
    Header,
    Footer,
  },
};
</script>

<style></style>
