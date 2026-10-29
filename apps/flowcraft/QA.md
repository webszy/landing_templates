# FlowCraft QA

- CopyAnything / Pingfusi 0.18.0（node 24.18.0），原站及副本测量视口 1728×982，DPR 2。
- visual：9922 comparisons，0 fails（4620 marks 因两侧同样的 rAF mover 子树被排除，逐条 receipted）。
- coverage：5382 painted leaves 全部覆盖。
- strict：0 structural deltas。
- clone-lint：clean，无 JS/网络依赖；静态捕获自托管 2 CSS / 8 字体 / 52 媒体。
- behavior：18 live behaviors —— 5 条容差内复现（marquee、placeholder、spin、reel），1 条由 motion receipt 满足，
  4 条写入 `behavior-deviations.json`（3 个合成 hover 不可测 + 1 个持续滚动的 odometer），14 条 declared 全部有据说明。
  两侧均由 kit-owned Chrome 捕获（`documentHidden=false`，rAF 62Hz）。
- `fixes.js`：tab 进度条按测量相位（`animation-delay:-2316ms`，14.26/92.34 × 15s）复现捕获帧；
  hero 打字机按 3220ms 周期 / 0.5s 淡入复现。
- 跨页链接已改写到原站绝对地址（`npm run rewrite-routes --workspace=@templates/flowcraft`），`check` 通过。
- 本地预览：`npm run dev -- flowcraft`（日志给出端口，本次实测 http://127.0.0.1:3164/ ）。
- `npm run check --workspace=@templates/flowcraft` 与 `npm run build --workspace=@templates/flowcraft` 通过；`dist/` 已生成。
- hosted draft：https://pingfusi.com/d/qhRTqOWARySm （约 2026-10-31 到期，见 `targets/flowcraft/draft.json`；已按改写链接后的 `index.html` 重新推送）。
- **独立真人审核提交失败：`Insufficient credits (0)`**（https://pingfusi.com/dashboard ）。未创建有效审核轮次，
  未获批准，`review` 与 `done` 未通过。需补充 credits 后重跑 `pingfusi review flowcraft file`，不能由自审替代。
- 本机 Chrome 无法在沙箱内启动（`sandbox initialization failed`），捕获通过
  `scripts/chrome-nosandbox.sh` 包装器 + `PPK_CHROME` 运行；这是环境限制，与副本无关。

复核（先进入 `apps/flowcraft`）：

```sh
pingfusi status flowcraft
pingfusi gate flowcraft visual
pingfusi gate flowcraft coverage
pingfusi gate flowcraft strict
pingfusi gate flowcraft behavior
```
