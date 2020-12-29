import { tree, hierarchy } from 'd3-hierarchy';
import { select, selectAll, event as currentEvent } from 'd3-selection';
import { transition } from 'd3-transition';
import { zoom } from 'd3-zoom';

const d3 = Object.assign({}, { tree, hierarchy }, { selectAll, select, currentEvent }, { transition }, { zoom });

Object.defineProperty(d3, 'event', {
  get: () => currentEvent,
});

export default d3;
