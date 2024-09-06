import * as cheerio from 'cheerio';


async function extractDataUrls(html: string): Promise<string[]> {
    const $ = cheerio.load(html);
    const dataUrls: string[] = [];

    $('img').each((_, elem) => {
        const src = $(elem).attr('src');
        if (src && src.startsWith('data:')) {
            dataUrls.push(src);
        }
    });

    return dataUrls;
}

async function convertDataUrlToBuffer(dataUrl: string): Promise<[string, Buffer]> {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid data URL');
    }

    const mimeType = matches[1];
    const base64 = matches[2];
    const buffer = Buffer.from(base64, 'base64');

    return [mimeType, buffer];
}

async function extractFirstImage(html: string): Promise<string | undefined> {
    const $ = cheerio.load(html);
    const firstImage = $('img').first().attr('src');
    return firstImage;
}

async function extractTitleAndShortText(html: string): Promise<{ title: string, short: string }> {
    // Try to extract the title and the first few sentences of the content.

    const $ = cheerio.load(html);
    let title = $('h1').first().text().trim();
    let combinedText = '';

    $('p, div, span').each((_, elem) => {
        combinedText += ' ' + $(elem).text().trim();
    });

    let sentences = combinedText.replace(/\s+/g, ' ').trim().split('. ');
    if (!title) {
        title = sentences.shift()?.split('.')[0].trim() || '';
    }

    let short = sentences.slice(0, 3).join('. ') + '.';

    return { title, short };
}

async function splitTitleFromContent(html: string): Promise<{ title: string, html: string }> {
    const $ = cheerio.load(html);

    const title = $('h1').first().html() || '';
    $('h1').first().remove();
    const content = $('body').html() || '';

    return { title, html: content };
}

function splitHtmlInHalf(html: string): string {
    // Okay, so this is actually a pretty complicated problem. It isn't as
    // simple as just cutting the text in half, because we want to maintain the
    // structure of the HTML. We can't just split the text in half because we
    // might end up with an incomplete tag or a broken structure.

    // The real solution is not to do this at all. It's a better idea to give
    // the user some kind of UX to decide where to cut the preview. However, for
    // this starter project, it's fine.

    // I highly recommend not trying to "fix" this function. Let it be as it is
    // as a reminder to do it properly on the UX side :)

    // Note: Use getFreeContent() instead if you can

    const $ = cheerio.load(html);
    const allContentElements = $('body').children();
    let accumulatedLength = 0;
    let totalLength = $('body').text().length;
    let halfLength = totalLength / 2; // half-ish
    let halfContent = $('<div>');

    allContentElements.each((_, elem) => {
        let currentTextLength = $(elem).text().length;
        if (accumulatedLength + currentTextLength <= halfLength) {
            halfContent.append($(elem).clone());
            accumulatedLength += currentTextLength;
        } else {
            // If we're close to the halfway point, we need to handle the last element
            // especially if it's a text node.
            if ($(elem).children().length === 0) {
                // For plain text elements, slice the text up to the halfway point
                let remainingLength = halfLength - accumulatedLength;
                let partialText = $(elem).text().slice(0, remainingLength);
                halfContent.append($(elem).clone().text(partialText));
            } else {
                // For elements with children, consider a more complex recursive approach
                // or potentially include the whole element, based on your requirements.
                halfContent.append($(elem).clone());
            }
            return false; // Break the loop after reaching the halfway point.
        }
    });

    const result = halfContent.html();
    if (!result) {
        throw new Error('Failed to generate preview');
    }

    return result;
}

function hasPaywall(html: string): boolean {
    return html.includes('[paywall]');
}

function getFreeContent(html: string): string {
    // We're going to look for the first [paywall] tag and return the content up
    // to that point. Any open tags will be closed.

    const freeContent = html.split('[paywall]')[0];
    const $ = cheerio.load(freeContent, { xmlMode: true });

    return $.html();
}

function removePaywallTag(html: string): string {
    // This is a simple function that removes the [paywall] tag from the content.
    // Note: This is a very naive implementation...
    return html.replace('[paywall]', '');
}

export { 
    convertDataUrlToBuffer,
    extractDataUrls,
    extractFirstImage,
    extractTitleAndShortText,
    hasPaywall,
    removePaywallTag,
    getFreeContent,
    splitHtmlInHalf,
    splitTitleFromContent,
};