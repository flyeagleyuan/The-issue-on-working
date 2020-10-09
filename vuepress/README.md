### 默认主题配置
---
home: true
heroText: Hero 标题
tagline: Hero 副标题
actionText: 快速上手 →
actionLink: /zh/guide/
features:
  - title: 简洁至上
    details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
  - title: Vue驱动
    details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
  - title: 高性能
    details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2020 flyeagleyuan
---

### GIT 提交规范

**信息提交格式为**

> \<commit-type\>[(\<scope\>)]: \<commit-msg\>

- `commit-type`：必填项，为对应提交类型，这里约定了`feat`,`fix`,`docs`,`style`,`refactor`,`perf`,`test`,`build`,`ci`,`chore`,`types`,`wip`,`revert`这些类别，具体代表的含义可以查看下面的*提交类别*说明。
- `scope`：可选必填项，用于描述改动的范围，如果一次 commit 修改多个模块，建议拆分成多次 commit，以便更好追踪和维护。
- `commit-msg`: 必填项，为提交信息的简要说明。
- 禅道号: 必填项，每一次提交必须对应一个禅道号，如果某次修改没有禅道号对应，请使用`#000`。需要注意的是，禅道号必须使用`#`开头，并且一个提交只能写一个禅道号，在有多个禅道 bug 的情况下，请将不同的 bug 进行拆分提交。

**提交示例**

```bash
# 在F9模块添加一个新功能
git commit -m "feat(f9): F9中添加融资图谱模块 (#123)"

# 不指定具体模块
git commit -m "fix: 修复xxx不显示问题 (#666)"

# 当没有禅道号对应时
git commit -m "fix: xxx修复 (#000)"
```


**提交类别**

| 类别       | emoji | 含义                                                  |
| ---------- | ----- | ----------------------------------------------------- |
| `feat`     | ✨    | 新功能                                                |
| `fix`      | 🐛    | 修复 bug                                              |
| `docs`     | 📝    | 仅仅修改文档，比如 README, CHANGELOG, CONTRIBUTE 等等 |
| `style`    | 🎨    | 不改变代码逻辑 (仅仅修改了空格、格式缩进、逗号等等)   |
| `ui`       | 💄    | 样式调整                                              |
| `refactor` | ♻️    | 重构（既不修复错误也不添加功能）                      |
| `perf`     | ⚡️   | 优化相关，比如提升性能、体验                          |
| `test`     | ✅    | 增加测试，包括单元测试、集成测试等                    |
| `build`    | 👷    | 构建系统或外部依赖项的更改                            |
| `ci`       | 💚    | 自动化流程配置或脚本修改                              |
| `chore`    | 🔩    | 非 src 和 test 的修改，例如构建过程或辅助工具的变动   |
| `types`    | 🏷️    | 添加或更新类型                                        |
| `wip`      | 🚧    | 开发中                                                |
| `revert`   | ⏪    | 恢复先前的提交                                        |


