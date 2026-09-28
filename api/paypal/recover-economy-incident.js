import { recoverEconomyIncident } from "../_lib/paypal-ledger.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { claimToken, captureID } = req.body || {};
    if (!claimToken || !captureID) {
      return res.status(400).json({ error: "Missing economy recovery information." });
    }

    const result = await recoverEconomyIncident(claimToken, captureID);

    if (!result.ok && result.reason === "NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        recoverable: false,
        status: "NO_INCIDENT"
      });
    }

    if (!result.ok) {
      return res.status(409).json({
        ok: false,
        recoverable: false,
        status: result.status || "FROZEN",
        reason: result.reason,
        incident: result.incident || null,
        reconciliation: result.reconciliation || null
      });
    }

    return res.status(200).json({
      ok: true,
      recoverable: true,
      status: result.status,
      action: result.action,
      incident: result.incident,
      reconciliation: result.reconciliation
    });
  } catch (err) {
    console.error("[PayPal recover-economy-incident]", err);
    return res.status(500).json({ error: "Unable to recover economy incident." });
  }
}
