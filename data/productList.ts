export async function fetchProducts(query?: string) {
  let apiURL = 'https://www.melticgroup.com/online/wp-json/wc/v3/products';

  if (query) {
    apiURL += `/${query}`;
  }
  apiURL +=
    '?per_page=100&page=1&consumer_key=ck_8ed576e4b09fbadb918a2360c252064763a5a1d8&consumer_secret=cs_55439183c9806d1a0ac32052649eeb8d6d387bc0';
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}
