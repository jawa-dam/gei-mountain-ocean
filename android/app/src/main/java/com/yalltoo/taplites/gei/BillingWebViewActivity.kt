package com.yalltoo.taplites.gei

import android.annotation.SuppressLint
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
        private val ALLOWED_HOSTS = setOf(
            "gei-mountain-ocean.vercel.app",
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

        webView.addJavascriptInterface(billingBridge, "PlayBillingBridge")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val host = request?.url?.host ?: return true
                return host !in ALLOWED_HOSTS
            }
        }

        webView.loadUrl(intent?.data?.toString() ?: ORIGIN)
    }

    override fun onDestroy() {
        billingBridge.destroy()
        webView.removeJavascriptInterface("PlayBillingBridge")
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
