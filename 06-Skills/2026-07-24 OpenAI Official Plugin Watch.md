# OpenAI 官方插件观察记录

检查日期：2026-07-24

## 推荐候选

### GitHub Plugin

- 仓库：https://github.com/openai/plugins/tree/main/plugins/github
- 用途：通过官方 GitHub 插件能力处理仓库、Issue、Pull Request 等协作任务。
- 维护状态：OpenAI 官方仓库，近期持续更新，约 4.7k stars。
- 接入方式：从官方插件目录安装 `plugins/github`，按其 `.codex-plugin`、`.mcp.json` 和 `skills` 配置接入。
- 风险提示：需要 GitHub 授权；保持最小权限，不把 token 写入技能文件。
- 结论：与当前 `Star-Platinum-1/codex-skills` 共享仓库高度相关，建议下一步评估后安装。

### Codex Security Plugin

- 仓库：https://github.com/openai/plugins/tree/main/plugins/codex-security
- 用途：技能、插件和代码的安全检查与风险识别。
- 维护状态：OpenAI 官方仓库，结构完整，包含 `preflight`、`scripts`、`references` 和 `skills`。
- 接入方式：从官方插件目录安装 `plugins/codex-security`，先运行其预检流程。
- 风险提示：安全检查本身可能读取待审查文件；先限定到技能仓库和本地知识库公开内容。
- 结论：建议优先评估，可用于现有技能仓库的自动筛选流程。

## 暂不推荐

`sannnnway-prog/codex-skills-sync-tool`：功能方向与当前同步需求相近，但截至本次检查为 0 stars、无许可证，且主要是个人脚本面板，暂不安装。
