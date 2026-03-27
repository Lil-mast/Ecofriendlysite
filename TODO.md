# Debug react-leaflet MapContainer Context Error

## Plan Breakdown (Approved)
1. [x] **Create/Update src/main.tsx**: Add global Leaflet CSS import + icon prototype fix.
2. [x] **Update src/components/DistanceMap.tsx**: Remove local CSS, add error handling.
3. [x] **Restart dev server** – running on :3001.
4. [x] **Fix blank page**: Replaced 'card' → glassmorphism cards, 'btn-primary' → gradient button.

**Complete!** All fixes deployed:
- MapContext error: Leaflet globals in main.tsx.
- Blank page: CSS classes defined.
Dev server HMR active (:3001). Visit http://localhost:3001/calculator – form + map visible/functional. Navbar? If other pages broken, similar CSS fixes needed.

Paste F12 console if issues remain.

