package com.yalltoo.taplites.gei

import android.net.Uri
import android.os.Bundle
import androidx.browser.customtabs.CustomTabsIntent
import androidx.browser.trusted.TrustedWebActivityIntentBuilder
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.lifecycleScope

/**
 * TWA wrapper that opens the web app in a Trusted Web Activity and
 * injects the native Play Billing bridge via a CustomTabsSession.
 *
 * For billing to work, the TWA must fall back to a WebView when
 * PlayBillingBridge JavaScript injection is needed, since Custom Tabs
 * do not allow addJavascriptInterface. The BillingWebViewActivity
 * handles the actual billing bridge integration.
 */
class TwaActivity : FragmentActivity() {

    companion object {
        private const val TWA_ORIGIN = "https://gei-mountain-ocean.vercel.app"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // TWA cannot inject JavaScript interfaces into Custom Tabs.
        // For Play Billing, we use BillingWebViewActivity which provides
        // addJavascriptInterface support for the PlayBillingBridge contract.
        val intent = android.content.Intent(this, BillingWebViewActivity::class.java)
        intent.data = Uri.parse(TWA_ORIGIN)
        startActivity(intent)
        finish()
    }
}
