# Black Plus — CopyAnything 克隆

使用 CopyAnything / Pingfusi 捕获并生成的 Black Plus 首页，保留原站样式、字体、图片和动画参数。

## 启动

从 monorepo 根目录运行 `npm run dev:blackplus`。也可以在当前应用目录执行以下命令。环境要求见根目录 README，无额外 npm 依赖。

```sh
npm run dev -- --port 4174
```

打开 http://127.0.0.1:4174/ 。执行 `npm run build` 后，以 `dist/` 为静态发布目录。

## 范围

- 完整首页、响应式布局、原始字体和本地图片。
- 入场、滚动、鼠标视差与卡片倾斜动画。
- 移动菜单、空购物车弹窗、表单成功反馈。
- Features、About、Pricing、Blog 等其他页面链接仍指向原站；这些子页面不包含在本次首页克隆中。
- 表单与原模板一样只显示本地成功反馈，没有邮件或账户后端。

## 文件

- `targets/blackplus/clone/`：可独立托管的页面与素材。
- `targets/blackplus/NOTES.md`：实现依据与已知差异。
- `targets/blackplus/workflow.jsonl`：CopyAnything 校验记录。
- `targets/blackplus/source-scripts/`：用于核对行为的原站公开脚本。
- `scripts/restore-interactions.py`：从捕获脚本还原原始动画及交互。
- `targets/blackplus-mobile/`：手机尺寸对照捕获，不是第二个交付站点。

## 检查

```sh
npm run check
pingfusi status blackplus
pingfusi gate blackplus done
```

最终审核状态以 `pingfusi status blackplus` 和 `review-qa.json` 为准。
