var rollup = require('rollup').rollup;
var babel = require('rollup-plugin-babel');

rollup({
  entry: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [ 'es2015-rollup', 'react', 'stage-1' ],
    })
  ]
}).then(function (bundle) {
  // Alternatively, let Rollup do it for you
  // (this returns a promise). This is much
  // easier if you're generating a sourcemap
  return bundle.write({
    format: 'iife',
    dest: 'bundle.js'
  });
}).then(function (result) {
  console.log('built!');
}).catch(function (error) {
  console.log(error);
  if (error.codeFrame) {
    console.log(error.codeFrame);
  }
});
