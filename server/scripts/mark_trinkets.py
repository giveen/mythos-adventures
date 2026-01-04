#!/usr/bin/env python3
"""Mark known trinket rows in the equipment table as category='Trinket'.

Creates a small backup table before updating and prints a summary.
"""
import sqlite3
from datetime import datetime
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'db', 'mythos.db')

TRINKETS = [
    "A mummified goblin hand",
    "A crystal that faintly glows in moonlight",
    "A gold coin minted in an unknown land",
    "A diary written in a language you don't know",
    "A brass ring that never tarnishes",
    "An old chess piece made from glass",
    "A pair of knucklebone dice, each with a skull symbol on the side that would normally show six pips",
    "A small idol depicting a nightmarish creature that gives you unsettling dreams when you sleep near it",
    "A lock of someone's hair",
    "The deed for a parcel of land in a realm unknown to you",
    "A 1-ounce block made from an unknown material",
    "A small cloth doll skewered with needles",
    "A tooth from an unknown beast",
    "An enormous scale, perhaps from a dragon",
    "A bright-green feather",
    "An old divination card bearing your likeness",
    "A glass orb filled with moving smoke",
    "A 1-pound egg with a bright-red shell",
    "A pipe that blows bubbles",
    "A glass jar containing a bit of flesh floating in a pickling fluid",
    "A gnome-crafted music box that plays a song you dimly remember from your childhood",
    "A wooden statuette of a smug halfling",
    "A brass orb etched with strange runes",
    "A multiclolored stone disk",
    "A silver icon of a raven",
    "A bag containing forty-seven teeth, one of which is rotten",
    "A shard of obsidian that always feels warm to the touch",
    "A dragon's talon strung on a leather necklace",
    "A pair of old socks",
    "A blank book whose pages refuse to hold ink, chalk, grapohite, or any other marking",
    "A silver badge that is a five.pointed stat",
    "A knife that belonged to a relative",
    "A glass vial filled with nail clippings",
    "A rectangular metal device with two tiny metal cups on one end that throws sparks when wet",
    "A white, sequined glove sized for a human",
    "A vest with one hundred tiny pockets",
    "A weightless stone",
    "A sketch of a goblin",
    "An empty glass vial that smells of perfume",
    "A gemstone that looks like a lump of coal when examined by anyone but you",
    "A scrap of cloth from an old banner",
    "A rank insignia from a lost legionnaire",
    "A silver bell without a clapper",
    "A mechanical canary inside a lamp",
    "A miniature chest carved to look like it has numerous feet on the bottom",
    "A dead sprite inside a clear glass bottle",
    "A metal can that has no opening but sounds as if it is filled with liquid, sand, spiders, or broken glass (your choice)",
    "A glass orb filled with water, in which swims a clockwork goldfish",
    "A silver spoon with an M engraved on the handle",
    "A whistle made from gold-colored wood",
    "A dead scarab beetle the size of your hand",
    "Two toy soldiers, one missing a head",
    "A small box filled with different-sized buttons",
    "A candle that can't be lit",
    "A miniature cage with no door",
    "An old key",
    "An indecipherable treasure map",
    "A hilt from a broken sword",
    "A rabbit’s foot",
    "A glass eye",
    "A cameo of a hideous person",
    "A silver skull the size of a coin",
    "An alabaster mask",
    "A cone of sticky black incense that stinks",
    "A nightcap that gives you pleasant dreams when you wear it",
    "A single caltrop made from bone",
    "A gold monocle frame without the lens",
    "A 1-inch cube, each side a different color",
    "A crystal doorknob",
    "A packet filled with pink dust",
    "A fragment of a beautiful song, written as musical notes on two pieces of parchment",
    "A silver teardrop earring containing a real teardrop",
    "An eggshell painted with scenes of misery in disturbing detail",
    "A fan that, when unfolded, shows a sleepy cat",
    "A set of bone pipes",
    "A four-leaf clover pressed inside a book discussing manners and etiquette",
    "A sheet of parchment upon which is drawn a mechanical contraption",
    "An ornate scabbard that fits no blade you have found",
    "An invitation to a party where a murder happened",
    "A bronze pentacle with an etching of a rat's head in its center",
    "A purple handkerchief embroidered with the name of an archmage",
    "Half a floor plan for a temple, a castle, or another structure",
    "A bit of folded cloth that, when unfolded, turns into a stylish cap",
    "A receipt of deposit at a bank in a far-off city",
    "A diary with seven missing pages",
    "An empty silver snuffbox bearing the inscription “dreams” on its lid",
    "An iron holy symbol devoted to an unknown god",
    "A book about a legendary hero's rise and fall, with the last chapter missing",
    "A vial of dragon blood",
    "An ancient arrow of elven design",
    "A needle that never bends",
    "An ornate brooch of dwarven design",
    "An empty wine bottle bearing a pretty label that says, “The Wizard of Wines Winery, Red Dragon Crush, 331422-W\"",
    "A mosaic tile with a multicolored, glazed surface",
    "A petrified mouse",
    "A black pirate flag adorned with a dragon's skull and crossbones",
    "A tiny mechanical crab or spider that moves about when it's not being observed",
    "A glass jar containing lard with a label that reads, “Griffon Grease”",
    "A wooden box with a ceramic bottom that holds a living worm with a head on each end of its body",
    "A metal urn containing the ashes of a hero",
]


def normalize(s):
    return (s or '').strip().lower()


def main():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    ts = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    backup_table = f'equipment_backup_trinkets_{ts}'

    # Build WHERE clause for exact lower-name matches
    names = [normalize(n) for n in TRINKETS]
    ors = []
    params = []
    for n in names:
        ors.append("lower(name)=?")
        params.append(n)

    where_clause = ' OR '.join(ors)

    # Create backup of matching rows (if any)
    create_sql = f"CREATE TABLE IF NOT EXISTS {backup_table} AS SELECT * FROM equipment WHERE {where_clause};"
    cur.execute(create_sql, params)
    conn.commit()

    cur.execute(f"SELECT COUNT(*) FROM {backup_table}")
    backed_up = cur.fetchone()[0]
    print(f'Backed up {backed_up} equipment rows to {backup_table}')

    # Update matching rows
    update_sql = f"UPDATE equipment SET category='Trinket' WHERE {where_clause};"
    cur.execute(update_sql, params)
    conn.commit()
    updated = cur.rowcount
    print(f'Updated {updated} rows to category=Trinket')

    # List updated rows
    cur.execute("SELECT id,name FROM equipment WHERE lower(category)='trinket' ORDER BY id LIMIT 200")
    rows = cur.fetchall()
    print('Sample marked trinkets:')
    for r in rows[:120]:
        print(r[0], r[1])

    conn.close()


if __name__ == '__main__':
    main()
