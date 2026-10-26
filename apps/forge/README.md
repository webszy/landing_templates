# @templates/forge

克隆 [forge-template.modulify.website](https://forge-template.modulify.website/) 的静态落地页，用 **CopyAnything / Pingfusi** 工作流产出：真实字体与图标自托管、逐元素像素比对、交互与动效按实测复现。

## 命令

```bash
npm run dev:forge        # 本地预览（自动选端口，默认 127.0.0.1）
npm run build -w @templates/forge   # 把 targets/forge/clone 复制到 apps/forge/dist
npm run check -w @templates/forge   # 语法检查
```

`npm run dev`（仓库根）会自动发现本应用，因为它有 `dev` 脚本；也可以 `npm run dev -- forge` 只启动它。端口可用 `FORGE_PORT` 覆盖。

## 目录

| 路径 | 内容 |
| --- | --- |
| `targets/forge/clone/` | 克隆产物（`index.html` + `assets/` + `fixes.js`），由 `pingfusi capture-build` 生成 |
| `targets/forge/dom.html` | 原站水合后的 DOM 快照，构建的输入 |
| `targets/forge/live.json` / `clone.json` | 两侧逐元素测量快照 |
| `targets/forge/coverage.json` | 已绘制的叶子清单，coverage 门禁按它核对 |
| `targets/forge/fixes.js` | 复现 JS 驱动行为（状态部件节拍、watch 进度条） |
| `targets/forge/behavior-deviations.json` | 行为差异的逐条说明 |

## 工作流状态

`pingfusi status forge` 查看。机器门禁：target / assets / measure / build / coverage / behavior 通过；visual 与 strict 以 **environment-blocked** 记录（状态部件的 1350ms 重播节拍在相位冻结之后才触发，两侧都在动画中途被采样，原站自身两次捕获相差 0.06 透明度，与副本差异同量级）。review 需人工/服务侧裁决。

## 复现要点（来自实测，勿凭猜测改）

- **状态部件**：每 1350ms 整行重播 520ms 入场动画 + 图标 300ms 交叉淡入；文本三条消息在捕获窗口内不推进。
- **watch 进度条**：7s 线性填充，进入视口才跑、离开视口暂停；暂停态是原站自身行为，冻结会保留它。
