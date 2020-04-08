import http from '@/utils/http';
import { removeObjectNil } from '@/utils/utils';
import { getUrlSearches } from '@/utils/urls';

const { user, token } = getUrlSearches();

export const SCREEN_TYPE = {
  MODE_1: '1',
  MODE_2: '2',
  MODE_3: 'majorNotes',
  MODE_4: 'overDue',
};

/**
 * 筛选条件数据
 * @param child_type
 * @param filter_type
 * @param model_type 模式 模式1：使用接口返回的报告期 模式2：展示2012到当前年所有报告期数据
 * @return {Promise}
 */
export function getScreenData({ child_type, filter_type, model_type = SCREEN_TYPE.MODE_1 }) {
  const actionMap = {
    [SCREEN_TYPE.MODE_1]: '/finchinaAPP/finance/getBankFinanceFilter.action',
    [SCREEN_TYPE.MODE_2]: '/finchinaAPP/finance/getBankFinanceLandscapeFilter.action',
  };
  return http.get(
    actionMap[model_type],
    removeObjectNil({
      user,
      token,
      child_type,
      filter_type,
    })
  );
}

/**
 * 银行财务数据
 * @param child_type 节点类别
 * @param bankTypeCode 机构类型
 * @param marketType 上市类别
 * @param areaCode 地区代码
 * @param accountingCode 指标（多选）
 * @param statType 统计值
 * @param reportYear 报告期（年度）（单选）
 * @param reportType 报告期（类别）
 * @param sortKey 排序字段（指标代码）
 * @param sortType 排序方式 desc asc
 * @param skip 分页起始位置
 * @param pagesize 分页大小
 * @param modeType 模式
 * @param itcodeList
 * @return {Promise}
 */
export function getBankFinanceData({
  child_type,
  bankTypeCode,
  marketType,
  areaCode,
  accountingCode,
  accountCodeSelected,
  statType,
  reportYear,
  reportType,
  reportDateSelected,
  sortKey,
  sortType,
  skip,
  pagesize,
  modeType,
  itcodeList,
  unitCode,
  orgName,
}) {
  const actionMap = {
    [SCREEN_TYPE.MODE_1]: '/finchinaAPP/finance/getBankFinanceData.action',
    [SCREEN_TYPE.MODE_2]: '/finchinaAPP/finance/getBankFinanceLandscapeData.action',
  };
  return http.get(
    actionMap[modeType],
    removeObjectNil({
      user,
      token,
      child_type,
      bankTypeCode,
      marketType,
      areaCode,
      accountingCode,
      accountCodeSelected,
      statType,
      reportYear,
      reportType,
      reportDateSelected,
      sortKey,
      sortType,
      skip,
      pagesize,
      itcodeList,
      unitCode,
      orgName,
    })
  );
}

/**
 * 财务附注筛选条件数据
 * @param child_type
 * @param filter_type
 * @return {Promise}
 */
export function getNotesMenuData({ child_type, filter_type }) {
  // console.log(child_type);
  return http.get(
    '/finchinaAPP/finance/getFinancialNotesFilter.action',
    removeObjectNil({
      user,
      token,
      child_type,
      filter_type,
    })
  );
}

/**
 * 银行财务附注，包含贷款五级分类对比，贷款结构对比，逾期贷款对比，主要经营情况对比等页面
 * @param child_type 节点类别
 * @param bankTypeCode 机构类型
 * @param marketType 上市类别
 * @param areaCode 地区代码
 * @param accountingCode 指标（多选）
 * @param statType 统计值
 * @param reportYear 报告期（年度）（单选）
 * @param reportType 报告期（类别）
 * @param sortKey 排序字段（指标代码）
 * @param sortType 排序方式 desc asc
 * @param skip 分页起始位置
 * @param pagesize 分页大小
 * @param modeType 模式 MODE_3:贷款五级分类，贷款结构，主要经营情况的接口，MODE_4:逾期贷款的接口
 * @param itcodeList
 * @return {Promise}
 */
export function getFinanceNotesData({
  itcode,
  child_type,
  bankTypeCode,
  marketType,
  areaCode,
  accountingCode,
  accountCodeSelected,
  statType,
  reportYear,
  reportType,
  sortKey,
  sortType,
  orgName,
  unitCode,
  skip,
  pagesize,
  termType,
  amountType,
  tbType,
  zbType,
  modeType,
}) {
  const actionMap = {
    [SCREEN_TYPE.MODE_3]: '/finchinaAPP/finance/getFinancialNotesData.action',
    [SCREEN_TYPE.MODE_4]: '/finchinaAPP/finance/getFinancialNotesOverdueData.action',
  };
  return http.get(
    actionMap[modeType],
    removeObjectNil({
      itcode,
      user,
      token,
      child_type,
      bankTypeCode,
      marketType,
      areaCode,
      accountingCode,
      accountCodeSelected,
      statType,
      reportYear,
      reportType,
      sortKey,
      sortType,
      orgName,
      unitCode,
      skip,
      pagesize,
      termType,
      amountType,
      tbType,
      zbType,
    })
  );
}

/**
 * 银行对比图表请求接口，sendOpt包含以下字段
 * @param child_type 节点类别
 * @param bankTypeCode 机构类型
 * @param marketType 上市类别
 * @param areaCode 地区代码
 * @param accountingCode 指标（多选）
 * @param statType 统计值
 * @param reportYear 报告期（年度）（单选）
 * @param reportType 报告期（类别）
 * @param sortKey 排序字段（指标代码）
 * @param sortType 排序方式 desc asc
 * @param skip 分页起始位置
 * @param pagesize 分页大小
 * @param modeType 模式
 * @param itcodeList
 * @return {Promise}
 */
export function getBankChartData(obj) {
  let { sendOpt, currentPatternVal } = obj;

  return new Promise(function(resolve) {
    http
      .get(
        `/finchinaAPP/finance/${currentPatternVal === 1 ? 'getBankFinanceData' : 'getBankFinanceLandscapeData'}.action`,
        Object.assign({}, sendOpt, { user, token })
      )
      .then(({ data }) => {
        resolve(data);
      });
  });
}
