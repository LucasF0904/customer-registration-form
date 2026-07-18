import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'

export const metadata: Metadata = {
  title: 'Backoffice — Cadastro de Clientes',
}

async function getAdminEmail(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) redirect('/?login=1')

  try {
    const part = token.split('.')[1] ?? ''
    const payload = JSON.parse(Buffer.from(part, 'base64').toString())
    return payload.email ?? 'Admin'
  } catch {
    return 'Admin'
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail()

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg)' }}>
      <AdminHeader email={email} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
