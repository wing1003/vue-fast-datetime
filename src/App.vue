<template>
  <div id="abcv">
   <!-- <div @click="showPlugin('start')">
      <p>dateTime:</p>
    </div>-->
    <fast-datetime
      position="end"
      :startDate=startDate
      :endDate=endDate
      :startValue=dateValueStart
      :endValue=dateValueEnd
      confirmText="确定"
      hourRow="{value}时"
      minuteRow="{value}分"
      cancelText="取消"
      @on-change="select">
    </fast-datetime>
  </div>
</template>

<script>
 import FastDatetime from './component/vue-fast-datetime'

export default {
  name: 'app',
  components:{
    FastDatetime
  },
  data(){
    return {
      isShow:false,
      startDate:null,
      endDate:null,
      dateValueStart:'2018/05/06 10:00',
      dateValueEnd:'2018/05/07 10:00',
    }
  },
  computed:{
    value(){
      return `${this.dateValueStart}-${this.dateValueEnd}`;
    }
  },
  created(){
    this.startDate = new Date();
    this.endDate = this.delayDays(this.startDate,10);
  },
  methods: {
    delayDays(start, day) {
      return new Date(start.getTime() + day * 24 * 3600 * 1e3);
    },
    select(e, value, w_value) {
      console.log(e, value, w_value)
    },
    /*showPlugin (position) {
      this.$FastDateTime.show({
        position:position,
        startDate: this.startDate,
        endDate: this.endDate,
        cancelText: '取消',
        confirmText: '确定',
        startValue: this.dateValueStart,
        endValue:this.dateValueEnd,
        onConfirm:(newStartVal,newEndVal) => {
          this.dateValueStart = newStartVal;
          this.dateValueEnd = newEndVal;
        },
      });
    },*/
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
<style lang="scss">
  @import './component/vue-fast-datetime/style/fastDatetime';
</style>
