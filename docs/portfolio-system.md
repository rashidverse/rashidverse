# Portfolio and Featured Projects

## One project source

Portfolio projects are stored locally in `data/content.json` under the `portfolio` collection and are managed at `/admin` → **Portfolio Admin**. This project currently uses the local JSON content API (`/api/content/portfolio/`), not Firebase or an external database.

There is one project record per project. The old `featured` collection is legacy data only and is no longer read by the public Featured Projects carousel or shown in the admin navigation.

## Project record

Each project supports:

- `title`
- `thumb` and optional `hoverImg`
- `description` and optional `details`
- `link`
- `mainCategory`
- `subcategory`
- `published`
- `featured`
- `featuredOrder`
- `order`

The available `mainCategory` values are intentionally limited to the four current skill areas:

1. WordPress Design & Development
2. Video Editing & Motion Graphics
3. Multimedia Designer
4. WordPress Plugin Development

`category` is also kept in sync with `mainCategory` for compatibility with older project records and front-end code.

## Admin workflow

Create or edit a project from **Portfolio Admin**. Select the main category, then use the Subcategory field to select an existing suggestion or type a new one. Existing subcategory suggestions are filtered to the selected main category. New values become reusable automatically after saving because they are stored on the project record. Matching is case-insensitive, so `Elementor`, `elementor`, and `ELEMENTOR` resolve to one existing display label.

Set **Published** to `Yes` to make a project appear in Portfolio. Enable **Show in Featured Projects** and set **Featured order** to add the same project to the Featured Projects carousel. Lower featured order appears first. Project links in the featured carousel open in a new tab.

## Current local limitation

`data/content.json` and uploaded files under `public/uploads/` are local-server storage. They persist while this local app/server is running, but a deployment needs writable persistent storage (or a database/CMS) for admin changes to survive server rebuilds and redeployments. No Firebase is required; the persistence provider can be chosen later.
