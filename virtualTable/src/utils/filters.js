export default {
  /**
   * 日期格式化，如下示例：
   * formatDate('20170101', 'YYYYMMDD', 'YYYY.MM.DD') 输出:2017.01.01
   * formatDate(Date.now(), 'YYYY-MM-DD') 输出：当前时间的格式化
   * @param value
   * @param format 源日期格式
   * @param newFormat 新日期格式
   * @returns {String}
   */
  formatDate(value, format, newFormat = 'YYYY-MM-DD') {
    if (!value) return '';
    if (value == '19000101') return '-';

    const time = new Date(value);
    if (isNaN(+time)) {
      const matches = format.match(/([a-zA-Z])\1{1,}/g);
      let start = 0;
      for (const match of matches) {
        if (newFormat && newFormat.indexOf(match) !== -1) {
          newFormat = newFormat.replace(new RegExp(match, 'g'), value.substr(start, match.length));
        }
        start += match.length;
      }
      return newFormat;
    } else {
      const timeMaps = {
        'Y{4}': time.getFullYear(),
        'Y{2}': time
          .getFullYear()
          .toString()
          .substr(2),
        'M{2}': time.getMonth() + 1,
        'D{2}': time.getDate(),
        'H{2}': time.getHours(),
        'm{2}': time.getMinutes(),
        's{2}': time.getSeconds(),
      };

      Object.keys(timeMaps).forEach(key => {
        timeMaps[key] = String(timeMaps[key]).padStart(2, 0);
        format = format.replace(new RegExp(key, 'g'), timeMaps[key]);
      });
      return format;
    }
  },
  //数字千分位并保留fixed位小数
  formatNumber(value, fixed = 2) {
    // debugger
    if (isNaN(parseFloat(value))) return '';
    value = parseFloat(value)
      .toFixed(fixed)
      .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    return value;
  },
  /*eslint-disable*/
  capitalize(value) {
    return value || value === 0
      ? value
          .toString()
          .charAt(0)
          .toUpperCase() + value.toString().slice(1)
      : '';
  },
  upperCase(value) {
    return value || value === 0 ? value.toString().toUpperCase() : '';
  },
  lowerCase(value) {
    return value || value === 0 ? value.toString().toLowerCase() : '';
  },
  placeholder(input, property) {
    return input === undefined || input === '' || input === null ? property : input;
  },
  truncate(value, length = 15) {
    if (!value || typeof value !== 'string') return '';
    if (value.length < length) return value;
    return value.substring(0, length) + '...';
  },
  findKey(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value));
  },
};
