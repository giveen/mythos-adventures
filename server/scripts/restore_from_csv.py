#!/usr/bin/env python3
import sqlite3, csv, os, re

DB='/home/jeremy/dndai/server/db/mythos.db'
CSV='/home/jeremy/dndai/server/scripts/exports/dnd2024_imported_equipment.csv'

def parse_cost_to_gp(cost_str):
    if not cost_str: return None
    s = cost_str.strip().lower()
    m = re.search(r'([0-9,\.]+)\s*(gp|sp|cp)?', s)
    if not m: return None
    try:
        amount = float(m.group(1).replace(',',''))
    except:
        return None
    unit = m.group(2) or 'gp'
    if unit == 'gp':
        return int(amount)
    if unit == 'sp':
        return int(amount/10)
    if unit == 'cp':
        return int(amount/100)
    return int(amount)

if not os.path.exists(CSV):
    print('CSV not found:', CSV)
    raise SystemExit(1)

con = sqlite3.connect(DB)
con.row_factory = sqlite3.Row
cur = con.cursor()

restored_desc = 0
restored_cost = 0
restored_costgp = 0

with open(CSV, newline='', encoding='utf-8') as f:
    rdr = csv.DictReader(f)
    for r in rdr:
        name = r.get('name')
        if not name: continue
        desc = r.get('description') or None
        cost = r.get('cost') or None
        cost_gp = parse_cost_to_gp(cost)

        # update description if NULL or empty
        if desc:
            cur.execute('SELECT description FROM equipment WHERE name = ?', (name,))
            rows = cur.fetchall()
            for row in rows:
                cur_desc = row['description']
                if not cur_desc:
                    cur.execute('UPDATE equipment SET description = ? WHERE name = ? AND (description IS NULL OR description = "")', (desc, name))
                    if cur.rowcount:
                        restored_desc += cur.rowcount

        # update cost and cost_gp if missing
        if cost:
            cur.execute('SELECT cost, cost_gp FROM equipment WHERE name = ?', (name,))
            rows = cur.fetchall()
            for row in rows:
                cur_cost = row['cost']
                cur_costgp = row['cost_gp']
                updated = False
                if not cur_cost and cost:
                    cur.execute('UPDATE equipment SET cost = ? WHERE name = ? AND (cost IS NULL OR cost = "")', (cost, name))
                    if cur.rowcount:
                        restored_cost += cur.rowcount
                        updated = True
                if (cur_costgp is None or cur_costgp == 0) and cost_gp is not None:
                    cur.execute('UPDATE equipment SET cost_gp = ? WHERE name = ? AND (cost_gp IS NULL OR cost_gp = 0)', (cost_gp, name))
                    if cur.rowcount:
                        restored_costgp += cur.rowcount
                        updated = True

con.commit()
con.close()

print('Restored descriptions:', restored_desc)
print('Restored cost text rows:', restored_cost)
print('Restored cost_gp rows:', restored_costgp)
