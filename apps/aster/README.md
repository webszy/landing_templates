# Aster — Copy Anything 克隆

来源：https://aster-template.modulify.website/

独立静态订阅页，保留原站的布局、字体、背景视频、标题逐字翻转与鼠标倾斜、输入框高光、订阅加载和成功状态。原站的订阅也是本地演示；本项目不提交邮箱、不接入真实订阅服务。

## 本地复测

在仓库根目录执行：

```sh
npm run check --workspace=@templates/aster
npm run dev:aster
```

打开 http://127.0.0.1:3004/ 。也可用 `npm run dev -- aster`；修改端口可用 `ASTER_PORT=4004 npm run dev -- aster`。

1. 刷新页面，检查视频自动静音循环播放、标题逐字翻转、正文与表单渐入。
2. 桌面移动鼠标，检查标题随位置倾斜、离开后回正；移动至输入框，检查高光跟随。
3. 空邮箱时按钮禁用；输入无效邮箱后提交，应出现浏览器校验；有效邮箱提交后加载约 1.4 秒，随后显示成功，约 4 秒后清空复位。
4. 对比原站 1728×982、768×1024、390×844 和 375×667 的布局、换行与视频裁切；检查控制台及 Network，确认素材没有 404、没有原站分析或邮箱提交请求。
5. 开启系统“减少动态效果”后刷新，标题和正文应直接可见，鼠标不驱动标题倾斜。

按需构建：

```sh
npm run build --workspace=@templates/aster
```

`dist/` 可以独立托管，须作为站点根目录提供服务。预览服务器支持视频 Range 请求。

## 文件与验证边界

- `targets/aster/clone/`：页面源码和本地素材；编辑交互使用 `fixes.js`。
- `targets/aster/dom.html`、`live.json`、`coverage.json`、`capture-run.json`：Pingfusi 原站捕获与稳定性凭据。
- `targets/aster/evidence/`：原站页面脚本及交互参数出处，不会进入 `dist/`。
- `targets/aster/motion-doc.json`：工具捕获的 CSS 动画；首次加载与指针效果另从原站脚本恢复。
- `QA.md`：实际检查结果及尚待复测事项。

本次只进行原站捕获、静态源码生成和静态检查，没有启动、编译或浏览器运行克隆页面，也没有发布远程草稿或发起人工审核。
