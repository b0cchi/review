import { describe, test, expect } from "vitest";
import { filterUsers, type User } from "../lib/userFilter";

describe("filterUsers", () => {
    // テスト用のユーザーデータ
    const testUsers: User[] = [
        { id: 1, name: "田中 太郎", email: "tanaka@example.com", role: "管理者", registeredAt: "2024-01-15" },
        { id: 2, name: "佐藤 花子", email: "sato@example.com", role: "ユーザー", registeredAt: "2024-02-20" },
        { id: 3, name: "鈴木 一郎", email: "suzuki@example.com", role: "ユーザー", registeredAt: "2024-03-10" },
        { id: 4, name: "高橋 美咲", email: "takahashi@example.com", role: "編集者", registeredAt: "2024-04-05" },
    ];

    test("検索クエリが空の場合、全ユーザーを返す", () => {
        // Arrange: 空の検索クエリを準備
        const searchQuery = "";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: 全ユーザーが返されることを確認
        expect(result).toEqual(testUsers);
        expect(result).toHaveLength(4);
    });

    test("名前に検索クエリが含まれるユーザーのみ返す", () => {
        // Arrange: 「田中」で検索
        const searchQuery = "田中";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: 田中さんのみが返される
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("田中 太郎");
    });

    test("メールアドレスに検索クエリが含まれるユーザーのみ返す", () => {
        // Arrange: 「sato」で検索
        const searchQuery = "sato";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: 佐藤さんのみが返される
        expect(result).toHaveLength(1);
        expect(result[0].email).toBe("sato@example.com");
    });

    test("検索は大文字小文字を区別しない", () => {
        // Arrange: 大文字で「TANAKA」で検索
        const searchQuery = "TANAKA";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: 田中さんが返される
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("田中 太郎");
    });

    test("部分一致で検索できる（名前）", () => {
        // Arrange: 「太」で検索
        const searchQuery = "太";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: 「太」を含む名前のユーザーが返される
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("田中 太郎");
    });

    test("部分一致で検索できる（メールアドレス）", () => {
        // Arrange: 「example.com」で検索
        const searchQuery = "example.com";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: 全ユーザーが返される（全員example.comを使用）
        expect(result).toHaveLength(4);
    });

    test("該当するユーザーがいない場合、空配列を返す", () => {
        // Arrange: 存在しない名前で検索
        const searchQuery = "存在しない";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: 空配列が返される
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    test("複数のユーザーがマッチする場合、すべて返す", () => {
        // Arrange: 「@example.com」で検索
        const searchQuery = "@example.com";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: すべてのユーザーが返される
        expect(result).toHaveLength(4);
    });

    test("空白文字のみの検索クエリは全ユーザーを返さない", () => {
        // Arrange: 空白文字で検索
        const searchQuery = "   ";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: 空白文字を含むユーザーがいないため空配列
        expect(result).toEqual([]);
    });

    test("名前とメールアドレスの両方にマッチするクエリ", () => {
        // Arrange: 「鈴木」で検索（名前にもメールにも含まれる）
        const searchQuery = "鈴木";

        // Act: フィルタリング関数を実行
        const result = filterUsers(testUsers, searchQuery);

        // Assert: 鈴木さんが返される
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("鈴木 一郎");
    });

    test("元の配列を変更しない（純粋関数であることの確認）", () => {
        // Arrange: 元の配列をコピー
        const originalUsers = [...testUsers];
        const searchQuery = "田中";

        // Act: フィルタリング関数を実行
        filterUsers(testUsers, searchQuery);

        // Assert: 元の配列が変更されていないことを確認
        expect(testUsers).toEqual(originalUsers);
    });
});
