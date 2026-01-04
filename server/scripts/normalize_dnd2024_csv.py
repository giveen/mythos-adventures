#!/usr/bin/env python3
import csv
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
default_in = os.path.join(script_dir, 'exports', 'dnd2024_imported_equipment_clean.csv')
default_out = os.path.join(script_dir, 'exports', 'dnd2024_imported_equipment_normalized.csv')

infile = sys.argv[1] if len(sys.argv) > 1 else default_in
outfile = sys.argv[2] if len(sys.argv) > 2 else default_out

canon = {
    'light': 'Armor',
    'medium': 'Armor',
    'heavy': 'Armor',
    'varies': 'Varies',
    '': '',
}

armor_keywords = ['armor','armour','breastplate','chain','plate','scale','studded','ring mail','splint','leather','hide','padded','half plate']
weapon_keywords = ['sword','axe','dagger','mace','bow','crossbow','spear','halberd','scimitar','club','hammer','flail','pike','javelin','sling','arrow','bolt']
pack_keywords = ['pack','backpack','pouch','case']
inst_keywords = ['lute','flute','drum','lyre','horn','pan flute','bagpipes','viol','dulcimer']
mount_keywords = ['camel','elephant','horse','pony','mule','warhorse','carriage','cart','wagon','sled']

count_in = 0
count_out = 0

with open(infile, newline='', encoding='utf-8') as inf, open(outfile, 'w', newline='', encoding='utf-8') as outf:
    reader = csv.DictReader(inf)
    fieldnames = reader.fieldnames
    writer = csv.DictWriter(outf, fieldnames=fieldnames)
    writer.writeheader()
    for row in reader:
        count_in += 1
        cat_raw = (row.get('category') or '').strip()
        name = (row.get('name') or '').strip()
        cat_lower = cat_raw.lower()

        # canonicalize simple tokens
        cat = ''
        if cat_lower in canon:
            cat = canon[cat_lower]
        else:
            # if the category looks like JSON or a structured string, try to extract a name
            if cat_raw.startswith('{') and cat_raw.endswith('}'):
                try:
                    import json
                    parsed = json.loads(cat_raw)
                    if isinstance(parsed, dict) and parsed.get('name'):
                        cat = parsed.get('name')
                    else:
                        cat = cat_raw
                except Exception:
                    cat = cat_raw
            else:
                cat = cat_raw

        # if still empty or a small token, infer from name
        if not cat or cat.strip() == '' or len(cat) < 3:
            n = name.lower()
            def contains_any(words):
                return any(w in n for w in words)
            if contains_any(armor_keywords):
                cat = 'Armor'
            elif contains_any(weapon_keywords):
                cat = 'Weapon'
            elif 'potion' in n:
                cat = 'Potion'
            elif 'scroll' in n:
                cat = 'Scroll'
            elif contains_any(['poison','venom','tincture']):
                cat = 'Poison'
            elif contains_any(pack_keywords):
                cat = 'Pack'
            elif contains_any(['tool','kit','tools','forgery','tinker','smith','poisoner']):
                cat = 'Tools'
            elif contains_any(mount_keywords):
                cat = 'Mounts & Vehicles'
            elif contains_any(inst_keywords):
                cat = 'Instruments'
            elif contains_any(['arrow','bolt','bullet','ammunition']):
                cat = 'Ammunition'
            else:
                # default to Adventuring Gear
                cat = 'Adventuring Gear'

        row['category'] = cat

        # normalize cost thousand separators: turn "1,500 GP" -> "1500 GP"
        cost = (row.get('cost') or '').strip()
        if cost:
            # remove commas inside numbers
            row['cost'] = cost.replace(',', '')

        # trim whitespace from weight and description
        if 'weight' in row:
            row['weight'] = (row.get('weight') or '').strip()
        if 'description' in row:
            row['description'] = (row.get('description') or '').strip()

        writer.writerow(row)
        count_out += 1

print(f'Read {count_in} rows from {infile}')
print(f'Wrote {count_out} rows to {outfile}')
