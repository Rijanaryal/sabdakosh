import "./globals.css";

export const metadata = {
  title: "Morphem — Words, Meaning, Understanding",
  description: "Explore English words, definitions, pronunciation, examples and Nepali translations.",
  icons: { icon: "/morphem.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
