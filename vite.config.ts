import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';

import { defineConfig, loadEnv } from 'vite';

import { createViteProxy, getBuildTime } from './build/config';
import { setupVitePlugins } from './build/plugins';

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;

  const buildTime = getBuildTime();

  const enableProxy = configEnv.command === 'serve' && !configEnv.isPreview;
  return {
    base: viteEnv.VITE_BASE_URL,
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // 屏蔽 "use client" / module-level directives 相关 warning（打包器提示不影响运行）
          const msg = String(warning.message ?? '');
          if (
            warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
            msg.includes('Module level directives cause errors when bundled') ||
            (msg.includes('"use client"') && msg.includes('was ignored'))
          ) {
            return;
          }
          warn(warning);
        },
        output: {
          assetFileNames: chunkInfo => {
            const name = chunkInfo.names[0];

            if (name?.endsWith('.css')) {
              return 'css/[name]-[hash].css';
            }

            const imgExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

            if (imgExts.some(ext => name?.endsWith(`.${ext}`))) {
              return 'images/[name]-[hash].[ext]';
            }

            if (name?.endsWith('.js')) {
              return 'js/[name]-[hash].js';
            }

            return 'assets/[name]-[hash].[ext]';
          },
          chunkFileNames: chunkInfo => {
            // 检查文件路径，如果是 pages 目录下的文件，则修改文件名和路径
            const filePath = chunkInfo.facadeModuleId;

            if (filePath) {
              // 提取文件的父文件夹作为文件名
              if (filePath.includes('/src/pages/')) {
                // 提取文件的父文件夹作为文件名
                const pageName = filePath.split('/src/pages/')[1];
                // 替换 [name] 为  name 因为vite不支持
                const newPath = pageName.replace(/\[([^\]]+)\]/g, '$1');

                const path = newPath.slice(0, newPath.lastIndexOf('/'));

                return `js/pages/${path}/[name]-[hash].js`;
              } else if (filePath.includes('/src/components/')) {
                return `js/components/[name]-[hash].js`;
              }
            }

            return 'js/[name]-[hash].js'; // 默认处理方式
          },
          manualChunks: {
            animate: ['motion'],
            antd: ['antd'],
            axios: ['axios'],
            react: ['react', 'react-dom', 'react-error-boundary'],
            reactRouter: ['react-router-dom'],
            sa: ['@sa/axios', '@sa/color', '@sa/hooks', '@sa/materials', '@sa/utils']
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/scss/global.scss" as *;`,
          api: 'modern-compiler'
        }
      }
    },
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
    preview: {
      port: 9725
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./', import.meta.url)),
        'base-app': fileURLToPath(new URL('./src/modules/base-app', import.meta.url)),
        'common-app': fileURLToPath(new URL('./src/modules/common-app', import.meta.url)),
        'workplace-app': fileURLToPath(new URL('./src/modules/workplace-app', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      open: true,
      port: 9527,
      proxy: createViteProxy(viteEnv, enableProxy),
      warmup: {
        clientFiles: ['./index.html', './src/{pages,components}/*']
      }
    }
  };
});
