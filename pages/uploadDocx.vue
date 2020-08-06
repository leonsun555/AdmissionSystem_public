<template>
  <div class="uploadDocx">
    <div class="uploadDocx-content">
      <div class="uploadDocx-field">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">招生別</label>
          </div>
          <div class="field-body control">
            <div class="select is-fullwidth" v-bind:class="{ 'is-danger': checkPath }">
              <select
                v-model="form.admissionPath"
                @change="form.department = '';subjectList = [];hasSubject = false;"
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
            <label class="label">學系</label>
          </div>
          <div class="field-body control">
            <div class="select is-fullwidth" v-bind:class="{ 'is-danger': checkDep }">
              <select
                v-model="form.department"
                @change="getSubject"
                :disabled="form.admissionPath === ''"
                v-if="form.admissionPath === '個人申請'"
              >
                <option>新媒體藝術學系</option>
                <option>劇場設計學系</option>
              </select>
              <select
                v-model="form.department"
                @change="getSubject"
                :disabled="form.admissionPath === ''"
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
            <div class="select is-fullwidth" v-bind:class="{ 'is-danger': checkDep }">
              <select v-model="form.subject" :disabled="!hasSubject">
                <option v-for="(sub, i) in subjectList" :key="i" :value="sub.科目代碼">{{ sub.科目名稱 }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="file is-info has-name is-boxed is-centered upload">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                name="resume"
                ref="upload"
                @change="fileCheck()"
              />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-cloud-upload-alt"></i>
                </span>
                <span class="file-label">上傳套版檔案...</span>
              </span>
              <span class="file-name">{{ fileName }}</span>
            </label>
          </div>
        </div>
        <div class="field is-horizontal">
          <button class="button is-primary is-fullwidth" @click="sendFile()">送出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  layout: "main",
  data() {
    return {
      department: [],
      subjectList: [],
      checkDep: false,
      checkPath: false,
      form: {
        admissionPath: "單獨招生",
        department: "",
        subject: ""
      },
      fileName: ".docx",
      hasSubject: false
    };
  },
  async mounted() {
    var vm = this;
    vm.breadcrumb(["評分輔助表處理", "評分輔助表樣板上傳"]);
    var dep = await vm.$axios.$get("http://10.36.3.30:5100/api/Exam/getDEP", {
      params: {
        admissionPathName: vm.form.admissionPath
      }
    });
    vm.department = dep;
  },
  methods: {
    fileCheck() {
      var vm = this;
      vm.fileName = vm.$refs.upload.files[0].name;
      var ex = vm.fileName.split(".").pop();
      if (ex === "docx") vm.fileName = vm.$refs.upload.files[0].name;
      else {
        vm.fileName = ".docx";
        vm.$notyf.error("檔案格式錯誤!");
      }
    },
    async getSubject() {
      var vm = this;
      //改變選項時,reset子level選單
      vm.subjectList = [];
      vm.hasSubject = false;
      if (!vm.department) {
        return;
      }
      await vm.$axios
        .$get("http://10.36.3.30:5100/api/Exam/getSubject", {
          params: {
            招生管道: vm.form.admissionPath,
            學系名稱: vm.form.department
          }
        })
        .then(res => {
          //res長度為0代表該學系沒有建立資料,請從sql server下sql insert學系資料
          if (res.length === 0) {
            vm.hasSubject = false;
            //科目名稱 === null代表該學系並沒有細分科目樣板
          } else if (res[0].科目名稱 === null) {
            vm.hasSubject = false;
            //有抓到科目名稱則enable 科目選單
          } else {
            res.forEach(el => {
              vm.subjectList.push({
                科目代碼: el.科目代碼, 
                科目名稱: el.科目名稱
              });
            });
            vm.hasSubject = true;
          }
        });
    },
    async sendFile() {
      var vm = this;
      if (vm.form.admissionPath === "") {
        vm.checkPath = true;
        return;
      }
      if (vm.form.department === "") {
        vm.checkDep = true;
        return;
      }
      if (vm.fileName === ".docx") {
        vm.$notyf.error("請選擇欲上傳之套版檔案!");
        return;
      }
      var formData = new FormData();
      //將檔案路經相關欄位當成form參數傳入,並給予名稱
      formData.append("file", vm.$refs.upload.files[0], vm.fileName);
      formData.append("admissionPath", vm.form.admissionPath);
      formData.append("department", vm.form.department);
      formData.append("subject", vm.form.subject);
      console.log(vm.form.subject);
      await vm.$axios
        .$post("http://10.36.3.30:3356/api/uploadDocx", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          vm.fileName = ".docx";
          vm.$notyf.success("上傳成功!");
        })
        .catch(err => {
          vm.$notyf.error("發生錯誤!");
        });
    },
    ...mapMutations(["breadcrumb"])
  }
};
</script>

<style lang='scss' scoped>
@import "~/assets/pages/uploadDocx.scss";
</style>