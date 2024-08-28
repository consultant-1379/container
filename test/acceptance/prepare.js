#!/usr/bin/env node

console.log('Preparing tests');

[
    'dev'
  , 'dev-custom-name'
  , 'prod'
  , 'prod-custom-name'
  , 'backwards-compatibility-libs'
  , 'backwards-compatibility-assets'
].map(function (name) { return './stages/' + name; })
 .map(require)
 .forEach(function (stage) {
   stage.build();
});
