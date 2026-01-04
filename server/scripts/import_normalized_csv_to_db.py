#!/usr/bin/env python3
import csv
import os
import sys
import sqlite3
import re

script_dir = os.path.dirname(os.path.abspath(__file__))
default_csv = os.path.join(script_dir, 'exports', 'dnd2024_imported_equipment_normalized.csv')
default_db = os.path.join(script_dir, '..', 'db', 'mythos.db')

csv_path = sys.argv[1] if len(sys.argv) > 1 else default_csv
db_path = sys.argv[2] if len(sys.argv) > 2 else default_db

print('CSV:', csv_path)
print('DB:', db_path)

def parse_cost_to_gp(cost_str):
    if not cost_str: return None
    s = cost_str.strip()
    # examples: "50 GP", "4 CP", "5 SP", "1500 GP", "Varies"
    m = re.search(r"([0-9,]+(?:\.[0-9]+)?)\s*([A-Za-z]*)", s)
    if not m:
        return None
    num = m.group(1).replace(',', '')
    unit = m.group(2).lower()
    try:
        val = float(num)
    except Exception:
        return None
    if unit.startswith('gp') or unit == '':
        gp = val
    elif unit.startswith('sp'):
        gp = val / 10.0
    elif unit.startswith('cp'):
        gp = val / 100.0
    else:
        # unknown unit treat as gp
        gp = val
    # round to nearest integer gp
    try:
        return int(round(gp))
    except Exception:
        return None

def parse_weight_to_float(w):
    if not w: return None
    s = str(w).strip()
    # remove non-digit and non-dot and fractions
    # handle fractions like 1/2 lb.
    frac = re.match(r"^(\d+)\/(\d+)", s)
    if frac:
        try:
            return float(int(frac.group(1)) / int(frac.group(2)))
        except Exception:
            pass
    # find first number (may include comma)
    m = re.search(r"([0-9,]+(?:\.[0-9]+)?)", s)
    if not m:
        return None
    try:
        return float(m.group(1).replace(',', ''))
    except Exception:
        return None

# Read CSV rows
rows = []
with open(csv_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for r in reader:
        rows.append(r)

print(f'Loaded {len(rows)} rows from CSV')

# Connect to DB and replace equipment table contents
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Backup existing equipment by moving to equipment_backup_{ts}
import time
bak_name = f"equipment_backup_{int(time.time())}"
try:
    cur.execute(f"CREATE TABLE IF NOT EXISTS {bak_name} AS SELECT * FROM equipment")
    print('Backed up existing equipment to', bak_name)
except Exception as e:
    print('Backup failed:', e)

# Delete all rows
cur.execute('DELETE FROM equipment')
conn.commit()
print('Cleared equipment table')

insert_sql = '''INSERT INTO equipment (id, name, category, cost, cost_gp, weight, properties, description, source)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
'''

count = 0
for r in rows:
    try:
        eid = r.get('id') or None
        try:
            eid = int(eid) if eid!='' else None
        except Exception:
            eid = None
        name = r.get('name') or ''
        category = r.get('category') or ''
        cost = r.get('cost') or ''
        cost_gp = parse_cost_to_gp(cost)
        weight_text = r.get('weight') or ''
        weight = parse_weight_to_float(weight_text)
        properties = r.get('properties') or ''
        description = r.get('description') or ''
        source = 'dnd2024'

        cur.execute(insert_sql, (eid, name, category, cost, cost_gp, weight, properties, description, source))
        count += 1
    except Exception as e:
        print('Row insert failed:', e, r)

conn.commit()
print(f'Inserted {count} rows into equipment')
conn.close()
