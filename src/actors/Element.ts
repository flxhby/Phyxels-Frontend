/// <reference path="../interfaces/ElementArgs.ts"/>
namespace phyxels {
    export abstract class Element extends ex.Actor {
        private _inCollisionHandlerList: boolean = false;

        constructor(config?: ElementArgs) {
            if (config == undefined) {
                config = {
                    width: 1,
                    height: 1

                };
            } else {
                config.width = 1;
                config.height = 1;
            }
            super(config);
            this.setConfigs(config);
            game.add(this);

            ex.Debug.drawBounds(this.collider.bounds, { color: ex.Color.Yellow });
        }
        private setConfigs(config: ElementArgs): void {
            if (config.mass == undefined) {
                config.mass = 1;
            }
            if (config.friction == undefined) {
                config.friction = 0;
            }
            this.body.mass = config.mass;
            this.body.canSleep = true;
            this.body.limitDegreeOfFreedom = [ex.DegreeOfFreedom.Rotation];
            this.body.friction = config.friction;
            this.collider.useBoxCollider(0.9, 1, new ex.Vector(this.height / 2, this.width / 2));
        }

        public getType(): ElementType {
            return ElementType[this.name.toUpperCase() as keyof typeof ElementType];
        }

        abstract onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
        onPreUpdate(engine: ex.Engine, delta: number): void {

        }

        public get inCollisionHandlerList(): boolean {
            return this._inCollisionHandlerList;
        }

        public set inCollisionHandlerList(value: boolean) {
            this._inCollisionHandlerList = value;
        }
    }
}