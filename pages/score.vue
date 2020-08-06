<template>
  <div class="score">
    <hr />
    <div class="dep">
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">招生年度</label>
        </div>
        <div class="field-body control">
          <input class="input is-static" type="text" :value="admissionYear" readonly />
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">招生管道</label>
        </div>
        <div class="field-body control">
          <div class="select is-fullwidth">
            <select
              v-model="admissionPath"
              @change="admissionDepartment ='';subjectList = [];result = [];subject = '';hasSubject = false;form = []; showFinished=false;"
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
              <option>電影創作學系(甲)</option>
              <option>電影創作學系(乙)</option>
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
            <select v-model="selectedSubject" @change="query" :disabled="!hasSubject">
              <option v-for="(sub, i) in subjectList" :key="i" :value="sub">{{ sub.科目名稱 }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="result">
      <div class="notification is-primary is-light" v-if="showFinished">
        <button class="delete" @click="showFinished = false"></button>
        已評分，最後評分日期：{{ finishedDate }}
      </div>
      <div class="notification is-warning is-light" v-if="showNotFinished">
        <button class="delete" @click="showNotFinished = false"></button>
        尚未完成評分，上次評分日期：{{ finishedDate }}
      </div>
      <div class="result-tb" v-if="hasResult">
        <div class="table-container">
          <table class="table tbc">
            <thead>
              <tr>
                <th>序號</th>
                <th>准考證號</th>
                <th>科目名稱</th>
                <th>評分教師</th>
                <th>節次</th>
                <!-- 評分面向根據assessment數量來產生th -->
                <th
                  v-for="(resAssessment, index) in assessment"
                  :key="index"
                >{{ resAssessment.評分面向 }}</th>
              </tr>
            </thead>
            <tbody id="content">
              <tr v-for="(res, i) in resultPagiantedCopy" :key="i">
                <td>
                  <p>{{ res.排考序號 }}</p>
                  <!-- <input class="input is-static" type="text" :value="res.排考序號" readonly /> -->
                </td>
                <td>
                  <p>{{ res.准考證號 }}</p>
                  <!-- <input class="input is-static" type="text" :value="res.准考證號" readonly /> -->
                </td>
                <td>
                  <p>{{ selectedSubject.科目名稱 }}</p>
                  <!-- <input class="input is-static" type="text" :value="res.科目名稱" readonly /> -->
                </td>
                <td>
                  <p>{{ res.教師編號 }}</p>
                  <!-- <input class="input is-static" type="text" :value="res.教師編號" readonly /> -->
                </td>
                <td>
                  <p>{{ res.節次 }}</p>
                  <!-- <input class="input is-static" type="text" :value="res.教師編號" readonly /> -->
                </td>
                <!-- 評分面向根據assessment數量來產生td -->
                <td v-for="(resAssessment, index) in assessment" :key="index">
                  <div class="control">
                    <!-- 選項項目根據assessmentOption -->
                    <label class="radio" v-for="(option, iR) in resAssessment.評分結果選項" :key="iR">
                      <input
                        type="radio"
                        :name="'outcome_' + res.ID + '_' + resAssessment.評分面向"
                        :key="option"
                        :value="option"
                        @click="inputRadio(res.ID, resAssessment.評分面向, option)"
                        :checked="isChecked(i, resAssessment.評分面向, option, index)"
                        v-model="res[resAssessment.評分面向]"
                        :disabled="checkDisable(res.ID, resAssessment.評分面向, option)"
                      />
                      {{ option }}
                    </label>
                  </div>
                </td>
                <!-- <td>
                <input class="input is-static" type="text" :value="res.排考序號" readonly />
                </td>-->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="!hasResult && (!showFinished || !showNotFinished)" class="result-nothing">尚無數據顯示</div>
      <nav class="pagination is-centered" role="navigation" aria-label="pagination">
        <paginate
          v-if="regenerate"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="2"
          :click-handler="changePage"
          :prev-text="'上一頁'"
          :next-text="'下一頁'"
          :container-class="'pagination-list'"
          :page-link-class="'pagination-link'"
          :prev-link-class="'pagination-previous'"
          :next-link-class="'pagination-next'"
        ></paginate>
      </nav>
      <hr />
      <div class="submit" v-if="hasResult">
        <button class="button is-outlined" @click.prevent="deleteResult">刪除評分結果</button>
        <modalview v-if="showDeleteModal" modal-name="deleteResult">
          <template v-slot:header>成績刪除</template>
          <h3>是否確認刪除此成績?</h3>
          <div class="delete-info">
            <p>{{ admissionPath }}&nbsp;-</p>
            <p>&nbsp;{{ admissionDepartment }}</p>
            <p v-if="subject !== ''">&nbsp;-&nbsp;{{ subject }}</p>
          </div>
          <template v-slot:footer>
            <button class="button is-info is-inverted" v-on:click="confirmDel">確定</button>
          </template>
        </modalview>
        <button class="button is-outlined" @click.prevent="resetRadio">清除評分</button>
        <button class="button is-link" @click.prevent="sendForm">送出結果</button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapMutations } from "vuex";
import Modalview from "@/components/Modalview.vue";
import Paginate from "vuejs-paginate";
var currentDate = new Date();
export default {
  layout: "main",
  components: {
    Paginate,
    Modalview
  },
  data() {
    return {
      admissionYear: currentDate.getFullYear() - 1911,
      admissionDepartment: "",
      admissionPath: "",
      subjectList: [],
      selectedSubject: {
        科目代碼: "",
        科目名稱: "",
      },
      result: [],
      assessment: [],
      assessmentOption: [],
      hasSubject: false,
      currentPage: 1,
      form: [],
      showFinished: false,
      finishedDate: "",
      showNotFinished: false,
      resultPagiantedCopy: [],
      pageCount: 1,
      regenerate: true,
    };
  },
  methods: {
    ...mapMutations(["breadcrumb", "toggleLoading"]),
    async querySubject() {
      var vm = this;
      //先reset選單項目,並開啟loading
      vm.toggleLoading();
      vm.hasSubject = false;
      vm.showFinished = false;
      vm.showNotFinished = false;
      vm.assessment = [];
      vm.assessmentOption = [];
      vm.subjectList = [];
      vm.selectedSubject = {
        科目代碼: "",
        科目名稱: "",
      };
      vm.result = [];
      if (!vm.admissionDepartment) {
        vm.toggleLoading();
        return;
      }
      //設定 FromScore為'Y',表示從不同來源撈取科目資料(套版和成績輸入的科目邏輯不同)
      await vm.$axios
        .$get("http://10.36.3.30:5100/api/Exam/getSubject", {
          params: {
            招生管道: vm.admissionPath,
            學系名稱: vm.admissionDepartment,
          }
        })
        .then(res => {
          //res長度為0代表該學系沒有建立資料,執行至queryAssessment時會跳錯,請從sql server下sql insert學系資料
          if (res.length === 0) {
            vm.toggleLoading();
            vm.$$notyf.error("查無資料!");
            //科目名稱 === null代表該學系並沒有細分科目樣板
          } else if (res[0].科目名稱 === null) {
            vm.toggleLoading();
            vm.query();
            //有抓到科目名稱則enable 科目選單
          } else {
            res.forEach(el => {
              vm.subjectList.push({
                科目代碼: el.科目代碼, 
                科目名稱: el.科目名稱,
              });
            });
            vm.hasSubject = true;
            vm.toggleLoading();
          }
        });
    },
    async query() {
      var vm = this;
      //reset查詢結果,並開始Loading
      vm.result = [];
      vm.assessment = [];
      vm.assessmentOption = [];
      vm.currentPage = 1;
      vm.showFinished = false;
      vm.showNotFinished = false;
      //強制重新產生Paginate component,使其在非換頁時重置
      vm.regenerate = false;
      vm.toggleLoading();
      //當年民國年
      var year = new Date().getFullYear() - 1911;
      var paramsForAssessment;
      await vm.$axios
        .$get("http://10.36.3.30:5100/api/Exam/getAssessment", {params: 
          {
            招生管道: vm.admissionPath,
            學系名稱: vm.admissionDepartment,
            科目代碼: vm.selectedSubject.科目代碼,
            科目名稱: vm.selectedSubject.科目名稱,
            FromScore: 'Y',
          }
        })
        .then(res => {
          if (res.length > 0) {
            //如果評分結果選項有設定過
            if (res[0].評分結果選項 !== null) {
              res.forEach(element => {
                vm.assessment.push({
                  評分面向: element.評分面向,
                  評分結果選項: element.評分結果選項.split(",")
                });
              });
              //將其字串分割後存入scoreManageOtion
              // vm.assessmentOption = res[0].評分結果選項.split(",");
            } else {
              vm.$notyf.error("該學系科目之評分結果選項尚未設定!");
              //關閉Loading
              vm.toggleLoading();
              return;
            }
          } else {
            //如果run到這裡,代表該系所資料沒有建入db中,請手動insert
            vm.$notyf.error("該系所科目尚未設定,請通知資訊人員協助處理!");
            vm.result = [];
            //關閉Loading
            vm.toggleLoading();
            return;
          }
        });
      //先撈取評分結果是否有紀錄
      vm.toggleLoading();
      await vm.queryStudent();
      //paginate頁次判斷函式, 本來是直接寫在component prop中,
      //但因為上層DOM物件有v-if判斷,根據result是否有內容顯示pagainate component,
      //導致在切換資料頁次時,都會重置選中頁碼,造成永遠卡在第一頁的情形,
      //故將paginate component移出hasResult判斷, 與其解藕, 獨立判斷寫在這裡
      if (vm.result.length > 0) {
        if (vm.selectedSubject.科目代碼 === "B17X1" || vm.selectedSubject.科目代碼 === "B18X1") {
          vm.pageCount = vm.result[vm.result.length - 1].教師編號;
        } else {
          vm.pageCount = vm.result[vm.result.length - 1].分割頁次;
        }
      } else {
        vm.pageCount = 1;
      }
    },
    async queryStudent() {
      var vm = this;
      vm.result = [];
      vm.toggleLoading();
      var scoreResult = await vm.$axios.$get(
        "http://10.36.3.30:5100/api/Exam/getScoreResult",
        {
          params: {
            招生管道: vm.admissionPath,
            學系名稱: vm.admissionDepartment,
            科目代碼: vm.selectedSubject.科目代碼,
            科目名稱: vm.selectedSubject.科目名稱,
            年度: vm.admissionYear
          }
        }
      );
      //如果尚未評分,則從面試考生撈取資料
      if (scoreResult.length === 0) {
        await vm.$axios
          .$get("http://10.36.3.30:5100/api/Exam/getStudent", {
            params: {
              招生管道: vm.admissionPath,
              學系名稱: vm.admissionDepartment,
              科目代碼: vm.selectedSubject.科目代碼,
              科目名稱: vm.selectedSubject.科目名稱,
              年度: vm.admissionYear
            }
          })
          .then(res => {
            if (res.length === 0) {
              vm.$notyf.error("該學系或科目尚未產出評分輔助表");
              vm.assessment = [];
              vm.assessmentOption = [];
            } else {
              res.forEach((element, i) => {
                //目前僅有音樂和傳音用序號,其餘學系皆用連續序號
                if (
                  element.系所 === "音樂學系" ||
                  element.系所 === "傳統音樂學系"
                ) {
                  vm.result.push({
                    准考證號: element.准考證號,
                    科目代碼: element.科目代碼,
                    科目名稱: element.科目名稱,
                    教師編號: element.教師編號,
                    排考序號: element.序號,
                    分割頁次: element.分割頁次,
                    節次: element.節次,
                    ID: i
                  });
                } else {
                  vm.result.push({
                    准考證號: element.准考證號,
                    科目代碼: element.科目代碼,
                    科目名稱: element.科目名稱,
                    教師編號: element.教師編號,
                    排考序號: element.連續序號,
                    分割頁次: element.分割頁次,
                    節次: element.節次,
                    ID: i
                  });
                }
                //將評分面向key注入result object中,初始值為""
                vm.assessment.forEach(el => {
                  vm.result[i][el.評分面向] = "";
                });
              });
            }
            vm.toggleLoading();
          });
      } else {
        //評分日期
        vm.finishedDate = scoreResult[0].createdDate;
        // vm.scoredTimes = scoreResult[0].評分次數;
        await vm.$axios
          .$get("http://10.36.3.30:5100/api/Exam/getStudent", {
            params: {
              招生管道: vm.admissionPath,
              學系名稱: vm.admissionDepartment,
              科目代碼: vm.selectedSubject.科目代碼,
              科目名稱: vm.selectedSubject.科目名稱,
              年度: vm.admissionYear
            }
          })
          .then(res => {
            res.forEach((element, i) => {
              //目前僅有音樂和傳音用序號,其餘學系皆用連續序號
              if (
                element.系所 === "音樂學系" ||
                element.系所 === "傳統音樂學系"
              ) {
                vm.result.push({
                  准考證號: element.准考證號,
                  科目代碼: element.科目代碼,
                  科目名稱: element.科目名稱,
                  教師編號: element.教師編號,
                  排考序號: element.序號,
                  分割頁次: element.分割頁次,
                  節次: element.節次,
                  ID: i
                });
              } else {
                vm.result.push({
                  准考證號: element.准考證號,
                  科目代碼: element.科目代碼,
                  科目名稱: element.科目名稱,
                  教師編號: element.教師編號,
                  排考序號: element.連續序號,
                  分割頁次: element.分割頁次,
                  節次: element.節次,
                  ID: i
                });
              }
              //將評分面向key注入result object中,初始值為""
              vm.assessment.forEach(el => {
                vm.result[i][el.評分面向] = "";
              });
            });
            //比對撈出結果Array與面試考生Array,如不相等代表尚未評分完成,分別顯示不同通知
            // if (scoreResult.length !== vm.result.length)
            //   vm.showNotFinished = true;
            // else vm.showFinished = true;
            //目前尚無法定義未完成評分規定,暫時先視所有有評分紀錄的科目為評分完成
            if (scoreResult.length !== 0) vm.showFinished = true;

            var temp, tempIndex;
            //將面試考生資料與已存在於評分結果TB的資料進行比對,並撈出存於temp
            scoreResult.forEach((element, i) => {
              temp = vm.result.find((el, index) => {
                //位置Index暫存於tempIndex
                tempIndex = index;
                return (
                  el.准考證號 === element.准考證號 &&
                  String(el.教師編號) === element.評審委員編號
                );
              });
              //修改評分結果的相關temp屬性
              // temp[element.評分面向] = element.評分結果;
              // if (element.評分面向 === "弱勢學生") {
              //   temp.弱勢學生 = element.是否為弱勢學生;
              // }
              // if (element.評分面向 === "是否缺考") {
              //   temp.是否缺考 = element.評分結果;
              // }
              // temp.是否缺考 = element.評分面向 === '是否缺考' ? element.評分結果 : '';

              //再將temp放回原本於result中的位置
              vm.result[tempIndex][element.評分面向] = element.評分結果;
            });
          });
        //關閉Loading
        vm.toggleLoading();
      }
      vm.regenerate = true;
      
    },
    checkDisable(row, assessment, option) {
      var vm = this;
      if (option === "否" && assessment === "是否缺考") return false;
      // if (vm.isChecked(row, "是否缺考", "是")) {
      if (vm.result[row]["是否缺考"] === "是") {
        vm.assessment.forEach(el => {
          if (el.評分面向 !== "是否缺考") vm.result[row][el.評分面向] = "";
        });
        // vm.result[row][assessment] = '';
        return true;
      } else {
        return false;
      }
    },
    inputRadio(row, assessment, option) {
      var vm = this;
      if (vm.result[row][assessment] === option) {
        vm.result[row][assessment] = "";
      } else {
        vm.result[row][assessment] = option;
      }
      //輸入完結果後要強制渲染一次才會更新資料,因為這裡沒有使用v-model API
      vm.$forceUpdate();
    },
    //重置所有評分結果
    resetRadio() {
      var vm = this;
      vm.result.forEach(element => {
        vm.assessment.forEach(el => {
          element[el.評分面向] = "";
        });
      });
      //同inputRadio
      vm.$forceUpdate();
    },
    changePage(page) {
      var vm = this;
      // debugger;
      // console.log(page);
      var temp = vm.result;
      vm.result = [];
      vm.toggleLoading();
      setTimeout(() => {
        vm.result = temp;
        vm.currentPage = page;
        vm.toggleLoading();
      }, 400);
      // vm.queryChangepage();
      //同inputRadio
      // vm.$forceUpdate();
    },
    async queryChangepage() {
      var vm = this;
    },
    async sendForm() {
      var vm = this;
      var re = false;
      vm.toggleLoading();
      vm.assessment.some(el => {
        vm.result.some((element, i) => {
          //判斷未評分欄位不做push的動作
          if (
            (element.是否缺考 !== "是" &&
              element[el.評分面向] !== undefined &&
              element[el.評分面向] !== "" &&
              element[el.評分面向] !== null) ||
            element.是否缺考 === "是"
          ) {
            //跳過弱勢學生與是否缺考欄位
            if (el.評分面向 !== "弱勢學生" || el.評分面向 !== "是否缺考") {
              vm.form.push({
                准考證號: element.准考證號,
                年度: vm.admissionYear,
                招生管道: vm.admissionPath,
                學系名稱: vm.admissionDepartment,
                科目代碼: element.科目代碼,
                科目名稱: element.科目名稱,
                評審委員編號: element.教師編號,
                評分面向: el.評分面向,
                評分結果: element[el.評分面向],
                // 是否為弱勢學生: element.弱勢學生,
                // 是否缺考: element.是否缺考,
                排考序號: element.排考序號,
                createdDate: vm.$moment().format("LL"),
                createdBy: vm.$cookies.get("user-name")
              });
            }
          }
          // }
        });
      });
      await vm.$axios
        .$post("http://10.36.3.30:5100/api/Exam/postScoreResult", {
          Payload: vm.form
        })
        .then(res => {
          vm.toggleLoading();
          vm.reset();
          vm.$notyf.success("成績輸入成功!");
        })
        .catch(err => {
          vm.toggleLoading();
          vm.reset();
          vm.$notyf.error("發生錯誤! 描述:" + err);
        });
    },
    reset() {
      var vm = this;
      vm.result = [];
      vm.subjectList = [];
      vm.selectedSubject = {
        科目代碼: "",
        科目名稱: "",
      };
      vm.hasSubject = false;
      vm.scoreManageOption = [];
      vm.admissionDepartment = "";
      vm.admissionPath = "";
      vm.form = [];
      vm.showFinished = false;
      vm.showNotFinished = false;
    },
    isChecked(row, assessment, option, index) {
      var vm = this;
      // debugger;
      if (vm.resultPagiantedCopy[row][assessment] === option) return true;
      else return false;
    },
    deleteResult() {
      var vm = this;
      vm.toggleModal({ name: "deleteResult", state: true });
    },
    async confirmDel() {
      var vm = this;
      vm.toggleModal({ name: "deleteResult", state: false });
      vm.toggleLoading();
      await vm.$axios
        .$post("http://10.36.3.30:5100/api/Exam/deleteScoreResult", {
          年度: vm.admissionYear,
          招生管道: vm.admissionPath,
          學系名稱: vm.admissionDepartment,
          科目名稱: vm.selectedSubject.科目名稱
        })
        .then(res => {
          vm.toggleLoading();
          vm.reset();
          vm.$notyf.success("已刪除成績!");
        })
        .catch(err => {
          vm.toggleLoading();
          vm.reset();
          vm.$notyf.error("發生錯誤! 描述:" + err);
        });
    },
    ...mapMutations(["toggleModal"])
  },
  mounted() {
    this.breadcrumb(["評分輔助表處理", "評分成績輸入"]);
  },
  computed: {
    hasResult() {
      return this.result.length > 0 ? true : false;
    },
    //
    resultPagianted: {
      get: function() {
        var vm = this;
        //管樂暫時用教師編號來分頁
        if (vm.selectedSubject.科目代碼 === "B17X1" || vm.selectedSubject.科目代碼 === "B18X1") {
          return vm.result.filter(el => {
            return el.教師編號 === vm.currentPage;
          });
        } else {
          return vm.result.filter(el => {
            return el.分割頁次 === vm.currentPage;
          });
        }
      }
    },
    showDeleteModal() {
      return this.$store.state.showDeleteModal;
    }
  },
  watch: {
    resultPagianted() {
      var vm = this;
      vm.resultPagiantedCopy = vm.resultPagianted;
      vm.$forceUpdate();
    },
    deep: true
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/pages/score.scss";
</style>