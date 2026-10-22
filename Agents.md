# 本仓库的代理工作说明

## CopyAnything 是什么

CopyAnything（Copy Anything）是 Pingfusi 的网站复刻工作流，命令行入口是 `pingfusi`，不是名为 `copyanything` 的独立命令。流程是：捕获原站真实 DOM、样式和资源 → 生成本地副本 → 数值与交互校验 → 发布审核草稿 → 独立真人对照审核。

本文依据当前本机已安装工具编写。命令与门禁可能随版本变化；每次执行前以 `pingfusi --help`、`pingfusi next <name>` 和安装目录中的文档为准，不要照抄旧 QA 中的版本限制。

## 开始前

1. 涉及复刻网站时，读取并遵循已安装的 `pixel-perfect-clone` skill；修复已有副本时按任务选择 `fix-with-pingfusi`。
2. 检查环境并定位工具文档：

   ```sh
   pingfusi doctor
   pingfusi where
   pingfusi --help
   ```

3. 将 `pingfusi where` 输出的目录记作 KIT，阅读：
   - `KIT/docs/LAUNCH-PROMPT.md`
   - `KIT/docs/CLONE-ANY-SITE.md`
   - `KIT/docs/PLAYBOOK.md`
   - `KIT/tools/RUNBOOK.md`
   - `KIT/docs/LEARNINGS.md`
   - `KIT/docs/WORKFLOW.md`
4. doctor 有必需项失败时，按输出修复。缺少登录时请用户运行 `pingfusi setup`，不能伪造或跳过独立审核。
5. 明确原站 URL、目标名称和视口宽度。名称用简短 slug；默认宽度为 1728px。原站和副本必须使用一致的宽度、高度和 DPR。

## 本仓库的目录规则

- 这是 npm Workspaces 仓库，每个站点位于 `apps/<app>/`，不要在仓库根目录散落新站点的 `targets/`。
- **先进入应用目录，再执行 pingfusi 命令**：工具以当前目录为基准创建和查找 `targets/<name>/`。
- 运行时源码一般位于 `apps/<app>/targets/<name>/clone/`；`dist/` 是构建产物，不作为主要修改源。
- 捕获证据、工作流凭据和审核记录留在对应的 `targets/<name>/`。不要为通过门禁而修改证据或删掉失败记录。
- 多页面和移动端可使用独立 target，沿用应用现有命名与路由组织；不可把仅首页通过描述为全站通过。
- 新应用需有唯一的 workspace 包名及 `dev`、`build`、`check` 脚本，参考相邻应用与根目录 README。

## 新建复刻的基本流程

以下以应用 `example`、target `example` 为例；替换名称和 URL，示例不是跳过中间门禁的批处理脚本。

```sh
# 从仓库根目录开始
mkdir -p apps/example
cd apps/example

# 省略宽度时使用工具默认值
pingfusi new example https://www.example.com/ 1728
pingfusi status example
pingfusi advance example target

# 默认使用工具自己的不可见 Chrome，捕获稳定后的页面
pingfusi capture-run example
pingfusi capture-build example

# clone 存在后，auto 默认会测量原站与副本两侧
pingfusi capture-run example
pingfusi status example
pingfusi next example
```

必须通过捕获生成副本，不凭截图重新手写近似页面。保留捕获的字体、图片、SVG、样式和动画参数，将运行所需素材本地化。修复交互时依据原站捕获机制与测量值，不猜数值；重新 capture-build 前先保存自定义修复，并按 RUNBOOK 使用修复注入机制，避免覆盖手工修改。

### 按门禁推进

当前 CLI 的阶段顺序：

```text
target → assets → measure → build → visual → coverage → strict → behavior → review → done
```

每个阶段均先取得实际证据，再执行：

```sh
pingfusi gate example <phase>
pingfusi advance example <phase> --evidence "本阶段的实际证据说明"
pingfusi status example
pingfusi next example
```

`<phase>` 替换成具体阶段名，不要原样执行。`gate` 是只读校验，`advance` 在门禁通过后写入凭据。老文档可能把审核阶段写作 `reviewer`；以安装版本的 help、status 和 WORKFLOW 为准。

### 捕获失败与交互验证

- 页面必须完成滚动加载并稳定；交互式捕获中 `pxScrollSettle()` 返回 `stable:false` 时停止本次捕获，先解决未稳定原因。
- 只有 `capture-run` 明确提示机器人拦截、Chrome 缺失或探针拒绝等原因时，才按其错误信息和 RUNBOOK 切换交互式捕获：`pingfusi capture open example` → 在页面执行文档规定的 `pxCaptureAllPhased(...)` → `pingfusi capture pull example --all`。sink 地址取自命令输出，不编造。
- 生成后按 RUNBOOK 运行 `clone-lint`，排除空挂载点、冻结的 reveal 和误捕获的自动化浮层。
- 交互发现需要页面可见状态；自动化标签页长期 hidden 时，使用工具自带 Chrome，不反复尝试隐藏标签页：

  ```sh
  pingfusi behavior-capture example
  pingfusi behavior-worksheet example
  pingfusi next example
  ```

- 按需在 `targets/example/behavior-opts.json` 指定跑马灯、hover 等触发对象，具体结构查当前工具文档。验证菜单、链接、表单、悬停、滚动触发和其他实际存在的行为。

### 动画处理

`capture-build` 默认执行 motion pass。保留 `motion-doc.json`、`motion-pass.json`、`motion-items.json` 等凭据；需要重跑时使用 `pingfusi motion pass example`。

困难动画由 `pingfusi next example` 路由到具体机器命令，例如 `motion verify-introspected`，或 `motion sample` → `motion apply-sampled` → `motion verify-sampled`。滚动、指针、canvas、WebGL 动效按工具指定的 trace/loop/export 流程处理。motion 凭据本身是信息与警告，不单独构成审核轮次或阶段门禁；仍需在页面审核中确认视觉表现。不要将时间/动画差异塞进仅用于非时间性交互状态的 `behavior-deviations.json`。

## 独立审核与完成标准

审核草稿会上传到 Pingfusi，审核由服务上的独立真人进行，可能消耗 credits（默认 1 个结果；每个已完成结果 1 credit）。执行实际复刻任务时向用户说明审核方式；本说明文件的编写不需要提交审核。

```sh
pingfusi draft example push
pingfusi review example file --context "页面用途，以及需要重点对照的区域"
```

按反馈修复后，重新捕获、运行受影响门禁、推送新草稿，再提交：

```sh
pingfusi draft example push
pingfusi review example file --changelog "具体说明本轮修复了什么"
```

- 原站与副本的对照走正式 review；不直接调用审核 MCP 绕过 CLI 记录。
- 默认使用 hosted draft。其他独立静态构建使用 `pingfusi publish <built-dir>`；真正依赖实时后端时才考虑 tunnel。
- 提交命令会等待反馈；pending 时继续其等待流程，不重复建轮次。已有审核记录先读取再决定下一步。
- 发现 `STALLED` 时先执行 `pingfusi next example`；布局问题可用 `pingfusi assist example --compare` 获取对照诊断，不能盲目重复修补。
- 门禁失败时先尝试错误输出指定的补救。确实无法解决的环境限制可用 `pingfusi advance example <phase> --blocked "尝试及失败原因"` 如实记录，再依工具允许的流程继续审核；blocked 不等于通过。
- 禁止使用 `--force`，禁止自行填写真人批准结论。服务登录或提交失败时明确报告原因，不能以自审代替。
- **完成标准是 `pingfusi gate example done` 返回 0**，包含真实的独立审核批准。仅生成页面、机器检查全绿、提交审核或历史批准都不证明当前版本已完成。

## 恢复已有任务与交付

进入对应 `apps/<app>/`，先运行 `pingfusi status <name>` 和 `pingfusi next <name>`，完整读取 target 下的 `NOTES.md`、存在的 `FINDERS.md`、`review-qa.json` 和 workflow 记录；根据磁盘凭据恢复，不覆盖现有捕获重来。

保留每轮问题、修复和未解决项，更新应用的 README / QA。交付注明源码路径、预览地址、实际检查结果及审核状态；未通过的阶段直接写明，不能把旧版工具限制当作本次校验通过的依据。

仓库级命令在根目录运行，修改单个应用优先只检查和构建该 workspace：

```sh
npm ci
npm run dev -- example
npm run check --workspace=@templates/example
npm run build --workspace=@templates/example
```

上述 npm 命令以应用已经正确配置 workspace 为前提。开发端口通常在 3100–3200 随机分配，以启动日志为准；可用应用自己的 `PORT` 配置固定端口。构建和语法检查不替代 CopyAnything 的视觉、交互及独立审核。
