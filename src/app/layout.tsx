import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import './globals.css'

export const metadata: Metadata = {
  title: 'Roberto`s Mission',
  description: '',
}

const robotoFont = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: '400'
})

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang='pt' className={`${robotoFont.variable} font-sans antialiased`}>
    <body className='min-h-screen'>
      <main className='flex flex-col h-[100vh] px-2'>
        { children }
      </main>
    </body>
  </html>
}
