<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Analytics maintenance

- Preserve the public-only analytics boundary: `/studio` and nested Studio paths are excluded.
- Keep analytics URL redaction covered by tests; do not send query strings or fragments.
- Do not describe backend request counts as verified visitors.
- Analytics must remain non-blocking: failures in telemetry must not break rendering or navigation.

