export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-2">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">404</p>
                <h1 className="text-2xl font-semibold">ページが見つかりません</h1>
                <p className="text-muted-foreground text-sm">指定されたパスは存在しません。</p>
            </div>
        </div>
    );
}
