SSR

Server-Side Render

---

React -> generate -> app.js file

Then -> you open the browser:

<html>
  <head>
    <script src="app.js" defer></script>
  </head>
  <body>
    <main id="app"></main>
  </body>
</html>

The browser is blank.... until it downloads the app.js...
And then - app.js file will invoke a function which will populate the DOM content.

---

## (Client Side Rendering)

---

SPA - Singe Page Application

SSR ->

Render/Parse each of your pages' HTML content... and stroe it on the server (in a file, in a db, in cache)
Then, when the URL opened -> the related/relevant file to be loaded
/
/sign-in
/sign-up
/about-us
/contact-us
