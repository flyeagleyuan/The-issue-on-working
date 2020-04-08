## Vue 多页面脚手架（基于 vue-cli）

### 开发模式

```bash
yarn dev
```

### 打包代码

```bash
yarn build
```

### lint 检查

```bash
yarn lint
```

### 代码分析

```bash
yarn analyz
```

### 打包后仅提交内网服务器

```bash
yarn build && gulp upload
```

### 打包后提交内网并上传 SVN（只提交打包代码）

```bash
gulp checkInUpload
```

**注意**

该脚手架实现了对文件进行缓存控制，即对改动过的文件才会打包出新文件，所以对于线上来说可以实现增量更新。

那么，如果在提交内网时，如果生成了新的文件，之前的文件就相应失效，删除即可。
