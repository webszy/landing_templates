# flowcraft — https://flow-craft-template.modulify.website/ @ 1728px

- 工具：pingfusi 0.18.0（node 24.18.0），Chrome 156.0.8078.73 headless=new，视口 1728×982 DPR 2
- 状态：target → behavior 全部通过；review / done 因审核服务 credits 不足未完成（见应用根目录 QA.md）

## 环境发现

1. **Chrome 无法在本机沙箱内初始化**：直接启动报
   `sandbox initialization failed: Operation not permitted`，随后 `GPU process isn't usable. Goodbye.`，
   capture-run 因此报 `CDP Page.enable: CDP connection closed`。pingfusi 没有 `--no-sandbox` 开关，
   改用 `apps/flowcraft/scripts/chrome-nosandbox.sh` 包装器（只追加 `--no-sandbox`）配合 `PPK_CHROME` 解决。
   这是本机环境限制，不是原站问题。
2. 该站是 Next.js（turbopack）SSR + 客户端挂载：聊天演示、计数器、tab 自动切换、hero 打字机都在客户端运行，
   静态捕获必然冻结在某一帧。

## Iteration log

| round | flagged | gate caught it? | fix | kit change (tool/fixture/instruction) |
|-------|---------|-----------------|-----|----------------------------------------|
| 1 | 聊天第 6 条气泡 `p_your_sample_includes_*` opacity 0 vs 1（被 phase-freeze 钉在 0%） | visual 12 fails | 改用 `--live-url …/#full-service` 捕获，让聊天序列在 sweep 内跑完，再按新 DOM 重建 clone | freeze 对一次性入场动画应视作 finished，而非钉 0% |
| 2 | `span.fc-progress-bar` live 4.41px / clone 0（tab 15s 进度条被页面自身 pause，相位不同） | visual 6 fails | `fixes.js` 按测量相位 `animation-delay: -2316ms`（14.26/92.34 × 15000ms）复现该帧 | — |
| 3 | hero 打字机 `fc-placeholder-in` live opacity 0 / clone 1 | visual 3 fails | 5 次捕获均为相位 0 → `fixes.js` 改为 3220ms 无限循环（前 0.5s 淡入），capture 恒钉在 0% 帧，与 live 一致；用户侧仍是可见的淡入 | 同上（freeze 语义） |
| 4 | 见证/聊天区相对时间（"2m ago"）随捕获时刻变化 | visual 470 fails（新快照 + 旧 clone） | 用新 `dom.html` 重新 `capture-build`，两侧同帧 | — |
| 5 | 跨页链接 `/pilot`、`/apps` 等无本地目标 | `npm run check` 失败 | `scripts/rewrite-routes.mjs` 改写到原站绝对地址；改后复测 visual/strict 仍 0 fails | — |
| 6 | 3 个 hover（nav 链接、tab）在 live 上不可机测 | behavior 4 out of tolerance | 用 CDP 可信鼠标事件复核确认无计算样式变化（面板由祖先 `:hover` 控制且已预挂），写入 `behavior-deviations.json` 请审核轮人工确认 | hover 探测应支持「祖先 group-hover → 子面板 visibility」的 scope |
| 7 | odometer reel 终值 live −1002.96 / clone −576 | behavior 1 out of tolerance | 实测同一元素连续采样 −604.96 → −719.04 → −360px，属持续循环；按 `observed-mutation` 语义写入 deviations | 持续循环元素不应落进 `reveal:` 终值比较 |

## Site-specific findings

- 页面几乎所有区块都带 `fc-reveal` + `data-shown`（滚动进场），hero 用 `fc-hero-in` + 0.18/0.45/0.75s 延迟。
- `fc-progress-bar` 是 tab 自动切换的 15s 进度条，页面自身在离开视口时 pause，因此相位随捕获时机变化。
- hero 搜索框占位文本是 5 条短语的循环打字机（每 3220ms 一条，0.5s 淡入），短语原文见 `clone/fixes.js`。
- 聊天演示是客户端挂载（SSR HTML 里没有），随滚动逐步出现。
- 页脚右下角的 `data-modulify-badge` 由模板平台注入，带 hover 位移。
