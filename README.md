# Templates monorepo

模板来源：[Modulify Templates](https://modulify.ai/templates)。

使用 npm Workspaces 管理 Aster、Black Plus、Crema、Fieldhand、Kerning、Liquid Type、Membrane 和 Onda Studio 等静态站点。每个应用保留自己的源码、素材、脚本和审核记录。

## 环境与安装

建议使用 Node.js 24.15+（见 `.node-version`）和 npm 12.2.0，其他兼容版本见根目录 `package.json` 的 `engines`。当前使用 npm 12.2.0 生成根目录锁文件。

```sh
npm ci
```

所有应用目前都没有第三方 npm 依赖。依赖与 workspace 链接统一由根目录的 `package-lock.json` 管理。

## 启动

在仓库根目录执行：

迁移前已经启动的预览进程需要先退出，再从新目录启动，才能使用迁移后的文件路径。

```sh
npm run dev              # 同时启动全部站点，Ctrl+C 统一停止
npm run dev -- onda kerning  # 只同时启动指定站点
npm run dev:aster        # Aster 订阅页模板
npm run dev:blackplus    # 单独启动一个站点
npm run dev:crema        # Crema 点单落地页
npm run dev:fieldhand
npm run dev:kerning
npm run dev:liquid-type
npm run dev:membrane
npm run dev:onda
npm run dev:peelmark
```

| 应用 | Workspace | 默认地址 | 构建产物 |
| --- | --- | --- | --- |
| Aster | `@templates/aster` | 随机端口 3100–3200（见启动日志） | `apps/aster/dist/` |
| Black Plus | `@templates/blackplus` | 随机端口 3100–3200（见启动日志） | `apps/blackplus/dist/` |
| Crema | `@templates/crema` | 随机端口 3100–3200（见启动日志） | `apps/crema/dist/` |
| Fieldhand | `@templates/fieldhand` | 随机端口 3100–3200（见启动日志） | `apps/fieldhand/dist/` |
| Kerning | `@templates/kerning` | 随机端口 3100–3200（见启动日志） | `apps/kerning/dist/` |
| Liquid Type | `@templates/liquid-type` | 随机端口 3100–3200（见启动日志） | `apps/liquid-type/dist/` |
| Membrane | `@templates/membrane` | 随机端口 3100–3200（见启动日志） | `apps/membrane/dist/` |
| Onda Studio | `@templates/onda` | 随机端口 3100–3200（见启动日志） | `apps/onda/dist/` |
| Peelmark | `@templates/peelmark` | 随机端口 3100–3200（见启动日志） | `apps/peelmark/dist/` |

所有 dev 命令每次启动都会随机选择 3100–3200 内的端口，占用时自动重试；实际地址见启动日志。

单独启动时可使用 `PORT=4000 npm run dev:onda` 修改端口。同时启动多个应用时，可分别设置 `<应用名大写>_PORT`，避免将同一个 `PORT` 传给所有站点：

```sh
ONDA_PORT=4000 KERNING_PORT=4002 npm run dev
MEMBRANE_PORT=4005 LIQUID_TYPE_PORT=4006 npm run dev -- membrane liquid-type
```

## 检查与构建

```sh
npm run check                                  # 执行全部应用的现有检查
npm run build                                  # 构建全部应用
npm run build --workspace=@templates/kerning    # 仅构建 Kerning
npm run check --workspace=@templates/fieldhand  # 仅检查 Fieldhand
npm run effects --workspace=@templates/onda    # 重新生成 Onda 动效
```

各应用的 `dist/` 都可以独立部署，请分别作为站点根目录托管。页面使用根路径引用资源，每个应用需要独立域名或独立站点根目录。

## 目录

```text
Templates/
├── apps/
│   ├── aster/
│   ├── blackplus/
│   ├── crema/
│   ├── fieldhand/
│   ├── kerning/
│   ├── liquid-type/
│   ├── membrane/
│   └── onda/
├── scripts/
│   └── dev.mjs
├── package.json
└── package-lock.json
```

原目录迁移关系：`blackplus-templates/` → `apps/blackplus/`、`fieldhand-template/` → `apps/fieldhand/`、`kerning-template/` → `apps/kerning/`、`onda-studio/` → `apps/onda/`。

每个应用的运行时源码仍位于其 `targets/<站点名>/clone/`。具体编辑方式与功能范围见各应用 README；历史审核状态见各应用的 QA 文档。迁移保留原始捕获和审核记录，其中的历史路径或截图不代表本次迁移重新完成了视觉审核。

## 添加应用与依赖

新应用放入 `apps/<名称>/`，使用唯一的 `package.json` 名称，提供 `dev`、`build`、`check` 脚本并分配独立开发端口，然后在根目录运行 `npm install`。根目录会自动发现并启动带有 `dev` 脚本的应用。

```sh
npm install <依赖名> --workspace=@templates/onda
npm install -D <工具名>  # 所有应用共用的开发工具
```

后续出现实际共享的代码时，可新增 `packages/`，并将 `packages/*` 加入根目录 `workspaces`。本仓库以根目录作为单一 Git 仓库；`dist/`、`node_modules/`、捕获缓存和本地环境变量文件已在 `.gitignore` 中排除。

## Aurora

CopyAnything 复刻位于 `apps/aurora/`，包含原站 WebGL 背景、五种模式和 Tune 面板。运行 `npm run dev -- aurora` 或 `npm run dev:aurora`，实际端口见日志。构建使用 `npm run build --workspace=@templates/aurora`。校验与审核状态见 `apps/aurora/QA.md`。
