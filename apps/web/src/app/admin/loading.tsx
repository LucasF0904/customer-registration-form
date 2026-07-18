export default function AdminLoading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      {/* KPI skeleton */}
      <div>
        <div
          className="mb-5 h-6 w-36 animate-pulse rounded-lg"
          style={{ background: 'var(--border)' }}
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border p-5 space-y-2"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="h-3 w-20 rounded" style={{ background: 'var(--border)' }} />
              <div className="h-8 w-14 rounded" style={{ background: 'var(--border)' }} />
              <div className="h-3 w-28 rounded" style={{ background: 'var(--border)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div>
        <div
          className="mb-3 h-6 w-48 animate-pulse rounded-lg"
          style={{ background: 'var(--border)' }}
        />
        <div
          className="animate-pulse overflow-hidden rounded-xl border"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Filter bar */}
          <div
            className="flex gap-3 border-b px-5 py-4"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="h-9 flex-1 rounded-lg" style={{ background: 'var(--border)' }} />
            <div className="h-9 w-32 rounded-lg" style={{ background: 'var(--border)' }} />
          </div>

          {/* Header */}
          <div
            className="border-b px-5 py-3"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
          >
            <div className="flex gap-6">
              {[120, 80, 140, 90, 80].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded"
                  style={{ background: 'var(--border)', width: w }}
                />
              ))}
            </div>
          </div>

          {/* Rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 border-b px-5 py-3.5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-7 w-7 shrink-0 rounded-full"
                  style={{ background: 'var(--border)' }}
                />
                <div className="h-4 w-28 rounded" style={{ background: 'var(--border)' }} />
              </div>
              <div className="h-3 w-24 rounded" style={{ background: 'var(--border)' }} />
              <div className="h-3 w-36 rounded" style={{ background: 'var(--border)' }} />
              <div className="h-5 w-20 rounded-full" style={{ background: 'var(--border)' }} />
              <div className="h-3 w-20 rounded" style={{ background: 'var(--border)' }} />
            </div>
          ))}

          {/* Pagination */}
          <div
            className="flex items-center justify-between border-t px-5 py-3"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="h-3 w-24 rounded" style={{ background: 'var(--border)' }} />
            <div className="flex gap-1">
              <div className="h-7 w-7 rounded-lg" style={{ background: 'var(--border)' }} />
              <div className="h-7 w-14 rounded-lg" style={{ background: 'var(--border)' }} />
              <div className="h-7 w-7 rounded-lg" style={{ background: 'var(--border)' }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
