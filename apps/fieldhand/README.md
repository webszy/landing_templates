# Fieldhand — CopyAnything 克隆

来源：https://fieldhand-template.modulify.website/

## 运行

从 monorepo 根目录运行 `npm run dev:fieldhand`。也可以在当前应用目录执行以下命令。环境要求见根目录 README，无额外 npm 依赖。

```sh
npm run dev
```

打开 http://localhost:3003/ 。可通过环境变量 `PORT` 更改端口。

```sh
npm run check
npm run build
```

`dist/` 为可直接托管的静态站点。请从站点根路径提供服务。

## 文件

- `targets/fieldhand/clone/`：运行时源码，包含全部本地页面。
- `targets/fieldhand/clone/assets/fixes.js`：从原始页面行为恢复的原生 JavaScript。
- `targets/fieldhand/clone/assets/shared/`：按内容哈希去重的原站字体、图片与 CSS。
- `routes.json`：已捕获的内部页面列表。
- `asset-manifest.json`：原素材路径至去重素材的映射。
- `qa/`：桌面和移动端截图、布局差异、交互与动画检查结果。
- `targets/`：CopyAnything 捕获结果与工作流凭据。

## 范围

首页与法律页面。恢复计算器、7/30/90 天仪表盘、图表指针与键盘提示、审批及撤销演示、注册弹窗、滚动渐入和视差。

表单在本地校验并给出预览提示，不向原站提交数据，也不创建真实账户。

审核与验证状态见 `QA.md`。
