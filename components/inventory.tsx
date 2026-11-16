'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import snapshot from '@/public/inventory.json';
import { base } from '@/lib/studio';
import { applyOperation } from '@/scripts/ledger.mjs';
import { actions, type Action, type Asset, type Ledger } from '@/lib/inventory';

type Request = { action: Action; asset?: Asset };
function RequestForm({
  request,
  close,
  apply,
}: {
  request: Request;
  close: () => void;
  apply: (id: string, name: string, due: string) => void;
}) {
  const [error, setError] = useState('');
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
    try {
      apply(
        asset,
        String(fields.get('name') || '').trim(),
        String(fields.get('due') || ''),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '无法完成本次演示操作。');
    }
  }
  return (
    <dialog ref={modal} onCancel={close} aria-labelledby="request-name">
      <form onSubmit={submit}>
        <h2 id="request-name">{request.action}</h2>
        <p className="small-note">此次操作只更新当前页面的示例台账。</p>
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
                placeholder="例如 DEMO-04"
                pattern={String.raw`[A-Za-z0-9][A-Za-z0-9\-]{1,23}`}
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
        {error && (
          <p role="alert" className="hint">
            {error}
          </p>
        )}
        <div className="actions">
          <button type="button" className="outline" onClick={close}>
            取消
          </button>
          <button className="solid" type="submit">
            确认演示
          </button>
        </div>
      </form>
    </dialog>
  );
}
export function Inventory() {
  const [ledger, setLedger] = useState<Ledger>(snapshot as Ledger);
  const [query, setQuery] = useState(''),
    [status, setStatus] = useState('全部状态'),
    [request, setRequest] = useState<Request | null>(null);
  function reset() {
    setLedger(snapshot as Ledger);
    setStatus('全部状态');
    setQuery('');
  }
  function apply(id: string, name: string, due: string) {
    if (!request) return;
    setLedger(
      applyOperation(
        ledger,
        {
          id,
          name,
          due,
          action: request.action,
          revision: request.asset?.revision ?? 0,
          number: ledger.history.length + 1,
          actor: '示例成员',
        },
        new Date().toISOString(),
      ),
    );
    setRequest(null);
  }
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
        <h1>器材演示台账</h1>
        <p>
          这些器材和状态均为示例。可试用借还、维护和新增，刷新后恢复初始状态。
        </p>
      </div>
      <div className="ledger-head">
        <div>
          <h2>
            器材清单{' '}
            <small className="asset-id">{ledger.assets.length} 项</small>
          </h2>
        </div>
        <div className="ledger-links">
          <button className="outline small" onClick={reset}>
            <RefreshCw size={14} />
            重置演示
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
                  借用人 {a.borrower} · 预计 {a.due} 归还
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
              </li>
            ))}
          </ol>
        ) : (
          <p className="small-note">试用后，这里会显示本次演示的操作记录。</p>
        )}
      </div>
      {request && (
        <RequestForm
          apply={apply}
          request={request}
          close={() => setRequest(null)}
        />
      )}
    </main>
  );
}
