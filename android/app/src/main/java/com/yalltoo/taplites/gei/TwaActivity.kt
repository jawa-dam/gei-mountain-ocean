package com.yalltoo.taplites.gei

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.fragment.app.FragmentActivity

class TwaActivity : FragmentActivity() {

    companion object {
        private const val TWA_ORIGIN = "https://gei-mountain-ocean.vercel.app"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val intent = Intent(this, BillingWebViewActivity::class.java)
        intent.data = Uri.parse(TWA_ORIGIN)
        startActivity(intent)
        finish()
    }
}
