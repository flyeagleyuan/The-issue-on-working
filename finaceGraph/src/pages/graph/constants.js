export const SIDE_TYPE = {
  // 公司搜索
  COMPANY_SEARCH: 7,
  // 公司信息
  COMPANY_INFO: 8,
  // 境内债券 xx公司及子公司境内债券详情
  DOMESTIC_BOND_GROUP_COMPANY: 9,
  // 境内债券 XX公司境外债券详情
  DOMESTIC_BOND_NORMAL_DETAIL: 34,
  // 境外债券 xx公司及子公司境外债券详情
  OVERSEA_BOND_GROUP_COMPANY: 10,
  // 境外债券 XX公司境外债券详情
  OVERSEA_BOND_NORMAL_DETAIL: 33,
  // 银行借款 xx公司及子公司借款详情
  COMPANY_BORROW_GROUP_COMPANY: 11,
  // 银行借款 XX公司借款详情
  COMPANY_BORROW_OWN_NORMAL_DETAIL: 12,
  // 银行借款 XX银行参与借款详情
  COMPANY_BORROW_JOIN_DETAIL: 13,
  // 银行借款 xxx分行参与借款详情
  COMPANY_BORROW_BRANCH_JOIN_DETAIL: 14,
  // 租赁融资 xx公司及子公司租赁融资详情
  LEASE_FINANCE_GROUP_COMPANY: 15,
  // 租赁融资 XX公司租赁融资详情
  LEASE_FINANCE_NORMAL_DETAIL: 16,
  // 租赁融资 xx公司参与租赁融资详情
  LEASE_FINANCE_JOIN_DETAIL: 17,
  // 信托融资 xx公司及子公司信托融资详情
  TRUST_FINANCE_GROUP_COMPANY: 18,
  // 信托融资 XX公司信托融资详情
  TRUST_FINANCE_NORMAL_DETAIL: 19,
  // 信托融资 xx公司参与信托融资详情
  TRUST_FINANCE_JOIN_DETAIL: 20,
  // 应收账款融资 xx公司及子公司应收账款融资详情
  ACCOUNT_FINANCE_GROUP_COMPANY: 21,
  // 应收账款融资 XX公司应收账款融资详情
  ACCOUNT_FINANCE_NORMAL_DETAIL: 22,
  // 应收账款融资 xx公司参与应收账款融资详情
  ACCOUNT_FINANCE_JOIN_DETAIL: 23,
  // 股权质押 xx公司及子公司股权质押详情
  PLEDGE_GROUP_COMPANY: 24,
  // 股权质押 xx公司股权质押详情
  PLEDGE_NORMAL_DETAIL: 25,
  // 股权质押 质权人参与质押详情
  PLEDGE_JOIN_DETAIL: 26,
  // 战略投资 公司及子公司参与的融资明细
  STRATEGIC_GROUP_COMPANY: 27,
  // 战略投资 按投资人的明细
  STRATEGIC_DETAIL: 28,
  // 银行授信 银行授信 xx公司及子公司最新授信
  BANK_CREDIT_GROUP_COMPANY: 29,
  // 银行授信 按授信机构查看的详情
  BANK_CREDIT_DETAIL: 30,
  // 上市平台 公司及子公司发行股票详情
  LISTING_PLATFORM_DETAIL: 31,
  STRATEGIC_WITHOUT_SUB_NORMAL_DETAIL: 32,
  ADDITIONAL_STOCK: 35,
};

const groupTitles = Object.keys(SIDE_TYPE).reduce((titles, key) => {
  const k = key.toLowerCase();
  if (k.endsWith('_group_company')) {
    return Object.assign(titles, { [SIDE_TYPE[key]]: '{0}及子公司{1}详情' });
  }
  return Object.assign(titles, { [SIDE_TYPE[key]]: '{0}{1}详情' });
}, {});

export const TITLE_MAP = Object.assign(groupTitles, {
  [SIDE_TYPE.DOMESTIC_BOND_GROUP_COMPANY]: '{0}及子公司境内债券融资',
  [SIDE_TYPE.OVERSEA_BOND_GROUP_COMPANY]: '{0}及子公司境外债券融资',
  [SIDE_TYPE.LISTING_PLATFORM_DETAIL]: '{0}及子公司发行股票详情',
});

// side映射
export const SIDE_MAP = {
  bankBorrow: [
    SIDE_TYPE.COMPANY_BORROW_JOIN_DETAIL,
    SIDE_TYPE.COMPANY_BORROW_GROUP_COMPANY,
    SIDE_TYPE.COMPANY_BORROW_OWN_NORMAL_DETAIL,
    SIDE_TYPE.COMPANY_BORROW_BRANCH_JOIN_DETAIL,
  ],
  companySearch: [SIDE_TYPE.COMPANY_SEARCH],
  companyInfo: [SIDE_TYPE.COMPANY_INFO],
  bondFinance: [
    SIDE_TYPE.OVERSEA_BOND_GROUP_COMPANY,
    SIDE_TYPE.DOMESTIC_BOND_GROUP_COMPANY,
    SIDE_TYPE.OVERSEA_BOND_NORMAL_DETAIL,
    SIDE_TYPE.DOMESTIC_BOND_NORMAL_DETAIL,
  ],
  bankCredit: [SIDE_TYPE.BANK_CREDIT_GROUP_COMPANY, SIDE_TYPE.BANK_CREDIT_DETAIL],
  accountFinance: [
    SIDE_TYPE.ACCOUNT_FINANCE_GROUP_COMPANY,
    SIDE_TYPE.ACCOUNT_FINANCE_NORMAL_DETAIL,
    SIDE_TYPE.ACCOUNT_FINANCE_JOIN_DETAIL,
  ],
  equityPledge: [SIDE_TYPE.PLEDGE_GROUP_COMPANY, SIDE_TYPE.PLEDGE_NORMAL_DETAIL, SIDE_TYPE.PLEDGE_JOIN_DETAIL],
  leaseFinance: [
    SIDE_TYPE.LEASE_FINANCE_GROUP_COMPANY,
    SIDE_TYPE.LEASE_FINANCE_NORMAL_DETAIL,
    SIDE_TYPE.LEASE_FINANCE_JOIN_DETAIL,
  ],
  listingPlatform: [SIDE_TYPE.LISTING_PLATFORM_DETAIL],
  strategicInvestment: [
    SIDE_TYPE.STRATEGIC_GROUP_COMPANY,
    SIDE_TYPE.STRATEGIC_DETAIL,
    SIDE_TYPE.STRATEGIC_WITHOUT_SUB_NORMAL_DETAIL,
  ],
  trustFinance: [
    SIDE_TYPE.TRUST_FINANCE_GROUP_COMPANY,
    SIDE_TYPE.TRUST_FINANCE_NORMAL_DETAIL,
    SIDE_TYPE.TRUST_FINANCE_JOIN_DETAIL,
  ],
  additionalStock: [SIDE_TYPE.ADDITIONAL_STOCK],
};

export const SIDE_COMPONENTS = [
  // 银行借款
  'bankBorrow',
  // 搜索
  'companySearch',
  // 公司信息
  'companyInfo',
  // 债券融资
  'bondFinance',
  // 银行授信
  'bankCredit',
  // 应收账款融资
  'accountFinance',
  // 股权质押
  'equityPledge',
  // 租赁融资
  'leaseFinance',
  // 上市平台
  'listingPlatform',
  // 战略投资
  'strategicInvestment',
  // 信托融资
  'trustFinance',
  // 定向增发
  'additionalStock',
];
