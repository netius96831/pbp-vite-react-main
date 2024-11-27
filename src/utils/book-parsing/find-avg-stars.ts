export function findAvgStars(data: Document) {
  let avgStarsElement = data.querySelector('#averageCustomerReviews .a-icon-star .a-icon-alt');
  if (avgStarsElement) {
      const ratingMatch = avgStarsElement.textContent?.trim().match(/[\d\.]+/);
      if (ratingMatch && ratingMatch[0]) {
          return Number(ratingMatch[0]);
      }
  }
}