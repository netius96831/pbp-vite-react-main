import { SalesCategory } from "../../types/book-rank-item";

export function findSalesCategories(data: Document): SalesCategory[] {
  const salesCategoriesElements = data.querySelectorAll('#detailBulletsWrapper_feature_div .a-list-item .a-list-item a')

  let salesCategories: SalesCategory[] = [];
  if (salesCategoriesElements.length) {
      salesCategoriesElements.forEach((element) => {
          const itemRankMatch = element.parentElement?.textContent?.match(/#(\d+)/);

          let rank = itemRankMatch ? itemRankMatch[1] : '';
          const ladderString = element.textContent || '';

          let link = element.getAttribute('href') || '';

          link = link.trim();
          if (link.length !== 0) {
              // resolving absolute url
              if (link.search(/^\//) > -1) {
                const origin = window.location.origin;
                if (!origin.includes('amazon')) {
                  link = 'https://www.amazon.com' + link;
                } else {
                  link = origin + link
                }
              // resolving relative url
              } else {
                  link = window.location.href.trim().replace(/\/+$/, '');
              }
          }

          const ladder = ladderString.replace(/^\s*in\s+/, '').split(/\s*>\s*/);

          salesCategories.push({
              rank: rank,
              ladder: ladder,
              link: link,
          });
      });
  }

  return salesCategories;
}