function isContentEmpty(html: string): boolean {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent;
    return text === null || text.trim() === '';
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
    isContentEmpty,
    extractDataUrls,
    convertDataUrlToBlob,
}