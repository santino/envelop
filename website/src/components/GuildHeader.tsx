import { Header, ThemeProvider } from 'the-guild-components';

export function GuildHeader() {
  return (
    <ThemeProvider>
      <Header accentColor="#3b70b4" activeLink="/" />
    </ThemeProvider>
  );
}
