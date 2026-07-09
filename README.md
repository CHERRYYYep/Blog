# CHERRY Blog

这是我的个人博客项目，基于 Astro 构建，用于记录文章、归档内容和个人页面。

## 部署

项目已配置 GitHub Pages 自动部署工作流：

```bash
pnpm install
pnpm run build
```

推送到 `main` 分支后，GitHub Actions 会构建并发布 `dist` 目录。

## 致谢

本博客基于 [Fuwari](https://github.com/saicaca/fuwari) 修改而来。
