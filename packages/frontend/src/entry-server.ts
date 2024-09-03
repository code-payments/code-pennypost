import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(url:string, manifest: Record<string, string>, ctx: Record<string, any>) {
  const { app, router } = createApp()

  await router.push(url);
  await router.isReady();

  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  //const ctx = { hello: 'world', time: Date.now() }
  const html = await renderToString(app, ctx) + serializeState(ctx);
  const head = renderHead(ctx);

  return { 
    html,
    head,
  }
}

function renderHead(ctx: Record<string, any>) {

  return `
    <title>${ctx.title}</title>
    ${ctx.meta}
    ${ctx.head}
  `
}

function serializeState(ctx: Record<string, any>) {
  return `\n<script>window.__SSR_CONTEXT__=${JSON.stringify(ctx)}</script>`
}

export type Render = typeof render