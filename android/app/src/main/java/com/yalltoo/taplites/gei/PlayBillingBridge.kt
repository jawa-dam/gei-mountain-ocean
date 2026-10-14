package com.yalltoo.taplites.gei

import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.fragment.app.FragmentActivity
import com.android.billingclient.api.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.ConcurrentHashMap
import kotlin.coroutines.resume

class PlayBillingBridge(
    private val activity: FragmentActivity,
    private val webView: WebView,
    private val scope: CoroutineScope
) : PurchasesUpdatedListener {

    private var billingClient: BillingClient? = null
    private var billingFlowCallbackId: String? = null
    private var isConnected = false
    private val activeCallbacks = ConcurrentHashMap<String, Boolean>()
    @Volatile
    private var unresolvedPurchaseJson: String? = null

    init {
        billingClient = BillingClient.newBuilder(activity)
            .setListener(this)
            .enablePendingPurchases(
                PendingPurchasesParams.newBuilder()
                    .enableOneTimeProducts()
                    .build()
            )
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
            return errorJson("INVALID_ARGS", "Invalid product ID")
        }

        val callbackId = "billing_${System.nanoTime()}"
        billingFlowCallbackId = callbackId
        activeCallbacks[callbackId] = true

        scope.launch {
            try {
                if (!ensureConnected()) {
                    resolveCallback(callbackId, errorJson("SERVICE_UNAVAILABLE", "Billing service unavailable"))
                    return@launch
                }

                val client = billingClient ?: run {
                    resolveCallback(callbackId, errorJson("SERVICE_UNAVAILABLE", "Billing client not initialized"))
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
                        "PRODUCT_UNAVAILABLE",
                        "Product not available (code ${detailsResult.first.responseCode})"
                    ))
                    return@launch
                }

                val productDetails = detailsResult.second[0]
                if (productDetails.oneTimePurchaseOfferDetails == null) {
                    resolveCallback(callbackId, errorJson("PRODUCT_UNAVAILABLE", "No one-time purchase offer"))
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
                resolveCallback(callbackId, errorJson("BILLING_ERROR", "Billing error: ${e.message}"))
            }
        }

        return JSONObject().put("pending", true).put("callbackId", callbackId).toString()
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: List<Purchase>?) {
        val callbackId = billingFlowCallbackId
        billingFlowCallbackId = null

        when (result.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                val purchase = purchases?.firstOrNull()
                if (purchase == null) {
                    if (callbackId != null) {
                        resolveCallback(callbackId, errorJson("NO_PURCHASE", "No purchase returned"))
                    }
                    return
                }

                if (purchase.purchaseState == Purchase.PurchaseState.PENDING) {
                    if (callbackId != null) {
                        resolveCallback(callbackId, errorJson("PENDING", "Purchase is pending"))
                    }
                    return
                }

                if (purchase.purchaseState != Purchase.PurchaseState.PURCHASED) {
                    if (callbackId != null) {
                        resolveCallback(callbackId, errorJson("UNEXPECTED_STATE", "Unexpected purchase state"))
                    }
                    return
                }

                val json = purchaseToJson(purchase)
                if (callbackId != null) {
                    resolveCallback(callbackId, json)
                } else {
                    unresolvedPurchaseJson = json
                }
            }
            BillingClient.BillingResponseCode.USER_CANCELED -> {
                if (callbackId != null) {
                    resolveCallback(callbackId, errorJson("USER_CANCELED", "USER_CANCELED"))
                }
            }
            else -> {
                if (callbackId != null) {
                    resolveCallback(callbackId, errorJson(
                        "PURCHASE_FAILED",
                        "Purchase failed (code ${result.responseCode})"
                    ))
                }
            }
        }
    }

    private fun purchaseToJson(purchase: Purchase): String {
        val json = JSONObject()
        json.put("purchaseToken", purchase.purchaseToken)
        json.put("orderId", purchase.orderId ?: "")
        json.put("playProductId", purchase.products.firstOrNull() ?: "")
        json.put("purchaseState", purchase.purchaseState)
        return json.toString()
    }

    @JavascriptInterface
    fun getUnresolvedPurchase(): String {
        val json = unresolvedPurchaseJson ?: return ""
        unresolvedPurchaseJson = null
        return json
    }

    @JavascriptInterface
    fun queryPurchases(): String {
        val callbackId = "query_${System.nanoTime()}"
        activeCallbacks[callbackId] = true

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
                        client.queryPurchasesAsync(params) { billingResult, purchasesList ->
                            if (cont.isActive) cont.resume(
                                PurchasesResult(billingResult, purchasesList)
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
            return errorJson("INVALID_ARGS", "Invalid purchase token")
        }

        val callbackId = "consume_${System.nanoTime()}"
        activeCallbacks[callbackId] = true

        scope.launch {
            try {
                if (!ensureConnected()) {
                    resolveCallback(callbackId, errorJson("SERVICE_UNAVAILABLE", "Billing service unavailable"))
                    return@launch
                }

                val client = billingClient ?: run {
                    resolveCallback(callbackId, errorJson("SERVICE_UNAVAILABLE", "Billing client not initialized"))
                    return@launch
                }

                val consumeParams = ConsumeParams.newBuilder()
                    .setPurchaseToken(purchaseToken)
                    .build()

                val result = withContext(Dispatchers.IO) {
                    suspendCancellableCoroutine<ConsumeResult> { cont ->
                        client.consumeAsync(consumeParams) { billingResult, outToken ->
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
                        "CONSUME_FAILED",
                        "Consume failed (code ${result.billingResult.responseCode})"
                    ))
                }
            } catch (e: Exception) {
                resolveCallback(callbackId, errorJson("CONSUME_ERROR", "Consume error: ${e.message}"))
            }
        }

        return JSONObject().put("pending", true).put("callbackId", callbackId).toString()
    }

    private fun resolveCallback(callbackId: String, json: String) {
        activeCallbacks.remove(callbackId)
        val b64 = Base64.encodeToString(json.toByteArray(Charsets.UTF_8), Base64.NO_WRAP)
        activity.runOnUiThread {
            webView.evaluateJavascript(
                "if(window.__PlayBillingCallbacks&&window.__PlayBillingCallbacks['$callbackId'])" +
                "{window.__PlayBillingCallbacks['$callbackId'](atob('$b64'));" +
                "delete window.__PlayBillingCallbacks['$callbackId'];}",
                null
            )
        }
    }

    private fun errorJson(code: String, message: String): String {
        return JSONObject()
            .put("error", message)
            .put("code", code)
            .toString()
    }

    fun destroy() {
        for (callbackId in activeCallbacks.keys()) {
            resolveCallback(callbackId, errorJson("DESTROYED", "Billing bridge destroyed"))
        }
        billingClient?.endConnection()
        billingClient = null
        isConnected = false
        billingFlowCallbackId = null
    }

    private data class PurchasesResult(
        val billingResult: BillingResult,
        val purchasesList: List<Purchase>
    )

    private data class ConsumeResult(
        val billingResult: BillingResult,
        val purchaseToken: String
    )

    companion object {
        const val JS_BRIDGE_SHIM = """(function(){
  if(!window.__NativePlayBillingBridge)return;
  window.__PlayBillingCallbacks={};
  var TIMEOUT_MS=120000;
  function wrapNative(method,args){
    return new Promise(function(resolve,reject){
      var raw;
      try{raw=window.__NativePlayBillingBridge[method].apply(window.__NativePlayBillingBridge,args);}
      catch(e){return reject(e);}
      if(!raw||raw==='')return resolve(null);
      var parsed;
      try{parsed=JSON.parse(raw);}catch(e){return reject(new Error('Invalid native response'));}
      if(parsed.error){
        var err=new Error(parsed.error);
        err.code=parsed.code||'BILLING_ERROR';
        return reject(err);
      }
      if(parsed.pending&&parsed.callbackId){
        var cid=parsed.callbackId;
        var timer=setTimeout(function(){
          delete window.__PlayBillingCallbacks[cid];
          reject(new Error('Billing operation timed out'));
        },TIMEOUT_MS);
        window.__PlayBillingCallbacks[cid]=function(dataStr){
          clearTimeout(timer);
          try{
            var data=JSON.parse(dataStr);
            if(data.error){
              var e2=new Error(data.error);
              e2.code=data.code||'BILLING_ERROR';
              reject(e2);
            }else{resolve(data);}
          }catch(e3){reject(new Error('Failed to parse callback data'));}
        };
      }else{resolve(parsed);}
    });
  }
  window.PlayBillingBridge={
    launchBillingFlow:function(pid){return wrapNative('launchBillingFlow',[pid]);},
    queryPurchases:function(){return wrapNative('queryPurchases',[]);},
    consumePurchase:function(tok){return wrapNative('consumePurchase',[tok]);}
  };
  var pending=window.__NativePlayBillingBridge.getUnresolvedPurchase();
  if(pending&&pending!==''){
    try{
      var p=JSON.parse(pending);
      if(p.purchaseToken)window.__PlayBillingUnresolvedPurchase=p;
    }catch(e){}
  }
})();"""
    }
}
