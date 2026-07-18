'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { CustomerListItem, RainbowColor, PaginatedMeta } from '@customer-reg/shared'
import { CustomerDetailModal } from './customer-detail-modal'

interface CustomersTableProps {
  customers: CustomerListItem[]
  meta: PaginatedMeta
  colors: RainbowColor[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function CustomersTable({ customers, meta, colors }: CustomersTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<CustomerListItem | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [colorFilter, setColorFilter] = useState(searchParams.get('colorId') ?? '')

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v)
        else params.delete(k)
      })
      params.delete('page')
      startTransition(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push(`${pathname}?${params.toString()}` as any)
      })
    },
    [router, pathname, searchParams],
  )

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    startTransition(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`${pathname}?${params.toString()}` as any)
    })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    updateParams({ search: value, colorId: colorFilter })
  }

  const handleColorFilter = (value: string) => {
    setColorFilter(value)
    updateParams({ search, colorId: value })
  }

  return (
    <>
      <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} />

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        {/* Filters */}
        <div
          className="flex flex-wrap items-center gap-3 border-b px-5 py-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: 'var(--muted)' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nome, CPF ou e-mail…"
              className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--cta)]"
              style={{
                background: 'var(--input-bg)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          <select
            value={colorFilter}
            onChange={(e) => handleColorFilter(e.target.value)}
            className="rounded-lg border py-2 pl-3 pr-8 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-[var(--cta)]"
            style={{
              background: 'var(--input-bg)',
              borderColor: 'var(--border)',
              color: 'var(--text)',
            }}
          >
            <option value="">Todas as cores</option>
            {colors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--muted)' }} />
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
              >
                {['Nome', 'CPF', 'E-mail', 'Cor preferida', 'Cadastrado em'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em]"
                    style={{ color: 'var(--muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {customers.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm"
                      style={{ color: 'var(--muted)', background: 'var(--card)' }}
                    >
                      Nenhum cliente encontrado.
                    </td>
                  </motion.tr>
                ) : (
                  customers.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      className="border-b cursor-pointer transition-colors"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'var(--card)',
                      }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ backgroundColor: 'var(--bg)' } as Record<string, string>}
                      onClick={() => setSelected(c)}
                    >
                      <td className="px-5 py-3.5 font-medium" style={{ color: 'var(--text)' }}>
                        <div className="flex items-center gap-2.5">
                          <span
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ background: c.color.hexCode }}
                          >
                            {c.name.charAt(0).toUpperCase()}
                          </span>
                          {c.name}
                        </div>
                      </td>
                      <td
                        className="px-5 py-3.5 font-mono text-[12px]"
                        style={{ color: 'var(--muted)' }}
                      >
                        {c.cpfMasked}
                      </td>
                      <td className="px-5 py-3.5" style={{ color: 'var(--muted)' }}>
                        {c.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{ background: `${c.color.hexCode}22`, color: c.color.hexCode }}
                        >
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ background: c.color.hexCode }}
                          />
                          {c.color.name}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px]" style={{ color: 'var(--subtle)' }}>
                        {formatDate(c.createdAt)}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between border-t px-5 py-3"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
            {meta.total === 0
              ? 'Nenhum registro'
              : `${(meta.page - 1) * meta.limit + 1}–${Math.min(meta.page * meta.limit, meta.total)} de ${meta.total}`}
          </p>

          <div className="flex items-center gap-1">
            <motion.button
              onClick={() => goToPage(meta.page - 1)}
              disabled={meta.page <= 1 || isPending}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: 'var(--muted)' }}
              whileHover={{ backgroundColor: 'var(--border)' } as Record<string, string>}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            <span className="min-w-[60px] text-center text-[12px]" style={{ color: 'var(--text)' }}>
              {meta.page} / {meta.totalPages || 1}
            </span>

            <motion.button
              onClick={() => goToPage(meta.page + 1)}
              disabled={meta.page >= meta.totalPages || isPending}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: 'var(--muted)' }}
              whileHover={{ backgroundColor: 'var(--border)' } as Record<string, string>}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </>
  )
}
