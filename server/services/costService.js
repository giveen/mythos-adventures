function parseCostToGp(costStr) {
  if (!costStr) return null;
  const s = String(costStr).toLowerCase().trim();
  // handle patterns like '15 gp', '50gp', '10', '0.00' and currencies sp/cp
  const m = s.match(/([0-9,.]+)\s*(gp|sp|cp)?/);
  if (!m) return null;
  let amount = parseFloat(m[1].replace(/,/g, ''));
  if (!Number.isFinite(amount)) return null;
  const unit = m[2] || 'gp';
  if (unit === 'gp') return Math.floor(amount);
  if (unit === 'sp') return Math.floor(amount / 10);
  if (unit === 'cp') return Math.floor(amount / 100);
  return Math.floor(amount);
}

module.exports = { parseCostToGp };
