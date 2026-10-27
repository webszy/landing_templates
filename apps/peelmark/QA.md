# Peelmark QA

- CopyAnything / Pingfusi 0.18.0，原站及副本测量视口 1728×982，DPR 2。
- visual：8938 comparisons，0 fails；coverage：745 painted leaves 全部覆盖；strict：0 structural deltas。
- clone-lint：无 FAIL；21 个 canvas 在去掉脚本后会空白，已用本地化原站 Next 运行时恢复。
- behavior：72 live behaviors，67 在容差内复现，5 条写入 `behavior-deviations.json`（caret-blink 相位、合成 hover 无法触发的导航/贴纸/风格键）；18 declared 中 1 条复现、17 条已说明。
- motion：caret-blink 与 skeleton-sheen `verify-introspected` 通过（±1ms / ±0.01）。
- 本地预览：http://127.0.0.1:3141/ 。真实指针下导航 hover 变色；Sparkle radio 会给贴纸加闪点。
- `npm run check --workspace=@templates/peelmark` 与 `npm run build --workspace=@templates/peelmark` 通过。
- hosted draft：https://pingfusi.com/d/h1SviAyv1u2g （约 2026-10-29 到期，见 `targets/peelmark/draft.json`）。
- 独立真人审核提交失败：`Insufficient credits (0)`。未创建有效审核轮次，未获批准；`review` 和 `done` 未通过。需在 https://pingfusi.com/dashboard 补充 credits 后再跑 `pingfusi review peelmark file`。不能由自审替代。

复核（先进入 `apps/peelmark`）：

```sh
pingfusi status peelmark
pingfusi gate peelmark visual
pingfusi gate peelmark coverage
pingfusi gate peelmark strict
pingfusi gate peelmark behavior
```
