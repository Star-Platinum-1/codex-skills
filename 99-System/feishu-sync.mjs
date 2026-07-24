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

async function apiRequest(path, token, options = {}) {
  return request(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
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

async function publishNote(token, filePath) {
  const markdown = await (await import("node:fs/promises")).readFile(filePath, "utf8");
  const title = markdown.match(/^#\s+(.+)$/m)?.[1] || filePath.split(/[\\/]/).pop().replace(/\.md$/i, "");
  const created = await apiRequest("/docx/v1/documents", token, {
    method: "POST",
    body: JSON.stringify({ title, ...(process.env.FEISHU_FOLDER_TOKEN ? { folder_token: process.env.FEISHU_FOLDER_TOKEN } : {}) }),
  });
  const documentId = created.data?.document?.document_id;
  if (!documentId) throw new Error("Feishu did not return a document id");
  const content = markdown.replace(/^#\s+.+\n?/, "").trim();
  if (content) {
    const children = content.split(/\r?\n/).filter(Boolean).map((line) => ({
      block_type: 2,
      text: { elements: [{ text_run: { content: line.replace(/^[-*]\s+/, "") } }] },
    }));
    await apiRequest(`/docx/v1/documents/${documentId}/blocks/${documentId}/children`, token, {
      method: "POST",
      body: JSON.stringify({ children, index: 0 }),
    });
  }
  return { title, documentId, url: `https://feishu.cn/docx/${documentId}` };
}

const token = await getTenantToken();
const command = process.argv[2] || "check";

if (command === "check") {
  console.log(JSON.stringify({ ok: true, appId, sharedDir, message: "Feishu tenant token acquired" }, null, 2));
} else if (command === "manifest") {
  const notes = await listSharedNotes(sharedDir);
  console.log(JSON.stringify({ source: sharedDir, count: notes.length, notes }, null, 2));
} else if (command === "publish") {
  const file = process.argv[3];
  if (!file) throw new Error("Usage: ... feishu-sync.mjs publish <markdown-file>");
  console.log(JSON.stringify(await publishNote(token, file), null, 2));
} else {
  console.error("Usage: node 99-System/feishu-sync.mjs [check|manifest|publish <markdown-file>]");
  process.exit(1);
}

// Keep the token in memory only; never write it to the vault or repository.
