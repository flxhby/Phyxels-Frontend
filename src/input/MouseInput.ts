namespace phyxels {
    export class MouseInput {

        public static isPressed: boolean = false;
        public static init(): void {
            game.input.pointers.primary.on('down', (evt) => {
                MouseInput.isPressed = true;
            });
            game.input.pointers.primary.on('up', (evt) => {
                MouseInput.isPressed = false;
            }
            );

        }
    }

}