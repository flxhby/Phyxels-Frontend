namespace phyxels {
    export class ElementFactory {
        public static create(element: ElementType, pos: ex.Vector): Element | null {
            let el: Element;

            switch (element) {
                case ElementType.LAVA:
                    el = new Lava(pos);
                    break;
                case ElementType.SAND:
                    el = new Sand(pos);
                    break;
                case ElementType.STONE:
                    el = new Stone(pos);
                    break;
                case ElementType.GLASS:
                    el = new Glass(pos);
                    break;
                case ElementType.WAMBO:
                    el = new Wambo(pos)
                    break;
                default:
                    console.error("Element of type " + element + " not found!");
                    return null;
            }
            return el;
        }
    }
}