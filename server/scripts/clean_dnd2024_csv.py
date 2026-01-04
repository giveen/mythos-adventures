#!/usr/bin/env python3
import csv
import os
import sys
import json

script_dir = os.path.dirname(os.path.abspath(__file__))
default_in = os.path.join(script_dir, 'exports', 'dnd2024_imported_equipment.csv')
default_out = os.path.join(script_dir, 'exports', 'dnd2024_imported_equipment_clean.csv')

infile = sys.argv[1] if len(sys.argv) > 1 else default_in
outfile = sys.argv[2] if len(sys.argv) > 2 else default_out

keep_fields = ['id','name','category','cost','weight','properties','description']

count_in = 0
count_out = 0
count_skipped = 0

with open(infile, newline='', encoding='utf-8') as inf, open(outfile, 'w', newline='', encoding='utf-8') as outf:
    reader = csv.DictReader(inf)
    writer = csv.DictWriter(outf, fieldnames=keep_fields)
    writer.writeheader()
    for row in reader:
        count_in += 1
        src = (row.get('source') or '').strip().lower()
        if src != 'dnd2024':
            count_skipped += 1
            continue
        # normalize category: if it's a JSON string with a name, use that; otherwise infer from name
        raw_cat = row.get('category') or ''
        name = (row.get('name') or '')
        cat = ''
        if raw_cat:
            # try parse JSON
            try:
                parsed = json.loads(raw_cat)
                if isinstance(parsed, dict) and parsed.get('name'):
                    cat = parsed.get('name')
                else:
                    cat = str(raw_cat)
            except Exception:
                cat = str(raw_cat)

        # if category still empty or unhelpful, infer from name
        if not cat or cat.strip() == '':
            n = name.lower()
            def contains_any(words):
                return any(w in n for w in words)

            if contains_any(['armor','armour','breastplate','chain','plate','scale','studded','ring mail','splint','leather','hide','padded','studded']):
                cat = 'Armor'
            elif contains_any(['sword','axe','dagger','mace','bow','crossbow','spear','halberd','scimitar','club','hammer','flail','pike','javelin','sling','arrow','bolt']):
                cat = 'Weapon'
            elif contains_any(['potion']):
                cat = 'Potion'
            elif contains_any(['scroll']):
                cat = 'Scroll'
            elif contains_any(['poison','venom','tincture']):
                cat = 'Poison'
            elif contains_any(['pack','backpack','pouch','case']):
                cat = 'Pack'
            elif contains_any(['tool','kit','tools','forgery','tinker','smith','poisoner']):
                cat = 'Tools'
            elif contains_any(['camel','elephant','horse','pony','mule','warhorse','carriage','cart','wagon','sled']):
                cat = 'Mounts & Vehicles'
            elif contains_any(['lute','flute','drum','lyre','horn','pan flute','bagpipes','viol','dulcimer']):
                cat = 'Instruments'
            elif contains_any(['arrow','bolt','bullet','ammunition']):
                cat = 'Ammunition'
            else:
                cat = ''

        out = {k: '' for k in keep_fields}
        out['id'] = row.get('id','')
        out['name'] = name
        out['category'] = cat
        out['cost'] = row.get('cost','')
        out['weight'] = row.get('weight','')
        out['properties'] = row.get('properties','')
        out['description'] = row.get('description','')
        writer.writerow(out)
        count_out += 1

print(f"Read {count_in} rows from {infile}")
print(f"Wrote {count_out} rows to {outfile}")
print(f"Skipped {count_skipped} rows not from dnd2024")
