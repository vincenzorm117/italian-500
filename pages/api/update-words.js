// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs';

export default function handler(req, res) {
  const wordsDB = JSON.parse(fs.readFileSync('/Users/vincenzo/playground/italian-500/pages/api/words/words-db.json'))
  wordsDB.currFile += 1
  
  fs.writeFileSync(`/Users/vincenzo/playground/italian-500/pages/api/words/words-${wordsDB.currFile}.txt`, req.body)
  fs.writeFileSync('/Users/vincenzo/playground/italian-500/pages/api/words/words-db.json', JSON.stringify(wordsDB))
  res.status(200).send()
}
