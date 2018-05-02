import Datetime from './FastDatetimePicker'

const libs = {
  show: function (options = {}) {
    options = Object.assign({
      destroyOnHide: true
    }, options);

    const datetime = libs.datetime = new Datetime(options);
    datetime.show()
  },
  hide: function () {
    libs.datetime && libs.datetime.hide()
  }
};

export default {
  install (Vue) {
    if (!Vue.FastDateTime) {
      Vue.FastDateTime = {
        datetime: libs
      }
    }
    else {
      Vue.FastDateTime.datetime = libs
    }

    Vue.mixin({
      created: function () {
        this.FastDateTime = Vue.FastDateTime
      }
    });
  }
}
