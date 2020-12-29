import { isFunc } from '@/utils/utils';

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    size: {
      type: Number,
      default: 30,
    },
    distance: {
      type: Number,
      default: 200,
    },
    loadData: Function,
  },
  data() {
    return {
      isLoading: false,
      page: 1,
      currentData: this.data.slice(0, this.size),
      isReachBottom: false,
    };
  },
  computed: {
    chunkLength() {
      return Math.ceil(this.data.length / this.size);
    },
  },
  methods: {
    currentLoadData() {
      if (this.page < this.chunkLength) {
        this.currentData = this.currentData.concat(this.data.slice(this.page * this.size, ++this.page * this.size));
      } else {
        this.isReachBottom = true;
      }
      this.isLoading = false;
    },
    handleScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollHeight - clientHeight - scrollTop <= this.distance && !this.isLoading) {
        this.isLoading = true;
        if (!this.isReachBottom) {
          /* eslint-disable */
          isFunc(this.loadData)
            ? this.loadData(
                () => (this.isLoading = false),
                () => (this.isReachBottom = true)
              )
            : this.currentLoadData();
          /* eslint-enable */
        }
      }
    },
  },
  render(h) {
    return h(
      'div',
      {
        on: {
          scroll: this.handleScroll,
        },
      },
      this.$scopedSlots.default({ data: this.currentData })
    );
  },
  watch: {
    data() {
      this.currentData = this.data.slice(0, this.size);
    },
  },
};
