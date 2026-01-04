import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import '../styles/Market.css';

export default function Market() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const { activeCharacter, fetchCharacters } = useGame();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    // reload when activeCharacter changes
    load();
  }, [activeCharacter]);

  async function load() {
    setLoading(true);
    try {
      const url = activeCharacter ? `http://localhost:4000/api/market?characterId=${activeCharacter.id}` : 'http://localhost:4000/api/market';
      const res = await fetch(url);
      const data = await res.json();
      setItems(data);
      // default selected category to first available category when loading
      try {
        const cats = Array.from(new Set(data.map(it => parseCategory(it.category, it.name) || 'Adventuring Gear'))).sort();
        if (cats.length && !selectedCategory) setSelectedCategory(cats[0]);
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function purchase(itemId) {
    if (!activeCharacter) return alert('Select an active character first');
    const qty = 1;
    const confirm = window.confirm(`Buy ${qty} x item?`);
    if (!confirm) return;

    try {
      const res = await fetch('http://localhost:4000/api/market/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: activeCharacter.id, equipmentId: itemId, quantity: qty })
      });
      const body = await res.json();
      if (!res.ok) return alert(body.error || 'Purchase failed');
      alert('Purchase successful');
      // update characters to reflect gold/inventory
      await fetchCharacters();
    } catch (e) {
      console.error(e);
      alert('Purchase failed');
    }
  }

  function parseCategory(cat, name = '') {
    // Try structured category first
    if (cat) {
      if (typeof cat === 'string') {
        try {
          const obj = JSON.parse(cat);
          if (obj && obj.name) return obj.name;
        } catch (e) {
          // fall through
        }
      } else if (typeof cat === 'object' && cat.name) {
        return cat.name;
      }
    }

    const n = (name || '').toLowerCase();
    const raw = (typeof cat === 'string' ? cat.toLowerCase() : '');

    // Trinket detection: prefer its own category instead of Adventuring Gear
    if (raw.includes('trinket') || n.includes('trinket')) return 'Trinket';

    // Armor detection
    const armorKeywords = ['armor', 'armour', 'breastplate', 'chain', 'plate', 'scale', 'studded', 'ring mail', 'splint', 'leather', 'hide', 'padded', 'half plate'];
    for (const k of armorKeywords) if (n.includes(k)) return 'Armor';
    if (raw === 'light' || raw === 'medium' || raw === 'heavy') {
      // if category contains armor weight token, infer Armor when name implies armor
      if (n.includes('armor') || armorKeywords.some(k => n.includes(k))) return 'Armor';
    }

    // Weapon detection (avoid matching ammunition terms here so ammo is classified separately)
    const weaponKeywords = ['sword','axe','dagger','mace','bow','crossbow','spear','halberd','scimitar','club','hammer','flail','pike','javelin','sling'];
    for (const k of weaponKeywords) if (n.includes(k)) return 'Weapon';

    // Tools / Kits
    if (n.includes("tools") || n.includes("kit") || raw.includes('tools')) return 'Tools';

    // Packs
    if (n.includes('pack') || n.includes('backpack') || n.includes("pouch") || n.includes('case')) return 'Pack';

    // Potions / Scrolls / Spell
    if (n.includes('potion')) return 'Potion';
    if (n.includes('scroll')) return 'Scroll';

    // Poison
    if (n.includes('poison') || n.includes('venom') || n.includes('tincture')) return 'Poison';

    // Mounts & Vehicles
    if (['camel','elephant','horse','pony','mule','warhorse','carriage','cart','wagon','sled'].some(k => n.includes(k))) return 'Mounts & Vehicles';

    // Musical instruments
    if (['lute','flute','drum','lyre','horn','pan flute','bagpipes','viol','dulcimer'].some(k => n.includes(k))) return 'Instruments';

    // Ammunition
    if (n.includes('arrow') || n.includes('bolt') || n.includes('bullet') || n.includes('ammunition')) return 'Ammunition';

    // Misc / Adventuring Gear (default)
    if (raw && raw !== '') return raw.charAt(0).toUpperCase() + raw.slice(1);
    return 'Adventuring Gear';
  }

  function formatCost(item) {
    if (!item) return '—';
    if (item.cost_gp != null) return `${Number(item.cost_gp)} gp`;
    const cost = item.cost;
    if (cost == null) return '—';
    const s = String(cost).trim();
    if (/^[0-9,.]+(?:\.[0-9]+)?$/.test(s)) {
      const n = Math.round(Number(s));
      return `${n} gp`;
    }
    return s;
  }

  function iconFor(item) {
    const n = (item.name || '').toLowerCase();
    const c = (parseCategory(item.category, item.name) || '').toLowerCase();
    if (c.includes('armor')) return '🛡️';
    if (c.includes('weapon') || c === 'weapon') return '🗡️';
    if (c.includes('potion') || n.includes('potion')) return '🧪';
    if (c.includes('scroll') || n.includes('scroll')) return '📜';
    if (c.includes('instrument')) return '🎵';
    if (c.includes('ammunition') || n.includes('arrow') || n.includes('bolt')) return '🏹';
    if (c.includes('tools')) return '🧰';
    if (c.includes('pack')) return '🎒';
    return '⚒️';
  }
  function toggleExpand(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function buildCategories() {
    const set = new Set();
    items.forEach(it => {
      const c = parseCategory(it.category, it.name) || 'Uncategorized';
      set.add(c);
    });
    return Array.from(set).sort();
  }

  const categories = buildCategories();

  return (
    <div className="market">
      <div className="market-frame">
        <div className="market-title">MARKET</div>
        {loading && <div className="market-loading">Loading...</div>}
        {!loading && (
          <div className="market-body">
            <aside className="market-cats">
              <div className="cats-header">Categories</div>
              <ul className="cats-list">
                {categories.map(cat => (
                  <li key={cat} className={cat === selectedCategory ? 'cat active' : 'cat'} onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            </aside>

            <section className="market-items">
              <div className="items-header">Items</div>
              <div className="items-list">
                {items
                  .filter(it => {
                    if (!selectedCategory || selectedCategory === 'All') return true;
                    return (parseCategory(it.category, it.name) || 'Uncategorized') === selectedCategory;
                  })
                  .map(it => (
                    <div key={it.id} className="item-row">
                      <div className="item-left">
                        <div className="item-icon">{iconFor(it)}</div>
                        <div className="item-name">{it.name}</div>
                      </div>
                      <div className="item-right">
                        <div className="item-cost">{formatCost(it)}</div>
                        <button className="fantasy-button buy" onClick={() => purchase(it.id)}>Buy</button>
                      </div>
                    </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
