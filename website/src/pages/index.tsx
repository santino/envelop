import { GetStaticProps } from 'next';

import { Box, Stack } from '@chakra-ui/react';
import { MDXPage } from '@guild-docs/client';
import { MDXProps } from '@guild-docs/server';

import { getRoutes } from '../../routes';

export default MDXPage(function IndexPage({ content, TOC }) {
  return (
    <Stack>
      <Box as="main" maxWidth="80ch">
        {content}
      </Box>
      <TOC
        boxProps={{
          paddingRight: '2em',
          position: 'fixed',
          top: '3em',
          right: 0,
          fontSize: '2xl',
        }}
      />
    </Stack>
  );
});

export const getStaticProps: GetStaticProps = ctx => {
  return MDXProps(
    ({ readFile }) => {
      return readFile('../README.md');
    },
    ctx,
    {
      getRoutes,
    }
  );
};
