import { recommendCommercialPackage } from './commercialOfferEngine';

describe('recommendCommercialPackage', () => {
  it('recommends GOLD for a strong opportunity with sufficient evidence', () => {
    const result = recommendCommercialPackage({
      businessName: 'Example Business',
      signals: [
        { key: 'automation_opportunity', value: 82, confidence: 0.9, source: 'audit' },
        { key: 'payment_opportunity', value: 75, confidence: 0.85, source: 'audit' },
      ],
    });

    expect(result.packageId).toBe('GOLD');
    expect(result.status).toBe('RECOMMENDED');
  });

  it('does not manufacture a paid recommendation when evidence is weak', () => {
    const result = recommendCommercialPackage({
      businessName: 'Unknown Business',
      signals: [{ key: 'automation_opportunity', value: 80, confidence: 0.4 }],
    });

    expect(result.packageId).toBe('LEAD');
    expect(result.status).toBe('INSUFFICIENT_EVIDENCE');
  });
});
