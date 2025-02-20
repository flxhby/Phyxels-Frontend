/// <reference path="../Element.ts"/>
namespace phyxels {
    export class Lava extends Element {
        private stack_side: number = 1;
        private stack_depth: number = 0;
        constructor(pos: ex.Vector) {
            super({
                name: "Lava",
                color: ColorFactory.getColor(ElementType.LAVA),
                pos: pos,
                collisionType: ex.CollisionType.Active
            });
            this.addChild(new LavaAggregateState);
        }

        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void {
            if (!(other.owner instanceof Element)) {
                return;
            }

            let otherElement: Element = other.owner;

            if (otherElement.getType() != ElementType.LAVA) {
                return;
            }

            if (side == ex.Side.Bottom) {
                this.checkPosition();
            }
        }
        onPreUpdate(engine: ex.Engine, delta: number): void {

        }

        private checkPosition() {
            // Check  -x and +x if empty move there
            let currentScene: ex.Scene | null = this.scene;
            if (currentScene == null) {
                return;
            }
            let checkY: number = Math.round(this.pos.y + this.stack_depth);
            let checkX: number[] = [Math.round(this.pos.x - this.stack_side), Math.round(this.pos.x + this.stack_side)];

            checkX.sort(() => Math.random() - 0.5);

            //Shuffel array
            for (let i = 0; i < checkX.length; i++) {

                if (currentScene.actors.filter(actor => actor.contains(checkX[i], checkY)).length == 0) {
                    let newPosX: number = this.pos.x + Math.sign(this.pos.x - checkX[i]);
                    let newPosY: number = this.pos.y - 1;
                    if (currentScene.actors.filter(actor => actor.contains(newPosX, newPosY)).length > 0) {
                        continue;
                    }
                    this.pos = ex.vec(newPosX, newPosY);
                    return;
                }
            }
        }
    }
}