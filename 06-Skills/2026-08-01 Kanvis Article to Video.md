# Kanvis Article to Video

- 仓库：https://github.com/Kanvis-chen/kanvis-video
- 技能文件：https://github.com/Kanvis-chen/kanvis-video/blob/main/SKILL.md
- 用途：把中文文章、微信公众号文章或 Markdown 长文转换为带分镜、旁白、字幕、信息图和质量门禁的视频项目。
- 维护状态：近期活跃；截至 2026-08-01 有 5 stars，MIT 许可证。
- 结构：以标准 `SKILL.md` 为核心，附带文档、配置样例、预检和场景计划验证脚本；当前不是完整 `.codex-plugin` 包。
- 接入方式：评估后作为独立技能安装；运行前配置 `kanvis-video.config.json`，先执行 runtime 检测和 `preflight`，再初始化项目。
- 风险提示：视频生成可能涉及付费服务、真人素材、声音和头像授权；默认使用 `paid_calls=confirm/off`，不要提交 API Key 或未授权素材。
- 结论：适合中文知识内容的视频化，建议安装前先用本地/mock 模式验证流程。
