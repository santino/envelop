import 'prism-themes/themes/prism-atom-dark.css';
import 'tailwindcss/tailwind.css';

import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { ReactNode, useMemo } from 'react';

import { Box, chakra, ChakraProvider, extendTheme, Stack } from '@chakra-ui/react';
import { components, ExtendComponents, iterateRoutes, MdxInternalProps, MDXNavigation, NextNProgress } from '@guild-docs/client';
import { MDXProvider } from '@mdx-js/react';

import type { AppProps } from 'next/app';

const theme = extendTheme({
  colors: {},
  initialColorMode: 'light',
  useSystemColorMode: false,
});

const a = chakra('a', {
  baseStyle: {
    fontWeight: 'bold',
    color: 'blue.600',
  },
});

ExtendComponents({
  HelloWorld() {
    return <p>Hello World!</p>;
  },
  a,
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
let mdxRoutesData = serializedMdx && JSON.parse(serializedMdx);

function App({ Component, pageProps }: AppProps) {
  const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;
  const Navigation = useMemo(() => {
    const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);

    return <MDXNavigation paths={iterateRoutes(paths)} />;
  }, [mdxRoutes]);
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
        <link href="/admonitions.css" rel="stylesheet" />
      </Head>
      <NextNProgress />
      <MDXProvider components={components}>
        <AppThemeProvider>
          <Stack isInline>
            <Box maxW="280px" width="100%">
              {Navigation}
            </Box>
            <Component {...pageProps} />
          </Stack>
        </AppThemeProvider>
      </MDXProvider>
    </>
  );
}

export default appWithTranslation(App);
