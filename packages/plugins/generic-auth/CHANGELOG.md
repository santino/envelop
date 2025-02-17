# @envelop/generic-auth

## 4.0.0

### Major Changes

- 7f78839: Use the extended validation phase instead of resolver wrapping for applying authentication rules.

  `onResolverCalled` results in wrapping all resolvers in the schema and can be a severe performance bottle-neck.

  Now the authorization rules are applied statically before running any execution logic, which results in the WHOLE operation being rejected as soon as a field in the selection set does not have sufficient permissions.

  The mode `protect-auth-directive` has been renamed to `protect-granular`.

  The `authDirectiveName` option got renamed to `directiveOrExtensionFieldName`.

  Authorization rules for the `protect-all` and `protect-granular`, can be applied via field extensions:

  ```typescript
  // schema.ts
  import { GraphQLObjectType, GraphQLInt } from 'graphql';

  const GraphQLQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      foo: {
        type: GraphQLInt,
        resolve: () => 1,
        extensions: {
          skipAuth: true,
          // or auth: true for mode "protect-granular".
        },
      },
    },
  });
  ```
  
  The `validateUser` function is no longer attached to the `context` object passed to the resolvers. You can add your own `validateUser` function to the context using `useExtendContext`.
  
  ```typescript
  const getEnveloped = envelop({
    plugins: [
      useSchema(schema),
      useGenericAuth(options),
      useExtendContext(() => ({ validateUser })),
    ],
  });
  ```

### Minor Changes

- Updated dependencies [78b3db2]
- Updated dependencies [f5eb436]
  - @envelop/core@2.1.0

### Patch Changes

- Updated dependencies [78b3db2]
- Updated dependencies [8030244]
  - @envelop/extended-validation@1.4.0

## 3.0.0

### Patch Changes

- Updated dependencies [4106e08]
- Updated dependencies [aac65ef]
- Updated dependencies [4106e08]
  - @envelop/core@2.0.0

## 2.0.0

### Patch Changes

- Updated dependencies [d9cfb7c]
  - @envelop/core@1.7.0

## 1.2.1

### Patch Changes

- b1a0331: Properly list `@envelop/core` as a `peerDependency` in plugins.

  This resolves issues where the bundled envelop plugins published to npm had logic inlined from the `@envelop/core` package, causing `instanceof` check of `EnvelopError` to fail.

- Updated dependencies [b1a0331]
  - @envelop/core@1.6.1

## 1.2.0

### Minor Changes

- 090cae4: GraphQL v16 support

## 1.1.0

### Minor Changes

- 04120de: add support for GraphQL.js 16

### Patch Changes

- 9f63dac: Add `skipAuth` directive to `protect-all` auth option

## 1.0.1

### Patch Changes

- 546db6c: Fix issue with inaccessible directiveNode

## 1.0.1

### Patch Changes

- Fix issue with inaccessible directiveNode

## 1.0.0

### Major Changes

- 40bc444: v1 major release for envelop packages

## 0.2.0

### Minor Changes

- 83b2b92: Extend plugin errors from GraphQLError.

## 0.1.1

### Patch Changes

- 28ad742: Improve TypeScript types

## 0.1.0

### Minor Changes

- eb6f53b: ESM Support for all plugins and envelop core

## 0.0.2

### Patch Changes

- 5fc65a4: Improved type-safety for internal context

## 0.0.1

### Patch Changes

- 55a13bd: NEW PLUGIN!
