module.exports = {
  title: '记录vue源码，让你更懂vue',
  description: '使用了这么长时间得vue，特别想自己写一份源码得分析，便于自己理解，也输出一些东西',
  themeConfig: {
    displayAllHeaders: true,
    sidebarDepth: 2,
    sidebar: [
      { title: '前言', path: '/', children: ['/'] },
      {
        title: '数据变化',
        path: '/changeObserve',
        // sidebarDepth: 2,
        children: ['changeObserve/', 'changeObserve/objectObserve', 'changeObserve/arrayObserve'],
      },
      {
        title: '虚拟DOM',
        path: '/virtualDom',
        children: ['virtualDom/', 'virtualDom/DOMDiff', 'virtualDom/updateSubNode', 'virtualDom/improve'],
      },
      { title: '模板编译', path: '/template', children: ['template/'] },
      { title: '生命周期', path: '/liftCycle', children: ['liftCycle/'] },
      { title: '实例方法', path: '/instanceMethod', children: ['instanceMethod/'] },
      { title: '全局API', path: '/globalAPI', children: ['globalAPI/'] },
    ],
    lastUpdated: 'Last Updated',
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: ['vuepress-plugin-mermaidjs'],
};
