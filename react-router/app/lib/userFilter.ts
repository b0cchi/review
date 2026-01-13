// ユーザーの型定義
export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    registeredAt: string;
};

/**
 * ユーザーをフィルタリングする純粋関数
 * テスタビリティを考慮して、副作用のない関数として実装
 *
 * @param users - フィルタリング対象のユーザー配列
 * @param searchQuery - 検索クエリ文字列
 * @returns フィルタリングされたユーザー配列
 */
export function filterUsers(users: User[], searchQuery: string): User[] {
    // 検索クエリが空の場合は全ユーザーを返す
    if (!searchQuery) {
        return users;
    }

    const query = searchQuery.toLowerCase();

    return users.filter((user) => {
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    });
}

// テストユーザーデータ（サーバー側のデータベースを模擬）
export const allUsers: User[] = [
    { id: 1, name: "田中 太郎", email: "tanaka@example.com", role: "管理者", registeredAt: "2024-01-15" },
    { id: 2, name: "佐藤 花子", email: "sato@example.com", role: "ユーザー", registeredAt: "2024-02-20" },
    { id: 3, name: "鈴木 一郎", email: "suzuki@example.com", role: "ユーザー", registeredAt: "2024-03-10" },
    { id: 4, name: "高橋 美咲", email: "takahashi@example.com", role: "編集者", registeredAt: "2024-04-05" },
    { id: 5, name: "渡辺 健太", email: "watanabe@example.com", role: "ユーザー", registeredAt: "2024-05-12" },
    { id: 6, name: "伊藤 由美", email: "ito@example.com", role: "管理者", registeredAt: "2024-06-18" },
    { id: 7, name: "山本 大輔", email: "yamamoto@example.com", role: "ユーザー", registeredAt: "2024-07-22" },
    { id: 8, name: "中村 愛", email: "nakamura@example.com", role: "編集者", registeredAt: "2024-08-30" },
];
