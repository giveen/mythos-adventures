// New equipment data to be added to the market system
// Based on D&D 5e BR-2024 Equipment list

const newEquipment = [
  {
    name: "Club",
    category: "Simple Weapon",
    cost: "1 sp",
    weight: 2,
    properties: ["light"],
    description: "A simple club is a common weapon used by many characters. It's easy to find and use, making it an accessible choice for beginners."
  },
  {
    name: "Dagger",
    category: "Simple Weapon",
    cost: "2 gp",
    weight: 1,
    properties: ["finesse", "light", "thrown (20/60 ft)"],
    description: "A small blade that can be used for both melee and ranged attacks. It's often favored by rogues and thieves."
  },
  {
    name: "Handaxe",
    category: "Simple Weapon",
    cost: "5 gp",
    weight: 2,
    properties: ["light", "thrown (20/60 ft)"],
    description: "A small axe designed for one-handed use. It's versatile and effective in both combat and utility situations."
  },
  {
    name: "Javelin",
    category: "Simple Weapon",
    cost: "5 sp",
    weight: 2,
    properties: ["thrown (30/120 ft)"],
    description: "A lightweight spear designed for throwing. It's effective at range and can be used in both combat and hunting."
  },
  {
    name: "Light Hammer",
    category: "Simple Weapon",
    cost: "2 gp",
    weight: 2,
    properties: ["light", "thrown (20/60 ft)"],
    description: "A small hammer designed for throwing. It's useful for breaking through barriers or causing damage at range."
  },
  {
    name: "Mace",
    category: "Simple Weapon",
    cost: "5 gp",
    weight: 4,
    properties: [],
    description: "A blunt weapon that deals crushing damage. It's effective against armored opponents and can be used with one or two hands."
  },
  {
    name: "Quarterstaff",
    category: "Simple Weapon",
    cost: "2 sp",
    weight: 4,
    properties: ["versatile"],
    description: "A long stick that can be used as a weapon. It's versatile and can be wielded with one or two hands."
  },
  {
    name: "Sickle",
    category: "Simple Weapon",
    cost: "1 gp",
    weight: 2,
    properties: ["light"],
    description: "A farming tool that can be used as a weapon. It's useful for quick strikes and can be concealed easily."
  },
  {
    name: "Spear",
    category: "Simple Weapon",
    cost: "1 gp",
    weight: 3,
    properties: ["thrown (20/60 ft)", "versatile"],
    description: "A long pole weapon that's effective at range and in melee. It can be used for thrusting or throwing."
  },
  {
    name: "Crossbow, Light",
    category: "Simple Weapon",
    cost: "25 gp",
    weight: 2,
    properties: ["ammunition (40/160 ft)", "loading", "two-handed"],
    description: "A crossbow that fires bolts. It's more powerful than a regular bow and can be used in tight spaces."
  },
  {
    name: "Darts",
    category: "Simple Weapon",
    cost: "5 cp",
    weight: 0.25,
    properties: ["finesse", "thrown (20/60 ft)"],
    description: "Small throwing weapons that are easy to carry and use. They're effective for ranged attacks."
  },
  {
    name: "Longbow",
    category: "Simple Weapon",
    cost: "75 gp",
    weight: 2,
    properties: ["ammunition (150/600 ft)", "two-handed"],
    description: "A powerful bow that can be used for long-range attacks. It requires training to use effectively."
  },
  {
    name: "Net",
    category: "Simple Weapon",
    cost: "1 gp",
    weight: 3,
    properties: ["thrown (5/15 ft)", "special"],
    description: "A net that can be used to restrain enemies or catch prey. It's useful for non-lethal combat."
  },
  {
    name: "Chain Mail",
    category: "Armor",
    cost: "50 gp",
    weight: 20,
    properties: [],
    description: "A type of armor made from interlocking metal rings. It provides good protection but restricts movement."
  },
  {
    name: "Hide Armor",
    category: "Armor",
    cost: "10 gp",
    weight: 12,
    properties: [],
    description: "Armor made from animal hide. It's light and flexible, offering moderate protection."
  },
  {
    name: "Leather Armor",
    category: "Armor",
    cost: "10 gp",
    weight: 10,
    properties: [],
    description: "Light armor made from leather. It's comfortable and allows for easy movement."
  },
  {
    name: "Padded Armor",
    category: "Armor",
    cost: "5 gp",
    weight: 8,
    properties: [],
    description: "Light armor made from layers of cloth or leather. It provides minimal protection but is very comfortable."
  },
  {
    name: "Scale Mail",
    category: "Armor",
    cost: "50 gp",
    weight: 45,
    properties: [],
    description: "A type of armor with small metal scales attached to a backing. It offers good protection while maintaining flexibility."
  },
  {
    name: "Breastplate",
    category: "Armor",
    cost: "400 gp",
    weight: 20,
    properties: [],
    description: "A chest piece that provides good protection for the torso. It's more expensive but offers excellent defense."
  },
  {
    name: "Half Plate",
    category: "Armor",
    cost: "750 gp",
    weight: 40,
    properties: [],
    description: "Partial armor that covers the torso and upper legs. It provides good protection while allowing for mobility."
  },
  {
    name: "Plate Armor",
    category: "Armor",
    cost: "1,500 gp",
    weight: 65,
    properties: [],
    description: "Full body armor made of metal plates. It provides maximum protection but restricts movement significantly."
  },
  {
    name: "Ring Mail",
    category: "Armor",
    cost: "30 gp",
    weight: 40,
    properties: [],
    description: "Armor made from metal rings linked together. It's lightweight and flexible, providing good protection."
  },
  {
    name: "Splint Armor",
    category: "Armor",
    cost: "200 gp",
    weight: 55,
    properties: [],
    description: "Armor made of metal strips riveted to leather or cloth. It provides excellent protection but is heavy and restrictive."
  },
  {
    name: "Studded Leather Armor",
    category: "Armor",
    cost: "45 gp",
    weight: 13,
    properties: [],
    description: "Leather armor reinforced with metal studs. It offers better protection than regular leather while remaining flexible."
  },
  {
    name: "Belt of Hill Giant Strength",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This belt is made from the hide of a hill giant. When worn, it grants its wearer the strength of a hill giant."
  },
  {
    name: "Boots of Elvenkind",
    category: "Wondrous Item",
    cost: "50 gp",
    weight: 1,
    properties: [],
    description: "These soft leather boots are made from the hide of an elf. They make no sound when walking, even on hard surfaces."
  },
  {
    name: "Belt of Dwarvenkind",
    category: "Wondrous Item",
    cost: "50 gp",
    weight: 1,
    properties: [],
    description: "This belt is made from the hide of a mountain dwarf. When worn, it grants its wearer the endurance of a dwarf."
  },
  {
    name: "Boots of Striding and Springing",
    category: "Wondrous Item",
    cost: "500 gp",
    weight: 1,
    properties: [],
    description: "These boots allow the wearer to move at normal speed while also jumping up to 30 feet in any direction without a running start."
  },
  {
    name: "Bracers of Archery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "These bracers enhance the wearer's archery skills. They grant a +2 bonus to attack and damage rolls with bows."
  },
  {
    name: "Belt of Fire Giant Strength",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This belt is made from the hide of a fire giant. When worn, it grants its wearer the strength of a fire giant."
  },
  {
    name: "Circlet of blasting",
    category: "Wondrous Item",
    cost: "500 gp",
    weight: 1,
    properties: [],
    description: "This circlet allows the wearer to cast the magic missile spell at will, as well as the shield spell once per day."
  },
  {
    name: "Amulet of Health",
    category: "Wondrous Item",
    cost: "500 gp",
    weight: 1,
    properties: [],
    description: "This amulet grants its wearer a +2 bonus to Constitution saving throws and increases their maximum hit points by 10."
  },
  {
    name: "Amulet of the Planes",
    category: "Wondrous Item",
    cost: "5,000 gp",
    weight: 1,
    properties: [],
    description: "This amulet allows its wearer to cast the plane shift spell once per day. It also grants resistance to all damage types."
  },
  {
    name: "Armor of Vulnerability",
    category: "Wondrous Item",
    cost: "10,000 gp",
    weight: 2,
    properties: [],
    description: "This armor makes the wearer vulnerable to a specific type of damage. It grants resistance to all other damage types."
  },
  {
    name: "Bag of Holding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 15,
    properties: [],
    description: "This bag can hold up to 500 pounds of material, plus a volume of 64 cubic feet. It is dimensionally transcendental."
  },
  {
    name: "Belt of Storm Giant Strength",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This belt is made from the hide of a storm giant. When worn, it grants its wearer the strength of a storm giant."
  },
  {
    name: "Belt of Stone Giant Strength",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This belt is made from the hide of a stone giant. When worn, it grants its wearer the strength of a stone giant."
  },
  {
    name: "Boots of Levitation",
    category: "Wondrous Item",
    cost: "500 gp",
    weight: 1,
    properties: [],
    description: "These boots allow the wearer to levitate up to 20 feet off the ground. They can be controlled by the wearer's thoughts."
  },
  {
    name: "Boots of Speed",
    category: "Wondrous Item",
    cost: "500 gp",
    weight: 1,
    properties: [],
    description: "These boots allow the wearer to move at twice normal speed, even when climbing or jumping. They also grant advantage on Dexterity saving throws."
  },
  {
    name: "Bottle of Poison",
    category: "Consumable",
    cost: "100 gp",
    weight: 0.5,
    properties: [],
    description: "This vial contains a deadly poison that can be applied to weapons or thrown as an attack."
  },
  {
    name: "Oil of Etherealness",
    category: "Consumable",
    cost: "1,000 gp",
    weight: 0.5,
    properties: [],
    description: "This oil allows the wearer to become ethereal for 1 hour or until they attack."
  },
  {
    name: "Potion of Healing",
    category: "Consumable",
    cost: "50 gp",
    weight: 0.5,
    properties: [],
    description: "Heals 2d4+2 hit points when consumed."
  },
  {
    name: "Potion of Greater Healing",
    category: "Consumable",
    cost: "100 gp",
    weight: 0.5,
    properties: [],
    description: "Heals 4d4+4 hit points when consumed."
  },
  {
    name: "Potion of Superior Healing",
    category: "Consumable",
    cost: "200 gp",
    weight: 0.5,
    properties: [],
    description: "Heals 8d4+8 hit points when consumed."
  },
  {
    name: "Potion of Supreme Healing",
    category: "Consumable",
    cost: "500 gp",
    weight: 0.5,
    properties: [],
    description: "Heals 10d4+10 hit points when consumed."
  },
  {
    name: "Spell Scroll (Cantrip)",
    category: "Consumable",
    cost: "25 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing a spell that can be cast by any class."
  },
  {
    name: "Spell Scroll (1st Level)",
    category: "Consumable",
    cost: "100 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing a first-level spell that can be cast by any class."
  },
  {
    name: "Spell Scroll (2nd Level)",
    category: "Consumable",
    cost: "200 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing a second-level spell that can be cast by any class."
  },
  {
    name: "Spell Scroll (3rd Level)",
    category: "Consumable",
    cost: "400 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing a third-level spell that can be cast by any class."
  },
  {
    name: "Spell Scroll (4th Level)",
    category: "Consumable",
    cost: "800 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing a fourth-level spell that can be cast by any class."
  },
  {
    name: "Spell Scroll (5th Level)",
    category: "Consumable",
    cost: "1,600 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing a fifth-level spell that can be cast by any class."
  },
  {
    name: "Spell Scroll (6th Level)",
    category: "Consumable",
    cost: "3,200 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing a sixth-level spell that can be cast by any class."
  },
  {
    name: "Spell Scroll (7th Level)",
    category: "Consumable",
    cost: "6,400 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing a seventh-level spell that can be cast by any class."
  },
  {
    name: "Spell Scroll (8th Level)",
    category: "Consumable",
    cost: "12,800 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing an eighth-level spell that can be cast by any class."
  },
  {
    name: "Spell Scroll (9th Level)",
    category: "Consumable",
    cost: "25,600 gp",
    weight: 0.5,
    properties: [],
    description: "A scroll containing a ninth-level spell that can be cast by any class."
  },
  {
    name: "Wand of Magic Missiles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireballs",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolts",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Cure Wounds",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast cure wounds as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Paralysis",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast paralysis as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Web",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast web as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Arrow",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid arrow as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Melf's Acid Arrow",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast melf's acid arrow as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Snilloc's Snowball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast snilloc's snowball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fire Shield",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fire shield as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ice Storm",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ice storm as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Missile",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic missile as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Frost",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of frost as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Sleep",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast sleep as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Fireball",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast fireball as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Lightning Bolt",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast lightning bolt as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Acid Splash",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast acid splash as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chill Touch",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chill touch as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Eldritch Blast",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast eldritch blast as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mage Hand",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mage hand as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Message",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast message as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Minor Illusion",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast minor illusion as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prestidigitation",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prestidigitation as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Ray of Sickness",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast ray of sickness as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Shocking Grasp",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast shocking grasp as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of True Strike",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast true strike as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Vicious Mockery",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast vicious mockery as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Fire",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of fire as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Ice",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of ice as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Thorns",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of thorns as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Chain Lightning",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast chain lightning as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Disintegrate",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast disintegrate as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Evard's Black Tentacles",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast evard's black tentacles as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Mordenkainen's Sword",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast mordenkainen's sword as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Otiluke's Resilient Sphere",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast otiluke's resilient sphere as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Prismatic Spray",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast prismatic spray as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Wall of Force",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast wall of force as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Flesh to Stone",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast flesh to stone as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Glyph of Warding",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast glyph of warding as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Magic Circle",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast magic circle as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Counterspell",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast counterspell as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Invisibility",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast invisibility as a spell-like ability. It has 7 charges."
  },
  {
    name: "Wand of Knock",
    category: "Wondrous Item",
    cost: "2,000 gp",
    weight: 1,
    properties: [],
    description: "This wand allows the user to cast knock as a spell-like ability. It has 7 charges."
  }
];

module.exports = newEquipment;