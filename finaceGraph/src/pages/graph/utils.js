import { isEmpty } from '@/utils/utils';
import { getF9Link } from '@/utils/appAssist';

export function groupByCompany(data) {
  return data.reduce((results, item) => {
    const company = results.find(r => r.type === item['公司类型'] && r.name === item['公司']);
    if (company) {
      company.value.push(item);
    } else {
      results.push({ type: item['公司类型'], code: item['公司code'], name: item['公司'], value: [item] });
    }
    return results;
  }, []);
}

export function getLink(company) {
  const code = company['对象公司code'];
  if (!isEmpty(code) && `${code}`.length === 10) {
    return getF9Link({ type: 'company', code: company['对象公司code'], name: company['对象公司'] });
  }
  return 'javascript:;';
}

export function detectOrient() {
  const storage = localStorage;
  const data = storage.getItem('J-recordOrientX');
  const cw = document.documentElement.clientWidth;

  let _Width = 0,
    _Height = 0;
  if (!data) {
    const sw = window.screen.width;
    const sh = window.screen.height;
    _Width = sw < sh ? sw : sh;
    _Height = sw >= sh ? sw : sh;
    storage.setItem('J-recordOrientX', _Width + ',' + _Height);
  } else {
    const str = data.split(',');
    _Width = str[0];
    _Height = str[1];
  }
  if (cw == _Width) {
    // 竖屏
    return true;
  }
  if (cw == _Height) {
    // 横屏
    return false;
  }
}
