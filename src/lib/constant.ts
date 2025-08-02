// ------- To connect to UAT below url is used -----------------
//
const BASE_URL = "https://hov.actifyzone.com/ecom-test"; // -- Test
// const BASE_URL = "https://houseofvalor.in/ECOM-PROD"; // -- Production
// const BASE_URL = "http://192.168.0.118:8080"; // -- Local

// -------- To deploy on Production uncomment the below url and comment others -------------------

// const BASE_URL = "/ECOM-PROD";
// const BASE_URL = "/ecom-test";

// const BASE_URL = "http://192.168.0.120:8080";

// const RAZORPAY_KEY= "rzp_test_fKuWCWiCO8vrIY"; //RazorPay test key
const RAZORPAY_KEY = "rzp_test_H5U9YORmaieu84"; //RazorPay Vishal test key
// const RAZORPAY_KEY= "rzp_test_VzJsUY4nXk9Qyv"; //RazorPay HOV test key
// const RAZORPAY_KEY= "rzp_live_mZxq0nvStx1iXR"; //RazorPay live key -- Actify
// const RAZORPAY_KEY = "rzp_live_mcwTeeVsLX8oGG"; //RazorPay live key -- House of Valor

// ------- To connect to Azure Blob Storage -----------------
// const SAS_TOKEN = "sp=racwdli&st=2025-04-30T09:29:16Z&se=2026-04-30T17:29:16Z&spr=https&sv=2024-11-04&sr=c&sig=JvQdFfWzTJeb%2FtFpG6pxJG%2B5%2FlMLEbqdMR%2F6%2Fg%2BKNmU%3D";
// const ACCOUNT_NAME = "actify";
// const STORAGE_ACCOUNT_SAS = `https://${ACCOUNT_NAME}.blob.core.windows.net/?${SAS_TOKEN}`;
// const CONTAINER_NAME = "cms"
// const FOLDER_NAME = "ecom/ECOM-UAT";

// sareekas haven blob
const SAS_TOKEN =
  "sp=racwdl&st=2025-07-26T06:20:14Z&se=2026-07-26T14:35:14Z&spr=https&sv=2024-11-04&sr=c&sig=L6QqU8G5Gqn6OQzZpOUXiZ74yt78rQc3p%2BlSxTwPZDY%3D";
const ACCOUNT_NAME = "sarikashaven";
const STORAGE_ACCOUNT_SAS = `https://${ACCOUNT_NAME}.blob.core.windows.net/?${SAS_TOKEN}`;
const CONTAINER_NAME = "uat";
const FOLDER_NAME = "sareekas";

export {
  BASE_URL,
  RAZORPAY_KEY,
  STORAGE_ACCOUNT_SAS,
  CONTAINER_NAME,
  FOLDER_NAME,
};
