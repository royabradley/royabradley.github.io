// Builds the newsletter form action and field name from config. Spread straight into the Newsletter section.
import { forms } from '../config';

export function newsletterForm() {
  const { provider, id, action } = forms.newsletter;
  // pro-only. Embed form specs per service
  if (provider === 'buttondown')
    return {
      action: id && `https://buttondown.com/api/emails/embed-subscribe/${id}`,
      hidden: { embed: '1' },
    };
  if (provider === 'kit')
    return {
      action: id && `https://app.kit.com/forms/${id}/subscriptions`,
      field: 'email_address',
    };
  return { action };
}
