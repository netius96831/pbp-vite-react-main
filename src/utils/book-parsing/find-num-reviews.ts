export function findNumReviews(data: Document) {
  let noReviewsElement = data.querySelector('#acrCustomerReviewText');
  if (noReviewsElement) {
      const numberMatch = noReviewsElement.textContent?.match(/\d{1,3}(?:(?:,\d{1,3})+| )/);
      if (numberMatch) {
          const noReviews = parseInt(numberMatch[0].replace(/,/g, ''));
          return isNaN(noReviews) ? 0 : noReviews;
      }
  }

}