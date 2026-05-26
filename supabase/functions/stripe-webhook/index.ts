import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14?target=denonext"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-04-30.basil",
})

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

serve(async (req) => {
  console.log("--- WEBHOOK ARRIVATO ---");
  console.log("Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));

  const signature = req.headers.get("stripe-signature")
  const body = await req.arrayBuffer()

  let event

  try {
    // Usiamo constructEventAsync per Deno/SubtleCrypto
    event = await stripe.webhooks.constructEventAsync(
      new Uint8Array(body),
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    )
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  console.log("EVENT:", event.type)

  switch (event.type) {

    case "checkout.session.completed": {
      const session = event.data.object
      console.log("Processing checkout.session.completed", session.id)

      const userId = session.metadata?.user_id
      const customerId = session.customer
      const subscriptionId = session.subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)
      
      // Recuperiamo il priceId dai line_items se disponibile, o usiamo un fallback
      // Nota: in una sessione di checkout, il priceId si trova solitamente nel primo item
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      const priceId = lineItems.data[0]?.price?.id
      const productId = lineItems.data[0]?.price?.product

      if (!userId) {
        console.error("No user_id found in metadata");
        break;
      }

      const { data, error } = await supabase.from("subscriptions").upsert({
        profile_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        stripe_product_id: productId,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        next_payment_date: new Date(subscription.next_payment_date * 1000).toISOString(),
        status: "active",
        plan: "plus",
      }, { onConflict: 'profile_id' })

      if (error) console.error("Error upserting:", error)
      else console.log("Upsert successful")

      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object

      await supabase
        .from("subscriptions")
        .update({
          status: sub.status,
          cancel_at_period_end: sub.cancel_at_period_end,
          current_period_start: new Date(sub.current_period_start * 1000),
          current_period_end: new Date(sub.current_period_end * 1000),
        })
        .eq("stripe_subscription_id", sub.id)

      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object

      await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
        })
        .eq("stripe_subscription_id", sub.id)

      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object

      await supabase
        .from("subscriptions")
        .update({
          status: "past_due",
          canceled_at: new Date(invoice.canceled_at * 1000),
        })
        .eq("stripe_customer_id", invoice.customer)

      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object
      console.log("Payment succeeded for invoice:", invoice.id)

      // Se non c'è un abbonamento associato all'invio, ignoriamo (es. pagamento una tantum)
      if (!invoice.subscription) break

      const subscriptionId = invoice.subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)

      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          stripe_price_id: subscription.items.data[0].price.id,
          stripe_product_id: subscription.items.data[0].price.product,
        })
        .eq("stripe_subscription_id", subscriptionId)

      if (error) {
        console.error("Error updating subscription on payment success:", error)
      } else {
        console.log("Subscription updated successfully after payment success")
      }

      break
    }

    default:
      console.log("Unhandled event:", event.type)
  }

  return new Response("ok")
})