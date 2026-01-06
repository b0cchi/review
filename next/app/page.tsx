"use client";

import { useEffect, useState } from "react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Member = {
  name: string;
  role: string;
  email: string;
  status: "Active" | "Onboarding" | "OOO";
};

const statusStyles: Record<Member["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Onboarding: "bg-blue-50 text-blue-700 ring-blue-100",
  OOO: "bg-amber-50 text-amber-700 ring-amber-100",
};

function StatusBadge({ status }: { status: Member["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full ring-1 ring-inset font-medium text-xs",
        statusStyles[status],
      )}
    >
      <span className="bg-current opacity-70 rounded-full w-1.5 h-1.5" />
      {status}
    </span>
  );
}

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      q: searchTerm,
    });

    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const response = await fetch(`/api/users?${params.toString()}`, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data: {
          members: Member[];
          total: number;
          page: number;
          totalPages: number;
        } = await response.json();
        if (isMounted) {
          setMembers(data.members);
          setTotal(data.total);
          setPage(data.page);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [page, pageSize, searchTerm]);

  return (
    <main className="flex flex-col gap-8 mx-auto px-6 py-16 max-w-5xl min-h-screen">
      <header className="space-y-2">
        <p className="font-medium text-primary text-sm">Shadcnテーブル</p>
        <div className="space-y-3">
          <h1 className="font-semibold text-3xl sm:text-4xl tracking-tight">
            メンバーテーブルのサンプル
          </h1>
          <p className="w-full text-muted-foreground text-base">
            Next.js 13 App Router と Shadcn UI の Table コンポーネントを使ったメンバーテーブルのサンプルです。 <br />
            API からデータを取得し、検索とページングが可能です。
          </p>
        </div>
      </header>

      <section className="bg-card/80 backdrop-blur border rounded-xl">
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 px-6 py-4 border-b">
          <div>
            <h2 className="font-semibold text-lg">メンバー</h2>
          </div>
          <div className="flex sm:flex-row flex-col sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <label className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="whitespace-nowrap">検索</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="名前またはメールアドレス"
                className="shadow-sm px-3 py-2 border focus:border-ring rounded-lg outline-none ring-1 ring-transparent focus:ring-ring w-full sm:w-64 text-sm transition"
              />
            </label>
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-2 pb-4">
          <Table>
            <TableCaption><span className="font-semibold">/api/users</span> から取得したサンプルデータです。</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-55">名前</TableHead>
                <TableHead>役割</TableHead>
                <TableHead>メール</TableHead>
                <TableHead className="w-35">ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    読み込み中...
                  </TableCell>
                </TableRow>
              )}
              {error && !loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-red-600">
                    データの取得に失敗しました: {error}
                  </TableCell>
                </TableRow>
              )}
              {!loading && !error && members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    データがありません。
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                !error &&
                members.map((member) => (
                  <TableRow key={member.email}>
                    <TableCell className="font-semibold">
                      {member.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.role}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <div className="flex sm:flex-row flex-col justify-between items-center gap-3 mt-4 text-muted-foreground text-sm">
            <span>
              {loading ? "読み込み中..." : `全 ${total}件`}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap">{page} / {totalPages} ページ</span>
              </div>
              <label className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-background shadow-sm px-2 py-1.5 border focus:border-ring rounded-lg outline-none ring-1 ring-transparent focus:ring-ring text-sm transition"
                >
                  <option value={5}>5件</option>
                  <option value={10}>10件</option>
                  <option value={20}>20件</option>
                </select>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  disabled={loading || page <= 1}
                  className="hover:bg-muted disabled:opacity-60 p-2 border rounded-lg font-medium text-sm transition disabled:cursor-not-allowed"
                  aria-label="最初のページ"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={loading || page <= 1}
                  className="hover:bg-muted disabled:opacity-60 p-2 border rounded-lg font-medium text-sm transition disabled:cursor-not-allowed"
                  aria-label="前のページ"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={loading || page >= totalPages}
                  className="hover:bg-muted disabled:opacity-60 p-2 border rounded-lg font-medium text-sm transition disabled:cursor-not-allowed"
                  aria-label="次のページ"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  disabled={loading || page >= totalPages}
                  className="hover:bg-muted disabled:opacity-60 p-2 border rounded-lg font-medium text-sm transition disabled:cursor-not-allowed"
                  aria-label="最後のページ"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
