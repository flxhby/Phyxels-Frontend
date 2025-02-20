namespace phyxels {
    export class Sandbox extends ex.Scene {
        constructor() {
            super();
        }
        private activActors:number = 0;

        onPreUpdate(engine: ex.Engine, delta: number): void {
            CollisionManager.handle(this);
            if (MouseInput.isPressed) {
                let gamePos = game.screenToWorldCoordinates(game.input.pointers.primary.lastScreenPos);
                gamePos.x = Math.round(gamePos.x);
                gamePos.y = Math.round(gamePos.y);
                if(this.actors.filter(actor => actor.contains(gamePos.x, gamePos.y)).length == 0){
                    ElementFactory.create(ElementSelector.get(),gamePos);
                }
            }
        }

        onPostUpdate(engine: ex.Engine, delta: number): void {
        }

        onInitialize(engine: ex.Engine): void {
            this.addGroundCollision();
        }
        /**
         * Adds an hitbox, to stop Elements to fall down
         */
        private addGroundCollision() {
            let ground: ex.Actor;
            ground = new ex.Actor({
                pos: game.screenToWorldCoordinates(ex.vec(Config.canvas.width / Config.grid.size / 2, Config.canvas.height / Config.grid.size + 0.5)),
                width: Config.canvas.width / Config.grid.size,
                height: 1,
                color: ex.Color.Gray,
                collisionType: ex.CollisionType.Fixed
            });
            game.add(ground);
        }
    }
}