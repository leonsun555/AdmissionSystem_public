<template>
  <div>
    <Loading v-if="showLoading"></Loading>
    <Navbar></Navbar>
    <hr class="main-divider" />
    <div class="main-content">
      <div class="main-container">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li class="is-active">
              <a href="#">{{ $store.state.currentPage[0] }}</a>
            </li>
            <li class="is-active">
              <a href="#">{{ $store.state.currentPage[1] }}</a>
            </li>
          </ul>
        </nav>
        <nuxt />
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import Loading from "@/components/Loading.vue";

export default {
  middleware: "authenticated",
  components: {
    Navbar,
    Footer,
    Loading
  },
  computed: {
    showLoading() {
      return this.$store.state.showLoading;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/layout/main.scss";
</style>