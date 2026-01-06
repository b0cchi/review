<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <div class="mx-auto px-6 py-8 max-w-7xl">
      <!-- ヘッダーセクション -->
      <div class="mb-6">
        <h1 class="mb-1 font-bold text-slate-800 text-3xl tracking-tight">ユーザー管理</h1>
        <p class="text-slate-600 text-sm">システムユーザーの一覧管理と検索</p>
      </div>

      <!-- エラー状態 -->
      <div v-if="error" class="bg-white shadow-sm rounded-xl overflow-hidden">
        <div class="bg-red-50 px-6 py-4 border-red-200 border-l-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="font-semibold text-red-800 text-sm">エラーが発生しました</h3>
              <p class="mt-1 text-red-700 text-sm">{{ error.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- メインコンテンツ -->
      <div v-else>
        <!-- 検索とフィルターセクション -->
        <div class="bg-white shadow-sm mb-4 px-5 py-4 rounded-xl">
          <div class="flex md:flex-row flex-col md:items-end gap-3">
            <div class="flex-1">
              <label for="searchQuery" class="block mb-1.5 font-medium text-slate-700 text-xs">
                検索
              </label>
              <div class="relative">
                <div class="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input id="searchQuery" v-model="searchQuery" type="text" placeholder="ユーザー名またはメールアドレスで検索..."
                  class="bg-slate-50 focus:bg-white px-3 py-2 pl-9 border border-slate-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 w-full text-sm transition-all" />
              </div>
            </div>
            <button v-if="searchQuery" @click="clearSearch"
              class="flex justify-center items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-slate-700 text-sm transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              クリア
            </button>
          </div>
        </div>

        <!-- データ統計 -->
        <div class="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 mb-4">
          <div class="flex items-center gap-2 text-slate-600 text-xs">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="font-medium">全 <span class="font-bold text-slate-800">{{ total }}</span> 件中</span>
            <span class="font-bold text-blue-600">{{ displayStart }} - {{ displayEnd }}</span>
            <span>件を表示</span>
          </div>

          <div class="flex items-center gap-2">
            <label for="perPage" class="text-slate-700 text-xs whitespace-nowrap">表示件数:</label>
            <select id="perPage" v-model="perPage" @change="currentPage = 1"
              class="bg-white px-3 py-1.5 border border-slate-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs transition-all cursor-pointer">
              <option :value="5">5件</option>
              <option :value="10">10件</option>
              <option :value="20">20件</option>
              <option :value="30">30件</option>
            </select>
          </div>
        </div>

        <!-- テーブル -->
        <div class="bg-white shadow-sm rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gradient-to-r from-slate-700 to-slate-800">
                  <th class="px-4 py-2.5 font-semibold text-slate-100 text-xs text-left uppercase tracking-wider">ID
                  </th>
                  <th class="px-4 py-2.5 font-semibold text-slate-100 text-xs text-left uppercase tracking-wider">名前
                  </th>
                  <th class="px-4 py-2.5 font-semibold text-slate-100 text-xs text-left uppercase tracking-wider">
                    メールアドレス</th>
                  <th class="px-4 py-2.5 font-semibold text-slate-100 text-xs text-left uppercase tracking-wider">権限
                  </th>
                  <th class="px-4 py-2.5 font-semibold text-slate-100 text-xs text-left uppercase tracking-wider">ステータス
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <!-- ローディング状態 -->
                <tr v-if="pending">
                  <td colspan="5" class="px-4 py-12 text-center">
                    <div class="flex flex-col justify-center items-center">
                      <div
                        class="opacity-75 mb-3 border-slate-200 border-t-4 border-t-blue-600 rounded-full w-10 h-10 animate-spin">
                      </div>
                      <p class="text-slate-600 text-sm">データを読み込んでいます...</p>
                    </div>
                  </td>
                </tr>
                <!-- データ表示 -->
                <tr v-else v-for="user in paginatedUsers" :key="user.id"
                  class="hover:bg-slate-50 transition-colors duration-150">
                  <td class="px-4 py-2 font-mono text-slate-600 text-xs whitespace-nowrap">{{ user.id }}</td>
                  <td class="px-4 py-2 text-slate-800 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <div
                        class="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm rounded-full w-7 h-7 font-semibold text-white text-xs">
                        {{ user.name.substring(0, 2).toUpperCase() }}
                      </div>
                      <span class="font-medium text-sm">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-2 text-slate-700 text-sm">{{ user.email }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span
                      class="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-700 text-xs">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span :class="[
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
                      user.status === 'アクティブ'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    ]">
                      <span :class="[
                        'w-1.5 h-1.5 rounded-full',
                        user.status === 'アクティブ' ? 'bg-emerald-500' : 'bg-rose-500'
                      ]"></span>
                      {{ user.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ページネーション -->
        <div class="bg-white shadow-sm mt-6 px-6 py-4 rounded-xl">
          <div class="flex md:flex-row flex-col justify-between items-center gap-4">
            <!-- ナビゲーションボタン -->
            <div class="flex flex-wrap justify-center items-center gap-2">
              <button @click="currentPage = 1" :disabled="currentPage === 1"
                class="flex items-center gap-1 bg-white hover:bg-slate-50 disabled:opacity-40 px-4 py-2 border border-slate-300 hover:border-slate-400 rounded-lg font-medium text-slate-700 text-sm transition-all disabled:cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
                最初
              </button>

              <button @click="currentPage--" :disabled="currentPage === 1"
                class="flex items-center gap-1 bg-white hover:bg-slate-50 disabled:opacity-40 px-4 py-2 border border-slate-300 hover:border-slate-400 rounded-lg font-medium text-slate-700 text-sm transition-all disabled:cursor-not-allowed">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                前へ
              </button>

              <div class="flex gap-1">
                <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="[
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                  currentPage === page
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                ]">
                  {{ page }}
                </button>
              </div>

              <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="flex items-center gap-1 bg-white hover:bg-slate-50 disabled:opacity-40 px-4 py-2 border border-slate-300 hover:border-slate-400 rounded-lg font-medium text-slate-700 text-sm transition-all disabled:cursor-not-allowed">
                次へ
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
                class="flex items-center gap-1 bg-white hover:bg-slate-50 disabled:opacity-40 px-4 py-2 border border-slate-300 hover:border-slate-400 rounded-lg font-medium text-slate-700 text-sm transition-all disabled:cursor-not-allowed">
                最後
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- ページ情報 -->
            <div class="text-slate-600 text-sm">
              <span class="font-medium">Page {{ currentPage }}</span> of <span class="font-medium">{{ totalPages
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, ApiResponse } from '../types/user'

// ページネーション関連の状態
const currentPage = ref(1)
const perPage = ref(10)
const searchQuery = ref('')

// 検索クエリが変更されたらページを1に戻す
watch(searchQuery, () => {
  currentPage.value = 1
})

// サーバーサイドからデータを取得（リアクティブなクエリパラメータ）
const { data, pending, error } = await useFetch<ApiResponse>('/api/users', {
  query: {
    page: currentPage,
    perPage: perPage,
    search: searchQuery
  },
  watch: [currentPage, perPage, searchQuery]
})

// ユーザーデータを取得
const paginatedUsers = computed(() => data.value?.data || [])

// ページネーション情報
const total = computed(() => data.value?.pagination.total || 0)
const totalPages = computed(() => data.value?.pagination.totalPages || 1)

// 表示範囲の計算
const displayStart = computed(() => {
  if (total.value === 0) return 0
  return (currentPage.value - 1) * perPage.value + 1
})

const displayEnd = computed(() => {
  return Math.min(currentPage.value * perPage.value, total.value)
})

// 検索をクリア
const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

// 表示するページ番号ボタン（最大7個）
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 7
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>