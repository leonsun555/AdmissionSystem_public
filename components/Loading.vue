<template>
  <!-- <div class="ldBar"></div> -->

  <div class="loading">
    <div class="lds-roller" v-if="!isProgress">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <!-- <div ref="progress" id="progress" v-if="isProgress"></div> -->
    <progress
      v-if="isProgress"
      class="progress is-info"
      v-bind:value="percent"
      max="100"
    >{{ percent + '%'}}</progress>
  </div>
  <!-- <div class="ldBar" data-preset="bubble" data-value="50"></div> -->
</template>

<script>
import ProgressBar from "progressbar.js";
export default {
  computed: {
    isProgress() {
      if (this.$store.state.loadingPercent !== null) return true;
      else return false;
    },
    percent() {
      return this.$store.state.loadingPercent;
    }
  },
  created() {
    document.querySelector("html").style.overflow = "hidden";
  },
  beforeDestroy() {
    document.querySelector("html").style.overflow = "auto";
  },
  mounted() {
    // if (this.isProgress) {
    //   var bar = new ProgressBar.Circle(this.$refs.progress, {
    //     color: "#aaa",
    //     // This has to be the same size as the maximum width to
    //     // prevent clipping
    //     strokeWidth: 4,
    //     trailWidth: 1,
    //     easing: "easeInOut",
    //     duration: 1400,
    //     text: {
    //       autoStyleContainer: false
    //     },
    //     from: { color: "#aaa", width: 1 },
    //     to: { color: "#333", width: 4 },
    //     // Set default step function for all animate calls
    //     step: function(state, circle) {
    //       circle.path.setAttribute("stroke", state.color);
    //       circle.path.setAttribute("stroke-width", state.width);
    //       var value = Math.round(circle.value() * 100);
    //       if (value === 0) {
    //         circle.setText("");
    //       } else {
    //         circle.setText(value);
    //       }
    //     }
    //   });
    //   bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    //   bar.text.style.fontSize = "2rem";
    //   bar.animate(1.0); // Number from 0.0 to 1.0
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/components/loading.scss";
</style>