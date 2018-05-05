import FastDateTime from './FastDatetimePicker';
import FastDateTimeComponent from './FastDateTime.vue';

const operate = {
  show: function (options = {}) {
    const datetime = operate.datetime = new FastDateTime(options);
    datetime.show();
  },
  hide: function () {
    operate.datetime && operate.datetime.hide();
  }
};

export default {
  install (Vue) {
    Vue.component(FastDateTimeComponent.name, FastDateTimeComponent);

    if (!Vue.$FastDateTime) {
      Vue.$FastDateTime = operate;
    }

    Vue.mixin({
      created: function () {
        this.$FastDateTime = Vue.$FastDateTime;
      }
    });
  }
}
