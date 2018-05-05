import Scroller from './lib/scroller'
import {
  each,
  trimZero,
  addZero,
  parseRow,
  parseDate,
  getElement,
  toCreateElement,
  removeElement,
  addClass,
  hasClass,
  removeClass
} from './util';
import {
  isToday,
  isTodayHour,
  loopDate,
  delayDays,
  getWeek
} from './makeData';
import format from './format';

const MASK_TEMPLATE = '<div class="fd-mask"></div>';

const TEMPLATE = `<div class="fd-container">
  <div class="fd-header">
    <div class="fd-item fd-left fd--cancel" data-role="cancel">cancel</div>
    <div class="fd-item"></div>
    <div class="fd-item fd-right fd--confirm" data-role="confirm">ok</div>
  </div>
  <div class="fd-title">
    <div class="fd-title__item fd-active" data-role="start_datetime">
      <p data-role="startDate"></p>
    </div>
    <div class="fd-title__item" data-role="end_datetime">
      <p data-role="backDate"></p>
    </div>
  </div>
  <div class="fd-content fd-start" data-role="start-content">
    <div class="fd-item" data-role="start_date_unit"></div>
    <div class="fd-item" data-role="start_hour"></div>
    <div class="fd-item" data-role="start_minute"></div>
  </div>
  <div class="fd-content fd-end" data-role="end-content" style="display: none">
    <div class="fd-item" data-role="end_date_unit"></div>
    <div class="fd-item" data-role="end_hour"></div>
    <div class="fd-item" data-role="end_minute"></div>
  </div>
</div>`;

const SHOW_ANIMATION_TIME = 200;
const SHOW_CONTAINER_TIME = 300;
const DISTANT = 2;

const TYPE_MAP = {
  year: ['YYYY'],
  month: ['MM', 'M'],
  day: ['DD', 'D'],
  hour: ['HH', 'H'],
  minute: ['mm', 'm']
};

const START_RENDER_MAP = {
  date_unit:['YYYY/MM/DD'],
  hour: ['HH', 'H'],
  minute: ['mm', 'm']
};

const END_RENDER_MAP = {
  date_unit:['YYYY/MM/DD'],
  hour: ['HH', 'H'],
  minute: ['mm', 'm']
};

let MASK = null;

let CURRENT_PICKER;

const NOW = new Date();

const DEFAULT_CONFIG = {
  position:'start',
  template: TEMPLATE,
  trigger: null,
  minHour: 0,
  maxHour: 23,
  startDate: null,
  endDate: null,
  hourRow: '{value}',
  minuteRow: '{value}',
  format: 'YYYY/MM/DD HH:mm',
  startValue: `${NOW.getFullYear()}/${NOW.getMonth()+1}/${ NOW.getDate()}`,
  endValue:'',
  onSelect () {},
  onConfirm () {},
  onShow () {},
  onHide () {},
  confirmText: 'ok',
  cancelText: 'cancel',
  destroyOnHide: false,
  isOneInstance: false,
};


function renderScroller (container, data, value, callback) {
  data = data.map(one => {
    one.value = one.value + ''
    return one
  });
  return new Scroller(container, {
    data,
    defaultValue: value + '',
    onSelect: callback
  })
}

function showMask () {
  let _mask = document.querySelector('.fd-mask')
  if(_mask){
    _mask.style.zIndex = 900;
  }

  if (!MASK) {
    MASK = toCreateElement(MASK_TEMPLATE)
    document.body.appendChild(MASK)

    MASK.addEventListener('click', function () {
      CURRENT_PICKER && CURRENT_PICKER.hide()
    }, false);

    MASK.addEventListener('touchmove', function (e) {
      e.preventDefault()
    }, false);
  }

  MASK.style.display = 'block'

  setTimeout(function () {
    MASK && (MASK.style.opacity = 0.5)
  }, 0)
}

function hideMask () {
  let _mask = document.querySelector('.fd-mask');
  if(_mask){
    _mask.style.zIndex = -1;
  }
  if (!MASK) {
    return;
  }

  MASK.style.opacity = 0;

  setTimeout(function () {
    MASK && (MASK.style.display = 'none')
  }, SHOW_ANIMATION_TIME);
}

function FastDateTime (config) {
  const self = this;
  self.config = {};
  self.startValue = config.startValue || '';
  self.endValue = config.endValue || '';

  each(DEFAULT_CONFIG, function (key, val) {
    self.config[key] = config[key] || val
  });

  if (config.defaultSelectedValue && !config.value) {
    self.config.value = config.defaultSelectedValue;
  }

  if (typeof this.config.startDate === 'string') {
    this.config.startDate = this.config.startDate.replace(/-/g, '/');
  }
  else if(Object.prototype.toString.call(this.config.startDate) === "[object Date]"){
    this.config.startTime = delayDays(this.config.startDate,1/12);
  }

  if (typeof this.config.endDate === 'string') {
    this.config.endDate = this.config.endDate.replace(/-/g, '/')
  }
  else if(Object.prototype.toString.call(this.config.endDate) === "[object Date]"){
    this.config.endTime = delayDays(this.config.endDate,1/12);
  }

  if('string' === typeof config.confirmText) this.config.confirmText = config.confirmText;
  if('string' === typeof config.cancelText) this.config.cancelText = config.cancelText;

  this.triggerHandler = function (e) {
    e.preventDefault();
    self.show(self.startValue,self.endValue);
  };

  if (self.config.trigger) {
    this.trigger = getElement(self.config.trigger);
    this.trigger && this.trigger.addEventListener('click', this.triggerHandler, false);
  }
}

FastDateTime.prototype = {
  _show (startValue,endValue) {
    const self = this;

    self.container.style.display = 'block';

    each(START_RENDER_MAP, function (type) {
      if(type === 'date_unit'){
        self['start_' + type + 'Scroller'] && self['start_' + type + 'Scroller'].select((`${startValue['year']}/${startValue['month']}/${startValue['day']}`), false);
      }
      else{
        self['start_' + type + 'Scroller'] && self['start_' + type + 'Scroller'].select((startValue[type]), false);
      }
    });

    each(END_RENDER_MAP, function (type) {
      if(type === 'date_unit'){
        self['end_' + type + 'Scroller'] && self['end_' + type + 'Scroller'].select((`${endValue['year']}/${endValue['month']}/${endValue['day']}`), false);
      }
      else{
        self['end_' + type + 'Scroller'] && self['end_' + type + 'Scroller'].select((endValue[type]), false);
      }
    });


    setTimeout(function () {
      self.container.style['-webkit-transform'] = 'translateY(0)';
      self.container.style.transform = 'translateY(0)';
    }, 0);
  },
  show (start,end) {

    const self = this;
    const config = self.config;

    CURRENT_PICKER = self;

    const startValueMap = self.startValueMap = parseDate(config.format, start || config.startValue);
    const endValueMap = self.endValueMap = parseDate(config.format, end || config.endValue);

    let startValueObj = {};
    let endValueObj = {};

    each(TYPE_MAP, function (type, list) {
      startValueObj[type] = list.length === 1 ? startValueMap[list[0]] : (startValueMap[list[0]] || startValueMap[list[1]])
      endValueObj[type] = list.length === 1 ? endValueMap[list[0]] : (endValueMap[list[0]] || endValueMap[list[1]])
    });

    let startRenderValueMap = {};
    let endRenderValueMap = {};

    each(START_RENDER_MAP,function(type){
      if('date_unit' === type){
        startRenderValueMap[type] = `${startValueObj['year']}/${startValueObj['month']}/${startValueObj['day']}`;
      }
      else{
        startRenderValueMap[type] = startValueObj[type];
      }
    });

    each(END_RENDER_MAP,function(type){
      if('date_unit' === type){
        endRenderValueMap[type] = `${endValueObj['year']}/${endValueObj['month']}/${endValueObj['day']}`;
      }
      else{
        endRenderValueMap[type] = endValueObj[type];
      }
    });

    if (self.container) {
      self._show(startValueObj,endValueObj);
    }
    else {
      const container = self.container = toCreateElement(config.template);
      if (config.isOneInstance) {
        container.id = 'fast-datetime';
      }
      document.body.appendChild(container);

      self.container.style.display = 'block';

      each(START_RENDER_MAP, function (type) {
        const ele = self.find('[data-role = start_' + type + ']');
        if (startRenderValueMap[type] === undefined) {
          removeElement(ele);
          return;
        }

        let data;
        if ('date_unit' === type) {
          data = self._makeData('start_'+ type, trimZero(startValueObj.year), trimZero(startValueObj.month),trimZero(startValueObj.day));
        }
        else if ('hour' === type) {
          data = self._makeData('start_'+ type, trimZero(startValueObj.year), trimZero(startValueObj.month), trimZero(startValueObj.day),trimZero(startValueObj.hour));
        }
        else if ('minute' === type) {
          data = self._makeData('start_'+ type, trimZero(startValueObj.year), trimZero(startValueObj.month), trimZero(startValueObj.day),trimZero(startValueObj.hour),trimZero(startValueObj.minute));
        }

        self['start_'+ type + 'Scroller'] = renderScroller(ele, data, trimZero(startRenderValueMap[type]), function (currentValue) {
          let date = {};
          ['year','month','day'].forEach((item,index) => {
            date[item] = self.start_date_unitScroller.value.split('/')[index];
          });

          config.onSelect.call(self, 'start_'+ type, currentValue, self.getStartValue());
          if(self.getStartValue() <= format(self.config.startDate,'YYYY/MM/DD HH:mm')){
            self.find('[data-role=startDate]').innerText = format(self.config.startDate,'MM月DD号 HH:mm');
            self.start_hourScroller && self._setStartHourScroller(date.year, date.month, date.day, format(self.config.startDate,'HH'));
            self.start_minuteScroller && self._setStartMinuteScroller(date.year, date.month, date.day, format(self.config.startDate,'HH'), format(self.config.startDate,'mm'));
          }
          else{
            self.start_hourScroller && self._setStartHourScroller(date.year, date.month, date.day, self.start_hourScroller.value);
            self.start_minuteScroller && self._setStartMinuteScroller(date.year, date.month, date.day, self.start_hourScroller.value, self.start_minuteScroller.value);
          }

          if(self.getEndValue() <= self.getStartValue() && 'start' === self.config.position){
            let date = {};
            let delayOneDay = delayDays(new Date(self.getStartValue()),1);
            ['year','month','day'].forEach((item,index) => {
              date[item] = format(delayOneDay,'YYYY/MM/DD').split('/')[index];
            });
            if(delayOneDay > self.config.endTime){
              self.end_date_unitScroller.select(format(self.config.endTime,'YYYY/MM/DD'), false);
              self.end_hourScroller.select(format(self.config.endTime,'HH'), false);
              self.end_minuteScroller.select(format(self.config.endTime,'mm'), false);
            }
            else{
              self.end_date_unitScroller.select((`${date.year}/${date.month}/${date.day}`), false);
            }
          }
        });
      });

      each(END_RENDER_MAP, function (type) {
        const ele = self.find('[data-role = end_' + type + ']');

        if (endRenderValueMap[type] === undefined) {
          removeElement(ele);
          return
        }
        let data;

        if ('date_unit' === type) {
          data = self._makeData('end_'+ type, trimZero(endValueObj.year), trimZero(endValueObj.month),trimZero(endValueObj.day));
        }
        else if ('hour' === type) {
          data = self._makeData('end_'+ type, trimZero(endValueObj.year), trimZero(endValueObj.month), trimZero(endValueObj.day),trimZero(endValueObj.hour));
        }
        else if ('minute' === type) {
          data = self._makeData('end_'+ type, trimZero(endValueObj.year), trimZero(endValueObj.month), trimZero(endValueObj.day),trimZero(endValueObj.hour),trimZero(endValueObj.minute));
        }

        self['end_' + type + 'Scroller'] = renderScroller(ele, data, trimZero(endRenderValueMap[type]), function (currentValue) {
          let date = {};
          ['year','month','day'].forEach((item,index) => {
            date[item] = self.end_date_unitScroller.value.split('/')[index];
          });

          config.onSelect.call(self, 'end_'+ type, currentValue, self.getEndValue());
          self.end_hourScroller && self._setEndHourScroller(date.year, date.month, date.day, self.end_hourScroller.value);
          self.end_minuteScroller && self._setEndMinuteScroller(date.year, date.month, date.day, self.end_hourScroller.value, self.end_minuteScroller.value);

          if(self.getEndValue() <= self.getStartValue() && 'end' === self.config.position){
            let date = {};
            let advanceOneDay = delayDays(new Date(self.getEndValue()),-1);
            ['year','month','day'].forEach((item,index) => {
              date[item] = format(advanceOneDay,'YYYY/MM/DD').split('/')[index];
            });
            if(advanceOneDay < self.config.startDate){
              self.start_date_unitScroller.select(format(self.config.startDate,'YYYY/MM/DD'), false);
              self.start_hourScroller.select(format(self.config.startDate,'HH'), false);
              self.start_minuteScroller.select(format(self.config.startDate,'mm'), false);
            }
            else{
              self.start_date_unitScroller.select((`${date.year}/${date.month}/${date.day}`), false);
            }
          }
        });
      });

      self.find('[data-role=startDate]').innerText = `${startValueObj.month}月${startValueObj.day}号 ${startValueObj.hour}:${startValueObj.minute}`;
      self.find('[data-role=backDate]').innerText = `${endValueObj.month}月${endValueObj.day}号 ${endValueObj.hour}:${endValueObj.minute}`;

      this._show(startValueObj,endValueObj);

      self.find('[data-role=cancel]').addEventListener('click', function (e) {
        e.preventDefault();
        self.hide()
      }, false);

      self.find('[data-role=confirm]').addEventListener('click', function (e) {
        e.preventDefault();
        self.confirm()
      }, false);

      if('end' === self.config.position){
        let startEle = self.find('[data-role=start-content]');
        let endEle = self.find('[data-role=end-content]');

        removeClass(self.find('[data-role=start_datetime]'),'fd-active');
        addClass(self.find('[data-role=end_datetime]'),'fd-active');

        endEle.style.display = 'flex';
        startEle.style.display = 'none';
      }

      self.find('[data-role=start_datetime]').addEventListener('click', function (e) {
        let ele = self.find('[data-role=end_datetime]');
        e.preventDefault();

        if(!hasClass(this,'fd-active')){
          addClass(this,'fd-active');
          removeClass(ele,'fd-active');

          self.find('[data-role=start-content]').style.display = 'flex',self.config.position = 'start';
          self.find('[data-role=end-content]').style.display = 'none';
        }
      }, false);

      self.find('[data-role=end_datetime]').addEventListener('click', function (e) {
        let ele = self.find('[data-role=start_datetime]');
        e.preventDefault();

        if(!hasClass(this,'fd-active')){
          addClass(this,'fd-active');
          removeClass(ele ,'fd-active');

          self.find('[data-role=end-content]').style.display = 'flex',self.config.position = 'end';
          self.find('[data-role=start-content]').style.display = 'none';
        }
      }, false);

      self.find('[data-role=confirm]').innerText = self.config.confirmText;
      self.find('[data-role=cancel]').innerText = self.config.cancelText;
    }

    showMask();
    config.onShow.call(self);
  },

  /**
   * @method create datetime data
   * @param type{ string }: start_date_unit ,hour ,minute;
   * */
  _makeData (type, year, month, day, hour ,minute) {
    const config = this.config;
    const renderMap = 'start_date_unit' === type || 'start_hour' === type ||  'start_minute' === type ? START_RENDER_MAP : END_RENDER_MAP;
    const valueMap = 'start_date_unit' === type || 'start_hour' === type ||  'start_minute' === type  ? this.startValueMap : this.endValueMap;
    let data = [];
    let min;
    let max;

    if ('start_date_unit' === type) {
      data = loopDate(this.config.startDate, this.config.endDate).map(item => {
        let _week = getWeek(`${item.year}/${addZero(item.month)}/${item.days}`);
        return {
          name:`${addZero(item.month)}月${addZero(item.days)}日 ${_week}`,
          value: `${item.year}/${addZero(item.month)}/${addZero(item.days)}`
        }
      });
    }
    else if('end_date_unit' === type){
      data = loopDate(this.config.startTime, this.config.endTime).map(item => {
        let _week = getWeek(`${item.year}/${addZero(item.month)}/${item.days}`);
        return {
          name:`${addZero(item.month)}月${addZero(item.days)}日 ${_week}`,
          value: `${item.year}/${addZero(item.month)}/${addZero(item.days)}`
        }
      });
    }
    else if ('start_hour' === type) {
      if(isToday(new Date(`${year}/${month}/${day}`), new Date())){
        min = this.config.startDate.getHours();
        max = this.config.maxHour;
      }
      else if(isToday(new Date(`${year}/${month}/${day}`),this.config.endDate)){
        min = this.config.minHour;
        max = this.config.endDate.getHours();
      }
      else{
        min = this.config.minHour;
        max = this.config.maxHour;
      }
    }
    else if ('start_minute' === type) {
      if(isTodayHour(new Date(`${year}/${month}/${day}`), this.config.startDate, hour)){
        min = this.config.startDate.getMinutes();
        max = 59;
      }
      else if(isTodayHour(new Date(`${year}/${month}/${day}`), this.config.endDate, hour)){
        min = 0;
        max = this.config.endDate.getMinutes();
      }

      else{
        min = 0;
        max = 59;
      }
    }

    if ('end_hour' === type) {
      if(isToday(new Date(`${year}/${month}/${day}`), new Date())){
        min = this.config.startTime.getHours();
        max = this.config.maxHour;
      }
      else if(isToday(new Date(`${year}/${month}/${day}`),this.config.endTime)){
        min = this.config.minHour;
        max = this.config.endTime.getHours();
      }
      else{
        min = this.config.minHour;
        max = this.config.maxHour;
      }
    }
    else if ('end_minute' === type) {
      if(isTodayHour(new Date(`${year}/${month}/${day}`), this.config.startTime, hour)){
        min = this.config.startTime.getMinutes();
        max = 59;
      }
      else if(isToday(new Date(`${year}/${month}/${day}`), this.config.endTime)){
        min = 0;
        max = this.config.endTime.getMinutes();
      }
      else if(isToday(new Date(`${year}/${month}/${day}`), this.config.startTime)){
        min = this.config.startTime.getMinutes();
        max = 59;
      }
      else{
        min = 0;
        max = 59;
      }
    }

    for (let i = min; i <= max; i++) {
      let name;
      if('start_hour' === type || 'end_hour' === type){
        const val = valueMap[renderMap['hour'][0]] ? addZero(i) : i;
        name = parseRow(config.hourRow, val);
        data.push({
          name: name,
          value: val
        });
      }
      else if('start_minute' === type || 'end_minute' === type){
        const val = valueMap[renderMap['minute'][0]] ? addZero(i) : i;
        name = parseRow(config.minuteRow, val);
        data.push({
          name: name,
          value: val
        });
      }

    }
    return data;
  },
  /**
   * @private method:after date_unit changed
   * */
  _setStartHourScroller (year, month, day, hour) {
    const self = this;
    if (!this.start_hourScroller) {
      return
    }
    self.start_hourScroller.destroy();
    const div = self.find('[data-role="start_hour"]');
    self.start_hourScroller = renderScroller(div, self._makeData('start_hour', year, month, day), hour, function (currentValue) {
      let currentDate = `${self.start_date_unitScroller.value} ${currentValue}:${self.start_minuteScroller.value}`;
      if( currentDate >= self.getEndValue()){
        let delayOneHour = delayDays(new Date(currentDate),1/24);
        if(isToday(new Date(currentDate),delayOneHour)){
          self.end_hourScroller.select(format(delayOneHour,'HH'),false);
        }
        //the day is tomorrow,so corrected the end day
        else{
          self.find('[data-role=backDate]').innerText = format(delayOneHour,'MM月DD号 HH:mm');
          self.end_date_unitScroller.select(format(delayOneHour,'YYYY/MM/DD'));
          self.end_hourScroller.select(format(delayOneHour,'HH'));
        }
      }

      self.config.onSelect.call(self, 'start_hour', currentValue, self.getStartValue());
      self.start_minuteScroller && self._setStartMinuteScroller(year, month, day, currentValue,self.start_minuteScroller.value);
    });
  },
  /**
   * @private method:after start date_unit Or hour Scroller changed
   * */
  _setStartMinuteScroller(year, month, day, hour, minute){
    if (!this.start_minuteScroller) {
      return;
    }
    const self = this;
    self.start_minuteScroller.destroy();
    const div = self.find('[data-role="start_minute"]');
    self.start_minuteScroller = renderScroller(div, self._makeData('start_minute', year, month, day, hour), minute, function (currentValue) {
      let currentDate = `${self.start_date_unitScroller.value} ${self.start_hourScroller.value}:${currentValue}`;
      if( currentDate >= self.getEndValue()){
        let delayOneHour = delayDays(new Date(currentDate),1/24);
        if(isToday(new Date(currentDate),delayOneHour)){
          self.end_hourScroller.select(format(delayOneHour,'HH'),false);
        }
        //the day is tomorrow,so corrected the end day
        else{
          self.find('[data-role=backDate]').innerText = format(delayOneHour,'MM月DD号 HH:mm');
          self.end_date_unitScroller.select(format(delayOneHour,'YYYY/MM/DD'));
          self.end_hourScroller.select(format(delayOneHour,'HH'));
        }
      }
      self.config.onSelect.call(self, 'start_minute', currentValue, self.getStartValue());
    });
  },
  _setEndHourScroller (year,month,day,hour) {
    if (!this.end_hourScroller) {
      return;
    }
    const self = this;
    self.end_hourScroller.destroy();
    const div = self.find('[data-role="end_hour"]');
    self.end_hourScroller = renderScroller(div, self._makeData('end_hour', year, month, day), hour, function (currentValue) {
      let currentDate = `${self.end_date_unitScroller.value} ${currentValue}:${self.end_minuteScroller.value}`;
      if( currentDate <= self.getStartValue()){
        let advanceOneHour = delayDays(new Date(currentDate),-1/24);
        if(isToday(new Date(currentDate),advanceOneHour)){
          self.start_hourScroller.select(format(advanceOneHour,'HH'),false);
        }
        //the day is yesterday,so corrected the start day
        else{
          self.find('[data-role=startDate]').innerText = format(advanceOneHour,'MM月DD号 HH:mm');
          self.start_date_unitScroller.select(format(advanceOneHour,'YYYY/MM/DD'));
          self.start_hourScroller.select(format(advanceOneHour,'HH'));
        }
      }

      self.config.onSelect.call(self, 'end_hour', currentValue, self.getEndValue());
      self.end_minuteScroller && self._setEndMinuteScroller(year, month, day, currentValue,self.end_minuteScroller.value);
    });
  },
  /**
   * @method:after end date_unit Or hour Scroller changed
   * */
  _setEndMinuteScroller(year, month, day, hour, minute){
    if (!this.end_minuteScroller) {
      return;
    }
    const self = this;
    self.end_minuteScroller.destroy();
    const div = self.find('[data-role="end_minute"]');
    self.end_minuteScroller = renderScroller(div, self._makeData('end_minute', year, month, day, hour), minute, function (currentValue) {
      let currentDate = `${self.end_date_unitScroller.value} ${self.end_hourScroller.value}:${currentValue}`;
      if( currentDate <= self.getStartValue()){
        let advanceOneHour = delayDays(new Date(currentDate),-1/24);
        if(isToday(new Date(currentDate),advanceOneHour)){
          self.start_hourScroller.select(format(advanceOneHour,'HH'),false);
        }
        //the day is yesterday,so corrected the start day
        else{
          self.find('[data-role=startDate]').innerText = format(advanceOneHour,'MM月DD号 HH:mm');
          self.start_date_unitScroller.select(format(advanceOneHour,'YYYY/MM/DD'));
          self.start_hourScroller.select(format(advanceOneHour,'HH'));
        }
      }
      self.config.onSelect.call(self, 'end_minute', currentValue, self.getEndValue());
    });
  },

  find (selector) {
    return this.container.querySelector(selector);
  },

  findAll(selector){
    return this.container.querySelectorAll(selector);
  },

  hide () {
    if (!this.container) {
      return;
    }
    const self = this;
    self.container.style.removeProperty('transform');
    self.container.style.removeProperty('-webkit-transform');

    setTimeout(function () {
      self.container && (self.container.style.display = 'none');
    }, SHOW_CONTAINER_TIME);

    hideMask();

    self.config.onHide.call(self);
    if (self.config.destroyOnHide) {
      setTimeout(() => {
        self.destroy();
      }, 500)
    }
  },

  select (type, value) {
    this[type + 'Scroller'].select(value, false);
  },

  destroy () {
    const self = this;
    this.trigger && this.trigger.removeEventListener('click', this.triggerHandler, false);
    if (!self.config.isOneInstance && !self.willShow) {
      removeElement(MASK);
      MASK = null;
    }
    removeElement(self.container);
    self.container = null;
  },

  getStartValue () {
    const self = this;
    const config = self.config;

    let value = config.format;
    function formatValue (scroller, expr1, expr2) {
      if (scroller) {
        const val = scroller.value;

        if (expr1) {
          value = value.replace(new RegExp(expr1, 'g'), addZero(val));
        }
        if (expr2) {
          value = value.replace(new RegExp(expr2, 'g'), trimZero(val));
        }
      }
    }
    each(START_RENDER_MAP, function (key, list) {
      formatValue(self['start_'+ key + 'Scroller'], list[0], list[1]);
    });
    self.find('[data-role=startDate]').innerText = `${value.split(' ')[0].split('/')[1]}月${value.split(' ')[0].split('/')[2]}号 ${value.split(' ')[1]}`;
    return value;
  },

  getEndValue () {
    const self = this;
    const config = self.config;

    let value = config.format;
    function formatValue (scroller, expr1, expr2) {
      if (scroller) {
        const val = scroller.value;
        if (expr1) {
          value = value.replace(new RegExp(expr1, 'g'), addZero(val));
        }
        if (expr2) {
          value = value.replace(new RegExp(expr2, 'g'), trimZero(val));
        }
      }
    }

    each(END_RENDER_MAP, function (key, list) {
      formatValue(self['end_'+ key + 'Scroller'], list[0], list[1]);
    });
    self.find('[data-role=backDate]').innerText = `${value.split(' ')[0].split('/')[1]}月${value.split(' ')[0].split('/')[2]}号 ${value.split(' ')[1]}`;
    return value;
  },

  confirm () {
    const startVal = this.getStartValue();
    const endVal = this.getEndValue();

    this.startValue = startVal;
    this.endValue = endVal;

    if (this.config.onConfirm.call(this, startVal, endVal) === false) {
      return;
    }
    this.hide();
  }
};

export default FastDateTime;
