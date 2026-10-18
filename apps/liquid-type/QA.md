# Liquid Type 验证记录

日期：2026-10-18。

## 原站证据

- Copy Anything / Pingfusi 0.18.0 独立无界面 Chrome 捕获，视口 1728×982、DPR 2。
- `capture-run.json`：`stable: true`、`imagesPending: 0`，捕获 29 个 painted leaves。
- 原站捕获记录了 10 个无法冻结的 rAF mover，相关 10 个 mark 被工具排除出像素门禁。此排除不是交互验证通过。
- 原始页面脚本保存在 `targets/liquid-type/evidence/original-page.js`；来源、SHA-256 与交互参数记录在 `source.json`。参数来自作者代码，不冒充本地运行测量。
- 已保存 19 个原始素材文件，字体和图片均本地引用。原站分析与框架脚本已从运行页面移除。

## 已执行的静态检查

- `npm run check --workspace=@templates/liquid-type`：通过；预览、构建及交互脚本语法有效，20 个本地引用有效，字体与图片签名有效。
- `clone-lint`：退出 0，无 FAIL；有一个 `dead-canvas` 提示，说明 Canvas 需要脚本绘制。已在 `fixes.js` 中按原站代码恢复绘制，实际画面待运行验证。
- `git diff --check`：通过；工作区入口与锁文件条目一致。
- 未新增 npm 依赖。

## 尚未验证

遵照用户要求，修改后没有编译、启动或浏览器运行克隆页面。`capture-build --no-motion --fixes` 仅生成静态源码并下载原始素材；跳过会探测本地运行页面的自动 motion pass。

未执行：本地截图和像素差异、Canvas 动态效果、鼠标/点击交互、响应式和短屏、浏览器兼容性、远程草稿及独立人工审核。

Pingfusi 只记录 `target`、`assets`、`measure` 的真实门禁结果；`build` 需要本地 `clone.json`，与 `visual`、`coverage`、`strict`、`behavior`、`review`、`done` 一并保留 pending。没有使用 `--force` 或伪造审批。

复测步骤见 README。
