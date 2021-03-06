import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { IStyleGroup } from "@paperbits/common/styles";
import { ButtonEditor } from "./buttonEditor";
import { ButtonHandlers } from "../buttonHandlers";

export class ButtonEditorModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("buttonEditor", ButtonEditor);
        injector.bindToCollection("widgetHandlers", ButtonHandlers, "buttonHandler");

        const styleGroup: IStyleGroup = { 
            key: "button",
            name: "components_button", 
            groupName: "Buttons", 
            selectorTemplate: `<button data-bind="css: classNames">Button</button>`,
            styleTemplate: `<button data-bind="stylePreview: variation.key">Button</button>`
        };
        injector.bindInstanceToCollection("styleGroups", styleGroup);
    }
}