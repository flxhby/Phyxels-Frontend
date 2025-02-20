namespace phyxels {
    export class CollisionManager {
        //list with all collision events to handle
        private static collisionList: [Element, ElementType][] = [];
        private static frameRateMilliseconds: number = 1 / 15;

        public static handle(scene: ex.Scene): void {

            let startTime: number = performance.now();
            for (let i = 0; i < this.collisionList.length; i++) {
                if (game.currentFrameElapsedMs < CollisionManager.frameRateMilliseconds) {
                    return;
                }
                const [oldElement, newElementType]: [Element, ElementType] = this.collisionList[i];
                let newElement: Element | null = ElementFactory.create(newElementType, new ex.Vector(0, 0));
                if (newElement == null) {
                    console.warn(newElementType.toString() + " not found!, skipping");
                    continue;
                }
                newElement.pos = oldElement.pos.clone();
                newElement.angularVelocity = oldElement.angularVelocity;
                try {
                    oldElement.kill();
                } catch (error) {
                    console.warn(error);
                }
                this.collisionList.pop();
            }
        }
        public static add(oldElement: Element, newElement: ElementType) {
            this.collisionList.push([oldElement, newElement]);
        }
    }
}