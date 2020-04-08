import Vue from 'vue';

export const store = Vue.observable({
  scrollLeft: 0,
  scrollTop: 0,
  widthTotal: 0,
});
export const setScrollLeft = value => {
  store.scrollLeft = value;
};

export const setScrollTop = value => {
  store.scrollTop = value;
};

export const setWidthList = list => {
  store.widthTotal = list.reduce((total, width) => total + width, 0);
};
