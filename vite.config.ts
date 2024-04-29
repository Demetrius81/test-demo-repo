import inspect from 'vite-plugin-inspect';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

// export default defineConfig(() =>{

//   plugins: [inspect(), checker({ typescript: true }), tsconfigPaths()],
// };)

export default defineConfig(({ command, mode }) => {
  if (command === 'build' && mode === 'production') {
    return {
      base: './',
      plugins: [checker({ typescript: true }), tsconfigPaths()],
    };
  }
  return {
    plugins: [inspect(), checker({ typescript: true }), tsconfigPaths()],
  };
});
