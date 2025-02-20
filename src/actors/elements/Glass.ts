/// <reference path="../Element.ts"/>
namespace phyxels {
    export class Glass extends Element {
        constructor(pos: ex.Vector) {
            super({
                name: "Glass",
                pos: pos,
                color: ColorFactory.getColor(ElementType.GLASS),
                collisionType: ex.CollisionType.Fixed
            });
            this.addChild(new GlassAggregateState);
        }
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void {
        }
        onPreUpdate(engine: ex.Engine, delta: number): void {
        }
    }
}