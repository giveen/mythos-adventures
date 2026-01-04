import React, { useState, useEffect } from "react";
import './CharacterCreator.css';
import { AttributeRow } from "./AttributeRow";
import {
  BASE_SCORE,
  MAX_SCORE,
  POINTS_AVAILABLE,
  costFor,
  STANDARD_ARRAY
} from "./AttributeControls";

export function CharacterCreator({ onCreate, onCancel }) {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [races, setRaces] = useState([]);
  const [loadingRaces, setLoadingRaces] = useState(true);
  const [charClass, setCharClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [availableSpells, setAvailableSpells] = useState([]);
  const [rawSpells, setRawSpells] = useState([]);
  const [school, setSchool] = useState("");
  const [schoolsList, setSchoolsList] = useState([]);
  const magicClasses = ['Wizard','Sorcerer','Warlock','Cleric','Druid','Bard','Paladin','Ranger','Artificer'];
  const [selectedSpellId, setSelectedSpellId] = useState(null);
  const level = 1;
  const [background, setBackground] = useState("");
  const [alignment, setAlignment] = useState("");

  // Lowercase stats to match backend schema
  const [stats, setStats] = useState({
    str: 8,
    dex: 8,
    con: 8,
    int: 8,
    wis: 8,
    cha: 8
  });

  const totalCost = Object.values(stats)
    .map((s) => costFor(s))
    .reduce((a, b) => a + b, 0);

  const pointsLeft = POINTS_AVAILABLE - totalCost;

  function updateStat(stat, newScore) {
    if (newScore < BASE_SCORE || newScore > MAX_SCORE) return;

    const newStats = { ...stats, [stat]: newScore };
    const newCost = Object.values(newStats)
      .map((s) => costFor(s))
      .reduce((a, b) => a + b, 0);

    if (newCost <= POINTS_AVAILABLE) {
      setStats(newStats);
    }
  }

  function applyStandardArray() {
    const keys = Object.keys(stats);

    const shuffled = [...STANDARD_ARRAY]
      .map((v) => ({ v, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((o) => o.v);

    const assigned = {};
    keys.forEach((key, i) => {
      assigned[key] = shuffled[i];
    });

    setStats(assigned);
  }

  function handleSubmit() {
    const character = {
      name,
      race,
      class: charClass,
      level,
      background,
      alignment,
      stats: { ...stats }
    };

    // attach selected starting spell in metadata if present
    if (selectedSpellId && availableSpells.length) {
      const sp = availableSpells.find(s => s.id === selectedSpellId);
      if (sp) character.metadata = { spells: [{ id: sp.id, name: sp.name, level: sp.level, school: sp.school, source: sp.source }] };
    }

    onCreate(character);
  }

  useEffect(() => {
    let mounted = true;

    const fallback = [
      "Human",
      "Elf",
      "Dwarf",
      "Halfling",
      "Dragonborn",
      "Gnome",
      "Half-Elf",
      "Half-Orc",
      "Tiefling",
      "Aasimar",
      "Tabaxi",
      "Firbolg",
      "Genasi",
      "Goliath",
      "Kenku",
      "Lizardfolk",
      "Triton",
      "Kobold",
      "Minotaur",
      "Warforged"
    ];

    async function loadRaces() {
      try {
        const res = await fetch("https://www.dndbeyond.com/species");
        const text = await res.text();

        // Attempt to parse species names from the page. This may fail due to CORS.
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        // Try a few selectors likely to contain species names; filter unique values.
        const candidates = Array.from(
          doc.querySelectorAll("a[href*='/species/'], .card-title, h3, .listing-card__title")
        ).map((n) => n.textContent && n.textContent.trim()).filter(Boolean);

        const unique = Array.from(new Set(candidates)).filter((s) => s.length > 1);

        if (unique.length > 4) {
          if (mounted) setRaces(unique);
        } else {
          if (mounted) setRaces(fallback);
        }
      } catch (err) {
        if (mounted) setRaces(fallback);
      } finally {
        if (mounted) setLoadingRaces(false);
      }
    }

    loadRaces();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const fallback = [
      "Barbarian",
      "Bard",
      "Cleric",
      "Druid",
      "Fighter",
      "Monk",
      "Paladin",
      "Ranger",
      "Rogue",
      "Sorcerer",
      "Warlock",
      "Wizard",
      "Artificer"
    ];

    async function loadClasses() {
      try {
        const res = await fetch("https://www.dndbeyond.com/classes");
        const text = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const candidates = Array.from(
          doc.querySelectorAll("a[href*='/classes/'], .card-title, h3, .listing-card__title")
        ).map((n) => n.textContent && n.textContent.trim()).filter(Boolean);

        const unique = Array.from(new Set(candidates)).filter((s) => s.length > 1);

        if (unique.length > 4) {
          if (mounted) setClasses(unique);
        } else {
          if (mounted) setClasses(fallback);
        }
      } catch (err) {
        if (mounted) setClasses(fallback);
      } finally {
        if (mounted) setLoadingClasses(false);
      }
    }

    loadClasses();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!charClass || !magicClasses.includes(charClass)) {
      setAvailableSpells([]);
      setSelectedSpellId(null);
      setSchool('');
      setSchoolsList([]);
      return;
    }

    let mounted = true;
    (async function loadSpells(){
      try {
        let url = `${API_BASE}/api/spells?level=1&class=${encodeURIComponent(charClass)}`;
        if (school) url += `&school=${encodeURIComponent(school)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!mounted) return;
        setRawSpells(data || []);
        // compute schools list from returned spells
        const schools = Array.from(new Set((data || []).map(s => (s.school || '').trim()).filter(Boolean)));
        setSchoolsList(schools.sort());
        // apply alignment filter when first loaded
        const filtered = filterSpellsByAlignment(data || [], alignment);
        setAvailableSpells(filtered);
        if (Array.isArray(filtered) && filtered.length) setSelectedSpellId(filtered[0].id);
        else setSelectedSpellId(null);
      } catch (e) {
        console.error('Failed to load spells', e);
        if (mounted) {
          setAvailableSpells([]);
          setSelectedSpellId(null);
        }
      }
    })();

    return () => { mounted = false; };
  }, [charClass, school]);

  // Re-filter spells when alignment changes
  useEffect(() => {
    if (!rawSpells || !rawSpells.length) return;
    const filtered = filterSpellsByAlignment(rawSpells, alignment);
    setAvailableSpells(filtered);
    if (!filtered || !filtered.length) setSelectedSpellId(null);
    else if (!filtered.find(s => s.id === selectedSpellId)) setSelectedSpellId(filtered[0].id);
  }, [alignment, rawSpells]);

  function filterSpellsByAlignment(spells, alignmentStr) {
    if (!alignmentStr || !spells || !spells.length) return spells || [];
    const a = String(alignmentStr).toLowerCase();
    // simple rules: Good characters shouldn't get obviously evil or fiendish spells
    const evilKeywords = [
      'summon demon', 'summon devil', 'summon fiend', 'summon', 'demon', 'devil', 'fiend', 'undead', 'animate dead', 'create undead', 'raise dead', 'finger of death', 'circle of death'
    ];

    if (a.includes('good')) {
      return spells.filter((s) => {
        const n = String(s.name || '').toLowerCase();
        for (const k of evilKeywords) {
          if (n.includes(k)) return false;
        }
        return true;
      });
    }

    // For other alignments, return as-is for now
    return spells;
  }

  function filterSpellsByClass(spells, cls) {
    if (!cls || !spells || !spells.length) return spells || [];
    const c = String(cls).toLowerCase();
    if (c === 'bard') {
      // Curated allowlist of spells commonly available to Bards (can be expanded)
      const allow = [
        'vicious mockery','friends','dancing lights','light','mage hand','message','true strike',
        'cure wounds','healing word','faerie fire','sleep','charm person','disguise self','comprehend languages',
        'dissonant whispers','tasha\'s hideous laughter','silent image','minor illusion','detect magic','identify',
        'heat metal','shatter','hold person','invisibility','suggestion','hypnotic pattern','greater invisibility',
        'counterspell','dispel magic','polymorph','seeming','remove curse','searing smite'
      ];

      const lowerAllow = allow.map(a => a.toLowerCase());
      return spells.filter(s => {
        const n = String(s.name || '').toLowerCase();
        for (const a of lowerAllow) if (n.includes(a)) return true;
        return false;
      });
    }

    // default: return unchanged
    return spells;
  }

  function handleSelectSpell(e) {
    const id = Number(e.target.value);
    setSelectedSpellId(id || null);
    if (!id) return;
    const sp = availableSpells.find(s => s.id === id) || rawSpells.find(s => s.id === id);
    if (sp && sp.school && !school && magicClasses.includes(charClass)) {
      setSchool(sp.school);
    }
  }

  return (
    <div className="cc-card">
      <h2>Create New Character</h2>

      <div className="cc-row">
        <label className="cc-label">Name</label>
        <input className="cc-input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      {/* starting spell moved below Race/Class/Alignment for better layout */}

      <div className="cc-row cc-row--inline">
        <div className="cc-field">
          <label className="cc-label">Race</label>
          {loadingRaces ? (
            <input className="cc-input" value={race} onChange={(e) => setRace(e.target.value)} />
          ) : (
            <select className="cc-select cc-select--small" value={race} onChange={(e) => setRace(e.target.value)}>
              <option value="">-- Select race --</option>
              {races.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="cc-field">
          <label className="cc-label">Class</label>
          {loadingClasses ? (
            <input className="cc-input" value={charClass} onChange={(e) => setCharClass(e.target.value)} />
          ) : (
            <select className="cc-select cc-select--small" value={charClass} onChange={(e) => setCharClass(e.target.value)}>
              <option value="">-- Select class --</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
        {magicClasses.includes(charClass) && (
          <div className="cc-field">
            <label className="cc-label">School</label>
            {schoolsList && schoolsList.length ? (
              <select className="cc-select cc-select--small" value={school} onChange={(e) => setSchool(e.target.value)}>
                <option value="">-- Any school --</option>
                {schoolsList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <select className="cc-select cc-select--small" value={school} onChange={(e) => setSchool(e.target.value)}>
                <option value="">-- Any school --</option>
              </select>
            )}
          </div>
        )}

        <div className="cc-field">
          <label className="cc-label">Alignment</label>
          <select className="cc-select cc-select--small" value={alignment} onChange={(e) => setAlignment(e.target.value)}>
            <option value="">-- Select alignment --</option>
            <option value="Lawful Good">Lawful Good</option>
            <option value="Neutral Good">Neutral Good</option>
            <option value="Chaotic Good">Chaotic Good</option>
            <option value="Lawful Neutral">Lawful Neutral</option>
            <option value="True Neutral">True Neutral</option>
            <option value="Chaotic Neutral">Chaotic Neutral</option>
            <option value="Lawful Evil">Lawful Evil</option>
            <option value="Neutral Evil">Neutral Evil</option>
            <option value="Chaotic Evil">Chaotic Evil</option>
          </select>
        </div>
      </div>

      {availableSpells.length > 0 && (
        <div className="cc-row" style={{ marginTop: 8, marginBottom: 10 }}>
          <div className="cc-field cc-field--narrow">
            <label className="cc-label">Starting Spell (level 1)</label>
            <select className="cc-select cc-select--small" value={selectedSpellId || ''} onChange={handleSelectSpell}>
              <option value="">-- Select a starting spell --</option>
              {availableSpells.map(s => (
                <option key={s.id} value={s.id}>{s.name}{s.level != null ? ` (lvl ${s.level})` : ''}{s.school ? ` - ${s.school}` : ''}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <label>Level</label>
        <p>Level is fixed to 1 for new characters</p>
      </div>

      <h3>Attributes (Point Buy — {pointsLeft} points left)</h3>

      {Object.keys(stats).map((stat) => (
        <AttributeRow
          key={stat}
          label={stat.toUpperCase()}
          score={stats[stat]}
          onChange={(newScore) => updateStat(stat, newScore)}
        />
      ))}

      <button onClick={applyStandardArray} style={{ marginTop: 10 }}>
        Random Assign (Standard Array)
      </button>

      <div className="cc-row">
        <label className="cc-label">Background</label>
        <textarea className="cc-textarea" value={background} onChange={(e) => setBackground(e.target.value)} />
      </div>

      

      <div className="cc-actions">
        <button className="fantasy-button" onClick={handleSubmit} style={{ marginRight: 10 }}>
          Create Character
        </button>
        <button className="fantasy-button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
