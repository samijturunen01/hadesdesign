# Content sources

All facts on the site come from the previous hadesdesign.fi (checked 2026-10). They live in `src/data/` and `src/pages/legal/legalContent.ts`. Page copy (headlines, intros) is written around those facts and must not add new ones.

## Verified (from the previous site)

- Company name, founder (Sami Turunen, role and quote), email, phone, Joensuu location, "locally and remotely".
- Response time ("usually within 24 hours on business days").
- The four services and their descriptions/benefits; prices: maintenance 40 €/month or 360 €/year (websites: see the packages below).
- Kevyt (790 €) and Verkkosivupaketti (990 €) were replaced on 2026-11-23. The online store package (Verkkokauppapaketti 1 990 €) was removed on the owner's request on 2026-11-23; online stores are now priced per project ("Hinta tarjouksen mukaan").
- Payment by bank transfer, invoice on completion; upgrade credit ("we credit your original investment"); ownership after payment (pricing FAQ).

## Set by the owner (2026-11-23)

- Website packages **Hermes 800 €** (one page), **Apollo 1 000 €** (multi-page, the recommended package) and **Zeus** = Apollo + add-ons: booking system and admin dashboard **+400 €**, online payments **+300 €**, analytics **+100 €**, each additional language **+100 €**. All four with one extra language = **1 900 €**. Contents per package, add-on scope and limits as in the owner's brief; all of it lives in `src/data/pricing.ts`.
- Philosophy "Conversion First" / "Suunniteltu näyttämään hyvältä. Rakennettu myymään."
- Apollo is labelled **"Suosituin"** / "Most popular" (owner's choice, 2026-11-23).
- Post-launch support and maintenance are **separately paid** services (owner's rule, 2026-10-14). The old "60 days of support" claim was removed everywhere – do not reintroduce it.
- Pricing and maintenance FAQs, including "99,9 % käytettävyys" and daily backups kept 30 days.
- Portfolio: Pielisen Lumo (from the previous site); Okkuva and Kuljetus Jumppanen (added on the owner’s request 2026-10-14; descriptions use only facts visible on okkuva.fi and kuljetusjumppanen.fi that day). Shady was removed from the portfolio.
- The single testimonial (quote text verbatim from the previous site).
- Terms of service (January 2025), privacy policy (extended – see below).

## Not known – do not add without the owner

- Business ID (Y-tunnus), street address, opening hours.
- Whether maintenance prices include VAT (never stated, so the site does not say).
- **Whether Hermes/Apollo/Zeus prices include VAT.** The site applies its existing policy ("Hinnat sisältävät ALV:n", one string in `src/data/packages.ts` → `vatNote`/`vatShort`, plus `valueAddedTaxIncluded` in `src/seo/schema.ts`). Owner to confirm.
- Delivery times for the new packages (the old 1–2 / 2–3 week figures belonged to Kevyt/Verkkosivupaketti; the FAQ now says the schedule comes with the quote), Apollo's page count, whether extra pages still cost 100 €/page.
- How much translation the 100 € language price covers (the site says the scope is agreed in the quote).
- Client numbers, years in business, statistics, other clients or testimonials.

## Needs the owner's attention before launch

- **Privacy policy**: extended to describe this site (Apps Script contact form, reCAPTCHA, GitHub Pages hosting). Google Analytics and the cookie banner were removed 2026-10-14; the policy says the site sets no cookies itself and that reCAPTCHA loads only when the contact form is used. The owner should review it.
- **Testimonial attribution** was moved from Shady to **Okkuva** on the owner’s request (2026-10-14). The quote is unchanged; the role line “Lyhytvideoita yrityksille / Short-form video for businesses” is Okkuva’s own tagline. Confirm both before production deployment.
- **Hero stat "100 % asiakastyytyväisyys / 100% customer satisfaction"** was added on the owner's request (2026-10-14) without supporting data. Confirm it before production deployment.
- The 99,9 % uptime guarantee is quoted from the old FAQ. Confirm it is still offered on the new hosting.
- Screenshots in `assets-src/work/` are from the live sites. Regenerate with `npm run assets` if they change.
