<template>
  <div class="scoreManagement">
    <hr />
    <div class="dep">
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">招生管道</label>
        </div>
        <div class="field-body control">
          <div class="select is-fullwidth">
            <select
              v-model="admissionPath"
              @change="admissionDepartment ='';subjectList = [];result = [];subject = ''"
            >
              <option>單獨招生</option>
              <option>個人申請</option>
              <option>特殊選才</option>
            </select>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">系所</label>
        </div>
        <div class="field-body control">
          <div class="select is-fullwidth">
            <select
              v-model="admissionDepartment"
              @change="querySubject"
              :disabled="admissionPath === ''"
              v-if="admissionPath === '個人申請'"
            >
              <option>新媒體藝術學系</option>
              <option>劇場設計學系</option>
            </select>
            <select
              v-model="admissionDepartment"
              @change="querySubject"
              :disabled="admissionPath === ''"
              v-else
            >
              <option>美術學系</option>
              <option>音樂學系</option>
              <option>動畫學系</option>
              <option>傳統音樂學系</option>
              <option>新媒體藝術學系</option>
              <option>電影創作學系</option>
              <option>劇場設計學系</option>
              <option>戲劇學系</option>
            </select>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">科目</label>
        </div>
        <div class="field-body control">
          <div class="select is-fullwidth">
            <select v-model="subject" @change="queryAssessment" :disabled="!hasSubject">
              <option v-for="(sub, i) in subjectList" :key="i" :value="sub">{{ sub.科目名稱 }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="result">
      <div class="result-tb" v-if="hasResult">
        <div class="table-container">
          <table class="table is-narrow tbc">
            <thead>
              <tr>
                <th>招生管道</th>
                <th>學系名稱</th>
                <th>
                  評分面向
                  <span class="th-description">(可修改)</span>
                </th>
                <th>
                  評分結果選項
                  <span class="th-description">(可修改)</span>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody id="content">
              <tr v-for="(res, i) in result" :key="i" v-if="res.isStatic !== 'Y'">
                <td>
                  <p>{{ res.招生管道 }}</p>
                  <!-- <input class="input is-static" type="text" :value="res.招生管道" readonly /> -->
                </td>
                <td>
                  <p>{{ res.學系名稱 }}</p>
                  <!-- <input class="input is-static" type="text" :value="res.學系名稱" readonly /> -->
                </td>
                <td>
                  <input
                    class="input is-static"
                    type="text"
                    v-model.lazy="res.評分面向"
                    v-on:dblclick.stop="onEdit(i)"
                    v-on:keyup.enter="onEnter(i)"
                    readonly
                  />
                </td>
                <td>
                  <input
                    class="input is-static"
                    type="text"
                    v-model.lazy="res.評分結果選項"
                    v-on:dblclick.stop="onEditOption(i)"
                    v-on:keyup.enter="onEnterOption(i)"
                    readonly
                  />
                </td>
                <td class="function">
                  <a href="#" class="input is-static" @click="del(i)">
                    <i class="fas fa-trash-alt"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr />
        <div class="submit">
          <button class="button is-outlined" @click="addField">新增面向</button>
          <!-- <button class="button is-outlined" @click="onEditScore">修改評分結果選項</button> -->
          <button class="button is-link" @click="sendForm">確定修改</button>
        </div>
      </div>
      <div v-if="!hasResult" class="result-nothing">尚無數據顯示</div>
    </div>
    <!-- <ModalView modalName="scoreManage" v-if="showModal">
      <template v-slot:header>評分結果欄位維護</template>
      <div class="scoreManageModal">
        <div class="scoreManageModal-content">
          <h5 v-if="scoreManageOption.length === 0">請新增評分結果選項</h5>
          <ol id="scoreManageModal-option">
            <li
              class="scoreManageModal-option-li"
              v-for="(option, i) in scoreManageOption"
              :key="i"
            >
              <div class="scoreManageModal-option-inside">
                <input
                  class="input is-static"
                  type="text"
                  v-on:dblclick.stop="onEditScoreOption(i)"
                  v-on:keyup.enter="onEditScoreOptionEnter(i)"
                  v-model="scoreManageOption[i]"
                  readonly
                />
                <a href="#" class="input is-static" @click="delOption(i)">
                  <i class="fas fa-trash-alt"></i>
                </a>
              </div>
            </li>
          </ol>
        </div>
      </div>
      <template v-slot:footer>
        <button class="button is-primary is-inverted" @click="addOption">增加選項</button>
        <button class="button is-link is-inverted" @click="comfirmOption">確認</button>
      </template>
    </ModalView>-->
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { type } from "os";
import ModalView from "@/components/Modalview.vue";
export default {
  layout: "main",
  components: {
    ModalView
  },
  data() {
    return {
      admissionDepartment: "",
      admissionPath: "",
      subjectList: [],
      subject: "",
      result: [],
      scoreManageOption: [],
      hasSubject: false
      //checkInput: false
    };
  },
  methods: {
    async querySubject() {
      var vm = this;
      //先reset選單項目,並開啟loading
      vm.toggleLoading();
      vm.hasSubject = false;
      vm.subjectList = [];
      vm.result = [];
      if(!vm.admissionDepartment){
        vm.toggleLoading();
        return;
      }
      await vm.$axios
        .$get("http://10.36.3.30:5100/api/Exam/getSubject", {
          params: {
            招生管道: vm.admissionPath,
            學系名稱: vm.admissionDepartment
          }
        })
        .then(res => {
          console.log(res);
          //res長度為0代表該學系沒有建立資料,執行至queryAssessment時會跳錯,請從sql server下sql insert學系資料
          if (res.length === 0) {
            vm.toggleLoading();
            vm.queryAssessment();
            //科目名稱 === null代表該學系並沒有細分科目樣板
          } else if (res[0].科目名稱 === null) {
            vm.toggleLoading();
            vm.queryAssessment();
            //有抓到科目名稱則enable 科目選單
          } else {
            res.forEach(el => {
              vm.subjectList.push({科目代碼: el.科目代碼,科目名稱: el.科目名稱});
            });
            vm.hasSubject = true;
            vm.toggleLoading();
          }
        });
    },
    async queryAssessment() {
      var vm = this;
      //reset查詢結果,並開始Loading
      vm.result = [];
      vm.scoreManageOption = [];
      vm.toggleLoading();
      await vm.$axios
        .$get("http://10.36.3.30:5100/api/Exam/getAssessment", {
          params: {
            招生管道: vm.admissionPath,
            學系名稱: vm.admissionDepartment,
            科目代碼: vm.subject.科目代碼,
            科目名稱: vm.subject.科目名稱
          }
        })
        .then(res => {
          console.log(res);
          if (res.length > 0) {
            //如果評分結果選項有設定過
            if (res[0].評分結果選項 !== null)
              //將其字串分割後存入scoreManageOtion
              vm.scoreManageOption = res[0].評分結果選項.split(",");

            res.forEach(element => {
              vm.result.push({
                招生管道: element.招生管道,
                學系名稱: element.學系名稱,
                科目代碼: element.科目代碼,
                科目名稱: element.科目名稱,
                評分面向: element.評分面向,
                評分結果選項: element.評分結果選項,
                更新日期: vm.$moment(element.editedDate).format("LL"),
                isStatic: element.isStatic
              });
            });
          } else {
            //如果run到這裡,代表該系所資料沒有建入db中,請手動insert
            vm.$notyf.error(
              "該系所科目目前沒有面向欄位,請通知資訊人員協助處理!"
            );
            vm.result = [];
            // vm.result.push({
            //   招生管道: vm.admissionPath,
            //   學系名稱: vm.admissionDepartment,
            //   評分面向: "",
            //   評分結果選項: ""
            // });
            // vm.reStyle();
          }
          //關閉Loading
          vm.toggleLoading();
        });
    },
    //新增面向
    addField() {
      var vm = this;
      vm.result.push({
        招生管道: vm.admissionPath,
        學系名稱: vm.admissionDepartment,
        科目代碼: vm.subject.科目代碼,
        科目名稱: vm.subject.科目名稱,
        評分面向: "",
        評分結果選項: vm.concatOptionString
      });
      vm.reStyle();
    },
    //dblclick 評分面向事件
    onEdit(index) {
      //children[2]為評分面向
      document
        .getElementById("content")
        .children[index].children[2].firstElementChild.removeAttribute(
          "readonly"
        );
      document
        .getElementById("content")
        .children[index].children[2].firstElementChild.classList.remove(
          "is-static"
        );
    },
    onEditOption(index) {
      document
        .getElementById("content")
        .children[index].children[3].firstElementChild.removeAttribute(
          "readonly"
        );
      document
        .getElementById("content")
        .children[index].children[3].firstElementChild.classList.remove(
          "is-static"
        );
    },
    onEnterOption(index) {
      document
        .getElementById("content")
        .children[index].children[3].firstElementChild.setAttribute(
          "readonly",
          ""
        );
      document
        .getElementById("content")
        .children[index].children[3].firstElementChild.classList.add(
          "is-static"
        );
      //去除空白
      this.result[index].評分面向 = this.result[index].評分面向.replace(
        /\s+/g,
        ""
      );
    },
    //開啟scoreManage選單
    // onEditScore() {
    //   var vm = this;
    //   vm.toggleModal({ name: "scoreManage", state: true });
    // },
    // //dblclick scoreManage選單事件
    // onEditScoreOption(index) {
    //   document
    //     .getElementById("scoreManageModal-option")
    //     .children[index].children[0].firstElementChild.removeAttribute(
    //       "readonly",
    //       ""
    //     );
    //   document
    //     .getElementById("scoreManageModal-option")
    //     .children[index].children[0].firstElementChild.classList.remove(
    //       "is-static"
    //     );
    // },
    // onEditScoreOptionEnter(index) {
    //   document
    //     .getElementById("scoreManageModal-option")
    //     .children[index].children[0].firstElementChild.setAttribute(
    //       "readonly",
    //       ""
    //     );
    //   document
    //     .getElementById("scoreManageModal-option")
    //     .children[index].children[0].firstElementChild.classList.add(
    //       "is-static"
    //     );
    // },
    onEnter(index) {
      document
        .getElementById("content")
        .children[index].children[2].firstElementChild.setAttribute(
          "readonly",
          ""
        );
      document
        .getElementById("content")
        .children[index].children[2].firstElementChild.classList.add(
          "is-static"
        );
      //去除空白
      this.result[index].評分面向 = this.result[index].評分面向.replace(
        /\s+/g,
        ""
      );
    },
    //增加評分結果選項
    addOption() {
      var index = this.scoreManageOption.length;
      this.scoreManageOption.push("選項" + (index + 1));
      this.$nextTick(() => {
        document
          .getElementById("scoreManageModal-option")
          .children[index].children[0].firstElementChild.removeAttribute(
            "readonly",
            ""
          );
        document
          .getElementById("scoreManageModal-option")
          .children[index].children[0].firstElementChild.classList.remove(
            "is-static"
          );
      });
    },
    //刪除面向
    del(index) {
      var vm = this;
      vm.result.splice(index, 1);
    },
    //刪除評分結果選項
    delOption(index) {
      var vm = this;
      vm.scoreManageOption.splice(index, 1);
    },
    comfirmOption() {
      var vm = this;
      //將連接後的評分結果選項注入至所有result對應欄位
      vm.result.forEach(element => {
        element.評分結果選項 = vm.concatOptionString;
      });
      vm.toggleModal({ name: "scoreManage", state: false });
    },
    sendForm() {
      var vm = this;
      vm.toggleLoading();
      var re = false;
      //將舊有的評分面向從sendForm中移除,避免資料重複
      //some方法 = forEach, 不同之處在於retrun true時,會中斷Loop
      vm.result.some((element, index, arr) => {
        if (element.評分面向 === "" || !element.評分面向) {
          vm.$notyf.error("部分評分面向資料尚未輸入,請再次確認!");
          re = true;
          //vm.result[index].checkInput = true;
          vm.toggleLoading();
          return true;
        }
      });
      if (re) return;
      var form = {
        pathName: vm.result[0].招生管道,
        depName: vm.result[0].學系名稱,
        subId: vm.result[0].科目代碼,
        Payload: vm.result
      };
      //console.log(form);
      vm.$axios
        .$post("http://10.36.3.30:5100/api/Exam/postAssessment", form)
        .then(res => {
          vm.toggleLoading();
          vm.$notyf.success("修改成功!");
          vm.reset();
        });
    },
    reStyle() {
      var vm = this;
      vm.$nextTick(function() {
        var index = vm.result.length;
        document
          .getElementById("content")
          .children[index - 1].children[2].firstElementChild.removeAttribute(
            "readonly"
          );
        document
          .getElementById("content")
          .children[index - 1].children[2].firstElementChild.classList.remove(
            "is-static"
          );
      });
    },
    reset() {
      var vm = this;
      vm.result = [];
      vm.subjectList = [];
      vm.hasSubject = false;
      vm.scoreManageOption = [];
      vm.admissionDepartment = "";
      vm.admissionPath = "";
    },
    ...mapMutations(["toggleLoading", "toggleModal", "breadcrumb"])
  },
  computed: {
    hasResult() {
      return this.result.length > 0 ? true : false;
    },
    showModal() {
      return this.$store.state.showScoreManageModal;
    },
    //評分結果選項字串連接
    concatOptionString() {
      var concatString = "";
      this.scoreManageOption.forEach((element, i, arr) => {
        if (i === arr.length - 1) concatString += element;
        else concatString += element + ",";
      });
      return concatString;
    }
  },
  mounted() {
    this.breadcrumb(["評分輔助表處理", "評分欄位維護"]);
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/pages/scoreManagement.scss";
</style>