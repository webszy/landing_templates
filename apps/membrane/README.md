# Membrane — Copy Anything 克隆

来源：https://membrane-template.modulify.website/

独立静态单屏模板。DOM、CSS、Playfair Display/Geist 字体、头像与装饰图标来自原站捕获。Canvas 的 50×30 网格、波动、鼠标推挤、按压增强与内容入场效果，按原始页面脚本算法恢复。

## 本地复测

在仓库根目录执行：

```sh
npm run check --workspace=@templates/membrane
npm run dev:membrane
```

打开 http://127.0.0.1:3005/ 。也可用 `npm run dev -- membrane`；修改端口可用 `MEMBRANE_PORT=4005 npm run dev -- membrane`。

1. 刷新页面，检查网格在约 2 秒内淡入，文本、徽章和按钮依次进入。
2. 移动鼠标，检查附近网格受到推挤并发亮；按住鼠标后影响范围和形变增强；松开并移出后逐渐回弹。
3. 悬停标题中的 “invisible” 和两个按钮，检查原始 CSS 悬停样式。
4. 对比原站 1728×982、768×1024、390×844 和 375×667 的布局、换行、图标和网格尺寸；缩放窗口后画布应重新适配。
5. 检查控制台与 Network，无素材 404、无原站分析请求；断开外网后刷新，字体、头像与网格仍可显示。

原站两个 CTA 链接均为 `#`，克隆保留该占位行为。原站网格监听鼠标事件；本次没有增加触摸交互。

需要构建时执行：

```sh
npm run build --workspace=@templates/membrane
```

`dist/` 可独立托管，须作为站点根目录提供服务。

## 文件与验证边界

- `targets/membrane/clone/`：运行时源码与本地素材，交互位于 `fixes.js`。
- `targets/membrane/evidence/`：原始页面脚本、来源及参数，不会进入 `dist/`。
- `targets/membrane/capture-run.json`、`dom.html`、`live.json`：原站捕获与测量证据。
- `asset-manifest.json`：素材路径、字节数和 SHA-256。
- `QA.md`：实际检查结果及待复测事项。

本次没有编译、启动或浏览器运行克隆页面；没有发布草稿或发起远程人工审核。
