'use strict'

module.exports = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Test</title>
    <style>
      html {
        font-family: sans-serif;
      }
    </style>
  </head>
  <body>
    <!-- comment -->
    <header>
      <h1>Acme Ltd</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/contact-us">Contact Us</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section>
        <h1>Welcome to Acme Ltd</h1>
        <h2>Purveyors of fine goods</h2>
        <p>Lorem ipsum etc.</p>
      </section>
    </main>
    <footer>
      <p><small>© 2017 Acme Ltd</small></p>
    </footer>
    <script>
      (function(){
        'use strict'

        window.alert( 'Welcome to Acme Ltd' )
      })()
    </script>
  </body>
</html>
`