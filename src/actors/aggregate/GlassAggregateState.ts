/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>

namespace phyxels {
    export class GlassAggregateState extends AggregateStateCollider {
        private parentElement: Element | undefined;

        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void {
            if (this.parent == null) {
                return;
            } else {
                try {
                    this.parentElement = this.parent as Element;
                } catch (error) {
                    console.error(error);
                    return;
                }
            }
            if (!(other.owner instanceof Element)) {
                return;
            }

            if (this.parentElement.inCollisionHandlerList) {
                return;
            }

            //Object changes on hit. Priority according the list.
            let otherElement: Element = other.owner;
            switch (otherElement.getType()) {
                case ElementType.WAMBO:
                    CollisionManager.add(this.parentElement, ElementType.WAMBO);
                    this.parentElement.inCollisionHandlerList = true;
            }
        }
    }
}