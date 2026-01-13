import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    // ワイルドカードで未定義パスを404にフォールバック
    route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
