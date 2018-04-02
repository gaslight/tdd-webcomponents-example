import Menu from "./menu.js";
import { expect } from '../node_modules/chai';

describe("basic test", () => {
  let sandbox;
  beforeEach(() => {
    sandbox = document.createElement("div", {id: "sandbox"})
    document.body.appendChild(sandbox);
    customElements.define('my-menu', Menu);
  });
  it("renders", () => {
    const myMenu = document.createElement("my-menu");
    sandbox.appendChild(myMenu);
    expect(document.querySelectorAll("my-menu").length).to.equal(1);
    expect(myMenu.textContent).to.equal("hi");
  })
})
