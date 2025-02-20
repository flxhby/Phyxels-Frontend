declare namespace phyxels {
    export class Config {
        static canvas: Canvas;
        static grid: Grid;
        static readonly BACKEND_URL = "http://192.168.10.203:8080";
    }
    interface Canvas {
        width: number;
        height: number;
        name: string;
        color: string;
    }
    interface Grid {
        size: number;
    }
    export {};
}
declare namespace phyxels {
    type ElementArgs = ex.ActorArgs & {
        mass?: number;
        friction?: number;
    };
}
declare namespace phyxels {
    abstract class Element extends ex.Actor {
        private _inCollisionHandlerList;
        constructor(config?: ElementArgs);
        private setConfigs;
        getType(): ElementType;
        abstract onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
        onPreUpdate(engine: ex.Engine, delta: number): void;
        get inCollisionHandlerList(): boolean;
        set inCollisionHandlerList(value: boolean);
    }
}
declare namespace phyxels {
    class ElementFactory {
        static create(element: ElementType, pos: ex.Vector): Element | null;
    }
}
declare namespace phyxels {
    class Sand extends Element {
        private stack_side;
        private stack_depht;
        constructor(pos: ex.Vector);
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
        onPreUpdate(engine: ex.Engine, delta: number): void;
        private checkPosition;
    }
}
declare namespace phyxels {
    class Stone extends Element {
        constructor(pos: ex.Vector);
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
        onPreUpdate(engine: ex.Engine, delta: number): void;
    }
}
declare namespace phyxels {
    class Lava extends Element {
        private stack_side;
        private stack_depth;
        constructor(pos: ex.Vector);
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
        onPreUpdate(engine: ex.Engine, delta: number): void;
        private checkPosition;
    }
}
declare namespace phyxels {
    class Sandbox extends ex.Scene {
        constructor();
        private activActors;
        onPreUpdate(engine: ex.Engine, delta: number): void;
        onPostUpdate(engine: ex.Engine, delta: number): void;
        onInitialize(engine: ex.Engine): void;
        /**
         * Adds an hitbox, to stop Elements to fall down
         */
        private addGroundCollision;
    }
}
declare namespace phyxels {
    class MouseInput {
        static isPressed: boolean;
        static init(): void;
    }
}
declare namespace phyxels {
    class HttpService {
        private baseUrl;
        constructor(baseUrl: string);
        get(endpoint: string): Promise<any>;
        post(endpoint: string, data: any): Promise<any>;
        delete(endpoint: string): Promise<void>;
    }
}
declare namespace phyxels {
    class SaveService {
        private httpService;
        constructor(httpService: HttpService);
        saveGameState(saveState: SaveState): Promise<void>;
        updateGameState(id: string, saveState: SaveState): Promise<void>;
        loadGameState(id: string): Promise<SaveState>;
        loadAllGameStates(): Promise<SaveState[]>;
        deleteGameState(id: string): Promise<void>;
    }
}
declare namespace phyxels {
    class ElementService {
        private saveService;
        private createDownloadableFile;
        private game;
        constructor(saveService: SaveService, game: ex.Engine, createDownloadableFile?: boolean);
        saveElements(name: string): Promise<void>;
        updateElements(id: string, name: string): Promise<void>;
        deleteElements(id: string): Promise<void>;
        loadAllSaves(): Promise<SaveState[]>;
        loadSave(id: string): Promise<SaveState>;
        private getElements;
        isWambo(name: string): boolean;
        loadElements(id: string): Promise<void>;
        resetCanvas(): void;
        loadElementsFromFile(file: File): Promise<void>;
    }
}
declare namespace phyxels {
    enum Theme {
        LIGHT = "light",
        DARK = "dark"
    }
    class ThemeService {
        private static readonly THEME_KEY;
        private static readonly TRANSITION_DURATION;
        private static currentTheme;
        private static moonSprite;
        private static sunSprite;
        static init(game: ex.Engine): void;
        static toggleTheme(): void;
        private static setInitialTheme;
        private static listenToSystemChanges;
        private static createThemeSprites;
        private static applyTheme;
    }
}
declare namespace phyxels {
    enum ElementType {
        "SAND" = 0,
        "STONE" = 1,
        "LAVA" = 2,
        "GLASS" = 3,
        "WAMBO" = 4
    }
}
declare namespace phyxels {
    class ElementSelector {
        private static selector;
        static init(): void;
        static get(): ElementType;
        private static setOptions;
    }
}
declare namespace phyxels {
    class UiLogic {
        static init(): void;
    }
}
declare namespace phyxels {
    class ColorFactory {
        private static colors;
        static loadColors(): void;
        private static interpolateColor;
        static getRandomColorFrom(minColor: string, maxColor: string): ex.Color;
        static getColorRangeFrom(elementType: ElementType): {
            min: string;
            max: string;
        };
        static getColor(elementType: ElementType): ex.Color;
    }
}
declare namespace phyxels {
    const game: ex.Engine<any>;
}
declare namespace phyxels {
    class CollisionManager {
        private static collisionList;
        private static frameRateMilliseconds;
        static handle(scene: ex.Scene): void;
        static add(oldElement: Element, newElement: ElementType): void;
    }
}
declare namespace phyxels {
    class AggregateStateCollider extends ex.Actor {
        constructor();
    }
}
declare namespace phyxels {
    class GlassAggregateState extends AggregateStateCollider {
        private parentElement;
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
    }
}
declare namespace phyxels {
    class LavaAggregateState extends AggregateStateCollider {
        private parentElement;
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
    }
}
declare namespace phyxels {
    class SandAggregateState extends AggregateStateCollider {
        private parentElement;
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
    }
}
declare namespace phyxels {
    class StoneAggregateState extends AggregateStateCollider {
        private parentElement;
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
    }
}
declare namespace phyxels {
    class WamboAggregateState extends AggregateStateCollider {
    }
}
declare namespace phyxels {
    class Glass extends Element {
        constructor(pos: ex.Vector);
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
        onPreUpdate(engine: ex.Engine, delta: number): void;
    }
}
declare namespace phyxels {
    class Wambo extends Element {
        private randomTick;
        constructor(pos: ex.Vector);
        onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void;
        onPreUpdate(engine: ex.Engine, delta: number): void;
    }
}
declare namespace phyxels {
    const WAMBO_ASCII = "\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2584\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2584\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2580\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500   \n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2588\u2588\u2588\u2588\u2592\u2588\u2588\u2588\u2588\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2500\u2500\u2500\u2500\u2592\u2592\u2500\u2500\u2500\u2500\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2500\u2588\u2588\u2500\u2592\u2592\u2500\u2588\u2588\u2500\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2500\u2500\u2500\u2500\u2592\u2592\u2500\u2500\u2500\u2500\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2592\u2592\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2592\u2592\u2588\u2588\u2500\u2500\u2500\n                \u2500\u2588\u2588\u2592\u2592\u2592\u2592\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2592\u2592\u2592\u2592\u2588\u2588\u2500\n                \u2588\u2592\u2592\u2592\u2592\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2592\u2592\u2592\u2592\u2588\n                \u2588\u2592\u2592\u2592\u2592\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2592\u2592\u2592\u2592\u2588\n                \u2588\u2592\u2592\u2588\u2588\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2588\u2588\u2592\u2592\u2588\n                \u2580\u2588\u2588\u2588\u2588\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2593\u2593\u2593\u2593\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2588\u2588\u2588\u2588\u2580\n                \u2500\u2500\u2588\u258C\u258C\u258C\u258C\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592\u258C\u258C\u258C\u2588\u2588\u2588\u2500\u2500\n                \u2500\u2500\u2500\u2588\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u2588\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2588\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u2588\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2580\u2588\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u258C\u2588\u2588\u2580\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2588\u258C\u258C\u258C\u258C\u258C\u258C\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u258C\u258C\u258C\u258C\u258C\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2588\u2588\u2592\u2592\u2588\u2588\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n                \u2500\u2500\u2500\u2500\u2500\u2500\u2580\u2588\u2588\u2588\u2588\u2580\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2580\u2588\u2588\u2588\u2588\u2580\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n            ";
}
declare namespace phyxels {
    type SaveActorArgs = ex.ActorArgs & {
        type: number;
        x?: number;
        y?: number;
    };
}
interface SaveState {
    _id?: string;
    _rev?: string;
    save: string;
    name: string;
    date: string;
}
declare namespace phyxels {
    class Loading {
    }
}
