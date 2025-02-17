import { DocumentNode, ExecutionArgs, GraphQLFieldResolver, GraphQLSchema, GraphQLTypeResolver, SubscriptionArgs } from 'graphql';
import { ArbitraryObject, Maybe } from '@envelop/types';
import { EnvelopOrchestrator } from './orchestrator';
import { isAsyncIterable } from './utils';

const getTimestamp =
  typeof globalThis !== 'undefined' && globalThis?.performance?.now ? () => performance.now() : () => Date.now();

const measure = () => {
  const start = getTimestamp();
  return () => {
    const end = getTimestamp();
    return end - start;
  };
};

const tracingSymbol = Symbol('envelopTracing');

export function traceOrchestrator<TInitialContext extends ArbitraryObject, TPluginsContext extends ArbitraryObject>(
  orchestrator: EnvelopOrchestrator<TInitialContext, TPluginsContext>
): EnvelopOrchestrator<TInitialContext & { [tracingSymbol]?: {} }, TPluginsContext> {
  const createTracer = (name: string, ctx: Record<string | symbol, any>) => {
    const end = measure();

    return () => {
      ctx[tracingSymbol][name] = end();
    };
  };

  return {
    ...orchestrator,
    init: (ctx = {} as TInitialContext) => {
      ctx![tracingSymbol] = ctx![tracingSymbol] || {};
      const done = createTracer('init', ctx || {});

      try {
        return orchestrator.init(ctx);
      } finally {
        done();
      }
    },
    parse: (ctx = {} as TInitialContext) => {
      ctx[tracingSymbol] = ctx[tracingSymbol] || {};
      const actualFn = orchestrator.parse(ctx);

      return (...args) => {
        const done = createTracer('parse', ctx);

        try {
          return actualFn(...args);
        } finally {
          done();
        }
      };
    },
    validate: (ctx = {} as TInitialContext) => {
      ctx[tracingSymbol] = ctx[tracingSymbol] || {};
      const actualFn = orchestrator.validate(ctx);

      return (...args) => {
        const done = createTracer('validate', ctx);

        try {
          return actualFn(...args);
        } finally {
          done();
        }
      };
    },
    execute: async (
      argsOrSchema: ExecutionArgs | GraphQLSchema,
      document?: DocumentNode,
      rootValue?: any,
      contextValue?: any,
      variableValues?: Maybe<{ [key: string]: any }>,
      operationName?: Maybe<string>,
      fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
      typeResolver?: Maybe<GraphQLTypeResolver<any, any>>
    ) => {
      const args: ExecutionArgs =
        argsOrSchema instanceof GraphQLSchema
          ? {
              schema: argsOrSchema,
              document: document!,
              rootValue,
              contextValue,
              variableValues,
              operationName,
              fieldResolver,
              typeResolver,
            }
          : argsOrSchema;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore GraphQL.js types contextValue as unknown
      const done = createTracer('execute', args.contextValue || {});

      try {
        const result = await orchestrator.execute(args);
        done();

        if (!isAsyncIterable(result)) {
          result.extensions = result.extensions || {};
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore GraphQL.js types contextValue as unknown
          result.extensions.envelopTracing = args.contextValue[tracingSymbol];
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            `"traceOrchestrator" encountered a AsyncIterator which is not supported yet, so tracing data is not available for the operation.`
          );
        }

        return result;
      } catch (e) {
        done();

        throw e;
      }
    },
    subscribe: async (
      argsOrSchema: SubscriptionArgs | GraphQLSchema,
      document?: DocumentNode,
      rootValue?: any,
      contextValue?: any,
      variableValues?: Maybe<{ [key: string]: any }>,
      operationName?: Maybe<string>,
      fieldResolver?: Maybe<GraphQLFieldResolver<any, any>>,
      subscribeFieldResolver?: Maybe<GraphQLFieldResolver<any, any>>
    ) => {
      const args: SubscriptionArgs =
        argsOrSchema instanceof GraphQLSchema
          ? {
              schema: argsOrSchema,
              document: document!,
              rootValue,
              contextValue,
              variableValues,
              operationName,
              fieldResolver,
              subscribeFieldResolver,
            }
          : argsOrSchema;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore GraphQL.js types contextValue as unknown
      const done = createTracer('subscribe', args.contextValue || {});

      try {
        return await orchestrator.subscribe(args);
      } finally {
        done();
      }
    },
    contextFactory: (ctx = {} as TInitialContext) => {
      const actualFn = orchestrator.contextFactory(ctx);

      return async childCtx => {
        const done = createTracer('contextFactory', ctx);

        try {
          return await actualFn(childCtx);
        } finally {
          done();
        }
      };
    },
  };
}
