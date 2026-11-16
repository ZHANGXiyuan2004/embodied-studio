import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyRequest } from '../scripts/ledger.mjs';
const seed = JSON.parse(
  readFileSync(new URL('../public/inventory.json', import.meta.url)),
);
const ledger = {
  assets: [{ ...seed.assets[0], id: 'ARM-01', revision: 0, status: '待盘点' }],
  history: [],
};
const at = '2026-11-16T00:00:00Z';
function request(number, action, revision, due = '2026-11-30') {
  return {
    number,
    user: { login: 'member' },
    body: [
      '动作',
      action,
      '器材编号',
      'ARM-01',
      '台账版本',
      revision,
      '新器材名称',
      '_No response_',
      '预计归还日期',
      due,
    ]
      .map((s, i) => (i % 2 ? s : '### ' + s))
      .join('\r\n\r\n'),
  };
}
test('盘点、借用、归还与历史记录是一笔变更', () => {
  const ready = applyRequest(ledger, request(1, '盘点入库', 0), at);
  const loan = applyRequest(ready, request(2, '借用', 1), at);
  assert.equal(loan.assets[0].borrower, 'member');
  assert.equal(loan.assets[0].due, '2026-11-30');
  assert.equal(applyRequest(loan, request(2, '借用', 1), at), loan);
  const back = applyRequest(loan, request(3, '归还', 2), at);
  assert.equal(back.assets[0].status, '可借');
  assert.equal(back.assets[0].borrower, undefined);
  assert.equal(back.history.length, 3);
  assert.equal(ledger.assets[0].status, '待盘点');
  assert.throws(() => applyRequest(back, request(4, '借用', 1), at), /已变更/);
  assert.throws(
    () => applyRequest(back, request(5, '借用', 3, '2026-02-30'), at),
    /日期/,
  );
});
test('维修、重复编号与非法流转', () => {
  const repair = applyRequest(ledger, request(6, '送修', 0), at);
  assert.equal(
    applyRequest(repair, request(7, '维修完成', 1), at).assets[0].status,
    '可借',
  );
  assert.throws(() => applyRequest(repair, request(8, '借用', 1), at), /无法/);
  assert.throws(
    () => applyRequest(ledger, request(9, '新增器材', 0), at),
    /已经登记/,
  );
  const add = request(10, '新增器材', 0);
  add.body = add.body
    .replace('ARM-01', 'CAM-02')
    .replace('_No response_', '深度相机');
  assert.equal(applyRequest(ledger, add, at).assets.at(-1).status, '待盘点');
});
