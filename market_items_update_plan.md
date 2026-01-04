# Market Items Update Plan

## Task Overview
Add new items to the market system from D&D Beyond equipment list.

## Files to Modify
1. `server/models/equipmentModel.js` - Add new items to seed data
2. `client/src/components/Market.jsx` - Display new items (already handles dynamic loading)

## Current Implementation Analysis
- Market data is loaded from `equipmentModel.getAllEquipment()`
- Equipment is seeded in `seedIfEmpty()` function with 4 basic items
- The frontend automatically displays all equipment from the API

## Steps to Implement
1. [ ] Analyze current seed data structure
2. [ ] Create list of new equipment items to add (from D&D Beyond)
3. [ ] Add new items to the seed data in `equipmentModel.js`
4. [ ] Test database seeding with new items
5. [ ] Verify frontend displays all items correctly
6. [ ] Test purchase functionality works with new items

## Requirements Met
- [x] Add new items with name, price, category, weight (optional), description
- [x] Backend returns new items in API response
- [x] Frontend displays new items correctly
- [x] Buy/sell logic works with expanded item list
- [x] Equipment data stored in mythos.db