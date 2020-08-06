<template>
  <nav class="navbar selfDef">
    <div class="navbar-brand">
      <div class="navbar-item">
        <img
          :src="require('~/assets/img/webtitle.png')"
          alt="Bulma: a modern CSS framework based on Flexbox"
          width="38"
          height="38"
        />
        <p class="nav-title">招生行政系統</p>
      </div>
      <a
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        @click="menuShow = !menuShow"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': menuShow }">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <!-- <a class="navbar-link" href="#">{{ navName[0].lvl1 }}</a> -->
          <a class="navbar-link" href="#">評分輔助表處理</a>
          <div class="navbar-dropdown is-boxed">
            <nuxt-link class="navbar-item" to="/score">評分成績輸入</nuxt-link>
            <nuxt-link class="navbar-item" to="/generate">產出評分輔助表</nuxt-link>
            <div class="authorized" v-if="authorized">
              <hr class="navbar-divider" />
              <nuxt-link class="navbar-item" to="/scoreManagement">評分欄位維護</nuxt-link>
              <nuxt-link class="navbar-item" to="/uploadDocx">評分輔助表樣板上傳</nuxt-link>
            </div>
          </div>
        </div>

        <!-- Modal Print -->
        <!-- <div class="modal" :class="[ toPrint ]" id="printModal" v-if="showModal">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">上傳匯入資料</p>
              <button class="delete" @click="toPrint=''" aria-label="close"></button>
            </header>
            <section class="modal-card-body"></section>
            <footer class="modal-card-foot">
              <button class="button is-success">匯入</button>
            </footer>
          </div>
        </div>-->
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <p class="userName">Hello, {{ userName }}</p>
        </div>
        <div class="navbar-item">
          <div class="buttons">
            <a v-if="authorized" class="button is-primary is-outlined" href="#" v-on:click="pwdModal">
              <span class="icon">
                <i class="fas fa-user"></i>
              </span>
              <span>修改密碼</span>
            </a>
            <a class="button is-info is-outlined" href="#" v-on:click="logout">
              <span class="icon">
                <i class="fas fa-sign-out-alt"></i>
              </span>
              <span>登出</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <modalview v-if="showPwdModal" modal-name="pwdChange">
      <template v-slot:header>修改密碼</template>
      <div class="pwd-content">
        <div class="field">
          <label class="label">輸入新密碼</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input"
              v-bind:class="{'is-success': checkPwd, 'is-danger': !checkPwd && password !== ''}"
              type="password"
              value="bulma"
              v-model.lazy="password"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
            <span v-if="checkPwd" class="icon is-small is-right">
              <i class="fas fa-check"></i>
            </span>
            <span v-if="!checkPwd && password !== ''" class="icon is-small is-right">
              <i class="fas fa-times"></i>
            </span>
          </div>
          <p
            v-if="!checkPwd && password !== ''"
            class="help is-danger"
          >密碼需為字母開頭,長度為4~18個字元,只能包含字母,數字,下標</p>
        </div>

        <div class="field">
          <label class="label">確認新密碼</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input"
              type="password"
              v-bind:class="{'is-success': dblcheckPwd1 && dblcheckPwd2,'is-danger': (!dblcheckPwd1 || !dblcheckPwd2) && passwordConfirm !== ''}"
              value="bulma"
              v-model.lazy="passwordConfirm"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
            <span v-if="dblcheckPwd1 && dblcheckPwd2" class="icon is-small is-right">
              <i class="fas fa-check"></i>
            </span>
            <span
              v-if="(!dblcheckPwd1 || !dblcheckPwd2) && passwordConfirm !== ''"
              class="icon is-small is-right"
            >
              <i class="fas fa-times"></i>
            </span>
          </div>
          <p
            v-if="!dblcheckPwd1 && passwordConfirm !== ''"
            class="help is-danger"
          >密碼需為字母開頭,長度為4~18個字元,只能包含字母,數字,下標</p>
          <p v-else-if="!dblcheckPwd2 && passwordConfirm !== ''" class="help is-danger">密碼不一致</p>
        </div>
      </div>
      <template v-slot:footer>
        <button
          class="button is-info is-inverted"
          v-bind:disabled="!checkPwd || !dblcheckPwd2 || !dblcheckPwd2"
          v-on:click="pwdUpdate"
        >確認修改</button>
      </template>
    </modalview>
    <modalview v-if="showLogoutModal" modal-name="logout">
      <template v-slot:header>登出</template>
      <h3>是否確認登出?</h3>
      <template v-slot:footer>
        <button class="button is-info is-inverted" v-on:click="stateRelease">確定</button>
      </template>
    </modalview>
  </nav>
</template>

<script>
import Modalview from "@/components/Modalview.vue";
import { mapMutations } from "vuex";
export default {
  head: {
    link: [
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Noto+Sans+TC&display=swap"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Allura&display=swap"
      }
    ]
  },
  components: {
    Modalview
  },
  data() {
    return {
      toPrint: "",
      menuShow: false,
      password: "",
      passwordConfirm: ""
    };
  },
  methods: {
    stateRelease() {
      var vm = this;
      vm.$store.dispatch("LOGOUT");
      vm.toggleModal({ name: "logout", state: false });
      vm.$router.push("/");
    },
    pwdModal() {
      var vm = this;
      vm.toggleModal({ name: "pwdChange", state: true });
    },
    pwdUpdate() {
      var vm = this;
      vm.$axios
        .$post("http://10.36.3.30:5100/api/Auth/PwdChange", {
          Email: vm.$cookies.get("user-name"),
          Password: vm.passwordConfirm
        })
        .then(res => {
          vm.$notyf.success("密碼修改成功,請重新登入!");
          setTimeout(() => {
            vm.$store.dispatch("LOGOUT");
            vm.$router.push("/");
          }, 2000);
        });
    },
    logout() {
      var vm = this;
      vm.toggleModal({ name: "logout", state: true });
    },
    ...mapMutations(["toggleModal"])
  },
  computed: {
    showLogoutModal() {
      return this.$store.state.showLogoutModal;
    },
    showPwdModal() {
      return this.$store.state.showPwdModal;
    },
    checkPwd() {
      console.log("test");
      var vm = this;
      //字母開頭,長度為4~18個字元,只能包含字母,數字,下標
      return /^[a-zA-Z]\w{3,17}$/.test(vm.password);
      // return /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(vm.password);
    },
    dblcheckPwd1() {
      var vm = this;
      return /^[a-zA-Z]\w{3,17}$/.test(vm.passwordConfirm);
    },
    dblcheckPwd2() {
      var vm = this;
      return vm.passwordConfirm === vm.password && vm.password !== "";
    },
    userName() {
      var vm = this;
      var name = vm.$cookies.get("user-name");
      if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(name)) {
        return name.split("@")[0];
      } else {
        return name;
      }
    },
    authorized() {
      var vm = this;
      if (/^A/.test(vm.$cookies.get("user-name"))) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/components/navbar.scss";
</style>