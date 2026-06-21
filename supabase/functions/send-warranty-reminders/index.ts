import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase env configuration" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const waapiToken = Deno.env.get("WAAPI_TOKEN") || "";
    const waapiDeviceId = Deno.env.get("WAAPI_DEVICE_ID") || "";

    if (!waapiToken || !waapiDeviceId) {
      return new Response(
        JSON.stringify({ error: "Missing WAAPI_TOKEN or WAAPI_DEVICE_ID environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase Client with Service Role Key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate target expiry dates (today + 30 days, today + 7 days, today + 1 day) in WIB (UTC+7)
    const getTargetDateStr = (daysAhead: number) => {
      const date = new Date();
      // Add 7 hours to convert from UTC to WIB (or check the exact local day)
      date.setHours(date.getHours() + 7);
      date.setDate(date.getDate() + daysAhead);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const targetDate30 = getTargetDateStr(30);
    const targetDate7 = getTargetDateStr(7);
    const targetDate1 = getTargetDateStr(1);

    console.log(`Target date 30 days: ${targetDate30}`);
    console.log(`Target date 7 days: ${targetDate7}`);
    console.log(`Target date 1 day: ${targetDate1}`);

    // Query warranties expiring on target dates
    const { data: warranties, error: queryError } = await supabase
      .from("warranties")
      .select(`
        id,
        expiry_date,
        status,
        assets (
          id,
          name,
          brand,
          user_id,
          profiles (
            id,
            name,
            email,
            whatsapp
          )
        )
      `)
      .or(`expiry_date.eq.${targetDate30},expiry_date.eq.${targetDate7},expiry_date.eq.${targetDate1}`);

    if (queryError) {
      throw queryError;
    }

    if (!warranties || warranties.length === 0) {
      return new Response(
        JSON.stringify({ message: "No warranties expiring today for 30, 7, or 1 day alerts" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${warranties.length} warranties expiring soon.`);
    const results = [];

    for (const warranty of warranties) {
      // Deno/Supabase nested select typing: cast to any to avoid TS issues
      const wAny = warranty as any;
      const asset = wAny.assets;
      if (!asset) continue;

      const profile = asset.profiles;
      if (!profile) continue;

      let waNumber = profile.whatsapp || "";
      waNumber = waNumber.replace(/[^0-9]/g, "");
      
      if (waNumber.startsWith("0")) {
        waNumber = "62" + waNumber.substring(1);
      }

      if (!waNumber) {
        console.warn(`User ${profile.name || profile.email} does not have a WhatsApp number set. Skipping.`);
        continue;
      }

      const expiryDateStr = wAny.expiry_date;
      const userName = profile.name || "User";
      const assetName = asset.name;
      const formattedExpiryDate = new Date(expiryDateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });

      let type = "";
      let message = "";

      if (expiryDateStr === targetDate30) {
        type = "expiring_30";
        message = `⏰ *Reminder Garansi* \n\nHalo ${userName}! Garansi *${assetName}* kamu akan habis dalam *30 hari* lagi (tanggal ${formattedExpiryDate}).\n\nSegera manfaatkan garansi sebelum habis! 🛡️\n\n_- Tim TepatWaktu_`;
      } else if (expiryDateStr === targetDate7) {
        type = "expiring_7";
        message = `⚠️ *Reminder Garansi* \n\nHalo ${userName}! Garansi *${assetName}* kamu tinggal *7 hari* lagi (tanggal ${formattedExpiryDate}).\n\nJangan sampai terlewat! ⏳\n\n_- Tim TepatWaktu_`;
      } else if (expiryDateStr === targetDate1) {
        type = "expiring_1";
        message = `🚨 *Reminder Garansi* \n\nHalo ${userName}! Garansi *${assetName}* kamu akan habis *BESOK* (tanggal ${formattedExpiryDate}).\n\nIni hari terakhir kamu bisa klaim garansi! 🆘\n\n_- Tim TepatWaktu_`;
      } else {
        continue;
      }

      console.log(`Sending WhatsApp reminder to ${waNumber} for ${assetName}`);

      let waapiSuccess = false;
      let waapiErrorMsg = "";

      try {
        const response = await fetch("https://waapi.co.id/api/v1/messages/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${waapiToken}`
          },
          body: JSON.stringify({
            deviceId: waapiDeviceId,
            to: waNumber,
            message: message
          })
        });

        const respJson = await response.json();
        if (response.ok && respJson.status === "success") {
          waapiSuccess = true;
          console.log(`WhatsApp sent successfully to ${waNumber}`);
        } else {
          waapiErrorMsg = respJson.message || response.statusText;
          console.error(`WAAPI failed to send:`, respJson);
        }
      } catch (err) {
        waapiErrorMsg = err.message;
        console.error(`Error calling WAAPI:`, err);
      }

      // Log notification in database
      if (waapiSuccess) {
        const { error: insertError } = await supabase
          .from("notifications")
          .insert({
            user_id: asset.user_id,
            asset_id: asset.id,
            type: type,
            title: "Reminder Garansi",
            message: message.replace(/\*/g, ""), // strip markdown bold stars for in-app UI
            is_read: false,
            sent_at: new Date().toISOString()
          });

        if (insertError) {
          console.error("Failed to insert notification record:", insertError);
        }
      }

      results.push({
        asset_id: asset.id,
        user_id: asset.user_id,
        type,
        waapiSuccess,
        waapiErrorMsg
      });
    }

    return new Response(
      JSON.stringify({ message: "Job completed", results }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error running edge function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
