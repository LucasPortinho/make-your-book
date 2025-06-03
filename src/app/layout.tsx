import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'JustIlustrate',
    template: '%s | JustIlustrate'
  },
  description: "Ilustre ou crie gibis a partir de seus livros!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
