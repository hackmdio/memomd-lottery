#! /usr/bin/env node

const Table = require('cli-table');

const fs = require('fs')
const path = require('path')

const emails = require('./emails')

let picked = []

for (let i = 0; i < 50; i++) {
  picked.push(emails.splice(Math.floor(Math.random() * emails.length), 1)[0])
}

function maskEmail (email) {
  const [username, host] = email.split('@')

  const displayEmail = `${maskString(2 / 3, '*', username)}@${maskString(2 / 3, '*', host)}`
  return displayEmail
}

function maskString (percentage, chr, str) {
  const maskLength = Math.floor(str.length * percentage)
  const maskStart = Math.floor((str.length - maskLength) / 2)
  return `${str.slice(0, maskStart)}${repeat('*', maskLength)}${str.slice(maskStart + maskLength)}`
}

function repeat (ch, count) {
  return Array(count).fill(ch).join('')
}

const maxLength = Math.max(...picked.map(mail => mail.length))
const table = new Table();

const COLUMN = 3
const grouped = picked.map(maskEmail).reduce((acc, cur, index) => {
  const lastArray = acc.slice(-1)[0]
  if (lastArray && lastArray.length < COLUMN) {
    acc[acc.length - 1].push(cur)
  } else {
    acc.push([cur])
  }
  return acc
}, [])

table.push(...grouped)
console.log(table.toString())

fs.writeFileSync(path.join(__dirname, './result.txt'), picked.join('\n'))
