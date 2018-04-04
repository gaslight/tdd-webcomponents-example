I've been getting really excited about web components, in particular custom elements. As I've been building more custom elements, one of the things I wanted to figure out is how to
test drive them. While there are many great javascript test frameworks, they are often
tied to a particular web framework. Further adding to the challenge, newer browser apis
such as Custom Elements are not always supported by fake DOM implementations used by
test frameworks. I still wanted my tests to be fast and run on the command line, but
it seemed like running tests in a real web browser was necessary to make sure my
custom elements worked with the most up to date browser provided apis.

After a good deal of experimenting, I've come up with an approach that works. I'll
walk through how to test custom elements in this post, but if you're impatient you
can go straight to the codez.

## Enter puppeteer

Puppeteer is a project to provide a nice api around headless chrome. What this is
means is we can have fast, command line tests that run in a real browser. This is
a huge win: in the past I've ofter relied on fake DOM implementations for tests
only to run into inconsistencies at some point.

There are a couple different libraries to drive js unit testing frameworks through
puppeteer, in particular I spent time with [mocha-puppeteer] and [mocha-headless-chrome].
mocha-puppeteer requires a little less work to set up your tests, but it ties you
to a particular javascript bundler. Because I wanted to stay neutral on this I went
with mocha-headless-chrome in the end.

## How to

Let's walk through, step by step, how to test drive a simple custom element. You
can start with an empty directory and do a `yarn init` or `npm init` to create
your package.json file. Next, you'll want to add `mocha`, `chai`, `mocha-headless-chrome`.
I'm using webpack in this example so I also added `webpack` and `webpack-cli`.

Next, we'll write a test for a `hello-world` custom element.

```javascript
import HelloWorld from "./hello-world.js";
import { expect } from 'chai';

describe("basic test", () => {
  let sandbox;

  before(() => {
    sandbox = document.createElement("div", {id: "sandbox"});
    customElements.define('hello-world', HelloWorld);
  });

  beforeEach(() => {
    document.body.appendChild(sandbox);
  });

  it("renders", () => {
    const helloWorld = document.createElement("hello-world");
    sandbox.appendChild(helloWorld);
    expect(document.querySelectorAll("hello-world").length).to.equal(1);
    expect(helloWorld.textContent).to.equal("Hello, world!");
  })

  afterEach(() => {
    document.body.removeChild(sandbox);
  });
})
```

In this test, we are importing a module containing our custom element. In the
`beforeEach` method I'm creating a "sandbox" element to hold my custom element.
Since the DOM is effectively one big global variable, it's a good habit to isolate
any DOM manipulations to an element created before and destroyed after each test
is run. I call this element the sandbox, and add and remove it in `beforeEach`
and `afterEach` respectively.

I register the custom element in `before` because this only needs to happen once.
The test itself is pretty straightforward. I'm creating a `hello-world` element
and checking to see that it renders as I expect.

Here's what the hello-world custom element code looks like:

```javascript
class HelloWorld extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "Hello, world!";
  }
}

export default HelloWorld;
```

To run the test, I've got a couple more files I need to create. First I'll need a
webpack config file for my tests:

```javascript
const path = require('path');

module.exports = {
  entry: './src/hello-world.spec.js',
  mode: 'development',
  output: {
    filename: 'tests.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

In this case, I'm just reading in my single test file and producing a `tests.js`
bundle. If I had more tests, I would probably have a single entry file where
I import each test.

Next I'll need a test.html file for mocha-headless-chrome to load:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Mocha Tests</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="node_modules/mocha/mocha.css">
    </head>
    <body>
        <div id="mocha"></div>
        <script src="node_modules/mocha/mocha.js"></script>
        <script src="node_modules/chai/chai.js"></script>
        <script>mocha.setup('bdd');</script>
        <script src="dist/tests.js">
        </script>
        <script>mocha.run();</script>
    </body>
</html>
```

This file is a bit tedious to write, hopefully a solution will emerge where
we can skip this step, but for now it's what needed to make things work.

Last, and not least, we are ready to add a couple scripts to our package.json:

```json
"scripts": {
  "pretest": "webpack --config test.config.js",
  "test": "mocha-headless-chrome -f test.html"
}
```

From here, we can do npm test and our tests will run (and pass) in puppeteer. Yay!
