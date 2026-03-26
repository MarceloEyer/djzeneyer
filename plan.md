1. **Optimize MainLayout Re-renders due to Modal state changes**:
   - The `MainLayout` component passes the `openModal` function down to the `Navbar` component as a prop (`onLoginClick`).
   - However, the `openModal` function is recreated on every render of `MainLayout` because it's not wrapped in `useCallback`.
   - This causes `Navbar`, even though it's wrapped in `React.memo`, to re-render unnecessarily every time the `MainLayout` re-renders (which happens when `isAuthModalOpen` state changes).
   - This can be fixed by wrapping the `openModal` and `closeModal` functions in `useCallback` inside `MainLayout.tsx`.

2. **Verify Changes**:
   - Ensure the site still works normally.
   - Specifically verify the Auth Modal opens correctly from the Navbar.
   - Run linter and tests (if any).
   - Document learning in `.jules/bolt.md` (add entry).

3. **Pre-commit Instructions**:
   - Follow the pre-commit instructions before submitting.
