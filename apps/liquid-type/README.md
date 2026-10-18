# Liquid Type — Copy Anything 克隆

来源：https://liquid-type-template.modulify.website/

独立静态单屏模板。DOM、CSS、Geist 可变字体和头像来自原站捕获。逐字入场、空闲字重变化、鼠标附近的字重/缩放弹簧、光晕、拖尾和点击冲击波，按原始页面脚本算法恢复。主题按系统深浅色初始化，与原站一致。

## 本地复测

在仓库根目录执行：

```sh
npm run check --workspace=@templates/liquid-type
npm run dev:liquid-type
```

打开 http://127.0.0.1:3006/ 。也可用 `npm run dev -- liquid-type`；修改端口可用 `LIQUID_TYPE_PORT=4006 npm run dev -- liquid-type`。

1. 刷新页面，检查 “Words have weight” 逐字入场，说明、按钮和头像依次进入。
2. 移动鼠标靠近各个字母，检查字重、缩放和光晕的弹性变化，以及光标拖尾；移出页面后恢复空闲状态。
3. 点击页面，检查两层波纹向外扩散，并在经过字母时改变字重和缩放；连续点击应形成多个波纹。
4. 对比原站 1728×982、768×1024、390×844 和 375×667 的布局与标题换行；改变窗口大小后重复鼠标和点击测试。
5. 分别在系统浅色、深色模式下刷新，检查背景、文字、按钮、拖尾和波纹颜色。
6. 检查控制台与 Network，无素材 404、无原站分析请求；断开外网后刷新，字体、头像和交互仍可用。

原站 CTA 按钮没有导航或业务回调，克隆保留按钮视觉效果；按钮上的点击也会像原站一样向页面冒泡并触发波纹。

需要构建时执行：

```sh
npm run build --workspace=@templates/liquid-type
```

`dist/` 可独立托管，须作为站点根目录提供服务。

## 文件与验证边界

- `targets/liquid-type/clone/`：运行时源码与本地素材，交互位于 `fixes.js`。
- `targets/liquid-type/evidence/`：原始页面脚本、来源及参数，不会进入 `dist/`。
- `targets/liquid-type/capture-run.json`、`dom.html`、`live.json`：原站捕获与测量证据。
- `asset-manifest.json`：素材路径、字节数和 SHA-256。
- `QA.md`：实际检查结果及待复测事项。

本次没有编译、启动或浏览器运行克隆页面；没有发布草稿或发起远程人工审核。
