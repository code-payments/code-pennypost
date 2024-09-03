import path from 'path';
import fs from 'fs';
import { Application } from 'express';
import { ViteDevServer } from 'vite';
import type { Render } from './src/entry-server';

interface Config {
    readonly prod: boolean;
    readonly base: string;
}

export type Renderer = Awaited<ReturnType<typeof useRenderer>>;

async function useRenderer(app: Application, config: Config) {
    const opt = {
        base: config.base,
        prod: config.prod,
    };

    let vite: ViteDevServer | undefined = undefined;
    if (!opt.prod) {
        vite = await setupViteDevelopmentServer(opt);
        app.use(vite.middlewares);
    } else {
        await setupProductionEnvironment(app, opt);
    }

    const { cachedTemplateHtml, cachedSsrManifest } = cacheAssetsForProduction();
    async function compileTemplate(url:string) {
        try {
            let template: string;
            let fn: Render;

            if (!opt.prod && vite) {
                template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')
                template = await vite.transformIndexHtml(url, template);
                fn = (await vite.ssrLoadModule(path.join(__dirname, '/src/entry-server.ts'))).render as Render;
            } else {
                template = cachedTemplateHtml;
                fn = (await import(path.join(__dirname, 'dist/frontend/server/entry-server.js'))).render as Render;
            }

            return { 
                template, 
                render: (ctx: Record<string, any> = {}) => {
                        return fn(url, cachedSsrManifest, ctx);
                }
            };
        } catch (e: any) {
            if (vite) {
                vite.ssrFixStacktrace(e);
            }
            console.error(e.stack);
            throw e;
        }
    }

    return {
        compileTemplate,
        cachedSsrManifest,
        cachedTemplateHtml,
    };
}

async function setupViteDevelopmentServer(config: Config): Promise<ViteDevServer> {
    const { createServer } = await import('vite');
    return createServer({
        base: config.base,
        root: path.resolve(__dirname, './'),
        server: { middlewareMode: true },
        appType: 'custom',
    });
}

async function setupProductionEnvironment(app: Application, config: Config) {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;

    app.use(compression());
    app.use(config.base, sirv(path.join(__dirname, 'dist/frontend/client'), { extensions: [] }));
}

function cacheAssetsForProduction() {
    let cachedTemplateHtml = '';
    let cachedSsrManifest = {};

    cachedTemplateHtml = fs.readFileSync(path.join(__dirname, 'dist/frontend/client/index.html'), 'utf-8');
    cachedSsrManifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist/frontend/client/.vite/ssr-manifest.json'), 'utf-8'));

    return { cachedTemplateHtml, cachedSsrManifest };
}

export { useRenderer };