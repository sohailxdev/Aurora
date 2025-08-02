/*  sitemap-generator.js
 *  ------------------------------------------------------------
 *  Generates /public/sitemap.xml.gz for https://houseofvalor.in
 *  – Static routes from your router
 *  – Dynamic product URLs using product.productId + product.sku
 *  – Optional collections
 *  ------------------------------------------------------------ */

import fs from "fs";
import axios from "axios";
import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";

const SITE_URL = "https://houseofvalor.in/ECOM-PROD";
const PUBLIC_DIR = "./public";

/**
 * API endpoints — edit if yours differ
 * Products endpoint must return a `ProductResponse`
 *  {
 *    content: Product[],
 *    last: boolean
 *    ...
 *  }
 */
const PRODUCTS_API = `${SITE_URL}/api/products`; // paginated
const COLLECTIONS_API = `${SITE_URL}/api/collections`; // optional

/* ────────────────────────────────────────────────────────────
 * Helper: fetch ALL products, paginating until last === true
 * ──────────────────────────────────────────────────────────── */
async function fetchAllProducts(pageSize = 500) {
  const products = [];
  let page = 0;
  let isLast = false;

  while (!isLast) {
    try {
      const { data } = await axios.get(PRODUCTS_API, {
        params: { page, size: pageSize },
      });
      // defensive checks
      if (!data || !Array.isArray(data.content)) break;
      products.push(...data.content);
      isLast = Boolean(data.last); // pagination flag returned by backend
      page += 1;
    } catch (err) {
      console.error(`❌  Failed to fetch products page ${page}:`, err.message);
      break;
    }
  }

  return products;
}

/* ────────────────────────────────────────────────────────────
 * Build the sitemap
 * ──────────────────────────────────────────────────────────── */
(async () => {
  const smStream = new SitemapStream({ hostname: SITE_URL });
  const pipeline = smStream.pipe(createGzip());

  /* 1️⃣  Static public routes (match your router) */
  [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/category", changefreq: "daily", priority: 0.9 },
    { url: "/aboutus", changefreq: "yearly", priority: 0.5 },
    { url: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
    { url: "/T&C", changefreq: "yearly", priority: 0.3 },
    { url: "/wishlist", changefreq: "weekly", priority: 0.4 },
  ].forEach((r) => smStream.write(r));

  /* 2️⃣  Dynamic product routes */
  const allProducts = await fetchAllProducts();
  allProducts.forEach((p) => {
    // Ensure both fields exist before writing
    if (p.productId && p.sku) {
      smStream.write({
        url: `/category/products/${p.productId}/${p.sku}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmodISO: p.createdDate || new Date().toISOString(),
      });
    }
  });

  /* 3️⃣  Dynamic collection routes (optional) */
  // const collections = await fetchCollections();
  // collections.forEach((c) => {
  //   if (c.id) {
  //     smStream.write({
  //       url: `/collection/${c.id}`,
  //       changefreq: "weekly",
  //       priority: 0.7,
  //       lastmodISO: c.updatedAt || new Date().toISOString(),
  //     });
  //   }
  // });

  /* 4️⃣  Finish and write file */
  smStream.end();
  const data = await streamToPromise(pipeline);

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(`${PUBLIC_DIR}/sitemap.xml.gz`, data);
})();
