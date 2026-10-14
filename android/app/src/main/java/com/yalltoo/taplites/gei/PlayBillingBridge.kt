package com.yalltoo.taplites.gei

import android.app.Activity
import android.webkit.JavascriptInterface
import android.webkit.WebView
import com.android.billingclient.api.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import kotlin.coroutines.resume

class PlayBillingBridge(
    private val activity: Activity,
    private val webView: WebView,
    private val scope: CoroutineScope
) : PurchasesUpdatedListener {

    private var billingClient: BillingClient? = null
    private var pendingCallbackId: String? = null
    private var isConnected = false

    init {
        billingClient = BillingClient.newBuilder(activity)
            .setListener(this)
            .enablePendingPurchases()
            .build()
    }

    private suspend fun ensureConnected(): Boolean {
        val client = billingClient ?: return false
        if (isConnected && client.isReady) return true

        return suspendCancellableCoroutine { cont ->
            client.startConnection(object : BillingClientStateListener {
                override fun onBillingSetupFinished(result: BillingResult) {
                    isConnected = result.responseCode == BillingClient.BillingResponseCode.OK
                    if (cont.isActive) cont.resume(isConnected)
                }
                override fun onBillingServiceDisconnected() {
                    isConnected = false
                }
            })
        }
    }

    @JavascriptInterface
    fun launchBillingFlow(playProductId: String): String {
        if (playProductId.isBlank()) {
            return errorJson("Invalid product ID")
        }

        val callbackId = "billing_${System.nanoTime()}"
        pendingCallbackId = callbackId

        scope.launch {
            try {
                if (!ensureConnected()) {
                    resolveCallback(callbackId, errorJson("Billing service unavailable"))
                    return@launch
                }

                val client = billingClient ?: run {
                    resolveCallback(callbackId, errorJson("Billing client not initialized"))
                    return@launch
                }

                val productList = listOf(
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(playProductId)
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build()
                )
                val params = QueryProductDetailsParams.newBuilder()
                    .setProductList(productList)
                    .build()

                val detailsResult = withContext(Dispatchers.IO) {
                    suspendCancellableCoroutine<Pair<BillingResult, List<ProductDetails>>> { cont ->
                        client.queryProductDetailsAsync(params) { result, details ->
                            if (cont.isActive) cont.resume(Pair(result, details ?: emptyList()))
                        }
                    }
                }

                if (detailsResult.first.responseCode != BillingClient.BillingResponseCode.OK
                    || detailsResult.second.isEmpty()) {
                    resolveCallback(callbackId, errorJson(
                        "Product not available (code ${detailsResult.first.responseCode})"
                    ))
                    return@launch
                }

                val productDetails = detailsResult.second[0]
                val offerToken = productDetails.oneTimePurchaseOfferDetails?.let { "" } ?: run {
                    resolveCallback(callbackId, errorJson("No one-time purchase offer"))
                    return@launch
                }

                val flowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(
                        listOf(
                            BillingFlowParams.ProductDetailsParams.newBuilder()
                                .setProductDetails(productDetails)
                                .build()
                        )
                    )
                    .build()

                withContext(Dispatchers.Main) {
                    client.launchBillingFlow(activity, flowParams)
                }
            } catch (e: Exception) {
                resolveCallback(callbackId, errorJson("Billing error: ${e.message}"))
            }
        }

        return JSONObject().put("pending", true).put("callbackId", callbackId).toString()
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: List<Purchase>?) {
        val callbackId = pendingCallbackId ?: return
        pendingCallbackId = null

        when (result.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                val purchase = purchases?.firstOrNull()
                if (purchase == null) {
                    resolveCallback(callbackId, errorJson("No purchase returned"))
                    return
                }

                if (purchase.purchaseState == Purchase.PurchaseState.PENDING) {
                    resolveCallback(callbackId, errorJson("Purchase is pending"))
                    return
                }

                if (purchase.purchaseState != Purchase.PurchaseState.PURCHASED) {
                    resolveCallback(callbackId, errorJson("Unexpected purchase state"))
                    return
                }

                val json = JSONObject()
                json.put("purchaseToken", purchase.purchaseToken)
                json.put("orderId", purchase.orderId ?: "")
                json.put("playProductId", purchase.products.firstOrNull() ?: "")
                json.put("purchaseState", purchase.purchaseState)
                resolveCallback(callbackId, json.toString())
            }
            BillingClient.BillingResponseCode.USER_CANCELED -> {
                resolveCallback(callbackId, errorJson("Purchase cancelled"))
            }
            else -> {
                resolveCallback(callbackId, errorJson(
                    "Purchase failed (code ${result.responseCode})"
                ))
            }
        }
    }

    @JavascriptInterface
    fun queryPurchases(): String {
        val callbackId = "query_${System.nanoTime()}"

        scope.launch {
            try {
                if (!ensureConnected()) {
                    resolveCallback(callbackId, "[]")
                    return@launch
                }

                val client = billingClient ?: run {
                    resolveCallback(callbackId, "[]")
                    return@launch
                }

                val params = QueryPurchasesParams.newBuilder()
                    .setProductType(BillingClient.ProductType.INAPP)
                    .build()

                val result = withContext(Dispatchers.IO) {
                    suspendCancellableCoroutine<PurchasesResult> { cont ->
                        client.queryPurchasesAsync(params) { billingResult, purchases ->
                            if (cont.isActive) cont.resume(
                                PurchasesResult(billingResult, purchases)
                            )
                        }
                    }
                }

                if (result.billingResult.responseCode != BillingClient.BillingResponseCode.OK) {
                    resolveCallback(callbackId, "[]")
                    return@launch
                }

                val arr = JSONArray()
                for (purchase in result.purchasesList) {
                    if (purchase.purchaseState != Purchase.PurchaseState.PURCHASED) continue
                    val obj = JSONObject()
                    obj.put("purchaseToken", purchase.purchaseToken)
                    obj.put("orderId", purchase.orderId ?: "")
                    obj.put("playProductId", purchase.products.firstOrNull() ?: "")
                    obj.put("purchaseState", purchase.purchaseState)
                    arr.put(obj)
                }
                resolveCallback(callbackId, arr.toString())
            } catch (e: Exception) {
                resolveCallback(callbackId, "[]")
            }
        }

        return JSONObject().put("pending", true).put("callbackId", callbackId).toString()
    }

    @JavascriptInterface
    fun consumePurchase(purchaseToken: String): String {
        if (purchaseToken.isBlank()) {
            return errorJson("Invalid purchase token")
        }

        val callbackId = "consume_${System.nanoTime()}"

        scope.launch {
            try {
                if (!ensureConnected()) {
                    resolveCallback(callbackId, errorJson("Billing service unavailable"))
                    return@launch
                }

                val client = billingClient ?: run {
                    resolveCallback(callbackId, errorJson("Billing client not initialized"))
                    return@launch
                }

                val params = ConsumeParams.newBuilder()
                    .setPurchaseToken(purchaseToken)
                    .build()

                val result = withContext(Dispatchers.IO) {
                    suspendCancellableCoroutine<ConsumeResult> { cont ->
                        client.consumeAsync(params) { billingResult, outToken ->
                            if (cont.isActive) cont.resume(
                                ConsumeResult(billingResult, outToken)
                            )
                        }
                    }
                }

                if (result.billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    resolveCallback(callbackId, JSONObject().put("ok", true).toString())
                } else {
                    resolveCallback(callbackId, errorJson(
                        "Consume failed (code ${result.billingResult.responseCode})"
                    ))
                }
            } catch (e: Exception) {
                resolveCallback(callbackId, errorJson("Consume error: ${e.message}"))
            }
        }

        return JSONObject().put("pending", true).put("callbackId", callbackId).toString()
    }

    private fun resolveCallback(callbackId: String, json: String) {
        val escaped = json.replace("\\", "\\\\").replace("'", "\\'")
        activity.runOnUiThread {
            webView.evaluateJavascript(
                "if(window.__PlayBillingCallbacks&&window.__PlayBillingCallbacks['$callbackId'])" +
                "{window.__PlayBillingCallbacks['$callbackId']('$escaped');" +
                "delete window.__PlayBillingCallbacks['$callbackId'];}",
                null
            )
        }
    }

    private fun errorJson(message: String): String {
        return JSONObject().put("error", message).toString()
    }

    fun destroy() {
        billingClient?.endConnection()
        billingClient = null
        isConnected = false
    }

    private data class PurchasesResult(
        val billingResult: BillingResult,
        val purchasesList: List<Purchase>
    )

    private data class ConsumeResult(
        val billingResult: BillingResult,
        val purchaseToken: String
    )
}
