import { RegistrationForm } from '@/components/registration-form/registration-form'
import { AnimatedPanel } from '@/components/registration-form/animated-panel'
import { LoginButton } from '@/components/auth/login-button'
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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ login?: string }>
}) {
  const colors = await getColors()
  const params = await searchParams
  const openLogin = params.login === '1'

  return (
    <div className="flex min-h-screen">
      <LoginButton autoOpen={openLogin} />

      <AnimatedPanel />

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
