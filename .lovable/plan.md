

## Dark Mode Toggle

The project already has dark mode CSS variables defined in `index.css` under `.dark`. Tailwind is configured with `darkMode: ["class"]`. What's missing is the toggle mechanism and applying the `dark` class to `<html>`.

### Plan

**1. Create a ThemeProvider and hook (`src/hooks/use-theme.tsx`)**
- React context that reads/writes theme preference to `localStorage`
- On mount, applies `dark` class to `document.documentElement` based on stored preference or system preference
- Exposes `theme` (light/dark/system) and `setTheme` function

**2. Add a toggle button to the header in `Index.tsx`**
- Sun/Moon icon button next to the "+ Add" button
- Uses `useTheme` hook to toggle between light and dark
- Subtle ghost-style button matching the existing design language

**3. Wrap app with ThemeProvider in `App.tsx`**
- Wrap the existing component tree with the new `ThemeProvider`

**4. Remove the `next-themes` import from `sonner.tsx`**
- Replace it with the custom `useTheme` hook so Sonner respects the same theme state

No new dependencies needed -- this will be a lightweight custom implementation using `localStorage` and the existing `.dark` CSS variables.

