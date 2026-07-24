# Feishu Sharing

## Purpose

Feishu is the sharing layer for notes that have already been reviewed and prepared in Obsidian.

## Workflow

1. Draft and classify in the local vault.
2. Move the share-ready version to `05-Shared`.
3. Remove secrets, private paths, credentials, and internal-only details.
4. Share the cleaned note in Feishu as a document or message.
5. Add the Feishu link back to the source note when available.

## Local Connector

The Feishu app is `Codex 知识分享`. The local connector reads only `05-Shared` and keeps credentials outside the vault.

Set `FEISHU_APP_SECRET` in the local environment, then run:

```powershell
node D:\codex\obsidian\99-System\feishu-sync.mjs check
node D:\codex\obsidian\99-System\feishu-sync.mjs manifest
```

The connector is intentionally read-only at this stage for local notes. Publishing is a deliberate next step after the target Feishu folder or wiki space is chosen.

## Share Checklist

- Audience is clear
- Sensitive information removed
- Source links included
- Skill review status recorded
- Date and owner included
