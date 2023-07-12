declare module 'tree-sitter-beancount' {
    const Paraser: any;
    export = Paraser;
}

declare module "*.scm" {
    const content: string;
    export = content;
}

declare module "*.wasm" {
    const content: Uint8Array;
    export = content;
}