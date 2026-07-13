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

async function convertOne(srcPath, outPath) {
  const ext = extname(srcPath).toLowerCase()
  const inputBuffer = await readFile(srcPath)

  const jpegBuffer =
    ext === '.heic'
      ? Buffer.from(await convert({ buffer: inputBuffer, format: 'JPEG', quality: 0.92 }))
      : inputBuffer

  await sharp(jpegBuffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(outPath)
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

    const outPath = join(outDir, outputFileNameFor(fileName))
    try {
      await convertOne(srcPath, outPath)
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
