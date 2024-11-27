export const getAsinFromUrl = (url: string) => {
  if(!url) return null;

  let asin = url.match(
    /localhost:5173\/\?dp=([^&]+)/
  );

  if (!asin) {
    asin = url.match(
      /www\.amazon\.com\/[^\/]+\/dp\/([^\/\?]+)\??/
    );
  }

  if (!asin) {
    asin = url.match(
        /www\.amazon\.com\/gp\/product\/([^\/?]+)\??/
    );
  }

  if (!asin) {
    asin = url.match(
        /www\.amazon\.com\/dp\/product\/([^\/?]+)\??/
    );
  }

  if (!asin) {
    asin = url.match(
        /www\.amazon\.com\/dp\/([^\/?]+)\??/
    );
  }

  return asin ? asin[1] : null;
}

export default getAsinFromUrl;