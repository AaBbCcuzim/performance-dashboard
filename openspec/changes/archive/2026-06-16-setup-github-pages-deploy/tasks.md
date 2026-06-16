## 1. 创建 GitHub 仓库并推送代码

- [x] 1.1 使用 `gh repo create` 创建远程仓库
- [x] 1.2 推送当前分支到远程仓库

## 2. 配置 GitHub Pages 部署

- [x] 2.1 在 vite.config.ts 中添加 `base` 配置（仓库名作为子路径）
- [x] 2.2 创建 `.github/workflows/deploy-pages.yml` 工作流文件

## 3. 验证

- [x] 3.1 本地运行 `npm run build` 确认构建成功且资源路径正确
- [x] 3.2 推送代码到 main 分支，确认 GitHub Actions 工作流触发并部署成功
