import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tier_id, billing_interval = "monthly", success_url, cancel_url } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User not authenticated");

    // Get user profile and organization
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("organization_id, email")
      .eq("id", userData.user.id)
      .single();

    if (!profile?.organization_id) throw new Error("Organization not found");

    // Get subscription tier details
    const { data: tier } = await supabaseClient
      .from("subscription_tiers")
      .select("*")
      .eq("id", tier_id)
      .single();

    if (!tier) throw new Error("Subscription tier not found");

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: profile.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: {
          organization_id: profile.organization_id,
          user_id: userData.user.id,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const price = billing_interval === "monthly" ? tier.price_monthly : tier.price_yearly;
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `TITANIS™ ${tier.name} Plan`,
              description: tier.description,
            },
            unit_amount: price,
            recurring: {
              interval: billing_interval === "monthly" ? "month" : "year",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: success_url || `${req.headers.get("origin")}/subscription-success`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/subscription-cancel`,
      metadata: {
        organization_id: profile.organization_id,
        tier_id: tier_id,
        billing_interval: billing_interval,
      },
      subscription_data: {
        metadata: {
          organization_id: profile.organization_id,
          tier_id: tier_id,
        },
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});