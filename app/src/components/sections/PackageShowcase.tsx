import { COMMERCIAL_PRICING } from '@/config/commercial';
import { packages } from '@/pages/Packages';
export function PackageShowcase() {
  return <div><h2>Diamond R{COMMERCIAL_PRICING.DIAMOND_PRICE}/mo</h2><div>{packages.map(p=> <div key={p.id}>{p.name} R{p.price}</div>)}</div></div>;
}
export default PackageShowcase;
