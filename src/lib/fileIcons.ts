const B = '/icons/files'

export const FILE_ICON_MAP: Record<string, string> = {
  // Web
  tsx:   `${B}/react_ts.svg`,
  jsx:   `${B}/react.svg`,
  ts:    `${B}/typescript.svg`,
  js:    `${B}/javascript.svg`,
  mjs:   `${B}/javascript.svg`,
  cjs:   `${B}/javascript.svg`,
  html:  `${B}/html.svg`,
  htm:   `${B}/html.svg`,
  css:   `${B}/css.svg`,
  scss:  `${B}/sass.svg`,
  sass:  `${B}/sass.svg`,
  json:  `${B}/json.svg`,
  jsonc: `${B}/json.svg`,
  md:    `${B}/markdown.svg`,
  mdx:   `${B}/markdown.svg`,
  pdf:   `${B}/pdf.svg`,
  vue:   `${B}/vue.svg`,
  svelte:`${B}/svelte.svg`,
  astro: `${B}/astro.svg`,
  // Config / markup
  yaml:  `${B}/yaml.svg`,
  yml:   `${B}/yaml.svg`,
  xml:   `${B}/xml.svg`,
  toml:  `${B}/toml.svg`,
  // Systems / compiled
  py:    `${B}/python.svg`,
  java:  `${B}/java.svg`,
  kt:    `${B}/kotlin.svg`,
  kts:   `${B}/kotlin.svg`,
  scala: `${B}/scala.svg`,
  c:     `${B}/c.svg`,
  h:     `${B}/c.svg`,
  cpp:   `${B}/cpp.svg`,
  cc:    `${B}/cpp.svg`,
  cxx:   `${B}/cpp.svg`,
  hpp:   `${B}/cpp.svg`,
  cs:    `${B}/csharp.svg`,
  go:    `${B}/go.svg`,
  rs:    `${B}/rust.svg`,
  rb:    `${B}/ruby.svg`,
  php:   `${B}/php.svg`,
  swift: `${B}/swift.svg`,
  dart:  `${B}/dart.svg`,
  r:     `${B}/r.svg`,
  lua:   `${B}/lua.svg`,
  pl:    `${B}/perl.svg`,
  pm:    `${B}/perl.svg`,
  ex:    `${B}/elixir.svg`,
  exs:   `${B}/elixir.svg`,
  erl:   `${B}/erlang.svg`,
  hrl:   `${B}/erlang.svg`,
  hs:    `${B}/haskell.svg`,
  lhs:   `${B}/haskell.svg`,
  clj:   `${B}/clojure.svg`,
  cljs:  `${B}/clojure.svg`,
  edn:   `${B}/clojure.svg`,
  ml:    `${B}/ocaml.svg`,
  mli:   `${B}/ocaml.svg`,
  nim:   `${B}/nim.svg`,
  zig:   `${B}/zig.svg`,
  wasm:  `${B}/webassembly.svg`,
  wat:   `${B}/webassembly.svg`,
  asm:   `${B}/assembly.svg`,
  s:     `${B}/assembly.svg`,
  // Scripts / shell
  sh:    `${B}/shellcheck.svg`,
  bash:  `${B}/shellcheck.svg`,
  zsh:   `${B}/shellcheck.svg`,
  fish:  `${B}/shellcheck.svg`,
  ps1:   `${B}/powershell.svg`,
  psm1:  `${B}/powershell.svg`,
  // Infra / config
  dockerfile: `${B}/docker.svg`,
  // Data / binary
  csv:   `${B}/table.svg`,
  tsv:   `${B}/table.svg`,
  sql:   `${B}/database.svg`,
  db:    `${B}/database.svg`,
  sqlite:`${B}/database.svg`,
  // Git
  gitignore:    `${B}/git.svg`,
  gitattributes:`${B}/git.svg`,
  // Media
  png:   `${B}/image.svg`,
  jpg:   `${B}/image.svg`,
  jpeg:  `${B}/image.svg`,
  gif:   `${B}/image.svg`,
  svg:   `${B}/image.svg`,
  webp:  `${B}/image.svg`,
  ico:   `${B}/image.svg`,
  mp4:   `${B}/video.svg`,
  mov:   `${B}/video.svg`,
  avi:   `${B}/video.svg`,
  mp3:   `${B}/audio.svg`,
  wav:   `${B}/audio.svg`,
  ogg:   `${B}/audio.svg`,
  // Archives
  zip:   `${B}/zip.svg`,
  tar:   `${B}/zip.svg`,
  gz:    `${B}/zip.svg`,
  rar:   `${B}/zip.svg`,
  // Lock / misc
  lock:  `${B}/lock.svg`,
  exe:   `${B}/exe.svg`,
  // Frameworks
  graphql:`${B}/graphql.svg`,
  gql:   `${B}/graphql.svg`,
  prisma:`${B}/prisma.svg`,
  angular:`${B}/angular.svg`,
  njk:   `${B}/nunjucks.svg`,
}

export function iconSrcForFile(name: string): string {
  // Check full filename first (e.g. "Dockerfile", ".gitignore")
  const lower = name.toLowerCase()
  if (lower === 'dockerfile') return FILE_ICON_MAP['dockerfile']
  if (lower === '.gitignore' || lower === '.gitattributes') return FILE_ICON_MAP['gitignore']

  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return FILE_ICON_MAP[ext] ?? '/icons/files/file.svg'
}
