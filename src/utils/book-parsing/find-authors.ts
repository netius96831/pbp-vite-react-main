export function findAuthors(data: Document) {
  let authors: string[] = []

  let authsElements = data.querySelectorAll('span.author span.a-declarative');
  if (!authsElements.length) {
      authsElements = data.querySelectorAll('span.author');
  }

  if (authsElements.length) {
      authsElements.forEach((element) => {
          const targetElement = element.querySelector('a');

          if (targetElement) {
              authors.push(targetElement.textContent || '');
          }
      });
  }

  return authors;
}