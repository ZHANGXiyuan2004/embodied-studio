// Apply a single operation to a copy of the demo ledger.
const transitions = {
  盘点入库: { from: ['待盘点'], to: '可借' },
  借用: { from: ['可借'], to: '借出' },
  归还: { from: ['借出'], to: '可借' },
  送修: { from: ['可借', '待盘点'], to: '维修中' },
  维修完成: { from: ['维修中'], to: '可借' },
};

export function applyOperation(current, operation, date) {
  const { action, id, revision, name, due, actor, number } = operation;
  if (current.history.some((entry) => entry.issue === number)) return current;
  if (!/^[A-Z0-9][A-Z0-9-]{1,23}$/.test(id ?? ''))
    throw Error('器材编号无效。');
  const ledger = structuredClone(current);
  const asset = ledger.assets.find((a) => a.id === id);
  if (action === '新增器材') {
    if (asset) throw Error('该编号已经登记。');
    if (!name || name.length > 80 || name.includes('\n'))
      throw Error('请填写 80 字以内的器材名称。');
    ledger.assets.push({
      id,
      name,
      description: '',
      status: '待盘点',
      revision: 0,
    });
  } else {
    if (!asset) throw Error('没有找到该器材。');
    if (revision !== asset.revision)
      throw Error('器材状态已变更，请刷新台账后重新申请。');
    if (
      !Object.hasOwn(transitions, action) ||
      !transitions[action].from.includes(asset.status)
    )
      throw Error('当前状态无法执行该动作。');
    if (action === '借用') {
      const valid = /^\d{4}-\d{2}-\d{2}$/.test(due);
      const parsed = valid ? new Date(due + 'T00:00:00Z') : null;
      const today = new Date(new Date(date).getTime() + 8 * 3600 * 1000)
        .toISOString()
        .slice(0, 10);
      if (
        !parsed ||
        !Number.isFinite(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== due ||
        due < today
      )
        throw Error('预计归还日期无效或已经过去。');
      asset.borrower = actor;
      asset.due = due;
    }
    if (action === '归还') {
      delete asset.borrower;
      delete asset.due;
    }
    asset.status = transitions[action].to;
    asset.revision++;
  }
  ledger.history.push({
    issue: number,
    date,
    asset: id,
    action,
    actor: actor,
  });
  return ledger;
}
