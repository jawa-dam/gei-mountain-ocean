package com.yalltoo.taplites.gei

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.lifecycleScope

class BillingWebViewActivity : FragmentActivity() {

    companion object {
        private const val ORIGIN = "https://gei-mountain-ocean.vercel.app"
        private val ALLOWED_ORIGINS = setOf(
            "https://gei-mountain-ocean.vercel.app"
        )
        private val EXTERNAL_ALLOWED_HOSTS = setOf(
            "www.paypal.com",
            "www.paypalobjects.com"
        )
    }

    private lateinit var webView: WebView
    private lateinit var billingBridge: PlayBillingBridge

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        billingBridge = PlayBillingBridge(this, webView, lifecycleScope)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            setSupportZoom(false)
        }

        webView.addJavascriptInterface(billingBridge, "__NativePlayBillingBridge")

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                view?.evaluateJavascript(PlayBillingBridge.JS_BRIDGE_SHIM, null)
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url ?: return true
                val scheme = url.scheme ?: return true
                val host = url.host ?: return true
                val origin = "$scheme://$host"

                if (origin in ALLOWED_ORIGINS) return false

                if (host in EXTERNAL_ALLOWED_HOSTS && scheme == "https") {
                    startActivity(Intent(Intent.ACTION_VIEW, url))
                    return true
                }

                return true
            }
        }

        val loadUrl = validateIntentUrl(intent) ?: ORIGIN
        webView.loadUrl(loadUrl)
    }

    private fun validateIntentUrl(intent: Intent?): String? {
        val data = intent?.data ?: return null
        val scheme = data.scheme ?: return null
        val host = data.host ?: return null
        val origin = "$scheme://$host"
        if (origin !in ALLOWED_ORIGINS) return null
        return data.toString()
    }

    override fun onDestroy() {
        billingBridge.destroy()
        webView.removeJavascriptInterface("__NativePlayBillingBridge")
        webView.destroy()
        super.onDestroy()
    }

    @Deprecated("Use OnBackPressedCallback")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            @Suppress("DEPRECATION")
            super.onBackPressed()
        }
    }
}
