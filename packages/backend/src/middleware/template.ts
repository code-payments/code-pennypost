import { NextFunction, Request, Response } from 'express';
import { Renderer } from '@code-pennypost/frontend/renderer';
import { useConfig } from '../config';

const config = useConfig();

async function renderTemplate(
    req: Request,
    res: Response,
    renderer: Renderer,
    ctx: Record<string, any>
) {
    try {
        const url = req.originalUrl.replace(config.base, '')
        const { template, render } = await renderer.compileTemplate(url);
        const rendered = await render({
            meta: '',  // default meta tags
            head: '',  // default head tags
            ...ctx 
        });

        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? '')
            .replace(`<!--app-html-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (e: any) {
        console.error(e);
        res.status(500).end('Internal Server Error');
    }
}

function templateMiddleware(renderer: Renderer) {
    return async function middleware(req: Request, res: Response, next: NextFunction) {
        res.ssrTemplate = async (ctx: Record<string, any>) => { 
            await renderTemplate(req, res, renderer, ctx);
        };

        next();
    };
}

declare global {
  namespace Express {
    interface Response {
        ssrTemplate: (ctx: Record<string, any>) => void;
    }
  }
}

export { templateMiddleware };