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
