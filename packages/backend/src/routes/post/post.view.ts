import { Request, Response } from 'express';
import { 
    getOwnerProfileForPost,
    getPostBySlug,
    getContentForPost
} from '../../models/post';
import { useConfig } from '../../config';

const ErrPostNotFound = (res: Response) => res.error({ message: "Post not found" }, 404);
const DefaultPostImage = (res: Response) => { res.sendFile('opengraph.png', { root: 'public' }); }

async function renderPost(req: Request, res: Response) {
  const config = useConfig();
  const slug = `${req.params.slug}/${req.params.title}`;

  try {
    const post = await getPostBySlug(slug);
    const content = await getContentForPost(post);
    const owner = await getOwnerProfileForPost(post);

    // Uncomment the following line to use the default pennypost image,
    // otherwise use the post image
    // const image = `https://${config.hostname}/img/${slug}.png`;

    const image = `https://${config.hostname}/img/${slug}/preview.webp`;

    const meta = renderOGTags(
      post.title, 
      post.short, 
      image
    );

    res.ssrTemplate({ 
      title: post?.title ?? 'Pennypost',
      post: post.toJsonString(),
      owner: owner.toJsonString(),
      content,
      meta,
    });
  } catch (e) {
    return ErrPostNotFound(res);
  }
}

async function renderPostImage(req: Request, res: Response) {
  const slug = `${req.params.slug}/${req.params.title}`;
  if (!slug) {
    return DefaultPostImage(res);
  }

  try {
    const post = await getPostBySlug(slug);
    if (post.imageId) {
      res.redirect(`/content/${post.imageId}`);
    }
  } catch (e) {
    console.warn('Unable to find post image', e);
    return DefaultPostImage(res);
  }
}

function renderOGTags(
  title: string,
  description: string,
  previewUrl: string
) : string {
  const config = useConfig();
  const safeTitle = title.replace(/[^a-zA-Z0-9\s]/g, '');
  const safeDescription = description.replace(/[^a-zA-Z0-9\s]/g, '');

  let tags = `
  <!-- Twitter opengraph metadata -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@getcode" />
  <meta name="twitter:creator" content="@getcode" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${previewUrl}" />

  <!-- Facebook opengraph metadata -->
  <meta property="og:url" content="https://${config.hostname}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:image" content="${previewUrl}" />
  `;

  return tags;
}

export {
    renderPost,
    renderPostImage,
}