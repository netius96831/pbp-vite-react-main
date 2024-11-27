export function findCover(data: Document) {
    let coverElement = data.querySelector('#ebooksImgBlkFront');
    if (!coverElement) {
        coverElement = data.querySelector('#imgBlkFront');
    }
    if (!coverElement) {
        coverElement = data.querySelector('#miniATF_image');
    }
    if (!coverElement) {
        coverElement = data.querySelector('#imgTagWrapperId img');
    }
    if (!coverElement) {
        coverElement = data.querySelector('#main-image');
    }
    if (coverElement) {
        return coverElement.getAttribute('src')?.trim() || '';
    }
    return '';
}