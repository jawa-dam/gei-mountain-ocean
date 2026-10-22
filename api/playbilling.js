import verifyHandler from "./_handlers/playbilling/verify-purchase.js";
import claimHandler from "./_handlers/playbilling/claim-entitlement.js";
import fulfillHandler from "./_handlers/playbilling/fulfill-entitlement.js";
import productsHandler from "./_handlers/playbilling/products.js";
import restoreHandler from "./_handlers/playbilling/restore-purchases.js";
import rtdnHandler from "./_handlers/playbilling/rtdn-notification.js";

const ROUTES = {
  "verify-purchase": verifyHandler,
  "claim-entitlement": claimHandler,
  "fulfill-entitlement": fulfillHandler,
  "products": productsHandler,
  "restore-purchases": restoreHandler,
  "rtdn-notification": rtdnHandler
};

export default async function handler(req, res) {
  const route = req.query?.route;
  const fn = route && ROUTES[route];
  if (!fn) {
    return res.status(404).json({ error: "Unknown billing route." });
  }
  return fn(req, res);
}
