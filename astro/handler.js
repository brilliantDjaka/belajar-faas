const { readFile } = require('fs').promises

module.exports = async (event, context) => {
  let input = event.headers["x-api-key"]
  let key = await readFile("/var/openfaas/secrets/astro-key")
  if (key != input) {
    return context
      .status(401)
      .headers({ "Content-type": "text/plain" })
      .fail("Unauthorized")
  }
  return context
    .status(200)
    .headers({ "Content-type": "text/plain" })
    .succeed("OK")
}