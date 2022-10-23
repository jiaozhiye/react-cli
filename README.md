## 说明

- EP 管理系统，车厂上下游互通及厂店一体化建设的集成解决方案。

## 前序准备

- 本地安装 nodejs 请使用 v14.18.0 及以上版本，建议使用 nvm 管理
- 建议使用 yarn 管理 npm 依赖
- 编译器统一使用 VScode，必要的插件列表：
  - Vetur
  - Prettier
  - EditorConfig
  - ESLint

## 安装

### 使用 yarn 或 npm 安装

```bash
# 安装依赖
$ yarn install 或 npm install

# 启动本地服务
$ npm run dev

# 发布，构建生产环境代码
$ npm run build
```

## 微前端

### 微应用(子系统) + 微模块(业务模块)

### 主机应用充当路由注册中心和分发调度的角色，来调用各子应用页面

| 应用名 | 说明           | 域名               |
| ------ | -------------- | ------------------ |
| app    | 主机应用(中台) | https://www.faw.cn |
| dms    | DMS 子应用     | https://dms.faw.cn |
| tds    | TDS 子应用     | https://tds.faw.cn |

1. 架构维护 config/app.conf.js => 定义当前应用
2. 架构维护 config/env.conf.js => 注册子应用
3. 架构维护 src/api/fetch.ts => 设置 header 请求头

## 自定义主题

```bash
# config/index.js
primaryColor: '#1890ff'
```

## 目录结构

```
├── build                      # 编译构建
├── config                     # 应用参数
├── static                     # 静态资源
├── public                     # 公共资源
│   ├── index.html             # Html 入口
│   ├── favicon.ico            # favicon 图标
├── src                        # 源代码
│   ├── api                    # ajax 封装
│   ├── assets                 # 静态资源
│   ├── charts                 # Echart 图表
│   ├── components             # 公用组件
│   ├── config                 # 全局配置
│   ├── hoc                    # 高阶组件
│   ├── hooks                  # hooks
│   ├── icon                   # 图标
│   ├── layout                 # 布局
│   ├── locale                 # 国际化
│   ├── mock                   # 模拟数据
│   ├── modules                # 业务子模块
│   ├── pages                  # 非业务页面
│   ├── router                 # 路由
│   ├── store                  # 状态管理
│   ├── utils                  # 公共方法
│   ├── App.tsx                # 根组件
│   ├── index.ts               # 应用入口
│   └── typings.d.ts           # Ts 声明文件
├── babel.config.js            # babel 配置
├── .browserslistrc            # 浏览器兼容配置
├── .editorconfig              # EditorConfig 配置
├── .env.dev                   # 开发环境环境常量
├── .env.prod                  # 生产环境环境常量
├── .eslintignore              # Eslint 忽略清单
├── .eslintrc.js               # Eslint 校验规则
├── .gitignore                 # git 忽略清单
├── .npmrc                     # npm 镜像地址
├── .postcssrc.js              # postcss 配置
├── .prettierrc                # prettier 配置
├── README.md                  # README.md
├── package.json               # package.json
├── yarn.lock                  # 包版本锁定
└── tsconfig.json              # Ts 配置
```

欢迎访问个人 [github](https://github.com/jiaozhiye) 主页.
