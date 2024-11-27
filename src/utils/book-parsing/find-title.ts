export function findTitle(data: Document) {
  let titleElement = data.querySelector('#title span');

  if (titleElement) {
    return titleElement.textContent?.trim() || '';
  } else {
    titleElement = data.querySelector('.series-detail-title');

    return titleElement?.textContent?.trim() || '';
  }
}