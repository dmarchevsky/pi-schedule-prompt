# dev-flow

<!-- Operator-owned playbook. Regenerate with: flow init --draft -->

## global

```flow
defaultBranch = master
forge = github
```

## plan

- [ ] (ui) rendered mockups attached for every changed screen

<!-- what the plan must contain, UI expectations -->

## implement

```flow
setup = npm install
test = npm test
build = npm run build
```

```flow-check lint
npm run lint
```

```flow-check typecheck
npm run typecheck
```

<!-- optional tier-1: add a flow-check 'health' block once the app exposes a health endpoint -->

- [ ] (ui) app runs locally with real data; visual pass: no overflows or stray scrollbars

<!-- tier-3: standing guidance for this stage -->

## pre-release

<!-- e.g. review policy, docs expectations, who picks the version -->

```flow
versionFile = package.json
versionTag = v{version}
```

## release

```flow
merge = squash
releases = true
```

<!-- e.g. tag policy, who publishes artifacts -->

