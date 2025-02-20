/// <reference path="../Element.ts"/>
/// <reference path="./Factory/ElementFactory.ts"/>
namespace phyxels {
    export class Sand extends Element {

        private stack_side: number = 1;
        private stack_depht: number = 2;
        constructor(pos: ex.Vector) {
            super({
                name: "Sand",
                pos: pos,
                color: ColorFactory.getColor(ElementType.SAND),
                mass: 10,
                collisionType: ex.CollisionType.Active
            });
            this.addChild(new SandAggregateState());
        }
        //TODO: Change to child colider -> https://excaliburjs.com/docs/colliders#child-actor
        /*
            The problem:
            Coliission and physics bound are the same. Physicsbounds should stay 1x1
            Collision bounds left and right needs to be a bit larger 1.1 for example
         */
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void {

            if (!(other.owner instanceof Element)) {
                return;
            }

            if (side == ex.Side.Bottom) {
                this.checkPosition();
            }
        }
        onPreUpdate(engine: ex.Engine, delta: number): void {
            // this.pos = ex.vec(Math.round(this.pos.x * 10) / 10, Math.round(this.pos.y * 10) / 10);
        }

        private checkPosition() {
            // Check  -x and +x if empty move there
            let currentScene: ex.Scene | null = this.scene;
            if (currentScene == null) {
                return;
            }
            let checkY: number = Math.round(this.pos.y + this.stack_depht);
            let checkX: number[] = [Math.round(this.pos.x - this.stack_side), Math.round(this.pos.x + this.stack_side)];

            checkX.sort(() => Math.random() - 0.5);

            //Shuffel array
            for (let i = 0; i < checkX.length; i++) {

                if (currentScene.actors.filter(actor => actor.contains(checkX[i], checkY)).length == 0) {

                    let newPosX: number = this.pos.x + Math.sign(this.pos.x - checkX[i]);
                    let newPosY: number = this.pos.y;

                    this.pos = ex.vec(newPosX, newPosY);
                }
            }
        }
    }
}