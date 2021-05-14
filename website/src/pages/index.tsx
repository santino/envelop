import { GetStaticProps } from 'next';

import { MDXPage } from '@guild-docs/client';
import { MDXProps } from '@guild-docs/server';

import { getRoutes } from '../../routes';

export default MDXPage(function IndexPage({ content }) {
  return <main>{content}</main>;
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
