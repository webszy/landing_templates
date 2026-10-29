# FlowCraft — CopyAnything clone

原站：https://flow-craft-template.modulify.website/ （单页克隆，测量视口 1728×982 @2x）

在仓库根目录：

```sh
npm run dev -- flowcraft
npm run dev:flowcraft
npm run check --workspace=@templates/flowcraft
npm run build --workspace=@templates/flowcraft
```

实际端口见启动日志（默认 3100–3200 随机，可用 `PORT` 固定）。`dist/` 可独立作为站点根目录部署。

- 源码：`targets/flowcraft/clone/`
- 原始捕获与校验：`targets/flowcraft/`
- 浏览器验证、截图：`qa/`（`qa/clone` 与 `qa/live` 同滚动位置对照）
- 运行逻辑恢复：`targets/flowcraft/clone/fixes.js`（tab 进度条相位 + hero 打字机淡入）

## 结构

页面是 Next.js 站点，捕获后自托管 2 个 CSS、8 个字体、52 个媒体文件，`<script>` 全部剥离，
因此聊天演示、计数器、tab 自动切换等 JS 行为由 `fixes.js` 按测量值复现或已在
`behavior-deviations.json` 中说明。原站只有首页被克隆，跨页链接（`/pilot`、`/apps`、
`/full-service?app=…#showcase` 等）已改写到原站绝对地址，因此不会出现死链：

```sh
npm run rewrite-routes --workspace=@templates/flowcraft
```

重新运行 `pingfusi capture-build flowcraft` 会用捕获的 DOM 覆盖 `index.html`，
之后需要再跑一次 `rewrite-routes`（`fixes.js` 不会被覆盖）。

审核由 Pingfusi 上的独立真人对照原站与托管草稿进行，不是本地自审。当前状态见 `QA.md`。
