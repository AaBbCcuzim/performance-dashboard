## Why

项目目前没有远程仓库和自动部署能力，需要推送到 GitHub 并通过 GitHub Pages 发布静态站点，方便在线访问和演示。

## What Changes

- 创建 GitHub 远程仓库并推送代码
- 配置 Vite `base` 路径以支持 GitHub Pages 子路径部署
- 添加 GitHub Actions 工作流，在推送到 main 分支时自动构建并部署到 GitHub Pages

## Capabilities

### New Capabilities
<!-- 本次变更不新增业务 capability，纯 CI/CD 配置 -->

### Modified Capabilities
<!-- 无已有规格变更 -->

## Impact

- `vite.config.ts` — 添加 `base` 配置
- `.github/workflows/deploy-pages.yml` — 新增 GitHub Actions 部署工作流
