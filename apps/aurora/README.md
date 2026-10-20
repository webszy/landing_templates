# Aurora — CopyAnything clone

原站：https://aurora-template.modulify.website/

在仓库根目录：

```sh
npm run dev -- aurora
npm run dev:aurora
npm run check --workspace=@templates/aurora
npm run build --workspace=@templates/aurora
```

实际端口见日志；本次预览为 http://127.0.0.1:3140/ 。`dist/` 可独立作为站点根目录部署。

- 源码：`targets/aurora/clone/`
- 原始捕获与校验：`targets/aurora/`
- 浏览器验证、截图：`qa/`
- 原站 SSR 与参考脚本：`source/`
- 运行逻辑恢复脚本：`scripts/restore-runtime.mjs`（需联网；从应用目录运行 `npm run restore-runtime`）

副本保留原站字体、WebGL shader、GSAP 入场动画、光标响应、Stream/Cascade/Veil/Ember/Dusk 五种预设和 Tune 参数面板。公开原始运行脚本已本地化；未恢复 analytics。SSR 初始根节点用于避免捕获后的 DOM 导致 React hydration recovery，`fixes.js` 顺序载入原始运行脚本。托管不接受 `~` 文件名，恢复脚本同时重写文件名和引用。

捕获构建若重新运行，会移除运行脚本；之后需再次运行 `npm run restore-runtime`。以 `source/original.html` 保存的初始 HTML 和捕获文档对应版本为准，不应混用其他版本。

审核尚未完成。详细状态见 QA.md，不应称为已获 pixel-perfect 最终批准。
