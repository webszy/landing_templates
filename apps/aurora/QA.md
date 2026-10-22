# Aurora QA — 2026-10-20

- CopyAnything / Pingfusi 0.17.1，原站及副本测量视口 1728×982，DPR 2。
- visual：203 comparisons，0 fails；coverage：23 painted leaves 全部覆盖；strict：0 structural deltas。
- clone-lint：clean。静态叶子门禁无法认证 WebGL 画布本身的视觉忠实度。
- `npm run check --workspace=@templates/aurora` 和 `npm run build --workspace=@templates/aurora` 通过。
- `qa/browser.json`：WebGL canvas 3456×1964；五种模式点击后的 aria-pressed 为 true；Tune 面板截图保存；390×844 下无横向溢出；无 pageerror / HTTP 错误响应。
- WebGL trace：348 draw calls / 344 frames、1 track；没有可导出的 DOM animation channel。原站 GSAP 与 shader 代码直接本地化，不猜动画参数。
- behavior 门禁 **blocked**：两侧独立启动采样的 eyebrow 入场时长超出容差；mode/Tune 的 synthetic hover 在原站没有明确变化，无法由探针认证。已尝试默认稳定时间及两侧 5000ms 稳定时间，原始结果保留。未使用 --force 或伪造通过结果。
- hosted draft：https://pingfusi.com/d/LcR-XS8zdXkU （临时托管，具体到期见 targets/aurora/draft.json）。
- 独立真人审核提交失败：`Insufficient credits (0)`。未创建有效审核轮次，未获批准；`review` 和 `done` 未通过。需用户在 https://pingfusi.com/dashboard 补充 credits 后继续正式审核，不能由自审替代。

复核（先进入 apps/aurora）：

```sh
pingfusi status aurora
pingfusi gate aurora visual
pingfusi gate aurora coverage
pingfusi gate aurora strict
pingfusi gate aurora behavior
```

检查代码在 `scripts/verify-browser.cjs`，其中 Playwright 路径针对本机安装位置，其他机器需调整。不要把旧截图或旧审核状态当作后续修改的校验。
