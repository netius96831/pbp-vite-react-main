import { ParsedBook } from "../../types/book-rank-item";

export function parseProductDetails(data: Document, bookItem: ParsedBook) {
  let productDetails = data.querySelector('#productDetailsTable');
  if (!productDetails) {
    productDetails = data.querySelector('#detailBullets_feature_div:not(.celwidget)');
  }
  if (!productDetails) {
    productDetails = data.querySelector('#audibleProductDetails');
  }

  if (productDetails) {
    const productDetailsText = productDetails.innerHTML;
    const lengthMatch = productDetailsText.match(/(\d*) pages/i);
    if (lengthMatch && lengthMatch[1]) {
      bookItem['noPages'] = parseInt(lengthMatch[1]);
      bookItem['noPages'] = isNaN(bookItem['noPages']) ? 0 : bookItem['noPages'];
    }

    const audioLengthMatch = productDetailsText.match(/(\d*) hours and (\d*) minutes/i);
    if (audioLengthMatch && audioLengthMatch[1] && audioLengthMatch[2]) {
      const hours = parseInt(audioLengthMatch[1]);
      const minutes = parseInt(audioLengthMatch[2]);
      bookItem['audioLength'] = hours * 60 + minutes;
    }

    const pubDateMatch = productDetailsText.match(/publication date:.*[b|strong]>\W([A-Za-z0-9_ ,]*)/i);

    if (pubDateMatch && pubDateMatch[1]) {
      bookItem['pubDate'] = pubDateMatch[1].trim();
    }
  }

  let salesRankElement = productDetails?.nextElementSibling;

  if (salesRankElement) {
    const salesRankMatch = salesRankElement.innerHTML.match(/sellers rank\D*([\d, ]*)/i);

    if (salesRankMatch && salesRankMatch[1]) {
      bookItem['salesRank'] = parseInt(salesRankMatch[1].replace(/[,. ]/g, ''));
    }
  }
}