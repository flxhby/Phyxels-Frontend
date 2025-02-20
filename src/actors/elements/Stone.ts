/// <reference path="../Element.ts"/>
namespace phyxels {
    export class Stone extends Element {
        constructor(pos: ex.Vector) {
            super({
                name: "Stone",
                pos: pos,
                color: ColorFactory.getColor(ElementType.STONE),
                collisionType: ex.CollisionType.Fixed
            });
            this.addChild(new StoneAggregateState);
        }

        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void {

        }
        onPreUpdate(engine: ex.Engine, delta: number): void {

        }
    }
}