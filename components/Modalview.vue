<template>
  <div class="w3-modal">
    <div class="w3-modal-content w3-animate-zoom">
      <header class="w3-container w3-teal">
        <span v-on:click="toggleModal({ name: modalName, state: false })" class="w3-button w3-display-topright">&times;</span>
        <h2>
          <slot name="header"></slot>
        </h2>
      </header>

      <div class="w3-container">
        <slot></slot>
      </div>

      <footer class="w3-container w3-teal">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
import "w3-css/w3.css";
import { mapMutations } from "vuex";

export default {
  props: ['modalName'],
  created() {
    document.querySelector("html").style.overflow = "hidden";
  },
  beforeDestroy() {
    document.querySelector("html").style.overflow = "auto";
  },
  methods: {
    ...mapMutations(['toggleModal'])
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/components/modalview.scss";
</style>

