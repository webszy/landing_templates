# Black Plus 克隆验收记录

项目路径：`/Volumes/Development/Templates/blackplus-templates`

本地预览：http://127.0.0.1:4174/
审核草稿：https://pingfusi.com/d/IDvayCRyyqE7

## 自动校验

| 项目 | 结果 |
| --- | --- |
| 桌面 1728 × 982 | 2023 项比较，0 失败；168 个叶元素覆盖完整 |
| 手机 390 × 844 | 1887 项比较，0 失败；155 个叶元素覆盖完整 |
| Strict | 桌面与手机均无未解决差异 |
| 行为 | 39 项原站行为记录，38 项复现通过；2 个弱声明标记有说明 |
| 交互手动检查 | 手机菜单、购物车开关、表单本地成功反馈 |

上述比较不等同于逐像素绝对一致：两个滚动关联的手机图片测量标记因无法冻结而排除，图片仍存在，原始滚动动画已还原。9 个时序候选没有独立 motion receipt，因此不宣称它们的时序已被量化认证。

## 独立审核

CopyAnything / Pingfusi 的审核命令已提交并持续等待服务反馈，尚无审核结论。`review` 和 `done` 尚未通过；不要将自动校验通过解释为最终审核通过。最终结果以 `targets/blackplus/review-qa.json` 和 `pingfusi status blackplus` 为准。

## 范围

交付完整首页及本地静态素材。其他子页面链接指向原站，表单不连接后端。
