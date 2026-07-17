import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cadastro de Clientes',
  description: 'Formulário de cadastro único de clientes — John Doe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
