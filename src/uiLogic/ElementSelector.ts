/// <reference path="../actors/ElementType.ts"/>
namespace phyxels {
    export class ElementSelector {
        private static selector: HTMLSelectElement;

        public static init(): void {
            let htmlElement: HTMLSelectElement | null = document.getElementById("elementSelector") as HTMLSelectElement;
            if (htmlElement != null) {
                ElementSelector.selector = htmlElement;
                ElementSelector.setOptions();
                return;
            }
            console.error("Can not find the Element in the HTML Doc in " + this);
        }

        public static get(): ElementType {
            let selectionID = ElementSelector.selector.selectedIndex;
            let selectedElement = ElementType[selectionID];
            if (selectedElement == "") {
                return 0
            }
            return selectionID;
        }

        private static setOptions(): void {
            let options = ElementSelector.selector.options;

            for (let i = 0; i < Object.keys(ElementType).length / 2; i++) {
                let optionElement: HTMLOptionElement = document.createElement("option");

                optionElement.value = ElementType[i];
                optionElement.text = ElementType[i];
                options.add(optionElement, i);
            }
        }
    }
}