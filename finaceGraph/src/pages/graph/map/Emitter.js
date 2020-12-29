import Base from './Base';

export default class Emitter extends Base {
  constructor() {
    super(
      {
        __target__: document.createDocumentFragment(),
      },
      ...arguments
    );
  }
  on(type, listener) {
    this.__target__.addEventListener(type, e => listener(...e.detail));
  }
  emit(type, ...args) {
    this.__target__.dispatchEvent(
      new CustomEvent(type, {
        detail: args,
      })
    );
  }
}
