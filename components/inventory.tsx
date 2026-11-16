'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
import snapshot from '@/public/inventory.json';
import { base, github, repository } from '@/lib/studio';
import { actions, type Action, type Asset, type Ledger } from '@/lib/inventory';

type Request = { action: Action; asset?: Asset };
function RequestForm({
  request,
  close,
}: {
  request: Request;
  close: () => void;
}) {
  const modal = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = modal.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const asset =
      request.asset?.id || String(fields.get('asset')).trim().toUpperCase();
    const params = new URLSearchParams({
      template: 'equipment.yml',
      title: '[器材] ' + request.action + ' · ' + asset,
      action: request.action,
      asset,
      revision: String(request.asset?.revision || 0),
    });
    for (const key of ['due', 'name']) {
      const value = fields.get(key);
      if (value) params.set(key, String(value).trim());
    }
    window.location.assign(github + '/issues/new?' + params);
  }
  return (
    <dialog ref={modal} onCancel={close} aria-labelledby="request-name">
      <form onSubmit={submit}>
        <h2 id="request-name">{request.action}</h2>
        <p className="small-note">
          在 GitHub 确认并提交公开申请。维护者核对实物后更新台账。
        </p>
        {request.asset ? (
          <p className="form-field">
            {request.asset.id} · {request.asset.name}
          </p>
        ) : (
          <>
            <label className="form-field">
              新器材编号
              <input
                name="asset"
                placeholder="例如 ARM-02"
                pattern="[A-Za-z0-9][A-Za-z0-9-]{1,23}"
                maxLength={24}
                required
              />
            </label>
            <label className="form-field">
              器材名称
              <input name="name" maxLength={80} required />
            </label>
          </>
        )}
        {request.action === '借用' && (
          <label className="form-field">
            预计归还日期
            <input type="date" name="due" required />
          </label>
        )}
        <div className="actions">
          <button type="button" className="outline" onClick={close}>
            取消
          </button>
          <button className="solid" type="submit">
            前往 GitHub 提交 <ArrowUpRight size={15} />
          </button>
        </div>
      </form>
    </dialog>
  );
}
export function Inventory() {
  const [ledger, setLedger] = useState<Ledger>(snapshot as Ledger),
    [version, setVersion] = useState(0);
  const [stamp, setStamp] = useState('正在读取共享台账…'),
    [busy, setBusy] = useState(true);
  const [query, setQuery] = useState(''),
    [status, setStatus] = useState('全部状态'),
    [request, setRequest] = useState<Request | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    async function load() {
      setBusy(true);
      setStamp('正在读取共享台账…');
      try {
        const res = await fetch(
          'https://api.github.com/repos/' +
            repository +
            '/contents/public/inventory.json?ref=main',
          {
            headers: { Accept: 'application/vnd.github.raw+json' },
            cache: 'no-store',
            signal: controller.signal,
          },
        );
        if (!res.ok) throw Error();
        const data: Ledger = await res.json();
        if (!Array.isArray(data.assets) || !Array.isArray(data.history))
          throw Error();
        if (active) {
          setLedger(data);
          setStamp('已同步 GitHub 共享台账');
        }
      } catch {
        if (active)
          setStamp('同步失败，显示已载入的台账。可刷新或查看 GitHub 原表。');
      } finally {
        window.clearTimeout(timeout);
        if (active) setBusy(false);
      }
    }
    void load();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [version]);
  const filtered = ledger.assets.filter(
    (a) =>
      (status === '全部状态' || a.status === status) &&
      (a.id + ' ' + a.name).toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <main className="wrap inner-page" id="main">
      <a className="back" href={base + '/#equipment'}>
        <ArrowLeft size={15} />
        返回工作室
      </a>
      <div className="detail-heading">
        <p className="kicker">Equipment ledger</p>
        <h1>共享器材台账</h1>
        <p>查找器材、核对借还与维修记录。首次盘点后，设备即可开放借用。</p>
      </div>
      <div className="ledger-head">
        <div>
          <h2>
            器材清单{' '}
            <small className="asset-id">{ledger.assets.length} 项</small>
          </h2>
          <p className="ledger-stamp" role="status">
            {stamp}
          </p>
        </div>
        <div className="ledger-links">
          <button
            className="outline small"
            disabled={busy}
            onClick={() => setVersion(version + 1)}
          >
            <RefreshCw size={14} />
            刷新
          </button>
          <button
            className="solid small"
            onClick={() => setRequest({ action: '新增器材' })}
          >
            <Plus size={15} />
            新增器材
          </button>
        </div>
      </div>
      <div className="filters">
        <label>
          搜索
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名称或器材编号"
          />
        </label>
        <label>
          状态
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {['全部状态', ...Object.keys(actions)].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="ledger">
        {filtered.map((a) => (
          <article className="ledger-row" key={a.id}>
            <span className="asset-id">{a.id}</span>
            <div>
              <h3>{a.name}</h3>
              <p>{a.description}</p>
              {a.borrower && (
                <p>
                  借用账号 @{a.borrower} · 预计 {a.due} 归还
                </p>
              )}
            </div>
            <span className="state" data-state={a.status}>
              {a.status}
            </span>
            <div className="row-actions">
              {actions[a.status].map((action) => (
                <button
                  key={action}
                  className="outline small"
                  onClick={() => setRequest({ action, asset: a })}
                >
                  {action}
                </button>
              ))}
            </div>
          </article>
        ))}
        {!filtered.length && <p className="empty">没有匹配的器材。</p>}
      </div>
      <div className="history">
        <h2>变更记录</h2>
        {ledger.history.length ? (
          <ol>
            {[...ledger.history].reverse().map((e) => (
              <li key={e.issue}>
                <span className="history-date">{e.date.slice(0, 10)}</span>　
                {e.asset} · {e.action}　
                <a className="text-link" href={github + '/issues/' + e.issue}>
                  申请 #{e.issue} <ArrowUpRight size={12} />
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <p className="small-note">
            首次登记通过后，这里会显示器材、动作和对应申请。
          </p>
        )}
      </div>
      <div className="actions">
        <a
          className="text-link"
          href={
            github +
            '/issues?q=is%3Aissue+%22%5B%E5%99%A8%E6%9D%90%5D%22+in%3Atitle'
          }
        >
          查看器材申请 <ArrowUpRight size={13} />
        </a>
        <a
          className="text-link"
          href={github + '/blob/main/public/inventory.json'}
        >
          GitHub 原表 <ArrowUpRight size={13} />
        </a>
      </div>
      {request && (
        <RequestForm request={request} close={() => setRequest(null)} />
      )}
    </main>
  );
}
