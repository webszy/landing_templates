# Onda Studio — CopyAnything clone

项目目录：`apps/onda/`。从 monorepo 根目录运行 `npm run dev:onda`，或在当前应用目录执行以下命令。环境要求见根目录 README。

## 运行

```sh
npm run dev
# http://localhost:3000
# 指定其他端口：PORT=3001 npm run dev
npm run build
```

无需安装依赖。静态发布目录为 `dist/`，源站副本位于 `targets/onda/clone/`。
首页 `/`，联系页 `/contact.html`（本地服务器也支持 `/contact/`）。

## 编辑

- `scripts/interactions.js`：菜单、计数器、滚动揭示、表单校验、环境波纹。
- `scripts/build-effects.cjs`：从捕获的原站绘制模块生成 `fixes.js`。
- 修改交互后运行 `npm run effects && npm run build`。
- `scripts/assemble.cjs`：组合首页及 Contact 页面，处理本地资源路径。
- `targets/onda/`：原始捕获、CopyAnything 校验记录及绘制算法来源。

## 范围与状态

已本地化字体、图片和样式，恢复主要 Canvas 动效、菜单和表单校验。
表单不会发送真实消息，需要自行配置收件后端；有效提交会明确提示此限制。

桌面原有校验：4,620 项视觉比较通过，317 个可见元素覆盖，结构差异为零。
手机原有校验：390px，4,540 项视觉比较通过，313 个元素覆盖。
这些数字验证布局，并不等于所有动画逐帧一致。

CopyAnything 的行为门禁仍因不同采样时刻的动画状态差异而阻塞；独立审核尚未完成。
2026-10-18 迁移后补齐 Contact 专属波纹参数及动态 Canvas 清理，并重新构建。
第三方审核预览上传被自动审批拦截，需用户明确同意上传到 Pingfusi 后继续；本地构建可使用。
