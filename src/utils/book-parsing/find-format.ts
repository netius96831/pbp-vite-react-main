export function findFormat(data: Document) {
  let formatElement = data.querySelector('.swatchElement.selected');
  let fullElement = formatElement?.querySelector('.a-button-text span')?.textContent?.trim() || '';
  let format = fullElement.split(' ').slice(0, 2).join(' ').trim(); // allows 2-word formats like "Hardcover Spiral" or "Perfect Paperback", but eliminates icons and divs
  return format || fullElement;
}

