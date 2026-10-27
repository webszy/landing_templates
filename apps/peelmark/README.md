# Peelmark — CopyAnything clone

原站：https://peelmark.modulify.website/

在仓库根目录：

```sh
npm run dev -- peelmark
npm run dev:peelmark
npm run check --workspace=@templates/peelmark
npm run build --workspace=@templates/peelmark
```

实际端口见日志。`dist/` 可独立作为站点根目录部署。

- 源码：`targets/peelmark/clone/`
- 原始捕获与校验：`targets/peelmark/`
- 浏览器验证、截图：`qa/`
- 原站 SSR：`source/original.html`
- 运行逻辑恢复：`scripts/restore-runtime.mjs`（需联网；从应用目录运行 `npm run restore-runtime`）

副本保留原站字体、贴纸/乙烯画布、风格切换、乙烯编辑器和 Modulify 徽章。公开原始运行脚本已本地化；未恢复 analytics。SSR 初始根节点用于避免捕获后的 DOM 导致 React hydration recovery。托管草稿不接受路径中的 `~`，恢复脚本会同时改文件名和引用。

重新运行 `pingfusi capture-build peelmark` 会去掉运行脚本，之后需要再跑 `npm run restore-runtime`。

审核由 Pingfusi 上的独立真人对照原站与托管草稿进行，不是本地自审。当前状态见 QA.md。
