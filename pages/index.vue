<template>
  <div class="container">
    <div>
      <!-- <logo /> -->
      <h1 class="title">招生行政系統</h1>
      <h2 class="subtitle"></h2>
      <div class="loginForm">
        <div class="field">
          <div class="control has-icons-left has-icons-right">
            <input class="input" type="text" placeholder="帳號" v-model="ruleForm.account" />
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
            <!-- <span class="icon is-small is-right">
              <i class="fas fa-check"></i>
            </span>-->
          </div>
          <!-- <p class="help is-success">This username is available</p> -->
        </div>

        <div class="field">
          <div class="control has-icons-left has-icons-right">
            <input class="input" type="password" placeholder="密碼" v-model="ruleForm.password" />
            <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
            <!-- <span class="icon is-small is-right">
              <i class="fas fa-exclamation-triangle"></i>
            </span>-->
          </div>
          <!-- <p class="help is-danger">This email is invalid</p> -->
        </div>
        <div class="btn">
          <a
            href="#"
            class="button is-info is-outlined is-medium"
            v-bind:class="toggleState"
            v-on:click="submitForm"
          >登入</a>
          <!-- <nuxt-link class="button is-info is-outlined is-medium" v-on:click="submitForm">登入</nuxt-link> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Typed from "typed.js";
import Logo from "~/components/Logo.vue";
import { mapMutations } from "vuex";

export default {
  middleware: 'login',
  data() {
    return {
      ruleForm: {
        account: "",
        password: ""
      }
    };
  },
  components: {
    Logo
  },
  mounted() {
    let options = {
      strings: ["本系統限臺北藝術大學招生人員使用", "如有相關問題請洽分機1257"],
      typeSpeed: 200,
      loop: true
    };

    new Typed(".subtitle", options);
  },
  methods: {
    async submitForm(evt) {
      var vm = this;
      if (vm.ruleForm.account === "" || vm.ruleForm.password === "") {
        vm.$notyf.error("請確認是否有輸入帳號及密碼!");
        return;
      }
      vm.AUTH_REQUEST();
      evt.preventDefault();
      const credentials = {
        Email: vm.ruleForm.account,
        Password: vm.ruleForm.password
      };

      this.$store
        .dispatch("AUTH_REQUEST", credentials)
        .then(res => {
          var options = { maxAge: 60 * 60 * 24 };
          var cookieList = [
            { name: "user-token", value: res.token, opts: options },
            { name: "user-name", value: res.username, opts: options },
          ];
          //儲存user data到cookie
          vm.$cookies.setAll(cookieList);
          vm.pageChange(['評分輔助表處理','評分成績輸入']);
          vm.$router.push("/score");
        })
        .catch(error => {
          vm.$notyf.error("帳號或密碼輸入錯誤!");
        });
    },
    ...mapMutations(["AUTH_REQUEST","pageChange"])
  },
  computed: {
    toggleState() {
      var vm = this;
      if (vm.$store.state.status === "loading") {
        return {
          "is-loading": true
        };
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/pages/index.scss";
</style>
