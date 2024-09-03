import express from 'express';
import { useRenderer } from '@code-pennypost/frontend/renderer';
import { useConfig } from './config';
import { renderPost, renderPostImage } from './routes/post/post.view';
import { renderFile } from './routes/data/data.view';
import { 
  apiMiddleware,
  loggingMiddleware,
  templateMiddleware,
} from './middleware';
import { cyan, whiteBold, gray } from './utils/colors';
import * as routes from './routes';

const config = useConfig();
const app = express();
const renderer = await useRenderer(app, config);

app.use(express.raw({type: '*/*', limit: '30mb'}));
app.use(loggingMiddleware);
app.use(apiMiddleware);
app.use(templateMiddleware(renderer));

app.use('/post', routes.post);
app.use('/data', routes.data);
app.use('/payment', routes.payment);
app.use('/login', routes.login);
app.use('/user', routes.user);

// well-known (this is how we let the code sequencer know our public key -- super important)
app.get('/.well-known/code-payments.json', (req, res) => {
  res.json({ "public_keys": [config.storeVerifier] });
});

// static routes
app.get('/favicon.ico', (req, res) => { res.sendFile('favicon.ico', { root: 'public' }); });
app.get('/privacy', (req, res) => { res.sendFile('privacy-policy.pdf', { root: 'public' }); });
app.get('/terms', (req, res) => { res.sendFile('terms-of-service.pdf', { root: 'public' }); });

// opengraph
app.use('/img/:slug/:title', renderPostImage);
app.use('/img/:slug/:title/preview.webp', renderPostImage);

// article page
app.use('/p/:slug/:title', renderPost);
app.use('/p/:slug/:title/:offset', renderPost);
app.use('/redirect/payment/:intent/post/:slug/:title/:offset', renderPost);

// uploaded content files
app.use('/content/:id', renderFile);

// views (catch-all with SSR)
app.use('*', async (req, res) => {
  res.ssrTemplate({ title: 'Pennypost' });
})

app.listen(config.port, () => {
    console.log(`\n\n${cyan('Server running at:')}\n`);
    console.log(`${whiteBold(`  > Network: ${cyan(`http://localhost:${config.port}`)}`)}`);
    
    console.log(`\n\n${cyan('Environment:')}\n`);
    Object.entries(config).forEach(([key, value]) => {
        if (typeof value === 'function') { return; }
        console.log(`${gray(`    ${cyan(key)}: ${value}`)}`);
    });

    console.log('\n');
});