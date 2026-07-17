import { CheckCircle2 } from 'lucide-react'
import type { RegisterCustomerResponse } from '@customer-reg/shared'

interface SuccessScreenProps {
  data: RegisterCustomerResponse
}

export function SuccessScreen({ data }: SuccessScreenProps) {
  return (
    <div className="rounded-[10px] border border-[var(--border)] bg-[var(--card)] p-9 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950">
        <CheckCircle2 className="h-7 w-7 text-emerald-600" strokeWidth={2} />
      </div>

      <h2 className="mb-2.5 text-xl font-bold tracking-tight text-[var(--text)]">
        Cadastro realizado!
      </h2>
      <p className="mx-auto max-w-sm text-sm leading-relaxed text-[var(--muted)]">
        Suas informações foram registradas com sucesso. Obrigado pelo preenchimento.
      </p>

      <div className="mt-7 rounded border border-[var(--border)] bg-[var(--bg)] p-4 text-left">
        <DetailRow label="Nome" value={data.name} />
        <DetailRow label="CPF" value={formatCpf(data.cpf)} />
        <DetailRow label="E-mail" value={data.email} />
        <DetailRow
          label="Cor preferida"
          value={
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: data.color.hexCode }}
              />
              {data.color.name}
            </span>
          }
        />
        {data.notes && <DetailRow label="Obs." value={data.notes} last />}
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string
  value: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 text-sm ${last ? '' : 'border-b border-[var(--border)]'}`}
    >
      <span className="font-semibold tracking-wide text-[var(--muted)]">{label}</span>
      <span className="text-[var(--text)]">{value}</span>
    </div>
  )
}

function formatCpf(cpf: string): string {
  const d = cpf.replace(/\D/g, '')
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`
}
