/* V2.1.1 — Customer Purchase Recovery
   Customer-facing recovery layer only.
   Reuses the existing certified capture → claim → fulfillment → credit path.
   It never creates a second PayPal order for an interrupted purchase.
*/
(function(){
  "use strict";

  const VERSION = "2.1.1";
  const INTENT_KEY = "gei.paypal.v2.1.1.recoveryIntent";
  const CLAIM_PREFIX = "gei.paypal.v2.0.22.claim.";

  function esc(value){
    return String(value ?? "").replace(/[&<>"']/g,function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
    });
  }
  function get(key){
    try{return sessionStorage.getItem(key);}catch(e){return null;}
  }
  function set(key,value){
    try{sessionStorage.setItem(key,value);}catch(e){}
  }
  function remove(key){
    try{sessionStorage.removeItem(key);}catch(e){}
  }
  function readIntent(){
    const raw=get(INTENT_KEY);
    if(!raw)return null;
    try{
      const x=JSON.parse(raw);
      if(!x || !x.packId || !x.startedAt)return null;
      return x;
    }catch(e){return null;}
  }
  function saveIntent(packId){
    set(INTENT_KEY,JSON.stringify({
      version:VERSION,
      packId:String(packId||""),
      startedAt:Date.now()
    }));
  }
  function clearIntent(){remove(INTENT_KEY);}

  function findPendingOrder(){
    const intent=readIntent();
    if(!intent)return null;
    const prefix=CLAIM_PREFIX;
    try{
      for(let i=0;i<sessionStorage.length;i++){
        const key=sessionStorage.key(i);
        if(!key || key.indexOf(prefix)!==0)continue;
        const orderID=key.slice(prefix.length);
        if(orderID)return {packId:intent.packId,orderID};
      }
    }catch(e){}
    return null;
  }

  function init(){
    if(document.getElementById("geiPurchaseRecovery"))return;

    const style=document.createElement("style");
    style.id="geiPurchaseRecoveryStyles";
    style.textContent=`
      #geiPurchaseRecovery{
        position:fixed;inset:0;z-index:10020;display:none;align-items:center;justify-content:center;
        padding:calc(env(safe-area-inset-top) + 14px) 12px calc(env(safe-area-inset-bottom) + 14px);
        background:rgba(1,5,16,.86);backdrop-filter:blur(18px);
      }
      #geiPurchaseRecovery.open{display:flex}
      .geiRecoveryShell{
        width:min(100%,500px);max-height:100%;overflow:auto;padding:20px;border-radius:26px;
        border:1.5px solid rgba(47,210,255,.38);
        background:linear-gradient(165deg,rgba(7,17,43,.99),rgba(4,7,20,.99));
        color:#fff;box-shadow:0 0 75px rgba(47,210,255,.22),inset 0 1px 0 rgba(255,255,255,.12);
      }
      .geiRecoveryEyebrow{font-size:.78rem;font-weight:950;letter-spacing:.14em;color:#2fd2ff;text-transform:uppercase}
      .geiRecoveryTitle{margin-top:5px;font-size:clamp(1.7rem,7vw,2.35rem);font-weight:950;line-height:1.04}
      .geiRecoveryCopy{margin-top:13px;font-size:1rem;line-height:1.48;color:rgba(255,255,255,.82)}
      .geiRecoverySafe{
        margin:14px 0;padding:14px;border-radius:18px;
        background:linear-gradient(135deg,rgba(32,220,160,.14),rgba(47,210,255,.12));
        border:1px solid rgba(126,255,214,.35);
      }
      .geiRecoverySafe strong{display:block;font-size:1.12rem;color:#7effd6;margin-bottom:4px}
      .geiRecoveryStatus{min-height:2.8em;margin:12px 0;font-weight:850;line-height:1.4}
      .geiRecoveryActions{display:grid;gap:9px}
      .geiRecoveryBtn{
        min-height:50px;border:0;border-radius:15px;padding:13px 16px;cursor:pointer;
        color:#fff;font-size:1rem;font-weight:950;
        background:linear-gradient(135deg,#2fd2ff,#3d3dea,#f310ba);
      }
      .geiRecoveryBtn.secondary{
        background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2)
      }
      .geiRecoveryBtn:disabled{opacity:.55;cursor:wait}
      .geiRecoveryMeta{margin-top:13px;font-size:.76rem;line-height:1.4;text-align:center;color:rgba(255,255,255,.52)}
    `;

    document.head.appendChild(style);

    const overlay=document.createElement("div");
    overlay.id="geiPurchaseRecovery";
    overlay.innerHTML=`
      <section class="geiRecoveryShell" role="dialog" aria-modal="true" aria-labelledby="geiRecoveryTitle">
        <div class="geiRecoveryEyebrow">DAM NATION · PURCHASE RECOVERY</div>
        <div class="geiRecoveryTitle" id="geiRecoveryTitle">Your purchase is safe. 💧</div>
        <div class="geiRecoveryCopy">
          It looks like checkout was interrupted before the game finished receiving your FL OZ.
          We found the existing purchase session and can safely continue it.
        </div>
        <div class="geiRecoverySafe">
          <strong id="geiRecoveryPack">Purchase found</strong>
          No new payment will be created. We will re-check the existing order, secure the entitlement, and finish the original delivery.
        </div>
        <div class="geiRecoveryStatus" id="geiRecoveryStatus" aria-live="polite">Ready to recover your purchase.</div>
        <div class="geiRecoveryActions">
          <button class="geiRecoveryBtn" id="geiRecoveryResume" type="button">RECOVER MY FL OZ</button>
          <button class="geiRecoveryBtn secondary" id="geiRecoveryClose" type="button">CONTINUE WITHOUT RECOVERY</button>
        </div>
        <div class="geiRecoveryMeta">Existing order only · no second charge · safe replay protection remains active.</div>
      </section>
    `;
    document.body.appendChild(overlay);

    const status=()=>document.getElementById("geiRecoveryStatus");
    const close=()=>{
      overlay.classList.remove("open");
      document.body.style.overflow="";
    };

    async function recover(){
      const pending=findPendingOrder();
      const s=status();
      const btn=document.getElementById("geiRecoveryResume");
      if(!pending){
        if(s)s.textContent="No recoverable checkout session was found. You can safely start a new purchase.";
        return;
      }

      btn.disabled=true;
      s.textContent="Checking your existing purchase…";

      try{
        if(typeof window.paypalFetchJson!=="function"){
          throw new Error("Purchase recovery is not available on this page yet.");
        }

        const captured=await window.paypalFetchJson("/api/paypal/capture-order",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({orderID:pending.orderID,packId:pending.packId})
        });
        const cr=captured.response, data=captured.data;
        if(!cr.ok || !data.ok || data.status!=="COMPLETED" || !data.claimToken){
          throw new Error("We could not confirm a completed payment for this existing order. Your checkout was not charged again.");
        }

        s.textContent="Payment confirmed. Securing your FL OZ entitlement…";

        const claimId = typeof window.checkoutClaimId==="function"
          ? window.checkoutClaimId(pending.orderID)
          : get(CLAIM_PREFIX+pending.orderID);

        if(!claimId)throw new Error("The secure recovery identity is missing. Please reopen the Store and start a fresh checkout.");

        const claimed=await window.paypalFetchJson("/api/paypal/claim-entitlement",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            claimToken:data.claimToken,
            captureID:data.captureID,
            claimId
          })
        });
        const qr=claimed.response, claim=claimed.data;
        if(!qr.ok || !claim.ok || !claim.entitlement){
          throw new Error("Your payment is confirmed, but entitlement recovery needs another verification.");
        }

        s.textContent="Entitlement secured. Completing the original delivery…";

        const fulfillmentId=typeof window.checkoutFulfillmentId==="function"
          ? window.checkoutFulfillmentId(claim.entitlement.captureID)
          : "GEI-FULFILL-"+String(claim.entitlement.captureID||"").replace(/[^A-Za-z0-9._:-]/g,"-");

        const fulfilled=await window.paypalFetchJson("/api/paypal/fulfill-entitlement",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            claimToken:data.claimToken,
            captureID:data.captureID,
            fulfillmentId
          })
        });
        const fr=fulfilled.response, receipt=fulfilled.data;
        if(!fr.ok || !receipt.ok || !receipt.receipt || receipt.receipt.fulfillmentId!==fulfillmentId){
          throw new Error("Your entitlement is secure, but delivery is still processing. Please try recovery again.");
        }

        if(typeof window.creditPack!=="function"){
          throw new Error("The game wallet is not ready to receive the verified FL OZ yet.");
        }

        const credited=window.creditPack(receipt.receipt.packId,receipt.receipt.fulfillmentId,{
          orderID:receipt.receipt.orderID,
          captureID:receipt.receipt.captureID,
          serverAuthorized:true,
          fulfillmentId:receipt.receipt.fulfillmentId
        });

        if(!credited || (!credited.ok && credited.message!=="Receipt already credited.")){
          throw new Error((credited && credited.message) || "Your verified FL OZ could not be applied yet.");
        }

        clearIntent();
        if(typeof window.renderStore==="function")window.renderStore();
        if(typeof window.showToast==="function"){
          window.showToast(credited.ok
            ? "💧 +"+(typeof window.fmt==="function"?window.fmt(credited.credited):credited.credited)+" FL OZ recovered"
            : "💧 Your FL OZ was already safely credited.");
        }

        const pack=(Array.isArray(window.STORE_PACKS)?window.STORE_PACKS:[]).find(p=>p.id===receipt.receipt.packId);
        if(typeof window.showPayPalReceipt==="function" && pack){
          window.showPayPalReceipt(pack,credited.ok?credited.credited:receipt.receipt.flOz,receipt.receipt.captureID);
        }

        s.textContent="✅ Purchase recovered. Your FL OZ is back in the reservoir.";
        setTimeout(close,1800);
      }catch(err){
        console.error("[GEI Purchase Recovery]",err);
        if(s)s.textContent=(err && err.message)
          ? "⚠️ "+err.message
          : "⚠️ Recovery could not finish yet. Your purchase was not charged a second time.";
        btn.disabled=false;
      }
    }

    document.getElementById("geiRecoveryResume").addEventListener("click",recover);
    document.getElementById("geiRecoveryClose").addEventListener("click",close);
    overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape" && overlay.classList.contains("open"))close();});

    window.GEIPurchaseRecovery={
      version:VERSION,
      open:function(){
        const pending=findPendingOrder();
        if(!pending)return false;
        const pack=(Array.isArray(window.STORE_PACKS)?window.STORE_PACKS:[]).find(p=>p.id===pending.packId);
        const label=document.getElementById("geiRecoveryPack");
        if(label)label.textContent=pack ? pack.label+" · "+(typeof window.fmt==="function"?window.fmt(pack.flOz):pack.flOz)+" FL OZ" : "Existing purchase found";
        overlay.classList.add("open");
        document.body.style.overflow="hidden";
        return true;
      },
      close:close,
      inspect:function(){return findPendingOrder();}
    };

    function wrapCheckout(){
      if(typeof window.startCheckout!=="function" || window.startCheckout.__geiRecoveryWrapped)return;
      const original=window.startCheckout;
      function wrapped(packId){
        saveIntent(packId);
        return original.apply(this,arguments);
      }
      wrapped.__geiRecoveryWrapped=true;
      wrapped.__geiRecoveryOriginal=original;
      window.startCheckout=wrapped;
    }

    function wrapReceipt(){
      if(typeof window.showPayPalReceipt!=="function" || window.showPayPalReceipt.__geiRecoveryWrapped)return;
      const original=window.showPayPalReceipt;
      function wrapped(){
        clearIntent();
        return original.apply(this,arguments);
      }
      wrapped.__geiRecoveryWrapped=true;
      wrapped.__geiRecoveryOriginal=original;
      window.showPayPalReceipt=wrapped;
    }

    wrapCheckout();
    wrapReceipt();

    // The core page defines these functions before the deferred V2.1.x scripts,
    // but retry briefly if a future refactor changes script ordering.
    let attempts=0;
    const hookTimer=setInterval(()=>{
      attempts++;
      wrapCheckout();
      wrapReceipt();
      if(attempts>=20 || (window.startCheckout && window.showPayPalReceipt))clearInterval(hookTimer);
    },250);

    const pending=findPendingOrder();
    if(pending){
      const pack=(Array.isArray(window.STORE_PACKS)?window.STORE_PACKS:[]).find(p=>p.id===pending.packId);
      const label=document.getElementById("geiRecoveryPack");
      if(label)label.textContent=pack ? pack.label+" · "+(typeof window.fmt==="function"?window.fmt(pack.flOz):pack.flOz)+" FL OZ" : "Existing purchase found";
      setTimeout(()=>window.GEIPurchaseRecovery.open(),450);
    }

    // Recovery launcher appears only when an interrupted purchase is actually found.
    const launcher=document.createElement("button");
    launcher.type="button";
    launcher.id="geiRecoveryLauncher";
    launcher.className="iconBtn";
    launcher.setAttribute("aria-label","Recover interrupted purchase");
    launcher.title="Recover interrupted purchase";
    launcher.textContent="↻";
    launcher.style.cssText="width:38px;height:38px;flex:0 0 auto;display:none;";
    launcher.addEventListener("click",()=>window.GEIPurchaseRecovery.open());
    const hudRight=document.querySelector(".hudRight");
    if(hudRight)hudRight.appendChild(launcher);
    if(pending)launcher.style.display="block";
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
