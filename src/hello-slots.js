class HelloSlots extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      Hi there, <slot></slot>!
    `;
  }
}

export default HelloSlots;
