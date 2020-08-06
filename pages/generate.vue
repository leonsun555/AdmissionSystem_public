<template>
  <div class="generate">
    <div class="generate-content">
      <div class="generate-field">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">招生年度</label>
          </div>
          <div class="field-body control">
            <input class="input is-static" type="text" :value="form.admissionYear" readonly />
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">招生別</label>
          </div>
          <div class="field-body control">
            <div class="select is-fullwidth" v-bind:class="{ 'is-danger': checkPath }">
              <select v-model="admissionPath">
                <option>請選擇</option>
                <option>單獨招生</option>
                <option>個人申請</option>
                <option>特殊選才</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">學系</label>
          </div>
          <div class="field-body control">
            <div class="select is-fullwidth" v-bind:class="{ 'is-danger': checkDep }">
              <select v-model="form.departmentId">
                <option v-for="dep in department" v-bind:value="dep.系所編號">{{ dep.學系名稱 }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">考試階段</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control is-flex">
                <label class="radio">
                  <input type="radio" value="1" name="member" v-model="form.stage" />
                  1階段
                </label>
                <label class="radio">
                  <input type="radio" value="2" name="member" v-model="form.stage" />
                  2階段
                </label>
                <label class="radio">
                  <input type="radio" value="3" name="member" v-model="form.stage" />
                  3階段
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">是否連續</label>
          </div>
          <div class="field-body">
            <div class="field is-narrow">
              <div class="control is-flex">
                <label class="radio">
                  <input type="radio" value="連續" name="contin" v-model="form.isContin" />
                  連續
                </label>
                <label class="radio">
                  <input type="radio" value="不連續" name="contin" v-model="form.isContin" />
                  不連續
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <button class="button is-primary is-fullwidth" @click="preview()">資料預覽</button>
        </div>
      </div>
    </div>
    <Modalview v-if="showModal" modal-name="generate">
      <template v-slot:header>資料預覽</template>
      <table class="table table-content">
        <thead>
          <tr>
            <th>准考證號</th>
            <th>年度</th>
            <th>招生別</th>
            <th>系所</th>
            <th>科目名稱</th>
            <th>評分教師</th>
            <th>節次</th>
            <th>序號</th>
            <!-- <th>條碼編號</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in response[currentPage - 1]" :key="res.准考證號">
            <td>{{ res.准考證號 }}</td>
            <td>{{ res.年度 }}</td>
            <td>{{ res.招生別 }}</td>
            <td>{{ res.系所 }}</td>
            <td>{{ res.節次名稱 }}</td>
            <td>{{ res.教師編號 }}</td>
            <td>{{ res.節次 }}</td>
            <td>{{ (form.isContin === '不連續') ? res.序號 : res.連續序號 }}</td>
            <!-- <td>{{ res.BarCode }}</td> -->
          </tr>
        </tbody>
      </table>
      <nav class="pagination is-centered" role="navigation" aria-label="pagination">
        <paginate
          :page-count="response.length"
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
      <template v-slot:footer>
        <button class="button is-link is-inverted" v-on:click="print()">產出檔案</button>
      </template>
    </Modalview>
    <!-- <Modalview v-if="showPreview">
      <template v-slot:header>預覽列印</template>
      <div class="previewContent">
        <a href="#" v-on:click="prevFile(currentPreview)" v-show="ifPrev"><i class="fas fa-chevron-left"></i></a>
        <iframe
          frameborder="0"
          scrolling="no"
          width="100%"
          height="100%"
          :src="'assets/img/printPreview/' + previewFileList[currentPreview] + '.gif'"
          name="imgbox"
          id="imgbox"
        ></iframe>
        <a href="#" v-on:click="nextFile(currentPreview)" v-show="ifNext"><i class="fas fa-chevron-right"></i></a>
      </div>
      <p>iframes are not supported by your browser.</p>

      <template v-slot:footer>
        <button class="button is-link is-inverted" v-on:click="print()">列印</button>
      </template>
    </Modalview>-->
    <a href="#" ref="zipFile" v-show="false"></a>
  </div>
</template>

<script>
import qs from "qs";
import Paginate from "vuejs-paginate";
import { mapMutations } from "vuex";
import Modalview from "@/components/Modalview.vue";
import { type } from "os";
var currentDate = new Date();
export default {
  layout: "main",
  components: {
    Modalview,
    Paginate
  },
  data() {
    return {
      importFileName: null,
      form: {
        admissionYear: currentDate.getFullYear() - 1911,
        // admissionYear: 108,
        admissionPathId: "",
        departmentId: "",
        stage: "1",
        isContin: "連續"
      },
      admissionPath: "請選擇",
      department: [],
      checkPath: false,
      checkDep: false,
      response: [],
      currentPage: 1,
      sendForm: [],
      previewFileList: [],
      currentPreview: 0,
      showPreview: false
    };
  },
  methods: {
    async preview() {
      var vm = this;
      if (vm.admissionPath === "請選擇") {
        vm.checkPath = true;
        return;
      } else vm.checkPath = false;
      if (vm.form.departmentId === "") {
        vm.checkDep = true;
        return;
      } else vm.checkDep = false;

      //調用vuex mutation,轉換loading boolean,意即show loading component

      if (!vm.checkPath && !vm.checkDep) {
        vm.toggleLoading();
        await vm.$axios
          .$post("http://10.36.3.30:5100/api/Exam/SortedV2", vm.form)
          .then(function(res) {
            vm.response = vm.pagination(res);
            vm.toggleLoading();
            vm.toggleModal({ name: "generate", state: true });
          });
      } else vm.$notyf.error("尚有未輸入欄位!");
    },
    async print() {
      var vm = this;
      var re = false;
      vm.toggleModal({ name: "generate", state: false });
      //有參數帶入代表Progress進度
      vm.toggleLoading(0);
      var i = 0;
      var pageIndex = 1;
      var printPageIndex = 1;
      var prevSub = "";
      var prevTID = "";
      var prevSection = "";
      var prevPageID = "";
      vm.nextElement(i, pageIndex, printPageIndex);
      while (i < vm.response.length) {
        //將每頁資料post至.net Core API將資料放入MSSQL SERVER
        await vm.$axios.$post(
          "http://10.36.3.30:5100/api/Exam/postExamStudent",
          { Page: vm.sendForm }
        );
        await vm.$axios
          .$post(
            "http://10.36.3.30:3356/api/writeFile",
            JSON.stringify(vm.sendForm),
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          )
          .then(res => {
            //vm.previewFileList.push(res.data);
            vm.sendForm = [];
            //換頁的比較參數 => 科目名稱,教師編號
            prevSub = vm.response[i][0].節次名稱;
            prevTID = vm.response[i][0].教師編號;
            prevSection = vm.response[i][0].節次;
            prevPageID = vm.response[i][0].頁碼;
            i++;
            if (i < vm.response.length) {
              //紀錄Table分頁,供成績輸入頁面分頁用
              if (vm.response[i][0].節次名稱 !== prevSub) {
                pageIndex = 1;
              } else {
                pageIndex++;
              }
              //列印頁次為教師不同則重新計算,需獨立出來做評分表頁碼用
              if (
                (vm.response[i][0].教師編號 !== prevTID && i !== 0) ||
                vm.response[i][0].節次名稱 !== prevSub
              ) {
                printPageIndex = 1;
              } else {
                printPageIndex++;
              }
              //持續處理下一個陣列元素直到全部處理完畢(此處陣列元素代表每頁資料)
              vm.nextElement(i, pageIndex, printPageIndex);
            }
          })
          .catch(err => {
            vm.$notyf.error("發生錯誤,描述:" + err);
            re = true;
          });
      }
      if (re) return;
      await vm.$axios
        .$get("http://10.36.3.30:3356/api/compress", { responseType: "blob" })
        .then(res => {
          var data = new Blob([res]);
          if (typeof window.navigator.msSaveBlob === "function") {
            // IE瀏覽器可以支援Blob直接下載
            window.navigator.msSaveBlob(data, "package.zip");
          } else {
            //將blob建入隱藏link,模擬click事件觸發下載
            var blob = data;
            vm.$refs.zipFile.href = window.URL.createObjectURL(blob);
            vm.$refs.zipFile.download = "package.zip";
            vm.$refs.zipFile.click();
          }
          vm.toggleLoading();
          vm.$notyf.success("已完成套版!");
        })
        .catch(error => {
          vm.$notyf.error("發生錯誤,描述:" + error);
          vm.toggleLoading();
        })
        .finally(() => {
          vm.reset();
        });
    },
    async fetchDepartment() {
      var vm = this;
      var dep = await vm.$axios.$get("http://10.36.3.30:5100/api/Exam/getDEP", {
        params: {
          admissionPathName: vm.admissionPath
        }
      });
      this.department = dep;
    },
    nextElement(index, pageIndex, printPageIndex) {
      var vm = this;
      // var Num = 1;
      vm.response[index].forEach((el, i) => {
        //如果沒有下一個元素,則hasNext = false
        vm.sendForm.push({
          准考證號: el.准考證號,
          年度: el.年度,
          招生別: (el.招生別.includes("個人申請") ? "個人申請" : el.招生別),
          系所: el.系所,
          科目代碼: el.科目代碼,
          科目名稱: el.節次名稱,
          教師編號: el.教師編號,
          連續序號: el.連續序號,
          序號: el.序號,
          條碼編號: el.BarCode,
          節次: el.節次,
          列印頁次: printPageIndex,
          分割頁次: pageIndex,
          頁次: el.ID,
          是否連續: vm.form.isContin,
          hN: true
        }); // console.log('res:' + vm.response[index]);
        //每完成一個陣列元素,帶入新的進度參數,持續更新進度條
        vm.addPercent(Math.floor(((index + 1) / vm.response.length) * 100));
      });
    },
    //分頁邏輯
    pagination(data) {
      var vm = this;
      var prevRow1, prevRow2, prevRow3;
      var result = [[]];
      var index = 1;
      data.forEach(element => {
        if (
          (element.教師編號 !== prevRow1 ||
            element.科目代碼 !== prevRow2 ||
            element.節次 !== prevRow3 ||
            result[index - 1].length >= vm.pageSize) &&
            prevRow3
        ) {
          element.ID = index;
          index++;
          result.push([element]);
        } else {
          element.ID = index;
          result[index - 1].push(element);
        }

        prevRow1 = element.教師編號;
        prevRow2 = element.科目代碼;
        prevRow3 = element.節次;
      });
      return result;
    },
    changePage(page) {
      this.currentPage = page;
    },
    nextFile(index) {
      var vm = this;
      if (index <= vm.previewFileList.length) {
        index++;
        vm.currentPreview = index;
      }
    },
    prevFile(index) {
      if (index >= 0) {
        index--;
        vm.currentPreview = index;
      }
    },
    ...mapMutations([
      "toggleLoading",
      "toggleModal",
      "addPercent",
      "reset",
      "breadcrumb"
    ])
  },
  watch: {
    admissionPath() {
      var vm = this;
      vm.fetchDepartment().then(() => {
        switch (vm.admissionPath) {
          case "單獨招生":
            vm.form.admissionPathId = "002";
            break;
          case "個人申請":
            vm.form.admissionPathId = "007";
            break;
          case "特殊選才":
            vm.form.admissionPathId = "010";
            break;
          default:
            vm.department = [];
            break;
        }
      });
    }
  },
  computed: {
    showModal() {
      return this.$store.state.showGeModal;
    },
    ifPrev() {
      if (this.currentPreview === 0) {
        return false;
      }
    },
    ifNext() {
      if (this.currentPreview === this.previewFileList.length - 1) {
        return false;
      }
    },
    pageSize() {
      //只有戲劇學系的pageSize上限是10筆資料
      if(this.form.departmentId === 'CH') return 10;
      else return 20;
    }
  },
  mounted() {
    this.breadcrumb(["評分輔助表處理", "產出評分輔助表"]);
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/pages/generate.scss";
</style>
