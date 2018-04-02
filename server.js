const express = require('express')
const next = require('next')
const racerBrowserChannel = require('racer-browserchannel')
const racer = require('racer')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const backend = racer.createBackend();

app.prepare().then(() => {
  const server = express()

  server
    .use(racerBrowserChannel(backend))
    .use(backend.modelMiddleware())

  server.get('/api/documents/:id', (req, res, next) => {
    const model = req.model
    const $doc = model.at('documents.' + req.params.id)
    $doc.subscribe(err => {
      if (err) return next(err)
      $doc.createNull({content: ''})
      model.ref('_page.doc', $doc.at('content'))
      model.bundle((err, bundle) => {
        if (err) return next(err)
        res.send(bundle)
      })
    });
  })

  server.get('*', handle)

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
