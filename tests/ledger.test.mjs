import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyOperation } from '../scripts/ledger.mjs';
const seed = JSON.parse(
  readFileSync(new URL('../public/inventory.json', import.meta.url)),
);
const ledger = {
  assets: [{ ...seed.assets[0], id: 'DEMO-01', revision: 0, status: '待盘点' }],
  history: [],
};
const at = '2026-11-16T00:00:00Z';
function request(number, action, revision, due = '2026-11-30') {
  return { number, action, revision, id: 'DEMO-01', actor: '示例成员', due };
}

test('盘点、借用、归还与历史记录是一笔变更', () => {
  const ready = applyOperation(ledger, request(1, '盘点入库', 0), at);
  const loan = applyOperation(ready, request(2, '借用', 1), at);
  assert.equal(loan.assets[0].borrower, '示例成员');
  assert.equal(loan.assets[0].due, '2026-11-30');
  assert.equal(applyOperation(loan, request(2, '借用', 1), at), loan);
  const back = applyOperation(loan, request(3, '归还', 2), at);
  assert.equal(back.assets[0].status, '可借');
  assert.equal(back.assets[0].borrower, undefined);
  assert.equal(back.history.length, 3);
  assert.equal(ledger.assets[0].status, '待盘点');
  assert.throws(
    () => applyOperation(back, request(4, '借用', 1), at),
    /已变更/,
  );
  assert.throws(
    () => applyOperation(back, request(5, '借用', 3, '2026-02-30'), at),
    /日期/,
  );
});
test('维修、重复编号与非法流转', () => {
  const repair = applyOperation(ledger, request(6, '送修', 0), at);
  assert.equal(
    applyOperation(repair, request(7, '维修完成', 1), at).assets[0].status,
    '可借',
  );
  assert.throws(
    () => applyOperation(repair, request(8, '借用', 1), at),
    /无法/,
  );
  assert.throws(
    () => applyOperation(ledger, request(9, '新增器材', 0), at),
    /已经登记/,
  );
  const add = request(10, '新增器材', 0);
  add.id = 'DEMO-04';
  add.name = '器材四';
  assert.equal(applyOperation(ledger, add, at).assets.at(-1).status, '待盘点');
});
