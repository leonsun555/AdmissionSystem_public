
export const state = () => ({
    showLoading: false,
    showGeModal: false,
    showLogoutModal: false,
    showDeleteModal: false,
    showScoreManageModal: false,
    showPwdModal: false,
    loadingPercent: null,
    status: '',
    currentPage: []
})

export const mutations = {
    toggleLoading(state, percent) {
        state.showLoading = !state.showLoading;
        //有參數傳入才賦值
        if (percent)
            state.loadingPercent = percent;
    },
    addPercent(state, percent) {
        state.loadingPercent = percent;
    },
    toggleModal(state, modalParam) {
        switch (modalParam.name) {
            case "generate":
                state.showGeModal = modalParam.state;
                break;
            case "scoreManage":
                state.showScoreManageModal = modalParam.state;
                break;
            case "pwdChange":
                state.showPwdModal = modalParam.state;
                break;
            case "logout":
                state.showLogoutModal = modalParam.state;
                break;
            case "deleteResult":
                state.showDeleteModal = modalParam.state;
                break;
            default:
                break;
        }

    },
    breadcrumb(state, page) {
        state.currentPage = [];
        state.currentPage = page;
    },
    reset(state) {
        state.loadingPercent = null;
    },
    AUTH_REQUEST(state) {
        state.status = 'loading';
    },
    AUTH_SUCCESS(state, token) {
        state.status = 'success';
        state.token = token;
    },
    AUTH_ERROR(state) {
        state.status = 'error';
    },
    STATE_RELEASE(state) {
        state.state = '';
        state.token = null;
    }
}

export const actions = {
    AUTH_REQUEST({ commit, dispatch }, user) {
        var vm = this;
        return new Promise(async function (resolve, reject) { // The Promise used for router redirect in login
            await vm.$axios.$post('http://10.36.3.30:5100/api/Auth/Authentication', user)  //auth API端點
                .then(resp => {
                    console.log(resp);
                    const token = resp.token
                    localStorage.setItem('user-token', token) // store the token in localstorage
                    commit('AUTH_SUCCESS', token)
                    // you have your token, now log in y    our user :)
                    //vm.$router.push("/RecruitChart");
                    resolve(resp)
                })
                .catch(err => {
                    commit('AUTH_ERROR')
                    localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
                    reject(err)
                })
        })
    },
    LOGOUT({ commit }) {
        var vm = this;
        localStorage.removeItem('user-token');
        vm.$cookies.remove('user-token');
        vm.$cookies.remove('user-name');
        commit('STATE_RELEASE');
    }
}
