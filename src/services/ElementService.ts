namespace phyxels {

    export class ElementService {
        private saveService: SaveService;
        private createDownloadableFile: boolean;
        private game: ex.Engine;

        constructor(saveService: SaveService, game: ex.Engine, createDownloadableFile: boolean = false) {
            this.saveService = saveService;
            this.game = game;
            this.createDownloadableFile = createDownloadableFile;
        }

        public async saveElements(name: string): Promise<void> {
            const elements = this.getElements();
            const saveState: SaveState = {
                save: JSON.stringify(elements),
                name: name || 'My Save',
                date: new Date().toISOString()
            };

            if (this.isWambo(name)) {
                console.log(WAMBO_ASCII);
            }
            

            if (this.createDownloadableFile) {
                const jsonString = JSON.stringify(saveState, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'saveState.json';
                a.click();
                URL.revokeObjectURL(url);
            }

            await this.saveService.saveGameState(saveState);
        }

        public async updateElements(id: string, name: string): Promise<void> {
            const elements = this.getElements();
            const saveState: SaveState = {
                _id: id,
                save: JSON.stringify(elements),
                name: name || 'My Save',
                date: new Date().toISOString()
            };

            await this.saveService.updateGameState(id, saveState);
        }

        public async deleteElements(id: string): Promise<void> {
            await this.saveService.deleteGameState(id);
        }

        public async loadAllSaves(): Promise<SaveState[]> {
            return await this.saveService.loadAllGameStates();
        }

        public async loadSave(id: string): Promise<SaveState> {
            return await this.saveService.loadGameState(id);
        }

        private getElements(): SaveActorArgs[] {
            const elements: SaveActorArgs[] = [];
            this.game.currentScene.actors.forEach(actor => {
                if (actor instanceof Element) {
                    elements.push({
                        type: actor.getType(),
                        x: actor.pos.x,
                        y: actor.pos.y
                    });
                }
            });
            return elements;
        }
        public isWambo(name: string): boolean {
            return name.toLowerCase() === 'wambo';
        }

        public async loadElements(id: string): Promise<void> {
            const saveState = await this.loadSave(id);
            const elements: SaveActorArgs[] = JSON.parse(saveState.save);

            this.resetCanvas();
                let ground = new ex.Actor({
                    pos: game.screenToWorldCoordinates(ex.vec(Config.canvas.width / Config.grid.size / 2, Config.canvas.height / Config.grid.size + 0.5)),
                    width: Config.canvas.width / Config.grid.size,
                    height: 1,
                    color: ex.Color.Gray,
                    collisionType: ex.CollisionType.Fixed
                });
                game.add(ground);

            elements.forEach(element => {
                if (element.x !== undefined && element.y !== undefined) {
                    const worldPos = new ex.Vector(element.x, element.y);
                    ElementFactory.create(element.type, worldPos);
                } else {
                    console.error('Invalid element position:', element);
                }
            });
        }

        public resetCanvas(): void {
            this.game.currentScene.clear();

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

        public async loadElementsFromFile(file: File): Promise<void> {
            const reader = new FileReader();
            reader.onload = (event) => {
                const json = event.target?.result as string;
                try {
                    const saveState: SaveState = JSON.parse(json);
                    const elements: SaveActorArgs[] = JSON.parse(saveState.save);
        
                    this.resetCanvas();
        
                    elements.forEach(element => {
                        if (element.x !== undefined && element.y !== undefined) {
                            const worldPos = new ex.Vector(element.x, element.y);
                            ElementFactory.create(element.type, worldPos);
                            let ground = new ex.Actor({
                                pos: game.screenToWorldCoordinates(ex.vec(Config.canvas.width / Config.grid.size / 2, Config.canvas.height / Config.grid.size + 0.5)),
                                width: Config.canvas.width / Config.grid.size,
                                height: 1,
                                color: ex.Color.Gray,
                                collisionType: ex.CollisionType.Fixed
                            });
                            game.add(ground);
                        } else {
                            console.error('Invalid element position:', element);
                        }
                    });
                } catch (error) {
                    console.error('Failed to parse JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    }
}