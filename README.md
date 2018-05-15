# vue-fast-datetime
A quick select datetime picker component for vue.js

## DEMO HERE
**[Go to demo](http://zeethan.github.io/)**.

![Screen record](https://zeethan.github.io/assets/images/vue-fastdatetime-screenshot.gif)

## Install
```shell
npm i vue-fast-datetime -D
```

## Usage
#### As global component
```main.js
  import FastDatetime from 'vue-fast-datetime'
  import 'vue-fast-datetime/dist/vue-fast-datetime.min.css'
  Vue.use(FastDatetime)
```
This will register a global component `<fast-datetime>`

```
  <fast-datetime
    position="start"
    :startDate=startDate
    :endDate=endDate
    :startValue=dateValueStart
    :endValue=dateValueEnd>
  </fast-datetime>
```

#### As plugin
```js
  import FastDatetime from 'vue-fast-datetime'
  import 'vue-fast-datetime/dist/vue-fast-datetime.min.css'
  Vue.use(FastDatetime)
```
This will register a plugin `this.$FastDateTime.show`

```
 this.$FastDateTime.show({
  position:'start',
  startDate: this.startDate,
  endDate: this.endDate,
  startValue: this.dateValueStart,
  endValue:this.dateValueEnd
})
```

## Available props
The component accepts these props:

| Attribute        | Type                                            | Default              | Description      |
| :--------------- | :---------------------------------------------- | :------------------- | :----------------|
| position         | String											 | `start`              | Initial the first choose time whether starttime or endtime  |
| startDate        | Object Date                                     | -                    | The starttime of fase-datetime (required)                   |
| endDate          | Object Date                                     | -                    | The endtime of fase-datetime (required)                     |
| startValue       | String                                          | -                    | Current value of starttime,this value must be less than the starttime (required)                   |
| endValue         | String                                          | -                    | Current value of endtime,this value must be less than the starttime (required)                   |
| confirmText      | String                                          | `ok`                 | The text of confirm button                   |
| cancelText       | String                                          | `cancel`             | The text of cancel button                 |
| hourRow          | String                                          | `{value}`            | Template of hourRow                 |
| minuteRow        | String                                          | `{value}`            | Template of minuteRow                 |

## methods

| name                       | type               | Default              | Description      |
| :------------------------- | :----------------- | :------------------- | :----------------|
| `onSelect` / `@on-change`  | `Function`         | (type, value, wholeValue) => {} | CallBack after date scroller value changed, pass three arguments, current scroller type `type` and current scroller value `value` and datetime value `wholeValue` |
| `onConfirm`                | `Function`         | (startValue, endValue) | CallBack after click confirm button,set current startValue and endValue |
| `onShow` / `@on-show`      | `Function`         | :---:                | show the vue-fast-datetime |
| `onHide` / `@on-hide`      | `Function`         | :---:                | hide the vue-fast-datetime |

##CHANGELOG
Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## License
[MIT](LICENSE.txt) License