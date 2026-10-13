import { allProductMappings } from "../_lib/billing-channel.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const packageName = process.env.GOOGLE_PLAY_PACKAGE_NAME || "com.yalltoo.taplites.gei";
    const products = allProductMappings();

    return res.status(200).json({
      ok: true,
      packageName,
      products
    });
  } catch (err) {
    console.error("[PlayBilling products]", err);
    return res.status(500).json({ error: err.message || "Unable to retrieve product catalog." });
  }
}
