/**
 * @author:Ethan Wong
 * @date:2018-04-16
 * */
import format from './format';

function isToday (val1, val2) {
  return val1.getFullYear() === val2.getFullYear() && val1.getMonth() === val2.getMonth() && val1.getDate() === val2.getDate();
}

function isTodayHour(val1, val2 ,hour1){
  return val1.getFullYear() === val2.getFullYear() && val1.getMonth() === val2.getMonth() && val1.getDate() === val2.getDate() && parseInt(hour1,10) === val2.getHours();
}

function delayDays(start, day){
  return new Date(start.getTime() + day * 24 * 3600 * 1e3);
}

function getWeek (date){
  return '周' + ('日一二三四五六'.charAt(new Date(date).getDay()));
}

function loopDate(startDay,endDay){
  let dateObj = [];
  let _loop = function(){
    if(format(startDay,'YYYY/MM/DD') <= format(endDay,'YYYY/MM/DD')){
      dateObj.push({
        year:startDay.getFullYear(),
        month:startDay.getMonth() + 1,
        days:startDay.getDate()
      });
      startDay = delayDays(startDay,1);
      _loop(startDay,endDay);
    }
    else{
      return dateObj;
    }
  };
  _loop();
  return dateObj;
}

export {
  isToday,
  isTodayHour,
  delayDays,
  getWeek,
  loopDate
}
