const withTM = require('next-transpile-modules')(['@tldraw/core'])

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
})
