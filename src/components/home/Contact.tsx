import { ArrowUpRight } from 'lucide-react';
import type { Profile } from '../../types/content';
import { SocialLinks } from '../common/SocialLinks';

export function Contact({ profile }: { profile: Profile }) {
  return (
    <section
      id="contact"
      className="section contact-section"
      aria-labelledby="contact-title"
    >
      <div>
        <p className="eyebrow">04 / Próximo passo</p>
        <h2 id="contact-title">{profile.contactHeadline}</h2>
        <p>{profile.contactText}</p>
        <SocialLinks profile={profile} labeled />
      </div>
      <ArrowUpRight
        className="contact-arrow"
        size={150}
        strokeWidth={0.6}
        aria-hidden="true"
      />
    </section>
  );
}
