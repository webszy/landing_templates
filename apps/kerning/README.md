# Kerning — CopyAnything 克隆

来源：https://kerning-template.modulify.website/

## 运行

从 monorepo 根目录运行 `npm run dev:kerning`。也可以在当前应用目录执行以下命令。环境要求见根目录 README，无额外 npm 依赖。

```sh
npm run dev
```

打开 http://localhost:3002/ 。可通过环境变量 `PORT` 更改端口。

```sh
npm run check
npm run build
```

`dist/` 为可直接托管的静态站点。请从站点根路径提供服务。

## 文件

- `targets/kerning/clone/`：运行时源码，包含全部本地页面。
- `targets/kerning/clone/assets/fixes.js`：从原始页面行为恢复的原生 JavaScript。
- `targets/kerning/clone/assets/shared/`：按内容哈希去重的原站字体、图片与 CSS。
- `routes.json`：已捕获的内部页面列表。
- `asset-manifest.json`：原素材路径至去重素材的映射。
- `qa/`：桌面和移动端截图、布局差异、交互与动画检查结果。
- `targets/`：CopyAnything 捕获结果与工作流凭据。

## 范围

首页及 15 个内部页面，含招聘流程、成功案例、Scout 介绍与申请、博客及 6 篇文章、申请页、登录说明、隐私和条款。恢复移动菜单、FAQ、响应式演示画布、滚动堆叠、步骤指示和照片展开动画。

表单在本地校验并给出预览提示，不向原站提交数据，也不创建真实账户。

审核与验证状态见 `QA.md`。
