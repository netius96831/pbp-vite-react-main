export function findPrice(data: Document) {
  let priceElement = data.querySelector('#price');
  if (priceElement) {
    const price = priceElement.textContent?.replace(/[^\d \.]/g, '') || '0';
    return numOrZero(price);
  }

  // this first block is new; the rest are refactored from the old price parsing code
  priceElement = document.querySelector('.a-price');
  if(priceElement){
    const aOffscreenElement = priceElement.querySelector('.a-offscreen');

    if (aOffscreenElement) {
      priceElement.removeChild(aOffscreenElement);
    }

    const price = priceElement?.textContent?.split("$")[1];
    return numOrZero(price);
  }

  priceElement = data.querySelector('input[name="displayedPrice"]');
  if (priceElement) {
    const price = priceElement.getAttribute('value') || '0';
    return numOrZero(price);
  }

  priceElement = data.querySelector('#miniATF_price');
  if (priceElement) {
    const price = priceElement.textContent?.replace(/[^\d \.]/g, '') || '0';
    return numOrZero(price);
  }

  priceElement = data.querySelector('span.a-size-medium.a-color-price.offer-price.a-text-normal, span#apub-pf-special-price');
  if(priceElement){
    const salePrice = priceElement.textContent || '';
    if(salePrice.indexOf("$")!=-1){
      const price = salePrice.split("$")[1];
      return numOrZero(price);
    } else{
      return numOrZero(salePrice);
    }
  }

  return 0;
}

function numOrZero(numString: string | undefined) {
  const num = parseFloat(numString || '0');
  return isNaN(num) ? 0 : num;
}