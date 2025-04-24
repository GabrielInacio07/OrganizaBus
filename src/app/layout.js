import '@/styles/globals.css';
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <title>OrganizaBus - O seu sistema de gestão financeira</title>
      </head>
      <body>{children}</body>
    </html>
  );
}