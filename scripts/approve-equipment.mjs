import { readFile } from 'node:fs/promises';
import { applyRequest } from './ledger.mjs';

const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
const endpoint =
  'https://api.github.com/repos/' + process.env.GITHUB_REPOSITORY;
const headers = {
  Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
  Accept: 'application/vnd.github+json',
  'Content-Type': 'application/json',
};
async function api(path, method = 'GET', body) {
  const res = await fetch(endpoint + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const error = new Error('GitHub 请求失败：' + res.status);
    error.status = res.status;
    throw error;
  }
  return res.status === 204 ? null : res.json();
}
const issuePath = '/issues/' + event.issue.number;
const file = '/contents/public/inventory.json';
async function approve() {
  for (let attempt = 0; attempt < 6; attempt++) {
    const doc = await api(file + '?ref=main');
    const current = JSON.parse(
      Buffer.from(doc.content, 'base64').toString('utf8'),
    );
    // Use the request snapshot that the maintainer approved, even if its author edits it later.
    let next;
    try {
      next = applyRequest(current, event.issue, new Date().toISOString());
    } catch (error) {
      await api(issuePath + '/comments', 'POST', {
        body: '登记未生效。' + error.message,
      });
      await api(
        issuePath + '/labels/' + encodeURIComponent('approved-equipment'),
        'DELETE',
      );
      return;
    }
    if (next !== current) {
      try {
        await api(file, 'PUT', {
          branch: 'main',
          sha: doc.sha,
          message: '登记器材变更 #' + event.issue.number,
          content: Buffer.from(JSON.stringify(next, null, 2) + '\n').toString(
            'base64',
          ),
        });
      } catch (error) {
        if ((error.status === 409 || error.status === 422) && attempt < 5)
          continue;
        throw error;
      }
    }
    await api(issuePath, 'PATCH', {
      state: 'closed',
      state_reason: 'completed',
    });
    return;
  }
}
await approve();
