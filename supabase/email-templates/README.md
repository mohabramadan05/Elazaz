# Arabic Email Templates

Use these files in `Supabase Dashboard -> Authentication -> Email Templates`.

- `signup-confirmation-ar.html`: Confirm signup template.
- `forgot-password-ar.html`: Reset password template.
- `magic-link-ar.html`: Magic link sign-in template.
- `invite-ar.html`: Invite user template.

Encoding note:

- The Arabic text is encoded as HTML entities (`&#x....;`) on purpose.
- This avoids Arabic turning into `????` when copied/saved through dashboards that mishandle UTF-8.
- Keep these files as-is when pasting into Supabase.

All templates are RTL Arabic and follow El Azaz colors:

- Primary accent: `#B47720`
- Primary text: `#1D1F1F`
- Secondary text: `#666666`
- Surface: `#FFFFFF`
