---
name: "scrape-google-maps"
description: "Scrape Google Maps for any business type in any location, then find and verify contact emails, optionally cross-check Oman commercial-registration status, export an Excel lead list, and (with explicit per-batch confirmation) send WhatsApp outreach. Use when the user wants leads/businesses from Google Maps, acting as a marketing-manager workflow."
---

# Google Maps scraper + email finder + verifier + outreach

This skill drives the full pipeline: discover businesses on Google Maps, find and verify contact emails, optionally cross-check Oman commercial-registration ("السجل التجاري") status, export a clean Excel lead list, and — only when the user explicitly asks and confirms — send outreach by email or WhatsApp. Think of it as giving the user a junior marketing-manager: it finds prospects and gets them lead-ready, but every outbound message still needs the user's own words and explicit go-ahead.

**Accuracy framing — say this up front whenever you run this skill for leads/outreach purposes:** this is a research and productivity aid, not a guaranteed-accurate directory. Google Maps listings can be stale, emails are AI-judgment best guesses, and (see Phase 5) the ministry name-match is frequently incomplete. Tell the user plainly what's verified vs. best-effort; never present a guess as a confirmed fact.
## Phase 0 — Load API keys

Run before any other phase. Bash tool calls don't share state, so every later API call must re-source the env file with `source "$HOME/.claude/skills/scrape-google-maps/.env" && <command>`.

### Load saved keys

```bash
ENV_FILE="$HOME/.claude/skills/scrape-google-maps/.env"
mkdir -p "$(dirname "$ENV_FILE")"
[ -f "$ENV_FILE" ] && set -a && . "$ENV_FILE" && set +a
echo "SERPER:          ${SERPER_API_KEY:-MISSING}"
echo "MILLIONVERIFIER: ${MILLIONVERIFIER_API_KEY:-MISSING}"
```

### Ask for any missing keys

If `SERPER_API_KEY` is missing, ask in chat:

> Need a **Serper API key** to search Google Maps. Grab one at **https://serper.dev** — free tier gives you 2,500 credits, no card needed. Paste it here when you have it.
>
> If `MILLIONVERIFIER_API_KEY` is missing, ask in chat:
>
> > Need a **MillionVerifier API key** to verify the emails. Sign up at **https://app.millionverifier.com** and add some credits (≈$0.0007/email — $10 covers ~14,000). Paste the key here.
> >
> > Validate the pasted value looks like a key (alphanumeric, ~30+ chars, not a URL or sentence). Reject obvious mistakes and ask again.
> >
> > If the user doesn't have these keys yet and just wants a quick, lower-fidelity preview (no verified emails, no CSV pipeline), you can instead run a one-off lookup with the `places_search`/`places_map_display` tools when available — that needs no API keys, gives name/address/phone/rating on a map, but no emails and no resumable job folder. Offer this as a fallback, not a replacement.
> >
> > ### Save the keys
> >
> > Persist so it's a one-time ask:
> >
> > ```bash
> > ENV_FILE="$HOME/.claude/skills/scrape-google-maps/.env"
> > KEY_NAME="SERPER_API_KEY"   # or MILLIONVERIFIER_API_KEY
> > KEY_VALUE="<pasted-value>"
> >
> > touch "$ENV_FILE" && chmod 600 "$ENV_FILE"
> > if grep -q "^${KEY_NAME}=" "$ENV_FILE"; then
> >   sed -i.bak "s|^${KEY_NAME}=.*|${KEY_NAME}=${KEY_VALUE}|" "$ENV_FILE" && rm "$ENV_FILE.bak"
> > else
> >   echo "${KEY_NAME}=${KEY_VALUE}" >> "$ENV_FILE"
> > fi
> > ```
> >
> > Confirm: *"Saved — won't ask again."*
> >
> > ### Verify sub-agent permissions
> >
> > The skill dispatches sub-agents to extract emails with AI judgment. Sub-agents don't inherit `accept edits on` from the parent session, so they need their own explicit permission grants. Required:
> >
> > - `Bash(curl:*)` — call Serper + MillionVerifier
> > - - `Bash(python3:*)` — parse JSON responses
> >   - - `Read` — read input files
> >     - - `Write` — write batch results
> >      
> >       - Check `~/.claude/settings.json` for missing entries; if any are missing, ask the user once and add them:
> >      
> >       - ```python
> >         import json, os
> >         SETTINGS = os.path.expanduser('~/.claude/settings.json')
> >         NEEDED = ['Bash(curl:*)', 'Bash(python3:*)', 'Read', 'Write']
> >
> >         data = json.load(open(SETTINGS))
> >         allow = data.setdefault('permissions', {}).setdefault('allow', [])
> >         missing = [p for p in NEEDED if p not in allow]
> >         print('missing:', missing)
> >         ```
> >
> > If `missing` is non-empty, ask:
> >
> > > The skill needs `<missing list>` in your Claude Code permissions so sub-agents can run. OK to add them to `~/.claude/settings.json`? (one-time setup)
> > >
> > > On confirmation, append the missing entries (preserve existing JSON formatting):
> > >
> > > ```python
> > > import json, os
> > > SETTINGS = os.path.expanduser('~/.claude/settings.json')
> > > NEEDED = ['Bash(curl:*)', 'Bash(python3:*)', 'Read', 'Write']
> > > data = json.load(open(SETTINGS))
> > > allow = data['permissions']['allow']
> > > for p in NEEDED:
> > >     if p not in allow: allow.append(p)
> > > json.dump(data, open(SETTINGS, 'w'), indent=2)
> > > ```
> > >
> > > Confirm: *"Permissions updated. Sub-agents can now run."*
> > >
> > > ## Working directory
> > >
> > > All output goes in the user's current working directory under `./<job-name>/`. Pick a kebab-case job name from the request (e.g. "dentists in austin" → `dentists-austin`). The folder contains:
> > >
> > > ```
> > > <job-name>/
> > > ├── config.json         # the job spec — keywords, locations, etc.
> > > ├── state.json          # resume tracker — done queries, done emails, done CR checks, done sends
> > > ├── serper-maps/        # raw Serper Maps responses (one file per batch)
> > > ├── serper-search/      # raw Serper /search responses (one per email-batch)
> > > ├── leads.csv           # the core deliverable, updated as the pipeline progresses
> > > ├── leads.xlsx          # Phase 6 export (Excel)
> > > ├── whatsapp-log.csv    # Phase 7 send log, if WhatsApp outreach is run
> > > └── debug.log           # what happened, for the user to inspect
> > > ```
> > >
> > > Create the folder, write `config.json`, then proceed.
> > >
> > > ## Pipeline overview
> > >
> > > ```
> > > 1. Discover    → Serper Maps batched calls → leads.csv (no emails yet)
> > > 2. Find emails → Sub-agents batched on Serper /search snippets
> > > 3. Validate    → MillionVerifier bulk API → email_status column
> > > 4. Export CSV  → finalize leads.csv, summary stats
> > > 5. CR check    → OPTIONAL, only if asked — Oman commercial-registration cross-check (best-effort)
> > > 6. Export xlsx → OPTIONAL, only if asked — polished Excel deliverable
> > > 7. Outreach    → OPTIONAL, only if asked, needs explicit confirmation — email draft or WhatsApp send
> > > ```
> > >
> > > Phases 5–7 only run when the user asks for them ("تأكد انهم نشطين", "طلعلي اكسل", "ارسلهم واتساب"); never run them unprompted. Each phase is independently resumable — always read `state.json` first and skip work that's already done.
> > >
> > > ---
> > >
> > > ## Phase 1 — Discover (Serper Maps)
> > >
> > > ### Build the query plan
> > >
> > > Talk to the user to nail down:
> > > - **Keywords** — 1-5 search terms ("dentist", "family dentistry", "cosmetic dentist"). More keywords = more coverage; each keyword × each location = 1 query.
> > > - - **Locations** — either a list of cities (`{city, state}`) or a geographic bounding box (lat/lng grid).
> > >   - - **Country (gl)** — `us`, `gb`, `de`, `om`, etc.
> > >     - - **Per-query result cap** — default 20 (Serper's max).
> > >      
> > >       - For a quick scrape (≤500 leads), 1-2 keywords × 5-20 cities is fine. For a big national run, ask the user to confirm cost: `(num_queries × 3 credits) / 1000 × $1`.
> > >      
> > >       - Write the plan to `config.json`:
> > >      
> > >       - ```json
> > > {
> > >   "name": "dentists-austin",
> > >   "keywords": ["dentist", "family dentist"],
> > >   "strategy": "cities",
> > >   "cities": [
> > >     {"city": "Austin", "state": "Texas"},
> > >     {"city": "Round Rock", "state": "Texas"}
> > >   ],
> > >   "gl": "us",
> > >   "num": 20,
> > >   "batchSize": 100,
> > >   "concurrency": 3
> > > }
> > > ```
> > >
> > > ### Run Serper Maps in batches
> > >
> > > Serper `/maps` accepts an array of up to **100 query objects per POST** (each is `{q, location|ll, gl, num}`). Each query costs **3 credits**.
> > >
> > > Build the full query list, then batch by 100. For each batch:
> > >
> > > ```bash
> > > . "$HOME/.claude/skills/scrape-google-maps/.env" && \
> > > curl -s -X POST https://google.serper.dev/maps \
> > >   -H "X-API-KEY: $SERPER_API_KEY" \
> > >   -H "Content-Type: application/json" \
> > >   --data @<job>/serper-maps/batch-N-request.json \
> > >   > <job>/serper-maps/batch-N-response.json
> > > ```
> > >
> > > **Read 1-2 sample responses** (use the `Read` tool) to sanity-check the data quality before processing all batches: are the businesses what the user expected? Are addresses populated? Are too many results irrelevant categories? If something looks off, stop and tell the user before burning more credits.
> > >
> > > ### Parse to leads.csv
> > >
> > > Use python3 (preinstalled everywhere) to parse responses and dedupe on `cid`:
> > >
> > > ```bash
> > > python3 - <<'PY'
> > > import json, csv, glob
> > > from urllib.parse import urlparse
> > >
> > > seen = set()
> > > rows = []
> > > for path in sorted(glob.glob('<job>/serper-maps/batch-*-response.json')):
> > >     data = json.load(open(path))
> > >     for item in (data if isinstance(data, list) else [data]):
> > >         for p in item.get('places', []):
> > >             cid = str(p.get('cid', ''))
> > >             if not cid or cid in seen: continue
> > >             seen.add(cid)
> > >             site = p.get('website') or ''
> > >             domain = urlparse(site).netloc.replace('www.', '') if site.startswith('http') else ''
> > >             rows.append({
> > >                 'cid': cid,
> > >                 'title': p.get('title', ''),
> > >                 'address': p.get('address', ''),
> > >                 'phone': p.get('phoneNumber', ''),
> > >                 'website': site,
> > >                 'domain': domain,
> > >                 'rating': p.get('rating', ''),
> > >                 'rating_count': p.get('ratingCount', ''),
> > >                 'type': p.get('type', ''),
> > >                 'latitude': p.get('latitude', ''),
> > >                 'longitude': p.get('longitude', ''),
> > >                 'email': '',
> > >                 'email_confidence': '',
> > >                 'email_status': '',
> > >                 'cr_number': '',
> > >                 'cr_status': 'not_checked',
> > >                 'cr_legal_name_ar': '',
> > >                 'cr_legal_name_en': '',
> > >             })
> > >
> > > with open('<job>/leads.csv', 'w', newline='') as f:
> > >     w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
> > >     w.writeheader()
> > >     w.writerows(rows)
> > > print(f'{len(rows)} unique leads')
> > > PY
> > > ```
> > >
> > > Update `state.json` with the list of completed batches.
> > >
> > > ---
> > >
> > > ## Phase 2 — Find emails (Serper /search via sub-agents)
> > >
> > > Only process leads with `domain != ''`. Filter out leads whose `email` is already filled (resume).
> > >
> > > ### Batch leads into groups of 25
> > >
> > > For each group of 25, **spawn one sub-agent in parallel**. Up to 4 sub-agents at a time (8 OK on a fast machine). Each sub-agent does ONE batched Serper `/search` call (Serper accepts 100 queries per POST, so 25 fits easily). One credit per lead — no multi-keyword variations.
> > >
> > > Before spawning each sub-agent, write the lead batch to `/tmp/email-batch-{N}-input.json`:
> > >
> > > ```python
> > > import csv, json
> > > leads = [r for r in csv.DictReader(open('<job>/leads.csv'))
> > >          if r.get('domain') and not r.get('email')]
> > > B = 25
> > > for i in range(0, len(leads), B):
> > >     chunk = [{'cid': l['cid'], 'title': l['title'], 'domain': l['domain']} for l in leads[i:i+B]]
> > >     json.dump(chunk, open(f'/tmp/email-batch-{i//B+1}-input.json', 'w'))
> > > ```
> > >
> > > ### Sub-agent prompt template
> > >
> > > Use this verbatim, substituting `{batch_num}`:
> > >
> > > ```
> > > You're an email-finding sub-agent. Find the best contact email for each business in the batch.
> > >
> > > ## Input
> > > Read /tmp/email-batch-{batch_num}-input.json — array of `{cid, title, domain}` objects (~25 leads).
> > >
> > > ## Step 1: Build batched Serper request
> > > For each lead, build a query object: `{"q": "\"<domain>\" email", "num": 10, "gl": "us"}`.
> > > Single keyword "email" only — one credit per lead, that's it.
> > > Write the array to /tmp/email-batch-{batch_num}-serper-request.json.
> > >
> > > ## Step 2: ONE batched Serper call
> > > . "$HOME/.claude/skills/scrape-google-maps/.env" && \
> > > curl -s -X POST https://google.serper.dev/search \
> > >   -H "X-API-KEY: $SERPER_API_KEY" \
> > >   -H "Content-Type: application/json" \
> > >   --data @/tmp/email-batch-{batch_num}-serper-request.json \
> > >   > /tmp/email-batch-{batch_num}-serper-response.json
> > >
> > > Response is an array, one element per query, in input order.
> > >
> > > ## Step 3: Pick the best email per business (AI judgment, NOT regex)
> > > For each lead, read its response's `organic` array. Look at title, snippet, and link. Pick the BEST email.
> > >
> > > PREFER:
> > > - Emails on the lead's actual business domain (info@domain, contact@domain, hello@, name@)
> > > - Owner/manager personal addresses tied to this business
> > > - Freemail (Gmail/Yahoo/etc.) ONLY if shown repeatedly across the lead's own website snippets
> > >
> > > REJECT:
> > > - noreply@, no-reply@, donotreply@, wordpress@, mailer@, postmaster@, webmaster@
> > > - Emails clearly belonging to a different company (different brand, unrelated)
> > > - Privacy-policy template emails on third-party domains
> > > - Customer testimonial / quoted emails
> > >
> > > CRITICAL — IGNORE the "domain" field if it's a social/aggregator host:
> > >    instagram.com, facebook.com, linkedin.com, yelp.com, zocdoc.com,
> > >    healthgrades.com, wellness.com, vagaro.com, yellowpages.com,
> > >    tiktok.com, x.com, twitter.com, youtube.com, sharecare.com,
> > >    apple.com, google.com
> > >
> > > Many Google Maps listings use Instagram/Facebook as their "website". DO NOT pick `support@instagram.com` or `noreply@facebook.com` as the lead's email. For these leads, return `email: null` unless a real business email surfaces from a different snippet (e.g. their actual business website appears in another organic result).
> > >
> > > If multiple candidates: pick ONE best, list the rest in `alternatives`.
> > > If nothing usable: `email: null` and move on.
> > >
> > > ## Step 4: Output
> > > Write /tmp/email-batch-{batch_num}-results.json — array in input order:
> > > [
> > >   {
> > >     "cid": "...",
> > >     "email": "best@example.com" | null,
> > >     "confidence": "high" | "medium" | "low",
> > >     "source": "serper-snippet" | "none",
> > >     "reasoning": "one short sentence",
> > >     "alternatives": [...]
> > >   }, ...
> > > ]
> > >
> > > ## Constraints
> > > - ONE batched Serper request, not 25 separate ones.
> > > - Use AI judgment. Reject social/aggregator domains as "lead domain" — non-negotiable.
> > > - Final response under 300 words.
> > > ```
> > >
> > > ### Merge results into leads.csv
> > >
> > > After all sub-agents complete, read each `/tmp/email-batch-*-results.json` and merge by `cid` into `leads.csv` (set `email` and `email_confidence`). Update `state.json` with completed batches.
> > >
> > > ---
> > >
> > > ## Phase 3 — Validate (MillionVerifier bulk API)
> > >
> > > Collect all unique non-empty emails from `leads.csv`. Write them to `<job>/emails-to-verify.txt`, one per line.
> > >
> > > > **Important — host and endpoint shape:** The bulk API runs on `bulkapi.millionverifier.com` (NOT `api.millionverifier.com`). All endpoints take `file_id` and `key` as **query parameters**, not path parameters.
> > > >
> > > > ### 1. Upload
> > > >
> > > > ```bash
> > > > . "$HOME/.claude/skills/scrape-google-maps/.env" && \
> > > > curl -s -X POST "https://bulkapi.millionverifier.com/bulkapi/v2/upload?key=$MILLIONVERIFIER_API_KEY" \
> > > >   -F "file_contents=@<job>/emails-to-verify.txt" \
> > > >   -F "file_name=<job>" \
> > > >   > <job>/mv-upload.json
> > > > ```
> > > >
> > > > Parse `file_id` from the response and save it to `state.json` as `mv_file_id` (so polling can resume across sessions).
> > > >
> > > > ### 2. Poll — capped at 5 minutes
> > > >
> > > > The MV bulk API often hangs at 95-99% for many minutes on the last batch — it'll get there but not soon. **Don't wait past 5 minutes; download whatever's verified and proceed.**
> > > >
> > > > Status endpoint: `GET /bulkapi/v2/fileinfo?file_id=<id>&key=<key>` — returns `status` (`in_progress` | `finished`), `total`, `verified`, `unverified`.
> > > >
> > > > ```bash
> > > > . "$HOME/.claude/skills/scrape-google-maps/.env"
> > > > FILE_ID=<from mv-upload.json>
> > > > START=$(date +%s)
> > > > CAP=300  # 5 minutes
> > > > while :; do
> > > >   resp=$(curl -s "https://bulkapi.millionverifier.com/bulkapi/v2/fileinfo?file_id=$FILE_ID&key=$MILLIONVERIFIER_API_KEY")
> > > >   st=$(echo "$resp" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status',''))")
> > > >   pct=$(echo "$resp" | python3 -c "import json,sys; d=json.load(sys.stdin); v=d.get('verified',0); t=max(d.get('total',1),1); print(f'{100*v/t:.0f}')")
> > > >   echo "$(date +%H:%M:%S) status=$st verified=$pct%"
> > > >   [ "$st" = "finished" ] && echo "MV finished" && break
> > > >   [ $(($(date +%s) - START)) -gt $CAP ] && echo "MV cap hit at 5 min — downloading partial ($pct%)" && break
> > > >   sleep 30
> > > > done
> > > > ```
> > > >
> > > > ### 3. Download
> > > >
> > > > `filter=all` is **required** — without it the endpoint returns 400.
> > > >
> > > > ```bash
> > > > . "$HOME/.claude/skills/scrape-google-maps/.env" && \
> > > > curl -sL "https://bulkapi.millionverifier.com/bulkapi/v2/download?file_id=$FILE_ID&key=$MILLIONVERIFIER_API_KEY&filter=all" \
> > > >   > <job>/mv-results.csv
> > > > ```
> > > >
> > > > CSV columns: `email, quality, result, free, role`. The `result` field has values: `ok`, `catch_all`, `unknown`, `error`, `disposable`, `invalid`.
> > > >
> > > > If you downloaded partial (cap hit), count rows in `mv-results.csv` vs lines in `emails-to-verify.txt` and tell the user how many are still missing — they can re-run the skill later to finish (`state.json.mv_file_id` is preserved).
> > > >
> > > > ### 4. Merge into leads.csv
> > > >
> > > > Set `email_status` per email based on `result`. Categorize:
> > > >
> > > > - `ok` → `valid`
> > > > - - `catch_all` → `risky` (the domain accepts everything; can't be sure)
> > > >   - - `unknown` → `unknown`
> > > >     - - `disposable` / `invalid` / `error` → `invalid`
> > > >       - - emails uploaded but not in `mv-results.csv` (partial-download case) → `unverified`
> > > >        
> > > >         - ---
> > > >
> > > > ## Phase 4 — Export & summarize (CSV)
> > > >
> > > > ### Write the deliverable
> > > >
> > > > Filter `leads.csv` → `<job>/leads-valid.csv` containing only rows with `email_status == valid`. That's the baseline deliverable; full `leads.csv` is reference data with every status.
> > > >
> > > > ```python
> > > > import csv
> > > > rows = list(csv.DictReader(open('<job>/leads.csv')))
> > > > valid = [r for r in rows if r.get('email_status') == 'valid']
> > > > with open('<job>/leads-valid.csv', 'w', newline='') as f:
> > > >     w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
> > > >     w.writeheader(); w.writerows(valid)
> > > > ```
> > > >
> > > > ### Print a polished summary
> > > >
> > > > This is the moment the user sees their result land — make it count. Use box-drawing for visual punch. Compute every value from `leads.csv`, `mv-results.csv`, and `state.json` (which should track Serper credit totals and start time for runtime calc).
> > > >
> > > > ```
> > > > ╔════════════════════════════════════════════════════════════════╗
> > > > ║       <BUSINESS> IN <LOCATION> — SCRAPE COMPLETE          ║
> > > > ╚═══════════════════════════════════════════════════════════════╝
> > > >
> > > >   📍 Coverage:        <N> cities
> > > >   🏢 Businesses:      <N> unique discovered
> > > >   ⭐ Avg rating:      <X.XX> stars (<N> rated)
> > > >   📞 With phone:      <N>  (<%>)
> > > >   🌐 With website:    <N>  (<%>)
> > > >   📧 Emails found:    <N>  (<%> of websites)
> > > >
> > > > ╔═════════════════════════════════════════════════════════════╗
> > > > ║  ✅  <N> REAL BUSINESSES WITH VERIFIED VALID EMAILS  ✅   ║
> > > > ╚═════════════════════════════════════════════════════════════╝
> > > >
> > > >   Email status (<N> unique emails verified):
> > > >     ✅ valid           <N>  (<%>)
> > > >     ⚠️  catch-all      <N>  (<%>)
> > > >     ❓ unknown          <N>  (<%>)
> > > >     ❌ invalid         <N>  (<%>)
> > > >
> > > >   Top cities by valid-email count:
> > > >     <City>      <N>     <City>     <N>
> > > >     <City>      <N>     <City>     <N>
> > > >
> > > >   Sample top-rated leads:
> > > >     <Title>                     <X.X>★ (<N> reviews)
> > > >     <Title>                     <X.X>★ (<N> reviews)
> > > >     <Title>                     <X.X>★ (<N> reviews)
> > > >
> > > > ╔═════════════════════════════════════════════════════╗
> > > > ║                       💰 TOTAL COST                         ║
> > > > ╠═════════════════════════════════════════════════════╣
> > > > ║  Serper Maps     <N> credits      ≈ $<X.XX>                ║
> > > > ║  Serper /search  <N> credits      ≈ $<X.XX>                ║
> > > > ║  MillionVerifier <N> emails       ≈ $<X.XX>                ║
> > > > ║  ────────────────────────────────────                    ║
> > > > ║  💵 TOTAL                         ≈ $<X.XX>                 ║
> > > > ╚══════════════════════════════════════════════════════════╝
> > > >
> > > >   ⏱️  Runtime:               ~<N> min
> > > >   📂 Deliverable:           leads-valid.csv (<N> verified leads)
> > > >   📂 Full data:             leads.csv (<N> total)
> > > >   💵 Cost per verified lead: $<X.XXX>
> > > > ```
> > > >
> > > > After printing the summary, ask the user whether they want to stop here (CSV only) or continue to the optional phases below (CR check, Excel export, outreach).
> > > >
> > > > ---
> > > >
> > > > ## Phase 5 — Oman commercial-registration cross-check (OPTIONAL, best-effort)
> > > >
> > > > Only run this phase if the user explicitly asks to verify/check whether businesses are registered, licensed, or "active" (e.g. "تأكد انهم نشطين", "شوف السجل التجاري مالهم"). This only applies to Oman-based leads; for other countries, tell the user you don't have an equivalent lookup and skip.
> > > >
> > > > ### Known limitations — say these to the user BEFORE starting, not after
> > > >
> > > > 1. **CAPTCHA, every browser session.** The official registry (business.gov.om, "بحث في السجلات التجارية") puts a CAPTCHA in front of the search form. You cannot solve or bypass CAPTCHAs under any circumstance, including if asked directly — this is a hard rule, not a technical gap to work around. Tell the user plainly and ask them to solve it themselves in the browser tab you open; don't try alternate tools, OCR, or asking again. In practice, once the user solves it, the rest of that browser session's searches do NOT require solving it again — confirm this behavior is still true before promising it, since sites change.
> > > > 2. 2. **Name mismatch is common.** The registry's "الاسم التجاري" field holds the LEGAL commercial-registration name — very often the full personal name of the owner for individual/sole-proprietor establishments ("تاجر فرد" / "العمل الحر") — not the public brand/trade name shown on Google Maps, signage, or Instagram. A search for the Maps title will often return zero results, or unrelated matches. A `not_found` result means "couldn't match the legal name," NOT "this business is unregistered" — never claim the latter from a name-search miss.
> > > >   
> > > >    3. ### Steps
> > > >   
> > > >    4. 1. Open `https://www.business.gov.om/portal/searchEstablishments` with the Claude in Chrome tools (load the `chrome-browser` skill first if not already loaded this session).
> > > >       2. 2. Tell the user the CAPTCHA limitation above, then ask them to solve the CAPTCHA shown on the page. Wait for them to confirm.
> > > >          3. 3. For each lead in `leads.csv` with `cr_status == not_checked`: fill the "الاسم التجاري" field with the lead's Maps title (try the full title first, then a shortened/distinctive fragment if zero results), submit, and read the results table.
> > > >             4. 4. On a match: record `cr_number`, `cr_legal_name_ar`, `cr_legal_name_en`, and `cr_status` from the "حالة السجل التجاري" column (`نشط` → `active`, `تم إلقاوه` → `cancelled`). If several results come back and none clearly matches, record `cr_status: ambiguous` rather than guessing which one is right.
> > > >                5. 5. On zero results: `cr_status = not_found`. Do not say "not registered" — say "couldn't match by name in the ministry search" and suggest the owner's name or CR number would resolve it.
> > > >                   6. 6. Update `state.json.completed.cr_check` after each lead so this resumes cleanly.
> > > >                      7. 7. If the extension reports it isn't connected, or a search stops responding, follow the chrome-browser skill's stop-and-ask guidance rather than retrying blindly.
> > > >                        
> > > >                         8. ---
> > > >                        
> > > >                         9. ## Phase 6 — Export Excel deliverable (OPTIONAL)
> > > >                        
> > > >                         10. Only run if the user asks for an Excel file (or once CSV + optional CR check are done and the user wants a polished handoff file). Use the `xlsx` skill if this session has it, for proper formatting (header row, column widths, frozen header). Columns, in order: Name, Phone, Address, Rating, Website, Email, Email Status, CR Number, CR Status, Maps Link.
> > > > 
Build from `leads.csv` (not just `leads-valid.csv`, so the user sees everything, with status columns making quality obvious at a glance). Save as `<job>/leads.xlsx` and deliver with SendUserFile.

---

## Phase 7 — Outreach: email or WhatsApp (OPTIONAL, explicit confirmation required every time)

Only offer this after Phase 4/6 output exists. Ask: *"تحب أرسل لهم إيميل أو رسالة واتساب، أو نكتفي بالملف؟"* If the user doesn't want outreach, stop here — never draft or send anything unprompted.

Hard rules for this phase, no exceptions:

- **Never invent the message.** Ask the user to write the exact subject/body (email) or message text (WhatsApp) themselves. You may offer to help them draft it if they ask, but the text that actually gets sent must be what the user wrote or explicitly approved verbatim — never send your own paraphrase.
- - **Never send without one explicit, fully-informed confirmation covering the whole batch.** Before sending anything, show the user: the exact message text, and the full list of recipients (name + phone or email) it will go to. Ask something like *"أؤكد أرسل هذه الرسالة للـ N رقم/إيميل الموجودين بالقائمة؟"* and wait for a clear yes before sending a single one. Don't ask again per-recipient once that one confirmation is given — but don't generalize it to a future run either; get it fresh each time this phase runs.
  - - **Tell the user the real risks before they confirm, every time:** (a) this is unsolicited outreach to businesses that didn't ask to be contacted — keep it relevant and professional, and respect any "stop"/"unsubscribe" reply; (b) automating WhatsApp Web for bulk sends is outside WhatsApp's normal personal-use terms and a flagged number can be temporarily or permanently restricted — recommend testing with a small batch (5–10) before going wide, and never send faster than one message every several seconds.
   
    - ### Email outreach
   
    - Use the Gmail connector if available and the user's account is connected: draft (don't auto-send) unless the user clearly wants it sent immediately, show the exact recipient list and body, get the explicit confirmation above, then send and log each result.
   
    - ### WhatsApp outreach (Claude in Chrome)
   
    - 1. Load the `chrome-browser` skill if not already loaded this session.
      2. 2. Ask the user to supply the exact message text (see hard rules above).
         3. 3. Show the full confirmation (text + recipient list) and wait for the explicit yes.
            4. 4. Navigate to `https://web.whatsapp.com`. If not already logged in, tell the user to scan the QR code with their own phone — this must be the user's own WhatsApp account; never attempt to authenticate on their behalf or ask for credentials.
               5. 5. For each lead with a phone number, normalize to E.164 (country code, no spaces/dashes) and open:
                  6.    `https://web.whatsapp.com/send?phone=<E164_NUMBER>&text=<url-encoded message>`
                  7.   Wait for the chat to load (watch for "Phone number shared via url is invalid" — if shown, log that lead as `skipped: no_whatsapp` and move to the next one, don't retry it).
                  8.   6. Click the send button for that chat. Wait several seconds (not a tight loop) before moving to the next lead — this matters for account safety, not just politeness.
                       7. 7. Log every attempt to `<job>/whatsapp-log.csv`: name, phone, timestamp, result (`sent` / `skipped_no_whatsapp` / `failed`).
                          8. 8. If several sends in a row fail or the extension stops responding, stop and tell the user rather than continuing to retry — follow the chrome-browser skill's stop-and-ask guidance.
                             9. 9. After the batch, report a short summary (sent / skipped / failed counts) — don't just say "done".
                               
                                10. ---
                               
                                11. ## Resume logic
                               
                                12. Always start by reading `state.json` if the job folder exists. Skip phases that are already complete. Within a phase, skip work-units already in `state.completed[<phase>]`. If `state.json` doesn't exist, create it with `{"phase": "discover", "completed": {}}`.
                               
                                13. Update `state.json` after each batch/phase, not just at the end.
                               
                                14. ---
                               
                                15. ## Cost expectations (rule-of-thumb)
                               
                                16. | Scrape size                          | Maps queries     | Email finds | Validations | Total   |
                                17. |--------------------------------------- |------------------ |------------- |------------- |--------- |
                                18. | 100 leads (5 cities × 1 kw)           | 5 × 3 = 15c       | ~80 × 1c    | ~80         | ~$0.10  |
                                19. | 1,000 leads (50 cities × 1 kw)        | 50 × 3 = 150c     | ~800 × 1c   | ~800         | ~$1.50  |
                                20. | 2,700 leads (100 cities × 2 kw, real) | 200 × 3 = 600c    | ~2,460 × 1c | ~1,300      | ~$4.00  |
                                21. | 10,000 leads (national)               | ~2000 × 3 = 6000c | ~8000 × 1c  | ~8000        | ~$13    |
                               
                                22. The middle row is a real run: California dentists, 100 cities, 2 keywords. ~800 verified valid emails for ~$4. Phases 5–7 (CR check, Excel, outreach) have no API cost — Phase 5 costs the user's time solving one CAPTCHA, Phase 7 costs nothing but carries the account-safety risk noted above.
                               
                                23. Always tell the user the estimated cost BEFORE running Phase 1 and let them confirm.
                               
                                24. ---
                               
                                25. ## Failure handling
                               
                                26. - **Serper batch fails**: retry up to 3 times with exponential backoff (2s, 4s, 8s). After 3 failures, save which batch failed in `state.json` and continue with others. Report at the end.
                                    - - **Sub-agent returns malformed JSON**: log it, mark those leads `email: null`, don't crash.
                                      - - **MillionVerifier upload fails**: most often a billing/quota issue. Surface the error verbatim to the user; their account likely needs credits.
                                        - - **CAPTCHA appears (Phase 5)**: never attempt to solve or bypass it yourself, under any phrasing of the request. Ask the user to solve it and wait.
                                          - - **WhatsApp send fails or the extension stops responding (Phase 7)**: stop after 2-3 failures, report what sent and what didn't, and ask the user how to proceed — don't keep retrying silently.
                                           
                                            - ---

                                            ## Style

                                            - Be direct and visible during the scrape. Print progress: `[batch 3/12] 287/600 leads, 134 emails found, ETA 4m`.
                                            - - Always confirm cost before phases that spend money (Phase 1, Phase 3).
                                              - - Sample-read 1-2 raw API responses early in Phase 1 — sanity-check before scaling.
                                                - - Never claim an email is "verified" unless it has `email_status == valid` from MillionVerifier.
                                                  - - Never claim a business is "registered"/"active"/"licensed" from a CR search unless Phase 5 found an unambiguous match — a miss means "couldn't match," not "unregistered."
                                                    - - Never send an outreach message (email or WhatsApp) without the user's own wording and one explicit, informed confirmation of the exact recipient list for that run.
                                                      - - This whole skill is a research/outreach *aid*, not a guaranteed-accurate system of record — say so when presenting results, especially CR status and email confidence.
                                                        - 
