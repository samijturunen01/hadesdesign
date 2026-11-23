/**
 * Price calculations and the pricing → contact form hand-off (src/data/pricing.ts).
 * Run with `npm test`. Node strips the TypeScript types itself, so the module
 * must keep to type-only imports.
 */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  ALL_ADDONS,
  addonCount,
  addons,
  comparison,
  headlinePrice,
  lineItems,
  MAX_EXTRA_LANGUAGES,
  NO_ADDONS,
  PRICES,
  quoteForTier,
  quoteFromSearch,
  quoteFromSelection,
  quoteToSearch,
  quoteTotal,
  STARTING_PRICE,
  tierForSelection,
  tiers,
  ZEUS_FROM_PRICE,
  ZEUS_FULL_PRICE,
  zeusTotal,
} from '../src/data/pricing.ts'

const pick = (patch) => ({ ...NO_ADDONS, ...patch })

describe('package prices', () => {
  it('Hermes is 800 €, Apollo 1 000 €', () => {
    assert.equal(headlinePrice('hermes'), 800)
    assert.equal(headlinePrice('apollo'), 1000)
    assert.equal(STARTING_PRICE, 800)
  })

  it('Zeus with every listed add-on and one extra language is 1 900 €', () => {
    assert.equal(zeusTotal(ALL_ADDONS), 1900)
    assert.equal(ZEUS_FULL_PRICE, 1900)
    assert.equal(headlinePrice('zeus'), 1900)
    assert.equal(1000 + 400 + 300 + 100 + 100, ZEUS_FULL_PRICE)
  })

  it('the cheapest Zeus is 1 100 €', () => {
    assert.equal(ZEUS_FROM_PRICE, 1100)
  })

  it('add-on prices', () => {
    assert.deepEqual(
      Object.fromEntries(addons.map((a) => [a.id, a.price])),
      { booking: 400, payments: 300, analytics: 100, languages: 100 },
    )
  })
})

describe('Zeus calculator', () => {
  const cases = [
    ['no add-ons = Apollo', pick({}), 1000],
    ['booking', pick({ booking: true }), 1400],
    ['payments', pick({ payments: true }), 1300],
    ['analytics', pick({ analytics: true }), 1100],
    ['one additional language', pick({ languages: 1 }), 1100],
    ['booking + payments', pick({ booking: true, payments: true }), 1700],
    ['analytics + one language', pick({ analytics: true, languages: 1 }), 1200],
    ['all four add-ons', ALL_ADDONS, 1900],
  ]
  for (const [name, selection, expected] of cases) {
    it(`${name} → ${expected} €`, () => assert.equal(zeusTotal(selection), expected))
  }

  it('every additional language adds exactly 100 €', () => {
    for (let n = 1; n <= MAX_EXTRA_LANGUAGES; n++) {
      assert.equal(zeusTotal(pick({ languages: n })) - zeusTotal(pick({ languages: n - 1 })), PRICES.language)
      assert.equal(zeusTotal({ ...ALL_ADDONS, languages: n }), 1800 + n * 100)
    }
  })

  it('removing an add-on takes its price off again', () => {
    let selection = ALL_ADDONS
    for (const [id, price] of [['booking', 400], ['payments', 300], ['analytics', 100]]) {
      const before = zeusTotal(selection)
      selection = { ...selection, [id]: false }
      assert.equal(before - zeusTotal(selection), price)
    }
    assert.equal(zeusTotal(selection), 1100)
    assert.equal(zeusTotal({ ...selection, languages: 0 }), 1000)
  })

  it('language count is clamped to 0…max and whole numbers', () => {
    assert.equal(zeusTotal(pick({ languages: -3 })), 1000)
    assert.equal(zeusTotal(pick({ languages: 2.7 })), 1200)
    assert.equal(zeusTotal(pick({ languages: 99 })), 1000 + MAX_EXTRA_LANGUAGES * 100)
    assert.equal(zeusTotal(pick({ languages: Number.NaN })), 1000)
  })

  it('line items add up to the total and list the base first', () => {
    const selection = pick({ booking: true, analytics: true, languages: 3 })
    const items = lineItems(selection)
    assert.deepEqual(items.map((i) => i.id), ['apollo', 'booking', 'analytics', 'languages'])
    assert.equal(items.at(-1).quantity, 3)
    assert.equal(items.reduce((s, i) => s + i.amount, 0), zeusTotal(selection))
  })

  it('no add-ons is labelled Apollo, never Zeus', () => {
    assert.equal(tierForSelection(NO_ADDONS), 'apollo')
    assert.equal(tierForSelection(pick({ languages: 1 })), 'zeus')
    assert.equal(addonCount(NO_ADDONS), 0)
    assert.equal(addonCount(pick({ booking: true, languages: 4 })), 2)
  })
})

describe('quote hand-off through the URL', () => {
  it('round-trips every kind of quote', () => {
    const quotes = [
      quoteForTier('hermes'),
      quoteForTier('apollo'),
      quoteFromSelection(pick({ booking: true })),
      quoteFromSelection(pick({ payments: true, languages: 2 })),
      quoteFromSelection(ALL_ADDONS),
    ]
    for (const quote of quotes) {
      const back = quoteFromSearch(quoteToSearch(quote))
      assert.deepEqual(back, quote)
      assert.equal(quoteTotal(back), quoteTotal(quote))
    }
  })

  it('writes readable URLs', () => {
    assert.equal(quoteToSearch(quoteForTier('hermes')), '?package=hermes')
    assert.equal(quoteToSearch(quoteFromSelection(NO_ADDONS)), '?package=apollo')
    assert.equal(
      quoteToSearch(quoteFromSelection(ALL_ADDONS)),
      '?package=zeus&addons=booking,payments,analytics&languages=1',
    )
  })

  it('totals', () => {
    assert.equal(quoteTotal(quoteForTier('hermes')), 800)
    assert.equal(quoteTotal(quoteForTier('apollo')), 1000)
    assert.equal(quoteTotal(quoteFromSearch('?package=zeus&addons=booking,payments')), 1700)
  })

  it('Zeus without add-ons becomes Apollo, Apollo with add-ons becomes Zeus', () => {
    assert.equal(quoteFromSearch('?package=zeus').tier, 'apollo')
    assert.equal(quoteFromSearch('?package=apollo&addons=analytics').tier, 'zeus')
  })

  it('Hermes ignores Zeus add-ons', () => {
    assert.deepEqual(quoteFromSearch('?package=hermes&addons=booking&languages=2'), quoteForTier('hermes'))
  })

  it('ignores junk', () => {
    assert.equal(quoteFromSearch(''), null)
    assert.equal(quoteFromSearch('?package=hades'), null)
    assert.equal(quoteFromSearch('?lang=en'), null)
    const odd = quoteFromSearch('?package=zeus&addons=booking,booking,nope,%3Cscript%3E&languages=abc')
    assert.deepEqual(odd.selection, pick({ booking: true }))
    assert.equal(quoteTotal(quoteFromSearch(`?package=zeus&languages=${MAX_EXTRA_LANGUAGES + 10}`)), 1000 + MAX_EXTRA_LANGUAGES * 100)
  })
})

describe('copy integrity', () => {
  it('Apollo is the only recommended package', () => {
    assert.deepEqual(tiers.filter((t) => t.recommended).map((t) => t.id), ['apollo'])
  })

  it('every tier and add-on has Finnish and English copy', () => {
    for (const t of tiers) for (const key of ['kind', 'myth', 'description', 'idealFor', 'includesLead']) {
      assert.ok(t[key].fi && t[key].en, `${t.id}.${key}`)
    }
    for (const t of tiers) assert.equal(t.features.fi.length, t.features.en.length, `${t.id} features`)
    for (const t of tiers) for (const s of t.specs) assert.ok(s.label.fi && s.label.en, `${t.id}.specs.${s.key}`)
    for (const a of addons) for (const key of ['name', 'short', 'summary', 'what', 'when', 'note']) {
      assert.ok(a[key].fi && a[key].en, `${a.id}.${key}`)
    }
  })

  it('every comparison row has a cell for every tier', () => {
    for (const group of comparison) for (const row of group.rows) {
      assert.deepEqual(Object.keys(row.cells).sort(), ['apollo', 'hermes', 'zeus'])
    }
  })
})

describe('package positioning (owner’s brief)', () => {
  const tier = (id) => tiers.find((t) => t.id === id)

  it('Hermes is one page, Apollo multi-page, Zeus is Apollo + add-ons', () => {
    assert.equal(tier('hermes').kind.fi, 'Yksisivuinen verkkosivusto')
    assert.equal(tier('apollo').kind.fi, 'Monisivuinen verkkosivusto')
    assert.match(tier('zeus').kind.fi, /^Apollo \+ valinnaiset lisäominaisuudet$/)
  })

  it('Hermes and Apollo share every headline spec except the contact form', () => {
    const shared = (id) => tier(id).specs.filter((s) => s.shared).map((s) => s.label.fi)
    assert.deepEqual(shared('hermes'), shared('apollo'))
    assert.ok(shared('hermes').includes('Conversion First -suunnittelu'))
    assert.ok(shared('hermes').includes('Premium-ulkoasu'))
    const form = (id) => tier(id).specs.find((s) => s.key === 'form').label.fi
    assert.equal(form('hermes'), 'Yksinkertainen yhteydenottolomake')
    assert.equal(form('apollo'), 'Monipuolinen yhteydenottolomake')
  })

  it('the quality group of the comparison is identical for all three packages', () => {
    const quality = comparison[0]
    assert.match(quality.title.fi, /Sama laatu/)
    for (const row of quality.rows) {
      assert.deepEqual(row.cells.hermes, row.cells.apollo, row.label.fi)
      assert.deepEqual(row.cells.apollo, row.cells.zeus, row.label.fi)
      assert.notEqual(row.cells.hermes, false, `${row.label.fi} must not be missing from Hermes`)
    }
    const labels = quality.rows.map((r) => r.label.fi).join(' | ')
    for (const required of ['Conversion First', 'premium-ulkoasu', 'Responsiivinen', 'Animaatiot', 'Hakukoneoptimointi']) {
      assert.ok(labels.includes(required), `quality group lists ${required}`)
    }
  })

  it('structure and form rows separate Hermes from Apollo and Zeus', () => {
    const rows = Object.fromEntries(comparison[1].rows.map((r) => [r.label.fi, r.cells]))
    assert.deepEqual(rows['Yksisivuinen verkkosivusto'], { hermes: true, apollo: false, zeus: false })
    assert.deepEqual(rows['Monisivuinen verkkosivusto'], { hermes: false, apollo: true, zeus: true })
    assert.deepEqual(rows['Yksinkertainen yhteydenottolomake'], { hermes: true, apollo: false, zeus: false })
    assert.deepEqual(rows['Monipuolinen, yrityskohtainen lomake'], { hermes: false, apollo: true, zeus: true })
  })

  it('Zeus add-ons are optional – never included in Hermes or the Apollo base', () => {
    const group = comparison.at(-1)
    assert.equal(group.rows.length, addons.length)
    for (const row of group.rows) {
      assert.equal(row.cells.hermes, false)
      assert.equal(row.cells.apollo, false)
      assert.ok(row.cells.zeus && typeof row.cells.zeus === 'object' && 'addon' in row.cells.zeus)
    }
    const nbsp = String.fromCharCode(0xa0)
    assert.ok(group.lead.fi.includes(`1${nbsp}000${nbsp}€`), group.lead.fi)
  })

  it('no package is described as basic or lower quality', () => {
    const text = tiers
      .flatMap((t) => [t.kind, t.description, t.idealFor, t.includesLead, ...t.specs.map((s) => s.label)])
      .flatMap((l) => [l.fi, l.en])
      .concat(tiers.flatMap((t) => [...t.features.fi, ...t.features.en]))
      .join('\n')
    assert.doesNotMatch(text, /\bperus|kevyt|halpa|yksinkertaistettu|\bbasic\b|\blite\b|cheap|budget/i)
  })
})
