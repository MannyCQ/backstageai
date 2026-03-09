export interface Profile {
  id: string;
  artist_name: string | null;
  area: string | null;
  genre: string | null;
  similar_artists: string | null;
  bio: string | null;
  spotify_url: string | null;
  soundcloud_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
  onboarding_complete: boolean;
  plan: 'free' | 'support_act' | 'headliner';
  venue_matches_used: number;
  emails_sent_this_month: number;
  usage_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface Outreach {
  id: string;
  user_id: string;
  venue_name: string;
  venue_email: string | null;
  subject: string | null;
  body: string | null;
  status: 'sent' | 'replied' | 'booked' | 'no_response';
  notes: string | null;
  sent_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'free' | 'support_act' | 'headliner';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export const PLAN_LIMITS = {
  free: { venue_matches: 5, emails_per_month: 3 },
  support_act: { venue_matches: 25, emails_per_month: 20 },
  headliner: { venue_matches: -1, emails_per_month: -1 }, // unlimited
} as const;

export const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  support_act: 'Support Act',
  headliner: 'Headliner',
};
