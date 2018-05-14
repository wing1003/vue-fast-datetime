<template>
  <div>
   <input type="text"
           v-model="inputDate"
           readonly="readonly"
           class="fast__input">
    <p class="fast__text">{{inputDate}}</p>
  </div>
</template>

<script>
import FastDateTime from './FastDatetimePicker';
import { uuid } from './util';

export default {
  name: 'fast-datetime',
  props: {
    position:{
      type:String,
      default:'start'
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD HH:mm'
    },
    startValue: {
      type: String,
      default: ''
    },
    endValue:{
      type:String,
      default: ''
    },
    confirmText: String,
    cancelText: String,
    hourRow: {
      type: String,
      default: '{value}'
    },
    minuteRow: {
      type: String,
      default: '{value}'
    },
    startDate: {
      type: Date,
      required:true
    },
    endDate: {
      type: Date,
      required:true
    },
  },
  data () {
    return {
      currentStartValue: null,
      currentEndValue:null,
    }
  },
  computed: {
    UUID(){
      return uuid();
    },
    inputDate(){
      return `${this.currentStartValue}  -  ${this.currentEndValue}`.replace(/\//g,'-');
    },
    currentOptions () {
      const self = this;
      const options = {
        trigger: '#fast-datetime-' + this.UUID,
        position:this.position,
        format: this.format,
        startValue: this.startValue,
        endValue:this.endValue,
        confirmText: this.confirmText,
        cancelText: this.cancelText,
        startDate: this.startDate,
        endDate:this.endDate,
        onSelect (type, value, wholeValue) {
          if (self.fast_datetime) {
            self.$emit('on-change',type, value, wholeValue);
          }
        },
        onConfirm (startValue, endValue) {
          self.currentStartValue = startValue;
          self.currentEndValue = endValue;
        },
        onHide () {
          self.$emit('update:show', false);
          self.$emit('on-hide');
        },
        onShow () {
          self.$emit('update:show', true);
          self.$emit('on-show');
        }
      };
      return options;
    },
  },
  created () {
    this.currentStartValue = this.startValue;
    this.currentEndValue = this.endValue;
  },
  mounted () {
    this.$el.setAttribute('id', `fast-datetime-${this.UUID}`)
    this.render();
  },
  methods: {
    render () {
      this.$nextTick(() => {
        this.fast_datetime && this.fast_datetime.destroy();
        this.fast_datetime = new FastDateTime(this.currentOptions);
      });
    },
  },
  beforeDestroy () {
    this.fast_datetime && this.fast_datetime.destroy()
  }
}
</script>
<style scoped>
  .fast__text{
    position: relative;
    border: 1px solid #ccc;
    height: 36px;
    line-height: 36px;
    width: 100%;
    padding: 8px;
    max-width: 300px;
    border-radius: 3px;
    background: transparent;
    font-size:16px;
  }
  .fast__input[readonly] {
    display: none;
  }
</style>
<style lang="scss">
  @import './style/fastDatetime';
</style>
