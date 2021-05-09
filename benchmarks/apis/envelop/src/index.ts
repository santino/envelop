import Fastify from 'fastify';
import { requireEnv } from 'require-env-variable';

import { useParserCache } from '@envelop/parser-cache';
import { useValidationCache } from '@envelop/validation-cache';
import { CreateApp } from '@pablosz/envelop-app/fastify';
import { schema } from 'envelop-bench';

const app = Fastify({
  logger: process.env.NODE_ENV !== 'production',
});

process.env.CACHE && console.log('Added Cache Plugins in Envelop');
process.env.JIT && console.log('Added JIT in Envelop');

app.register(
  CreateApp({
    plugins: process.env.CACHE ? [useParserCache(), useValidationCache()] : undefined,
    schema,
    jit: !!process.env.JIT,
    ide: false,
  }).buildApp({}).plugin
);

app.listen(requireEnv('PORT').PORT);
