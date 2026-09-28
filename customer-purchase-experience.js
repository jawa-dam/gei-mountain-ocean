/* V2.1.0 — Customer Purchase Experience
   Presentation layer only. Reuses the certified Store/PayPal transaction path.
   It never creates its own payment, capture, claim, fulfillment, or wallet-credit mechanism.
*/
(function(){
  "use strict";

  function esc(value){
    return String(value ?? "").replace(/[&<>"']/g, function(ch){
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[ch];
    });
  }

  function init(){
    if(document.getElementById("geiPurchaseCenter")) return;
    const packs = Array.isArray(window.STORE_PACKS) ? window.STORE_PACKS : [];
    if(!packs.length){
      setTimeout(init, 250);
      return;
    }

    const style=document.createElement("style");
    style.id="geiPurchaseExperienceStyles";
    style.textContent=`
      #geiPurchaseCenter{
        position:fixed; inset:0; z-index:9990; display:none;
        align-items:center; justify-content:center;
        padding:calc(env(safe-area-inset-top) + 14px) 12px calc(env(safe-area-inset-bottom) + 14px);
        background:rgba(1,5,16,.82); backdrop-filter:blur(16px);
      }
      #geiPurchaseCenter.open{display:flex;}
      .geiPurchaseShell{
        width:min(100%,500px); max-height:100%; overflow:auto;
        border:1.5px solid rgba(255,255,255,.28); border-radius:26px;
        background:linear-gradient(165deg,rgba(7,17,43,.98),rgba(4,7,20,.98));
        box-shadow:0 0 70px rgba(47,210,255,.24), inset 0 1px 0 rgba(255,255,255,.12);
        color:#fff; padding:18px;
      }
      .geiPurchaseTop{display:flex;align-items:center;justify-content:space-between;gap:10px;}
      .geiPurchaseEyebrow{font-size:.78rem;font-weight:950;letter-spacing:.14em;color:#2fd2ff;text-transform:uppercase;}
      .geiPurchaseTitle{margin-top:3px;font-size:clamp(1.65rem,7vw,2.25rem);font-weight:950;line-height:1.05;}
      .geiPurchaseClose{
        width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.28);
        background:rgba(255,255,255,.08);color:#fff;font-size:1.25rem;font-weight:900;cursor:pointer;
      }
      .geiPurchaseHero{
        margin:14px 0;padding:13px;border-radius:18px;
        background:linear-gradient(135deg,rgba(47,210,255,.12),rgba(241,16,186,.12));
        border:1px solid rgba(255,255,255,.14);
      }
      .geiPurchaseHero strong{color:#ffd76a;}
      .geiPurchasePacks{display:grid;gap:10px;}
      .geiPurchasePack{
        display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;
        padding:14px;border-radius:18px;background:rgba(255,255,255,.055);
        border:1px solid rgba(255,255,255,.14);
      }
      .geiPurchasePack.featured{
        border-color:rgba(255,215,106,.48);
        box-shadow:0 0 22px rgba(255,215,106,.08);
      }
      .geiPurchasePackName{font-size:1.05rem;font-weight:950;}
      .geiPurchasePackOz{margin-top:3px;font-size:1.15rem;font-weight:950;color:#2fd2ff;}
      .geiPurchasePackSub{margin-top:3px;font-size:.8rem;font-weight:750;color:rgba(255,255,255,.68);}
      .geiPurchaseBuy{
        min-width:94px;padding:12px 15px;border:0;border-radius:14px;cursor:pointer;
        color:#fff;font-weight:950;font-size:1rem;
        background:linear-gradient(135deg,#2fd2ff,#3d3dea,#f310ba);
        box-shadow:0 7px 20px rgba(47,210,255,.18);
      }
      .geiPurchaseBuy:active{transform:scale(.97);}
      .geiPurchaseStatus{
        margin-top:12px;min-height:1.4em;text-align:center;font-size:.9rem;font-weight:850;
        color:rgba(255,255,255,.78);
      }
      .geiPurchaseReceipt{
        display:none;margin-top:12px;padding:15px;border-radius:18px;
        background:linear-gradient(145deg,rgba(32,220,160,.14),rgba(41,198,255,.14));
        border:1.5px solid rgba(126,255,214,.55);text-align:center;
      }
      .geiPurchaseReceipt.show{display:block;}
      .geiPurchaseReceiptTitle{font-size:1.15rem;font-weight:950;}
      .geiPurchaseReceiptOz{margin-top:4px;font-size:1.55rem;font-weight:950;color:#2fd2ff;}
      .geiPurchaseReceiptSub{margin-top:5px;font-size:.8rem;color:rgba(255,255,255,.72);line-height:1.35;}
      .geiPurchaseFooter{
        margin-top:13px;padding-top:11px;border-top:1px solid rgba(255,255,255,.1);
        font-size:.76rem;line-height:1.4;text-align:center;color:rgba(255,255,255,.58);
      }
      .geiPurchaseFooter b{color:#2fd2ff;}
      @media(max-width:380px){
        .geiPurchaseShell{padding:14px;border-radius:22px;}
        .geiPurchasePack{grid-template-columns:1fr;}
        .geiPurchaseBuy{width:100%;}
      }
    `;
    document.head.appendChild(style);

    const overlay=document.createElement("div");
    overlay.id="geiPurchaseCenter";
    overlay.innerHTML=`
      <section class="geiPurchaseShell" role="dialog" aria-modal="true" aria-labelledby="geiPurchaseTitle">
        <div class="geiPurchaseTop">
          <div>
            <div class="geiPurchaseEyebrow">DAM NATION · PURCHASE CENTER</div>
            <div class="geiPurchaseTitle" id="geiPurchaseTitle">Fill the Reservoir 💧</div>
          </div>
          <button class="geiPurchaseClose" type="button" aria-label="Close purchase center">✕</button>
        </div>
        <div class="geiPurchaseHero">
          <strong>Choose your FL OZ.</strong><br>
          Your payment is handled by the existing secure PayPal flow. After confirmation, your entitlement is verified and fulfilled before the game credits your wallet.
        </div>
        <div class="geiPurchasePacks">
          ${packs.map(function(p,i){
            const featured=i===packs.length-1;
            return `
              <article class="geiPurchasePack${featured?" featured":""}">
                <div>
                  <div class="geiPurchasePackName">${esc(p.label)}</div>
                  <div class="geiPurchasePackOz">${esc(typeof fmt==="function"?fmt(p.flOz):p.flOz)} FL OZ</div>
                  <div class="geiPurchasePackSub">${featured?"Maximum reservoir pressure":"Digital water points · no shipping"}</div>
                </div>
                <button class="geiPurchaseBuy" type="button" data-gei-buy="${esc(p.id)}">${esc(p.priceLabel || ("$"+Number(p.priceUsd).toFixed(2)))}</button>
              </article>
            `;
          }).join("")}
        </div>
        <div class="geiPurchaseStatus" id="geiPurchaseCenterStatus" aria-live="polite">Choose a pack to begin.</div>
        <div class="geiPurchaseReceipt" id="geiPurchaseCenterReceipt">
          <div class="geiPurchaseReceiptTitle">💧 Reservoir Filled!</div>
          <div class="geiPurchaseReceiptOz" id="geiPurchaseCenterReceiptOz"></div>
          <div class="geiPurchaseReceiptSub">Payment verified · entitlement secured · wallet credit completed</div>
        </div>
        <div class="geiPurchaseFooter">
          <b>Secure flow:</b> PayPal → payment confirmation → durable entitlement → fulfillment → FL OZ credit.
        </div>
      </section>
    `;
    document.body.appendChild(overlay);

    function open(){
      overlay.classList.add("open");
      document.body.style.overflow="hidden";
      const first=overlay.querySelector("[data-gei-buy]");
      if(first) setTimeout(()=>first.focus(),30);
    }
    function close(){
      overlay.classList.remove("open");
      document.body.style.overflow="";
    }

    overlay.querySelector(".geiPurchaseClose").addEventListener("click",close);
    overlay.addEventListener("click",function(e){
      if(e.target===overlay) close();
      const buy=e.target.closest("[data-gei-buy]");
      if(!buy) return;
      const pack=packs.find(p=>p.id===buy.getAttribute("data-gei-buy"));
      if(!pack || typeof window.startCheckout!=="function") return;
      const status=document.getElementById("geiPurchaseCenterStatus");
      if(status) status.textContent="Opening secure PayPal checkout…";
      window.startCheckout(pack.id);
    });
    document.addEventListener("keydown",function(e){
      if(e.key==="Escape" && overlay.classList.contains("open")) close();
    });

    // Expose a tiny, presentation-only public hook for future navigation.
    window.GEIPurchaseExperience={open,close,version:"2.1.0"};

    // Reuse the existing store entry point when possible.
    const storeButton=document.getElementById("navStoreBtn");
    if(storeButton){
      storeButton.addEventListener("dblclick",function(e){
        e.preventDefault();
        open();
      });
    }

    // Add a clearly labeled purchase-center launcher without replacing existing controls.
    const launcher=document.createElement("button");
    launcher.type="button";
    launcher.className="iconBtn";
    launcher.setAttribute("aria-label","Open Purchase Center");
    launcher.title="Purchase Center";
    launcher.textContent="💧";
    launcher.style.cssText="width:38px;height:38px;flex:0 0 auto;";
    launcher.addEventListener("click",open);
    const hudRight=document.querySelector(".hudRight");
    if(hudRight) hudRight.appendChild(launcher);

    // Existing receipt renderer remains authoritative; this only mirrors its successful result.
    if(typeof window.showPayPalReceipt==="function"){
      const originalReceipt=window.showPayPalReceipt;
      window.showPayPalReceipt=function(pack,credited,captureID){
        originalReceipt.apply(this,arguments);
        const status=document.getElementById("geiPurchaseCenterStatus");
        const receipt=document.getElementById("geiPurchaseCenterReceipt");
        const oz=document.getElementById("geiPurchaseCenterReceiptOz");
        if(receipt && oz){
          oz.textContent="+" + (typeof fmt==="function"?fmt(credited):credited) + " FL OZ";
          receipt.classList.add("show");
        }
        if(status) status.textContent="✅ Purchase complete — your FL OZ is secured.";
      };
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();