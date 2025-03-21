import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientCompopnent from '@/layouts/ClientComponent';
import Providers from '@/layouts/SessionAuth';
import AuthProvider from '@/stores/Provider';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientCompopnent>

          <Providers>
            <div id="datepicker-root">
              {children}
            </div>
          </Providers>

        </ClientCompopnent>
      </body>
    </html>
  );
}
