import { Users } from 'lucide-react'
import { RegistrationForm } from '@/components/registration-form/registration-form'
import { apiClient } from '@/lib/api-client'
import { RainbowColor } from '@customer-reg/shared'

async function getColors(): Promise<RainbowColor[]> {
  try {
    const response = await apiClient.colors.list()
    return response.data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const colors = await getColors()

  return (
    <div className="flex min-h-screen">
      <aside
        className="sticky top-0 flex h-screen w-[420px] shrink-0 flex-col justify-between p-14"
        style={{ background: 'var(--panel-bg)', color: 'var(--panel-text)' }}
      >
        <div>
          <div className="mb-12 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--cta)]">
              <Users className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span
              className="text-[15px] font-bold tracking-tight"
              style={{ color: 'var(--panel-text)' }}
            >
              John Doe
            </span>
          </div>

          <h1
            className="mb-4 text-[30px] font-bold leading-tight tracking-[-0.03em]"
            style={{ color: 'var(--panel-text)', textWrap: 'balance' }}
          >
            Cadastro de clientes
          </h1>
          <p
            className="max-w-[300px] text-[15px] leading-relaxed"
            style={{ color: 'var(--panel-muted)' }}
          >
            Preencha o formulário uma única vez. Suas informações são armazenadas com segurança.
          </p>

          <div className="mt-12 space-y-5">
            <Step label="Informações pessoais" desc="Nome, CPF e e-mail" active />
            <Step label="Preferências" desc="Cor favorita e observações" />
            <Step label="Confirmação" desc="Cadastro concluído" />
          </div>
        </div>

        <p className="text-xs" style={{ color: '#334155' }}>
          Seus dados são protegidos e utilizados exclusivamente para fins de cadastro.
        </p>
      </aside>

      <main className="flex flex-1 items-start justify-center p-14 max-[900px]:p-6">
        <div className="w-full max-w-[520px]">
          <div className="mb-9">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--cta)]">
              Novo cadastro
            </p>
            <h2 className="mb-2 text-[26px] font-bold tracking-[-0.03em] text-[var(--text)]">
              Preencha suas informações
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Todos os campos marcados com <strong className="text-[var(--cta)]">*</strong> são
              obrigatórios.
            </p>
          </div>

          <RegistrationForm colors={colors} />

          <p className="mt-4 text-center text-xs leading-relaxed text-[var(--subtle)]">
            Cadastro realizado uma única vez por CPF e e-mail.
            <br />
            Em caso de dúvidas, entre em contato com o suporte.
          </p>
        </div>
      </main>
    </div>
  )
}

function Step({ label, desc, active = false }: { label: string; desc: string; active?: boolean }) {
  return (
    <div className="flex items-start gap-3.5">
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
          active ? 'border-[var(--cta)] bg-[var(--cta)]' : 'border-[#334155]'
        }`}
      >
        {active && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="h-3 w-3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div>
        <p
          className={`text-[13px] font-semibold uppercase tracking-[0.04em] ${active ? '' : ''}`}
          style={{ color: active ? 'var(--panel-text)' : 'var(--panel-muted)' }}
        >
          {label}
        </p>
        <p className="text-[13px]" style={{ color: 'var(--panel-muted)' }}>
          {desc}
        </p>
      </div>
    </div>
  )
}
