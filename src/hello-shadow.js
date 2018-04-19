class HelloShadow extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
<style>
  .shadow {
    text-shadow: 5px 5px gray;
  }
</style>
<h1 class="shadow">This has a shadow but ain't red</h1>
    `;
  }
}

export default HelloShadow;
