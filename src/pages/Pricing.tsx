import { Link } from 'react-router-dom';
import { Check, Zap, Star, Crown } from 'lucide-react';
import type { Profile } from '../types';

interface PricingProps {
  profile: Profile | null;
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Zap,
    description: 'Get started and explore',
    features: [
      '5 venue matches per month',
      '3 outreach emails per month',
      'Basic email templates',
      'Outreach tracking',
    ],
    cta: 'Current Plan',
    highlighted: false,
  },
  {
    id: 'support_act',
    name: 'Support Act',
    price: '$9',
    period: '/month',
    icon: Star,
    description: 'For active gigging musicians',
    features: [
      '25 venue matches per month',
      '20 outreach emails per month',
      'AI-personalized emails',
      'Priority venue matching',
      'Response tracking',
    ],
    cta: 'Upgrade',
    highlighted: true,
  },
  {
    id: 'headliner',
    name: 'Headliner',
    price: '$19',
    period: '/month',
    icon: Crown,
    description: 'Unlimited booking power',
    features: [
      'Unlimited venue matches',
      'Unlimited outreach emails',
      'AI-personalized emails',
      'Priority venue matching',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Upgrade',
    highlighted: false,
  },
];

export function Pricing({ profile }: PricingProps) {
  const currentPlan = profile?.plan || null;

  return (
    <div className="page-container">
      <div className="pricing-header">
        <h1>Simple, transparent pricing</h1>
        <p className="text-muted">Choose the plan that matches your ambition</p>
      </div>

      <div className="pricing-grid">
        {plans.map(plan => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;

          return (
            <div key={plan.id} className={`pricing-card ${plan.highlighted ? 'highlighted' : ''} ${isCurrent ? 'current' : ''}`}>
              {plan.highlighted && <div className="pricing-badge">Most Popular</div>}
              <div className="pricing-icon"><Icon size={28} /></div>
              <h3>{plan.name}</h3>
              <p className="pricing-description">{plan.description}</p>
              <div className="pricing-price">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map(feature => (
                  <li key={feature}>
                    <Check size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <button className="btn btn-outline btn-full" disabled>Current Plan</button>
              ) : currentPlan ? (
                <button className="btn btn-primary btn-full">
                  {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                </button>
              ) : (
                <Link to="/signup" className="btn btn-primary btn-full">
                  Get Started
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
