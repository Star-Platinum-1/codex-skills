import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const appId = process.env.FEISHU_APP_ID || "cli_aae9af9ee5f81cf8";
const appSecret = process.env.FEISHU_APP_SECRET;
const sharedDir = process.env.OBSIDIAN_SHARED_DIR || "D:\\codex\\obsidian\\05-Shared";
const apiBase = "https://open.feishu.cn/open-apis";

if (!appSecret) {
  console.error("Missing FEISHU_APP_SECRET. Set it only in the local environment.");
  process.exit(2);
}

async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json; charset=utf-8", ...(options.headers || {}) },
  });
  const body = await response.json();
  if (!response.ok || body.code !== 0) {
    throw new Error(`${path}: HTTP ${response.status}, code ${body.code ?? "unknown"}, ${body.msg ?? "request failed"}`);
  }
  return body;
}

async function getTenantToken() {
  const result = await request("/auth/v3/tenant_access_token/internal", {
    method: "POST",
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  return result.tenant_access_token;
}

async function listSharedNotes(dir, output = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await listSharedNotes(path, output);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      const info = await stat(path);
      output.push({ path: relative(dir, path), bytes: info.size, modified: info.mtime.toISOString() });
    }
  }
  return output;
}

const token = await getTenantToken();
const command = process.argv[2] || "check";

if (command === "check") {
  console.log(JSON.stringify({ ok: true, appId, sharedDir, message: "Feishu tenant token acquired" }, null, 2));
} else if (command === "manifest") {
  const notes = await listSharedNotes(sharedDir);
  console.log(JSON.stringify({ source: sharedDir, count: notes.length, notes }, null, 2));
} else {
  console.error("Usage: node 99-System/feishu-sync.mjs [check|manifest]");
  process.exit(1);
}

// Keep the token in memory only; never write it to the vault or repository.
