import Datetime from './FastDatetimePicker'

const operate = {
  show: function (options = {}) {
    const datetime = operate.datetime = new Datetime(options);
    datetime.show();
  },
  hide: function () {
    operate.datetime && operate.datetime.hide();
  }
};

export default {
  install (Vue) {
    if (!Vue.FastDateTime) {
      Vue.FastDateTime = {
        datetime: operate
      }
    }
    else {
      Vue.FastDateTime.datetime = operate;
    }

    Vue.mixin({
      created: function () {
        this.FastDateTime = Vue.FastDateTime
      }
    });
  }
}
