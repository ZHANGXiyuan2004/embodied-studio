'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { github, ideasFeed, repository, submitIdea } from '@/lib/studio';

type IdeaIssue = {
  number: number;
  title: string;
  body: string | null;
  user: { login: string };
  pull_request?: unknown;
};
function field(body: string, key: string) {
  const parts = body.split(/^### /m);
  return (
    parts
      .find((part) => part.startsWith(key + '\n'))
      ?.slice(key.length)
      .trim()
      .replace(/^_No response_$/, '') || ''
  );
}
function publicLink(raw: string, repo = false) {
  try {
    const url = new URL(raw.trim());
    if (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      (!repo || url.hostname === 'github.com')
    )
      return url.href;
  } catch {}
}
export function Community({ active }: { active: boolean }) {
  const [items, setItems] = useState<IdeaIssue[]>([]),
    [state, setState] = useState('loading'),
    [reload, setReload] = useState(0);
  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    let live = true;
    const timeout = setTimeout(() => controller.abort(), 10000);
    setState('loading');
    async function load() {
      try {
        const response = await fetch(
          'https://api.github.com/repos/' +
            repository +
            '/issues?state=open&labels=idea&per_page=12',
          { signal: controller.signal, cache: 'no-store' },
        );
        if (!response.ok) throw Error();
        const data: IdeaIssue[] = await response.json();
        if (live) {
          setItems(data.filter((i) => !i.pull_request));
          setState('ready');
        }
      } catch {
        if (live) setState('error');
      } finally {
        clearTimeout(timeout);
      }
    }
    void load();
    return () => {
      live = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [active, reload]);
  return (
    <div className="community">
      <div aria-live="polite">
        {state === 'loading' && (
          <p className="empty">正在读取 GitHub 社区投稿…</p>
        )}
        {state === 'error' && (
          <p className="empty">
            暂时无法读取投稿。{' '}
            <button
              className="text-link"
              onClick={() => setReload((v) => v + 1)}
            >
              重新加载
            </button>
          </p>
        )}
        {state === 'ready' && !items.length && (
          <div className="community-empty">
            <h3>留下第一个社区想法</h3>
            <p>写下你想验证的问题，也可以附上 GitHub 仓库和在线 Demo。</p>
            <a className="text-link" href={submitIdea}>
              提交想法 <ArrowUpRight size={14} />
            </a>
          </div>
        )}
        {state === 'ready' &&
          items.map((issue) => {
            const body = (issue.body || '').replaceAll('\r', ''),
              repo = publicLink(field(body, 'GitHub 仓库'), true),
              demo = publicLink(field(body, '可体验的 Demo'));
            return (
              <article className="community-idea" key={issue.number}>
                <small className="asset-id">@{issue.user.login}</small>
                <h3>
                  <a href={github + '/issues/' + issue.number}>
                    {issue.title.replace(/^\[想法\]\s*/, '')}
                  </a>
                </h3>
                <p>{field(body, '想解决什么问题').slice(0, 240)}</p>
                <div className="ledger-links">
                  {demo && (
                    <a className="text-link" href={demo}>
                      体验 Demo <ArrowUpRight size={13} />
                    </a>
                  )}
                  {repo && (
                    <a className="text-link" href={repo}>
                      <Github size={13} />
                      仓库
                    </a>
                  )}
                  <a
                    className="text-link"
                    href={github + '/issues/' + issue.number}
                  >
                    参与讨论 <ArrowUpRight size={13} />
                  </a>
                </div>
              </article>
            );
          })}
      </div>
      <a className="text-link" href={ideasFeed}>
        查看 GitHub 上的全部投稿 <ArrowUpRight size={13} />
      </a>
    </div>
  );
}
