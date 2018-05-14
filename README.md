# vue-fast-datetime
A quick select datetime picker component for vue.js

## DEMO HERE
**[Go to demo](http://zeethan.github.io/)**.

![Screen record](https://zeethan.github.io/assets/images/vue-fastdatetime-screenshot.gif)
## Usage
#### As global component
```main.js
  import FastDatetime from 'vue-fast-datetime'
  import 'vue-fast-datetime/dist/vue-fast-datetime.min.css'
  Vue.use(FastDatetime)
```
This will register a global component `<fast-datetime>`

#### As plugin
```js
  import FastDatetime from 'vue-fast-datetime'
  import 'vue-fast-datetime/dist/vue-fast-datetime.min.css'
  Vue.use(FastDatetime)
```
This will register a plugin `this.$FastDateTime.show`