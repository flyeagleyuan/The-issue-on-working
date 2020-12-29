<template>
  <svg>
    <g class="house" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g fill="#FFFFFF">
        <g transform="translate(-13, -13) scale(1.5)">
          <g>
            <path
              d="M8.93449091,0.00267272727 C8.93449091,0.00267272727 8.71030909,-0.00714545455 8.50467273,0.129218182 C8.29030909,0.275945455 0.246490909,6.92394545 0.246490909,6.92394545 C0.246490909,6.92394545 -0.339327273,7.38267273 0.295581818,8.19267273 C0.929945455,9.00321818 1.63303636,8.26085455 1.63303636,8.26085455 L8.92467273,1.83812727 L16.3335818,8.35903636 C16.3335818,8.35903636 16.9875818,8.90558182 17.5935818,8.1534 C18.1979455,7.39194545 17.5341273,6.86503636 17.5341273,6.86503636 L15.3675818,5.07867273 L15.3675818,1.94558182 L12.4194,1.94558182 L12.4194,2.65849091 L9.41285455,0.158672727 C9.41285455,0.158672727 9.21758182,-0.0169636364 8.93449091,0.00267272727 Z"
              id="Fill-1"
            ></path>
            <polygon
              points="1.6038 9.15910909 1.6038 15.0969273 7.55798182 15.1067455 7.55798182 10.1447455 10.2912545 10.1747455 10.2912545 15.0969273 16.2459818 15.1067455 16.2459818 9.16947273 8.93470909 2.77510909"
            ></polygon>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
import d3 from '../d3.lib';
import MindMap from '../map';
import { isUndef, isEmpty, isArray, oneOf, isFunc } from '@/utils/utils';
import { getUrlSearches } from '@/utils/urls';
const { code } = getUrlSearches();

export default {
  name: 'mindMap',
  props: {
    data: {
      type: Object,
      required: true,
    },
    asyncFunction: Function,
  },
  created() {
    this.expandNodes = [];
    this.nodes = {};
    this.$nextTick(() => {
      this.mapOptions = {
        svg: d3.select(this.$el),
        scale: [0.5, 2],
        limit: 10,
        duration: 750,
        svgRate: window.rate * 1.6,
      };
      this.map = new MindMap(this.mapOptions);
      this.map.on('treeNodeClick', this.handleNodeClick);
    });
  },
  methods: {
    async handleNodeClick(node, tree) {
      const data = node.data,
        parent = node.parent;

      if (node.depth === 0) {
        return this.$emit('on-root-click', this.data);
      }

      $(this.$el)
        .find('.flow.hover')
        .forEach(el => $(el).removeClass('hover'));

      const currentTarget = d3.event.currentTarget,
        target = d3.event.target;

      const hasTips = $(target)
        .parents('.svg-box')
        .hasClass('tips');
      if (hasTips) {
        return this.$emit('on-tips-click', node, tree);
      }

      $(currentTarget)
        .find('.flow')
        .addClass('hover');

      if (data._isLeave && !data.plus) {
        this.$emit('on-leave-click', node, tree);
      }

      if (isUndef(data.itcode) || data.plus) {
        const unlimited = data.plus;
        tree.selected = node;

        unlimited && this.expandNodes.push(parent.id);

        const nodes = [];
        tree.nodes.forEach(node => {
          if (oneOf(node.id, this.expandNodes)) {
            node.unlimited = true;
            nodes.push(node);
          }
        });

        tree.toggle(node);
        tree.update();
        tree.render();

        nodes.forEach(node => (node.unlimited = false));
      }
    },
    makeData(data) {
      if (isEmpty(data)) return data;
      if (isArray(data)) {
        const rebuildData = $.extend(true, [], data);
        return rebuildData.reduce((results, node) => results.concat([this._makeData(node)]), []);
      } else {
        const rebuildData = $.extend(true, {}, data);
        rebuildData._isRoot = true;
        rebuildData.itcode = code;
        rebuildData.children = rebuildData.children.reduce(
          (results, node) => results.concat([this._makeData(node)]),
          []
        );
        return rebuildData;
      }
    },
    _makeData(node) {
      const { name: nodeName, tips, symbol, children, childrencount, itcode } = node;
      node._isCategory = isUndef(itcode);
      node._isLeave = !node._isCategory;
      node._isCategory && (node._categoryType = node['cattype']);
      !isUndef(childrencount) && (node._size = childrencount);
      if (tips) {
        node.tips = tips;
        node._hideTips = false;
      }
      if (node._isCategory) {
        const nameLen = nodeName.length,
          halfLen = ~~(nameLen / 2);
        node.name = nodeName.substr(0, halfLen) + '\n' + nodeName.substr(halfLen);
      } else {
        symbol && (node.tags = [symbol]);
        if (itcode) {
          this.nodes[itcode] = node;
        }
      }
      isUndef(children) && (node.children = []);
      if (isArray(children) && children.length > 0) {
        node.children = children.reduce((results, nestedNode) => results.concat([this._makeData(nestedNode)]), []);
      }
      return node;
    },
    renderHome() {
      const $el = $(this.$el);
      $el.find('.node-root image').forEach(el => {
        $(el).wrap($el.find('.house').clone());
      });
    },
  },
  watch: {
    data: {
      immediate: true,
      async handler(data) {
        if (!isEmpty(data)) {
          const {
            data: { returndate: children, pointname },
          } = data;

          const rebuildData = this.makeData({ name: pointname, children });
          if (isFunc(this.asyncFunction)) {
            this.$loading.open();
            await this.asyncFunction(this.nodes, rebuildData);
            this.$loading.close();
          }
          this.map.init(rebuildData);
          this.renderHome();
        }
      },
    },
  },
};
</script>
