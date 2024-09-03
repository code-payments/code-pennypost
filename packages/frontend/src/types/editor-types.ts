export interface CoreOptions {
    activeButtonClass?: string;
    allowMultiParagraphSelection?: boolean;
    buttonLabels?: string | boolean;
    contentWindow?: Window;
    delay?: number;
    disableReturn?: boolean;
    disableDoubleReturn?: boolean;
    disableExtraSpaces?: boolean;
    disableEditing?: boolean;
    elementsContainer?: HTMLElement;
    extensions?: any;
    ownerDocument?: Document;
    spellcheck?: boolean;
    targetBlank?: boolean;
    toolbar?: ToolbarOptions;
    anchorPreview?: AnchorPreviewOptions | boolean;
    placeholder?: PlaceholderOptions | boolean;
    anchor?: AnchorFormOptions;
    paste?: PasteOptions;
    keyboardCommands?: KeyboardCommandsOptions | boolean;
    autoLink?: boolean;
    imageDragging?: boolean;
}

export interface ToolbarOptions {
    align?: string;
    allowMultiParagraphSelection?: boolean;
    buttons?: string[];
    diffLeft?: number;
    diffTop?: number;
    firstButtonClass?: string;
    lastButtonClass?: string;
    standardizeSelectionStart?: boolean;
    static?: boolean;
    sticky?: boolean;
    stickyTopOffset?: number;
    updateOnEmptySelection?: boolean;
    relativeContainer?: Node;
}

export interface AnchorPreviewOptions {
    hideDelay?: number;
    previewValueSelector?: string;
    showWhenToolbarIsVisible?: boolean;
    showOnEmptyLinks?: boolean;
}

export interface PlaceholderOptions {
    text?: string;
    hideOnClick?: boolean;
}

export interface AnchorFormOptions {
    customClassOption?: string;
    customClassOptionText?: string;
    linkValidation?: boolean;
    placeholderText?: string;
    targetCheckbox?: boolean;
    targetCheckboxText?: string;
}

export interface PasteOptions {
    forcePlainText?: boolean;
    cleanPastedHTML?: boolean;
    preCleanReplacements?: any[],
    cleanReplacements?: any[],
    cleanAttrs?: string[];
    cleanTags?: string[];
    unwrapTags?: string[],
}

export interface KeyboardCommandsOptions {
    commands?: KeyboardCommandOptions[];
}

export interface KeyboardCommandOptions {
    command: string;
    key: string;
    meta: boolean;
    shift: boolean;
    alt: boolean;
}

export interface CreateLinkOptions {
    value: string;
    target?: string;
    buttonClass?: string;
}

export interface PasteHTMLOptions {
    cleanAttrs?: string[];
    cleanTags?: string[];
    unwrapTags?: string[];
}

export type elementType = string | HTMLElement | HTMLElement[] | NodeList | NodeListOf<Element> | HTMLCollection;
export type selectionObject = { start: number, end: number };