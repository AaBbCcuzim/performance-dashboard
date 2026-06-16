## Context

当前项目是 Vite + React 单页应用，构建产物在 `dist/` 目录。需通过 GitHub Pages 部署为静态站点。

## Goals / Non-Goals

**Goals:**
- 创建 GitHub 远程仓库并推送代码
- 每次推送到 main 分支时自动构建并部署到 GitHub Pages
- 站点可正常访问（路由、资源路径正确）

**Non-Goals:**
- 自定义域名配置
- 多环境部署
- 预发布/预览环境

## Decisions

1. **部署 Action 选型：`peaceiris/actions-gh-pages`**
   - 社区广泛使用（12k+ stars），维护活跃
   - 支持 `deploy_key` 和 `GITHUB_TOKEN` 两种认证方式
   - 使用默认的 `GITHUB_TOKEN`，配置最简单

2. **Vite base 路径：`/<repo-name>/`**
   - GitHub Pages 默认部署在 `https://<user>.github.io/<repo>/` 子路径下
   - 必须在 Vite 构建时配置 `base` 确保 JS/CSS 资源路径正确
   - 仓库名由 `gh repo create` 创建时确定

3. **触发条件：push to main**
   - 合并到 main 分支后自动部署，保持站点与主分支同步

4. **GitHub Pages 源：`gh-pages` 分支 (deploy branch)**
   - `peaceiris/actions-gh-pages` 将构建产物推送到 `gh-pages` 分支
   - GitHub Pages 配置指向该分支

## Risks / Trade-offs

- **子路径部署路由问题** → TanStack Router 和 Vite 都需知道 base 路径，通过 `vite.config.ts` 的 `base` 统一配置即可
- **首次部署需手动启用 Pages** → 工作流首次运行后，需在仓库 Settings > Pages 中确认分支为 `gh-pages`
