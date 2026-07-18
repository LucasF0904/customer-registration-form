import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { KpiCard } from '@/components/admin/kpi-card'
import { CustomersTable } from '@/components/admin/customers-table'
import { CustomerListItem, CustomerStats, PaginatedMeta, RainbowColor } from '@customer-reg/shared'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

async function getToken(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) redirect('/?login=1')
  return token
}

async function getStats(token: string): Promise<CustomerStats> {
  const res = await fetch(`${API}/customers/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return { total: 0, byColor: [] }
  const data = await res.json()
  return data.data ?? { total: 0, byColor: [] }
}

async function getColors(token: string): Promise<RainbowColor[]> {
  const res = await fetch(`${API}/colors`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 86400 },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.data ?? []
}

async function getCustomers(
  token: string,
  params: Record<string, string>,
): Promise<{ customers: CustomerListItem[]; meta: PaginatedMeta }> {
  const qs = new URLSearchParams({
    page: params.page ?? '1',
    limit: '10',
    ...(params.search ? { search: params.search } : {}),
    ...(params.colorId ? { colorId: params.colorId } : {}),
  })

  const res = await fetch(`${API}/customers?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) return { customers: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } }
  const data = await res.json()

  return {
    customers: data.data ?? [],
    meta: data.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const token = await getToken()

  const [stats, colors, { customers, meta }] = await Promise.all([
    getStats(token),
    getColors(token),
    getCustomers(token, params),
  ])

  const topColor = stats.byColor[0]

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      {/* KPIs */}
      <div>
        <h1 className="mb-5 text-[20px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          Visão geral
        </h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard
            label="Total de clientes"
            value={stats.total}
            sub="cadastros realizados"
            accent="var(--cta)"
            index={0}
          />
          <KpiCard
            label="Cores diferentes"
            value={stats.byColor.length}
            sub="variações de preferência"
            accent="#7C3AED"
            index={1}
          />
          <KpiCard
            label="Cor mais popular"
            value={topColor?.colorName ?? '—'}
            sub={
              topColor ? `${topColor.count} cliente${topColor.count !== 1 ? 's' : ''}` : 'sem dados'
            }
            accent={topColor?.hexCode ?? 'var(--muted)'}
            index={2}
          />
          <KpiCard
            label="Página atual"
            value={`${meta.page} / ${meta.totalPages || 1}`}
            sub={`${meta.total} resultado${meta.total !== 1 ? 's' : ''} filtrados`}
            accent="var(--success)"
            index={3}
          />
        </div>
      </div>

      {/* Color distribution */}
      {stats.byColor.length > 0 && (
        <div>
          <h2
            className="mb-3 text-[13px] font-bold uppercase tracking-[0.06em]"
            style={{ color: 'var(--muted)' }}
          >
            Distribuição por cor
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.byColor.map((item) => (
              <span
                key={item.colorId}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
                style={{ background: `${item.hexCode}22`, color: item.hexCode }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: item.hexCode }}
                />
                {item.colorName} ({item.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div>
        <h2 className="mb-3 text-[20px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          Clientes cadastrados
        </h2>
        <CustomersTable customers={customers} meta={meta} colors={colors} />
      </div>
    </main>
  )
}
