# Aster 验证记录

日期：2026-10-18。

## 原站证据

- Copy Anything / Pingfusi 0.18.0 独立无界面 Chrome 捕获，视口 1728×982、DPR 2。
- `capture-run.json`：`stable: true`、`imagesPending: 0`，捕获 76 个 painted leaves；原站无 canvas。
- 原站 CSS、16 个 WOFF2 字体、WebM/MP4 视频与图标已下载。没有重画原站素材。
- 页面脚本的交互参数来源与 SHA-256 记录在 `targets/aster/evidence/behavior-source.json`；原始脚本仅作证据保存，不参与运行。
- 原站脚本没有订阅网络调用，仅使用 1400ms/4000ms 计时器切换状态；克隆保留该演示流程。

## 静态检查

- `npm run check --workspace=@templates/aster`：通过；预览、构建与交互脚本语法有效，22 个本地引用有效，字体与媒体签名有效。
- `node <Pingfusi安装目录>/tools/clone-lint.js apps/aster/targets/aster/clone/index.html`：通过；这是静态扫描结果，不代表浏览器已经运行。
- `git diff --check`：通过。
- npm 已识别 `@templates/aster` 工作区；没有新增 npm 依赖或执行安装。
- Pingfusi `target`、`assets`、`measure` 已记录通过。`build` 门禁要求 `clone.json`（运行本地页面后才能产生），此次保留 pending；没有使用 `--force` 或伪造门禁结果。

## 未执行的验证

遵照用户要求，本次修改后没有编译、启动或运行克隆页面。Pingfusi 的自动 motion pass 使用 `--no-motion` 跳过，保留原始 CSS 动画并在 `fixes.js` 中恢复脚本效果。

尚未完成：本地浏览器渲染、视频播放/Range 请求、移动端与短屏布局、键鼠与表单交互、减少动态效果、像素差异、动态差异、远程人工审核。

Pingfusi `build` / `visual` / `coverage` / `strict` / `behavior` / `review` / `done` 均不声明通过。复测方法见 README。
