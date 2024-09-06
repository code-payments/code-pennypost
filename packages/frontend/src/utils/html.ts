function getTextContent(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent;
    return text ? text.trim() : '';
}

function getTitleContent(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const title = doc.querySelector('h1');
    return title ? title.innerText : '';
}

function isContentEmpty(html: string): boolean {
    const text = getTextContent(html);
    return text.length === 0;
}

function isTitleEmpty(html: string): boolean {
    const title = getTitleContent(html);
    return title.length === 0;
}

function hasPaywallTag(html: string): boolean {
    const text = getTextContent(html);
    return text.includes('[paywall]');
}

async function extractDataUrls(html: string): Promise<string[]> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    const dataUrls: string[] = [];

    images.forEach((img) => {
        if (img.getAttribute('data-uploaded')) {
          return;
        }

        const src = img.getAttribute('src');
        if (src && (src.startsWith('data:') || src.startsWith('blob:'))) {
          dataUrls.push(src);
        }
    });

    return dataUrls;
}

async function convertDataUrlToBlob(dataUrl: string): Promise<Blob> {
    const res = await fetch(dataUrl);
    return await res.blob();
}


export {
    getTextContent,
    getTitleContent,
    isContentEmpty,
    isTitleEmpty,
    hasPaywallTag,
    extractDataUrls,
    convertDataUrlToBlob,
}