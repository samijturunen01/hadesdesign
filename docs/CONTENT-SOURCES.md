# Content sources

All facts on the site come from the previous hadesdesign.fi (checked 2026-10). They live in `src/data/` and `src/pages/legal/legalContent.ts`. Page copy (headlines, intros) is written around those facts and must not add new ones.

## Verified (from the previous site)

- Company name, founder (Sami Turunen, role and quote), email, phone, Joensuu location, "locally and remotely".
- Response time ("usually within 24 hours on business days").
- The four services and their descriptions/benefits; prices: websites from 790 €, online stores from 1 990 €, maintenance 40 €/month or 360 €/year.
- Packages (Kevyt 790 €, Verkkosivupaketti 990 €, Verkkokauppapaketti 1 990 €), pages, included features, "Suosituin", VAT included, typical timelines (from the pricing FAQ).
- Post-launch support and maintenance are **separately paid** services (owner's rule, 2026-10-14). The old "60 days of support" claim was removed everywhere – do not reintroduce it.
- Pricing and maintenance FAQs, including "99,9 % käytettävyys" and daily backups kept 30 days.
- Portfolio: Pielisen Lumo (from the previous site); Okkuva and Kuljetus Jumppanen (added on the owner’s request 2026-10-14; descriptions use only facts visible on okkuva.fi and kuljetusjumppanen.fi that day). Shady was removed from the portfolio.
- The single testimonial (quote text verbatim from the previous site).
- Terms of service (January 2025), privacy policy (extended – see below).

## Not known – do not add without the owner

- Business ID (Y-tunnus), street address, opening hours.
- Whether maintenance prices include VAT (never stated, so the site does not say).
- Client numbers, years in business, statistics, other clients or testimonials.

## Needs the owner's attention before launch

- **Privacy policy**: extended to describe this site (Apps Script contact form, reCAPTCHA, GitHub Pages hosting). Google Analytics and the cookie banner were removed 2026-10-14; the policy says the site sets no cookies itself and that reCAPTCHA loads only when the contact form is used. The owner should review it.
- **Testimonial attribution** was moved from Shady to **Okkuva** on the owner’s request (2026-10-14). The quote is unchanged; the role line “Lyhytvideoita yrityksille / Short-form video for businesses” is Okkuva’s own tagline. Confirm both before production deployment.
- **Hero stat "100 % asiakastyytyväisyys / 100% customer satisfaction"** was added on the owner's request (2026-10-14) without supporting data. Confirm it before production deployment.
- The 99,9 % uptime guarantee is quoted from the old FAQ. Confirm it is still offered on the new hosting.
- Screenshots in `assets-src/work/` are from the live sites. Regenerate with `npm run assets` if they change.
