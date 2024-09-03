import { useSSRContext } from 'vue';

export function useContext() : Record<string, any> {

  if (import.meta.env.SSR) {
    // Fetch context directly from SSR context in server-side
    const ssrContext = useSSRContext();
    
    if (ssrContext) {
        return ssrContext;
    }
  } else {
    // Fetch context from the window object in client-side
    if ((window as any).__SSR_CONTEXT__) {
        return (window as any).__SSR_CONTEXT__;
    }
  }

  return {};
}
