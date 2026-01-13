import type { Route } from "./+types/home";
import { useLoaderData, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { filterUsers, allUsers, type User } from "../lib/userFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// サーバーサイドのloader関数
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search") || "";

  // 純粋関数を使ってフィルタリング処理を実行
  const filteredUsers = filterUsers(allUsers, searchQuery);

  console.log(`[Server] Filtering users with query: "${searchQuery}", found ${filteredUsers.length} results`);

  return {
    users: filteredUsers,
    searchQuery,
    totalUsers: allUsers.length,
  };
}

export default function Home() {
  const { users, searchQuery, totalUsers } = useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchQuery);

  const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  // デバウンス処理: 入力が止まってから500ms後にサーバーリクエストを送信
  useEffect(() => {
    // 現在のURLパラメータと入力値が同じ場合はリクエストをスキップ
    if (inputValue === searchQuery) {
      return;
    }

    const timer = setTimeout(() => {
      if (inputValue) {
        setSearchParams({ search: inputValue });
      } else {
        setSearchParams({});
      }
    }, 500); // 500msのディレイ

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(94,234,212,0.08),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(129,140,248,0.06),transparent_30%)]" />

        <div className="relative container mx-auto px-4 py-10 space-y-8">
          {/* ヘッダー */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">User Directory</p>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">ユーザー情報一覧</h1>
              <p className="text-slate-400 max-w-2xl">
                登録されているユーザーをサーバーサイドでフィルタリングして表示します。検索条件はURLクエリに同期され、リロードや共有でも再現できます。
              </p>
            </div>

            {/* サマリーカード */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="総ユーザー" value={`${totalUsers} 人`} hint="全データ件数" />
              <StatCard label="現在の表示" value={`${users.length} 人`} hint="フィルター後" />
              <StatCard label="管理者" value={`${roleCounts["管理者"] || 0} 人`} hint="role: 管理者" />
              <StatCard label="編集者" value={`${roleCounts["編集者"] || 0} 人`} hint="role: 編集者" />
            </div>
          </div>

          {/* フィルター検索フォーム */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <label htmlFor="search" className="text-sm font-medium text-slate-200">
                  名前またはメールアドレスで検索
                </label>
                <div className="mt-2 flex gap-3 items-center">
                  <Input
                    id="search"
                    type="text"
                    placeholder="例: 田中、tanaka@example.com"
                    value={inputValue}
                    onChange={handleSearchChange}
                    className="max-w-md bg-slate-900/60 border-white/10 text-slate-50 placeholder:text-slate-400 focus-visible:ring-sky-400"
                  />
                  {searchQuery && (
                    <Badge variant="outline" className="border-sky-400/40 text-sky-100 bg-sky-400/10">
                      {users.length}件 / {totalUsers}件
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-400">
                入力停止から500ms後にサーバーへクエリを送信します。
              </div>
            </div>
          </div>

          {/* テーブルカード */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur shadow-2xl overflow-hidden">
            {users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="w-[80px] text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">名前</TableHead>
                    <TableHead className="text-slate-300">メールアドレス</TableHead>
                    <TableHead className="w-[120px] text-slate-300">ロール</TableHead>
                    <TableHead className="w-[140px] text-slate-300">登録日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-semibold text-slate-100">{user.id}</TableCell>
                      <TableCell className="text-slate-100">{user.name}</TableCell>
                      <TableCell className="text-slate-300">{user.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell className="text-slate-300">{user.registeredAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-lg font-semibold text-slate-100">ユーザーが見つかりません</h3>
                <p className="text-slate-400 mt-2">検索条件に一致するユーザーがいません</p>
              </div>
            )}
          </div>

          {/* フッター */}
          <div className="text-sm text-slate-300 flex gap-2 items-center">
            <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" aria-hidden />
            {searchQuery ? (
              <>検索結果: {users.length} 人 (全{totalUsers}人中)</>
            ) : (
              <>合計 {users.length} 人のユーザーが登録されています</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-50">{value}</p>
      {hint ? <p className="text-xs text-slate-400 mt-1">{hint}</p> : null}
    </div>
  );
}

/**
 * ロールに応じたバッジを表示するコンポーネント
 */
function RoleBadge({ role }: { role: string }) {
  const styleMap: Record<string, string> = {
    "管理者": "bg-sky-500/15 text-sky-100 border border-sky-400/40",
    "編集者": "bg-violet-500/15 text-violet-100 border border-violet-400/40",
    "ユーザー": "bg-emerald-500/15 text-emerald-100 border border-emerald-400/40",
  };

  const badgeClass = styleMap[role] ?? "bg-slate-500/20 text-slate-100 border border-slate-400/30";

  return (
    <Badge className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
      <span className="h-2 w-2 rounded-full bg-current opacity-80" aria-hidden />
      {role}
    </Badge>
  );
}
