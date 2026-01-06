export default defineEventHandler(async (event) => {
    // テスト用のディレイ（1秒）
    await new Promise(resolve => setTimeout(resolve, 1000))

    // クエリパラメータを取得
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const perPage = Number(query.perPage) || 10
    const search = (query.search as string) || ''

    // ユーザーデータのモックデータ
    const allUsers = [
        { id: 1, name: '山田太郎', email: 'yamada@example.com', role: '管理者', status: 'アクティブ' },
        { id: 2, name: '佐藤花子', email: 'sato@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', role: 'ユーザー', status: '非アクティブ' },
        { id: 4, name: '田中美咲', email: 'tanaka@example.com', role: 'モデレーター', status: 'アクティブ' },
        { id: 5, name: '高橋健', email: 'takahashi@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 6, name: '伊藤裕子', email: 'ito@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 7, name: '渡辺誠', email: 'watanabe@example.com', role: 'ユーザー', status: '非アクティブ' },
        { id: 8, name: '山本さくら', email: 'yamamoto@example.com', role: 'モデレーター', status: 'アクティブ' },
        { id: 9, name: '中村大輔', email: 'nakamura@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 10, name: '小林真理', email: 'kobayashi@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 11, name: '加藤翔太', email: 'kato@example.com', role: 'ユーザー', status: '非アクティブ' },
        { id: 12, name: '吉田優香', email: 'yoshida@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 13, name: '山口隆', email: 'yamaguchi@example.com', role: 'モデレーター', status: 'アクティブ' },
        { id: 14, name: '松本千尋', email: 'matsumoto@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 15, name: '井上悠斗', email: 'inoue@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 16, name: '木村愛', email: 'kimura@example.com', role: 'ユーザー', status: '非アクティブ' },
        { id: 17, name: '林大樹', email: 'hayashi@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 18, name: '斎藤美月', email: 'saito@example.com', role: 'モデレーター', status: 'アクティブ' },
        { id: 19, name: '清水陽介', email: 'shimizu@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 20, name: '山崎結衣', email: 'yamazaki@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 21, name: '森本拓海', email: 'morimoto@example.com', role: 'ユーザー', status: '非アクティブ' },
        { id: 22, name: '池田彩華', email: 'ikeda@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 23, name: '橋本健吾', email: 'hashimoto@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 24, name: '石川優衣', email: 'ishikawa@example.com', role: 'モデレーター', status: 'アクティブ' },
        { id: 25, name: '前田涼太', email: 'maeda@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 26, name: '藤田美優', email: 'fujita@example.com', role: 'ユーザー', status: '非アクティブ' },
        { id: 27, name: '岡田颯', email: 'okada@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 28, name: '後藤葵', email: 'goto@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 29, name: '長谷川蓮', email: 'hasegawa@example.com', role: 'ユーザー', status: 'アクティブ' },
        { id: 30, name: '村上陽菜', email: 'murakami@example.com', role: 'ユーザー', status: '非アクティブ' }
    ]

    // フィルタリング
    let filteredUsers = allUsers
    if (search.trim()) {
        const searchLower = search.toLowerCase().trim()
        filteredUsers = allUsers.filter(user =>
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        )
    }

    // 総件数
    const total = filteredUsers.length

    // ページネーション
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
        success: true,
        data: paginatedUsers,
        pagination: {
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage)
        }
    }
})
