const DUPLICATE_SUFFIX = /\(\d+\)(?=\.[^.]+$)/

export function isDuplicateFile(fileName) {
  return DUPLICATE_SUFFIX.test(fileName)
}

export function outputFileNameFor(sourceFileName) {
  const dotIndex = sourceFileName.lastIndexOf('.')
  const base = sourceFileName.slice(0, dotIndex)
  const normalized = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${normalized}.jpg`
}
