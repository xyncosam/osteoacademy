#!/usr/bin/env node
import { readdir, mkdir, readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'
import convert from 'heic-convert'
import { isDuplicateFile, outputFileNameFor } from './lib/filename.mjs'

const MAX_WIDTH = 2400
const JPEG_QUALITY = 82

const SOURCES = [
  { srcDir: 'images', outDir: 'public/images' },
  { srcDir: 'logo', outDir: 'public/logo' },
]

async function convertOne(srcPath, outDir, fileName) {
  const ext = extname(srcPath).toLowerCase()
  const inputBuffer = await readFile(srcPath)

  const decodedBuffer =
    ext === '.heic'
      ? Buffer.from(await convert({ buffer: inputBuffer, format: 'JPEG', quality: 0.92 }))
      : inputBuffer

  // Logos/graphics can carry transparency; flattening them to JPEG would
  // silently bake in a solid background. Preserve alpha as PNG instead —
  // but only when a pixel is actually transparent, not just when an alpha
  // channel is structurally present (many exports carry one at 100% opacity).
  const { hasAlpha } = await sharp(decodedBuffer).metadata()
  const isActuallyTransparent =
    hasAlpha && (await sharp(decodedBuffer).stats()).channels[3]?.min < 255
  const baseName = outputFileNameFor(fileName).replace(/\.jpg$/, '')
  const pipeline = sharp(decodedBuffer).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true })

  if (isActuallyTransparent) {
    const outPath = join(outDir, `${baseName}.png`)
    await pipeline.png().toFile(outPath)
    return outPath
  }

  const outPath = join(outDir, `${baseName}.jpg`)
  await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(outPath)
  return outPath
}

async function processDir({ srcDir, outDir }) {
  await mkdir(outDir, { recursive: true })
  const entries = await readdir(srcDir)

  let converted = 0
  let skipped = 0
  let failed = 0

  for (const fileName of entries) {
    if (isDuplicateFile(fileName)) {
      skipped += 1
      continue
    }

    const srcPath = join(srcDir, fileName)
    const info = await stat(srcPath)
    if (!info.isFile()) continue

    try {
      const outPath = await convertOne(srcPath, outDir, fileName)
      converted += 1
      console.log(`converted ${fileName} -> ${outPath}`)
    } catch (error) {
      failed += 1
      console.error(`FAILED to convert ${fileName}: ${error.message}`)
    }
  }

  console.log(
    `${srcDir}: converted ${converted}, skipped ${skipped} duplicate(s), failed ${failed}`,
  )
}

for (const source of SOURCES) {
  await processDir(source)
}
