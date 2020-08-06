import Vue from 'vue';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const option = {
    duration: 3500,
    ripple: true
}
Vue.prototype.$notyf = new Notyf(option)