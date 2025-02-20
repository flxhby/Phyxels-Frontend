namespace phyxels {
    export class AggregateStateCollider extends ex.Actor {
        constructor() {
            super({
                name: "collider"
            });
            this.collider.useBoxCollider(1.2, 1.1);
        }
    }
}