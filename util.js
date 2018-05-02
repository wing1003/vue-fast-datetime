import formater from './format'

export function uuid(){
  return Math.random().toString(32).substring(2,12);
}

export function each (obj, fn) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (fn.call(obj[key], key, obj[key]) === false) {
        break;
      }
    }
  }
}

export function trimZero (val) {
  val = String(val);
  val = val ? parseFloat(val.replace(/^0+/g, '')) : '';
  val = val || 0;
  val = val + '';
  return val;
}

export function addZero (val) {
  val = String(val);
  return val.length < 2 ? '0' + val : val;
}

export function parseRow (tmpl, value) {
  return tmpl.replace(/\{value\}/g, value);
}
// parse Date String
export function parseDate (format, value) {
  const formatParts = format.split(/[^A-Za-z]+/);
  let valueParts = value.split(/\D+/);
  if (formatParts.length !== valueParts.length) {
    // if it is error date, use current date
    const date = formater(new Date(), format);
    valueParts = date.split(/\D+/);
  }

  let result = {};

  for (let i = 0; i < formatParts.length; i++) {
    if (formatParts[i]) {
      result[formatParts[i]] = valueParts[i];
    }
  }
  return result;
}

export function getElement (expr) {
  return (typeof expr === 'string') ? document.querySelector(expr) : expr;
}

export function toCreateElement (html) {
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = html;
  return tempContainer.firstElementChild;
}

export function removeElement (el) {
  el && el.parentNode.removeChild(el);
}

export function addClass(obj, cls){
  let obj_class = obj.className,
    blank = (obj_class != '') ? ' ' : '',
    added = obj_class + blank + cls;
  obj.className = added;
}

export function hasClass(obj, cls){
  let obj_class = obj.className,
    obj_class_lst = obj_class.split(/\s+/);
  for(let x in obj_class_lst) {
    if(obj_class_lst[x] == cls) {
      return true;
    }
  }
  return false;
}

export function removeClass(obj, cls){
  let obj_class = (' '+ obj.className +' ').replace(/(\s+)/gi, ' '),
    remove = obj_class.replace(' '+ cls +' ', ' '),
    removed = remove.replace(/(^\s+)|(\s+$)/g, '');
  obj.className = removed;
}

export function getComputedStyle (el, key) {
  var computedStyle = window.getComputedStyle(el)
  return computedStyle[key] || ''
}

// Easing Equations (c) 2003 Robert Penner, all rights reserved.
// Open source under the BSD License.
export function easeOutCubic (pos) {
  return (Math.pow((pos - 1), 3) + 1)
}

export function easeInOutCubic (pos) {
  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(pos, 3)
  }
  return 0.5 * (Math.pow((pos - 2), 3) + 2)
}
