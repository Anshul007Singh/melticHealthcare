export async function fetchProducts(query?: string, page?: number, perPage?: number) {
  // Determine if pagination is requested
  const usePagination = page !== undefined || perPage !== undefined;
  const actualPage = page || 1;
  const actualPerPage = perPage || 100;

  let apiURL = 'https://www.melticgroup.com/online/wp-json/wc/v3/products';

  if (query) {
    apiURL += `/${query}`;
  }
  apiURL +=
    `?per_page=${actualPerPage}&page=${actualPage}&consumer_key=ck_8ed576e4b09fbadb918a2360c252064763a5a1d8&consumer_secret=cs_55439183c9806d1a0ac32052649eeb8d6d387bc0`;
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // If pagination is requested, return object with metadata
    if (usePagination) {
      // Get total count from headers if available
      const totalProducts = response.headers.get('X-WP-Total');
      const totalPages = response.headers.get('X-WP-TotalPages');

      return {
        products: data,
        totalProducts: totalProducts ? parseInt(totalProducts) : data.length,
        totalPages: totalPages ? parseInt(totalPages) : 1,
        currentPage: actualPage,
      };
    }

    // Otherwise, return just the array for backward compatibility
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}
