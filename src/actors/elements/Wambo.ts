/// <reference path="../Element.ts"/>
namespace phyxels {
    export class Wambo extends Element {
        private randomTick: number = 0;
        constructor(pos: ex.Vector) {
            super({
                name: "Wambo",
                color: ex.Color.fromHex("#ea9999"),
                pos: pos,
                collisionType: ex.CollisionType.Active
            });
            this.randomTick = 500 * (Math.random() * 10);
            this.addChild(new WamboAggregateState());
        }
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void {
        }
        onPreUpdate(engine: ex.Engine, delta: number): void {
            this.randomTick -= delta;
            this.inCollisionHandlerList = false;
            if (this.randomTick < 0) {
                this.randomTick = 500 * (Math.random() * 10);
                if (Math.abs(this.vel.magnitude) >= 0.1) {
                    return;
                }
                this.vel = ex.vec(this.vel.x, -(this.vel.y + 10));
                this.pos = ex.vec(Math.round(this.pos.x + ((Math.random() - 0.5) * 10)), Math.round(this.pos.y - 2));
            }
        }
    }
}