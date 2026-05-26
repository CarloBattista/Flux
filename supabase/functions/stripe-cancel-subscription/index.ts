import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "stripe"
import { createClient } from "supabase"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) throw new Error('User not found')

    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('profile_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (subError || !subscription) {
      throw new Error('No active subscription found')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Annulla l'abbonamento alla fine del periodo corrente
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: true }
    )

    // Aggiorna anche il database locale con la data di fine periodo
    await supabaseClient
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.stripe_subscription_id)

    return new Response(
      JSON.stringify({ success: true, subscription: updatedSubscription }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})