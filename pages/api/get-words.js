// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs';

export default function handler(req, res) {
  const wordsDB = fs.readFileSync('/Users/vincenzo/playground/italian-500/pages/api/words/words-db.json')
  const fileNum = JSON.parse(wordsDB.toString()).currFile
  const words = fs.readFileSync(`/Users/vincenzo/playground/italian-500/pages/api/words/words-${fileNum}.txt`)
  res.status(200).send(words)
}
