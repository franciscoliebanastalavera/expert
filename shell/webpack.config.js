const path = require('path');

/**
 * Tell webpack to resolve every node module against shell/node_modules first.
 *
 * Why: the shell statically imports components from @capitalflow/shared-ui,
 * whose ng-packagr output emits .mjs files under shared-ui/dist/fesm2022/...
 * Webpack's default Node resolution starts at the importer's directory and
 * walks up looking for node_modules. Once shared-ui/node_modules no longer
 * contains @angular/* (those packages live as peerDependencies and have
 * been pruned to avoid duplication), webpack walking up from a shared-ui
 * .mjs would not find Angular at all and the build would fail.
 *
 * Adding shell/node_modules as the first entry in resolve.modules makes
 * webpack look there first regardless of where the import originates.
 * Combined with the pruned shared-ui/node_modules this guarantees:
 *   - one single physical copy of @angular/* in the bundle (no duplicated
 *     RuntimeContext, no "bindingStartIndex" crash);
 *   - working resolution of subpaths exposed via Angular's package.json
 *     exports map (rxjs-interop, primitives/signals, cdk/scrolling, ...)
 *     because we are not aliasing those — the package's own exports field
 *     keeps doing its job.
 */
module.exports = {
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
  },
};
