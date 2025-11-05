/*
  # Add Stripe Integration Fields

  1. Changes
    - Add `stripe_customer_id` (text) to user_subscriptions
    - Add `stripe_subscription_id` (text) to user_subscriptions
    - Add indexes for Stripe IDs for faster lookups

  2. Security
    - No changes to RLS policies (existing policies remain)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_subscriptions' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE user_subscriptions ADD COLUMN stripe_customer_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_subscriptions' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE user_subscriptions ADD COLUMN stripe_subscription_id text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription ON user_subscriptions(stripe_subscription_id);