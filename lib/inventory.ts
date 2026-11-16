export type AssetStatus = '待盘点' | '可借' | '借出' | '维修中';
export type Action =
  | '盘点入库'
  | '借用'
  | '归还'
  | '送修'
  | '维修完成'
  | '新增器材';
export type Asset = {
  id: string;
  name: string;
  description: string;
  status: AssetStatus;
  revision: number;
  borrower?: string;
  due?: string;
};
export type Entry = {
  issue: number;
  date: string;
  asset: string;
  action: Action;
  actor: string;
};
export type Ledger = { assets: Asset[]; history: Entry[] };
export const actions: Record<AssetStatus, Action[]> = {
  待盘点: ['盘点入库', '送修'],
  可借: ['借用', '送修'],
  借出: ['归还'],
  维修中: ['维修完成'],
};
