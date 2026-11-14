// food-picture-01 entry v2 (Node 22, standard library only).
//
// The picture itself lives in this repository as entry.png: a steaming
// bowl of tonkotsu ramen, photographed-style, with a tall glossy noodle
// lift on chopsticks, a jammy egg front and centre, glistening chashu
// and red chili oil swirled through a golden broth. This program is only
// the delivery step: it copies that file into the output directory the
// grader gives it, so the judge sees exactly the bytes in the
// repository. After the copy it checks the output is byte-for-byte the
// source, so a failed delivery is loud instead of silently graded. No
// network, no clock, no randomness — two runs write the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');
// Validate the picture before delivering it: it must be a JPEG (the
// competition takes a JPEG under a .png name) and under the 1 MiB cap,
// so a bad file fails loudly here instead of being graded silently.
const bytes = readFileSync(source);
if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
  throw new Error('entry.png is not a JPEG (missing FF D8 FF magic bytes)');
}
if (statSync(source).size > 1024 * 1024) {
  throw new Error('entry.png exceeds the 1 MiB size cap');
}
mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
if (!readFileSync(source).equals(readFileSync(target))) {
  throw new Error('entry.png was not copied byte-for-byte');
}
