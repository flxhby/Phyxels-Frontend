"use strict";
`
                ───────────────▄████████▄────────
                ──────────────██▒▒▒▒▒▒▒▒██───────
                ─────────────██▒▒▒▒▒▒▒▒▒██───────
                ────────────██▒▒▒▒▒▒▒▒▒▒██───────
                ───────────██▒▒▒▒▒▒▒▒▒██▀────────
                ──────────██▒▒▒▒▒▒▒▒▒▒██─────────   
                ─────────██▒▒▒▒▒▒▒▒▒▒▒██─────────
                ────────██▒▒████▒████▒██─────────
                ────────██▒▒▒▒▒▒▒▒▒▒▒▒██─────────
                ────────██▒────▒▒────▒██─────────
                ────────██▒─██─▒▒─██─▒██─────────
                ────────██▒────▒▒────▒██─────────
                ────────██▒▒▒▒▒▒▒▒▒▒▒▒██─────────
                ───────██▒▒▒████████▒▒▒▒██───────
                ─────██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██─────
                ───██▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒██───
                ─██▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒██─
                █▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒█
                █▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒█
                █▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▒▒█
                ▀████▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒▒▒▒▒████▀
                ──█▌▌▌▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌▌▌███──
                ───█▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌█────
                ───█▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌█────
                ────▀█▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌██▀─────
                ─────█▌▌▌▌▌▌████████▌▌▌▌▌██──────
                ──────██▒▒██────────██▒▒██───────
                ──────▀████▀────────▀████▀───────
            `;
var phyxels;
(function (phyxels) {
    class Config {
        static canvas = { width: 800, height: 500, name: "game", color: "#141414" };
        static grid = { size: 10 };
        static BACKEND_URL = 'http://192.168.10.203:8080';
    }
    phyxels.Config = Config;
})(phyxels || (phyxels = {}));
/// <reference path="../interfaces/ElementArgs.ts"/>
var phyxels;
/// <reference path="../interfaces/ElementArgs.ts"/>
(function (phyxels) {
    class Element extends ex.Actor {
        _inCollisionHandlerList = false;
        constructor(config) {
            if (config == undefined) {
                config = {
                    width: 1,
                    height: 1
                };
            }
            else {
                config.width = 1;
                config.height = 1;
            }
            super(config);
            this.setConfigs(config);
            phyxels.game.add(this);
            ex.Debug.drawBounds(this.collider.bounds, { color: ex.Color.Yellow });
        }
        setConfigs(config) {
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
        getType() {
            return phyxels.ElementType[this.name.toUpperCase()];
        }
        onPreUpdate(engine, delta) {
        }
        get inCollisionHandlerList() {
            return this._inCollisionHandlerList;
        }
        set inCollisionHandlerList(value) {
            this._inCollisionHandlerList = value;
        }
    }
    phyxels.Element = Element;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class ElementFactory {
        static create(element, pos) {
            let el;
            switch (element) {
                case phyxels.ElementType.LAVA:
                    el = new phyxels.Lava(pos);
                    break;
                case phyxels.ElementType.SAND:
                    el = new phyxels.Sand(pos);
                    break;
                case phyxels.ElementType.STONE:
                    el = new phyxels.Stone(pos);
                    break;
                case phyxels.ElementType.GLASS:
                    el = new phyxels.Glass(pos);
                    break;
                case phyxels.ElementType.WAMBO:
                    el = new phyxels.Wambo(pos);
                    break;
                default:
                    console.error("Element of type " + element + " not found!");
                    return null;
            }
            return el;
        }
    }
    phyxels.ElementFactory = ElementFactory;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
/// <reference path="./Factory/ElementFactory.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
/// <reference path="./Factory/ElementFactory.ts"/>
(function (phyxels) {
    class Sand extends phyxels.Element {
        stack_side = 1;
        stack_depht = 2;
        constructor(pos) {
            super({
                name: "Sand",
                pos: pos,
                color: phyxels.ColorFactory.getColor(phyxels.ElementType.SAND),
                mass: 10,
                collisionType: ex.CollisionType.Active
            });
            this.addChild(new phyxels.SandAggregateState());
        }
        //TODO: Change to child colider -> https://excaliburjs.com/docs/colliders#child-actor
        /*
            The problem:
            Coliission and physics bound are the same. Physicsbounds should stay 1x1
            Collision bounds left and right needs to be a bit larger 1.1 for example
         */
        onCollisionStart(self, other, side, contact) {
            if (!(other.owner instanceof phyxels.Element)) {
                return;
            }
            if (side == ex.Side.Bottom) {
                this.checkPosition();
            }
        }
        onPreUpdate(engine, delta) {
            // this.pos = ex.vec(Math.round(this.pos.x * 10) / 10, Math.round(this.pos.y * 10) / 10);
        }
        checkPosition() {
            // Check  -x and +x if empty move there
            let currentScene = this.scene;
            if (currentScene == null) {
                return;
            }
            let checkY = Math.round(this.pos.y + this.stack_depht);
            let checkX = [Math.round(this.pos.x - this.stack_side), Math.round(this.pos.x + this.stack_side)];
            checkX.sort(() => Math.random() - 0.5);
            //Shuffel array
            for (let i = 0; i < checkX.length; i++) {
                if (currentScene.actors.filter(actor => actor.contains(checkX[i], checkY)).length == 0) {
                    let newPosX = this.pos.x + Math.sign(this.pos.x - checkX[i]);
                    let newPosY = this.pos.y;
                    this.pos = ex.vec(newPosX, newPosY);
                }
            }
        }
    }
    phyxels.Sand = Sand;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
(function (phyxels) {
    class Stone extends phyxels.Element {
        constructor(pos) {
            super({
                name: "Stone",
                pos: pos,
                color: phyxels.ColorFactory.getColor(phyxels.ElementType.STONE),
                collisionType: ex.CollisionType.Fixed
            });
            this.addChild(new phyxels.StoneAggregateState);
        }
        onCollisionStart(self, other, side, contact) {
        }
        onPreUpdate(engine, delta) {
        }
    }
    phyxels.Stone = Stone;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
(function (phyxels) {
    class Lava extends phyxels.Element {
        stack_side = 1;
        stack_depth = 0;
        constructor(pos) {
            super({
                name: "Lava",
                color: phyxels.ColorFactory.getColor(phyxels.ElementType.LAVA),
                pos: pos,
                collisionType: ex.CollisionType.Active
            });
            this.addChild(new phyxels.LavaAggregateState);
        }
        onCollisionStart(self, other, side, contact) {
            if (!(other.owner instanceof phyxels.Element)) {
                return;
            }
            let otherElement = other.owner;
            if (otherElement.getType() != phyxels.ElementType.LAVA) {
                return;
            }
            if (side == ex.Side.Bottom) {
                this.checkPosition();
            }
        }
        onPreUpdate(engine, delta) {
        }
        checkPosition() {
            // Check  -x and +x if empty move there
            let currentScene = this.scene;
            if (currentScene == null) {
                return;
            }
            let checkY = Math.round(this.pos.y + this.stack_depth);
            let checkX = [Math.round(this.pos.x - this.stack_side), Math.round(this.pos.x + this.stack_side)];
            checkX.sort(() => Math.random() - 0.5);
            //Shuffel array
            for (let i = 0; i < checkX.length; i++) {
                if (currentScene.actors.filter(actor => actor.contains(checkX[i], checkY)).length == 0) {
                    let newPosX = this.pos.x + Math.sign(this.pos.x - checkX[i]);
                    let newPosY = this.pos.y - 1;
                    if (currentScene.actors.filter(actor => actor.contains(newPosX, newPosY)).length > 0) {
                        continue;
                    }
                    this.pos = ex.vec(newPosX, newPosY);
                    return;
                }
            }
        }
    }
    phyxels.Lava = Lava;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class Sandbox extends ex.Scene {
        constructor() {
            super();
        }
        activActors = 0;
        onPreUpdate(engine, delta) {
            phyxels.CollisionManager.handle(this);
            if (phyxels.MouseInput.isPressed) {
                let gamePos = phyxels.game.screenToWorldCoordinates(phyxels.game.input.pointers.primary.lastScreenPos);
                gamePos.x = Math.round(gamePos.x);
                gamePos.y = Math.round(gamePos.y);
                if (this.actors.filter(actor => actor.contains(gamePos.x, gamePos.y)).length == 0) {
                    phyxels.ElementFactory.create(phyxels.ElementSelector.get(), gamePos);
                }
            }
        }
        onPostUpdate(engine, delta) {
        }
        onInitialize(engine) {
            this.addGroundCollision();
        }
        /**
         * Adds an hitbox, to stop Elements to fall down
         */
        addGroundCollision() {
            let ground;
            ground = new ex.Actor({
                pos: phyxels.game.screenToWorldCoordinates(ex.vec(phyxels.Config.canvas.width / phyxels.Config.grid.size / 2, phyxels.Config.canvas.height / phyxels.Config.grid.size + 0.5)),
                width: phyxels.Config.canvas.width / phyxels.Config.grid.size,
                height: 1,
                color: ex.Color.Gray,
                collisionType: ex.CollisionType.Fixed
            });
            phyxels.game.add(ground);
        }
    }
    phyxels.Sandbox = Sandbox;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class MouseInput {
        static isPressed = false;
        static init() {
            phyxels.game.input.pointers.primary.on('down', (evt) => {
                MouseInput.isPressed = true;
            });
            phyxels.game.input.pointers.primary.on('up', (evt) => {
                MouseInput.isPressed = false;
            });
        }
    }
    phyxels.MouseInput = MouseInput;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class HttpService {
        baseUrl;
        constructor(baseUrl) {
            this.baseUrl = baseUrl;
        }
        async get(endpoint) {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                console.error('GET request failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url
                });
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }
        async post(endpoint, data) {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain', // Set Content-Type to text/plain
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data) // Convert data to JSON string
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }
        async delete(endpoint) {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
    }
    phyxels.HttpService = HttpService;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class SaveService {
        httpService;
        constructor(httpService) {
            this.httpService = httpService;
        }
        async saveGameState(saveState) {
            await this.httpService.post('/api/v0/save', saveState);
        }
        async updateGameState(id, saveState) {
            await this.httpService.post(`/api/v0/save/${id}`, saveState);
        }
        async loadGameState(id) {
            if (!id) {
                throw new Error('Save ID is required');
            }
            return await this.httpService.get(`/api/v0/save/${id}`);
        }
        async loadAllGameStates() {
            return await this.httpService.get('/api/v0/save');
        }
        async deleteGameState(id) {
            await this.httpService.delete(`/api/v0/save/${id}`);
        }
    }
    phyxels.SaveService = SaveService;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class ElementService {
        saveService;
        createDownloadableFile;
        game;
        constructor(saveService, game, createDownloadableFile = false) {
            this.saveService = saveService;
            this.game = game;
            this.createDownloadableFile = createDownloadableFile;
        }
        async saveElements(name) {
            const elements = this.getElements();
            const saveState = {
                save: JSON.stringify(elements),
                name: name || 'My Save',
                date: new Date().toISOString()
            };
            if (this.isWambo(name)) {
                console.log(phyxels.WAMBO_ASCII);
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
        async updateElements(id, name) {
            const elements = this.getElements();
            const saveState = {
                _id: id,
                save: JSON.stringify(elements),
                name: name || 'My Save',
                date: new Date().toISOString()
            };
            await this.saveService.updateGameState(id, saveState);
        }
        async deleteElements(id) {
            await this.saveService.deleteGameState(id);
        }
        async loadAllSaves() {
            return await this.saveService.loadAllGameStates();
        }
        async loadSave(id) {
            return await this.saveService.loadGameState(id);
        }
        getElements() {
            const elements = [];
            this.game.currentScene.actors.forEach(actor => {
                if (actor instanceof phyxels.Element) {
                    elements.push({
                        type: actor.getType(),
                        x: actor.pos.x,
                        y: actor.pos.y
                    });
                }
            });
            return elements;
        }
        isWambo(name) {
            return name.toLowerCase() === 'wambo';
        }
        async loadElements(id) {
            const saveState = await this.loadSave(id);
            const elements = JSON.parse(saveState.save);
            this.resetCanvas();
            let ground = new ex.Actor({
                pos: phyxels.game.screenToWorldCoordinates(ex.vec(phyxels.Config.canvas.width / phyxels.Config.grid.size / 2, phyxels.Config.canvas.height / phyxels.Config.grid.size + 0.5)),
                width: phyxels.Config.canvas.width / phyxels.Config.grid.size,
                height: 1,
                color: ex.Color.Gray,
                collisionType: ex.CollisionType.Fixed
            });
            phyxels.game.add(ground);
            elements.forEach(element => {
                if (element.x !== undefined && element.y !== undefined) {
                    const worldPos = new ex.Vector(element.x, element.y);
                    phyxels.ElementFactory.create(element.type, worldPos);
                }
                else {
                    console.error('Invalid element position:', element);
                }
            });
        }
        resetCanvas() {
            this.game.currentScene.clear();
            let ground;
            ground = new ex.Actor({
                pos: phyxels.game.screenToWorldCoordinates(ex.vec(phyxels.Config.canvas.width / phyxels.Config.grid.size / 2, phyxels.Config.canvas.height / phyxels.Config.grid.size + 0.5)),
                width: phyxels.Config.canvas.width / phyxels.Config.grid.size,
                height: 1,
                color: ex.Color.Gray,
                collisionType: ex.CollisionType.Fixed
            });
            phyxels.game.add(ground);
        }
        async loadElementsFromFile(file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const json = event.target?.result;
                try {
                    const saveState = JSON.parse(json);
                    const elements = JSON.parse(saveState.save);
                    this.resetCanvas();
                    elements.forEach(element => {
                        if (element.x !== undefined && element.y !== undefined) {
                            const worldPos = new ex.Vector(element.x, element.y);
                            phyxels.ElementFactory.create(element.type, worldPos);
                            let ground = new ex.Actor({
                                pos: phyxels.game.screenToWorldCoordinates(ex.vec(phyxels.Config.canvas.width / phyxels.Config.grid.size / 2, phyxels.Config.canvas.height / phyxels.Config.grid.size + 0.5)),
                                width: phyxels.Config.canvas.width / phyxels.Config.grid.size,
                                height: 1,
                                color: ex.Color.Gray,
                                collisionType: ex.CollisionType.Fixed
                            });
                            phyxels.game.add(ground);
                        }
                        else {
                            console.error('Invalid element position:', element);
                        }
                    });
                }
                catch (error) {
                    console.error('Failed to parse JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    }
    phyxels.ElementService = ElementService;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    let Theme;
    (function (Theme) {
        Theme["LIGHT"] = "light";
        Theme["DARK"] = "dark";
    })(Theme = phyxels.Theme || (phyxels.Theme = {}));
    class ThemeService {
        static THEME_KEY = 'theme';
        static TRANSITION_DURATION = 300; // ms
        static currentTheme;
        static moonSprite;
        static sunSprite;
        static init(game) {
            this.createThemeSprites(game);
            this.setInitialTheme();
            this.listenToSystemChanges();
        }
        static toggleTheme() {
            const newTheme = this.currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
            this.applyTheme(newTheme);
        }
        static setInitialTheme() {
            const savedTheme = localStorage.getItem(this.THEME_KEY);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (prefersDark ? Theme.DARK : Theme.LIGHT);
            this.applyTheme(theme);
        }
        static listenToSystemChanges() {
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', e => {
                const theme = e.matches ? Theme.DARK : Theme.LIGHT;
                this.applyTheme(theme);
            });
        }
        static createThemeSprites(game) {
            // Moon sprite
            this.moonSprite = new ex.Actor({
                x: game.screenToWorldCoordinates(new ex.Vector(40, 40)).x,
                y: game.screenToWorldCoordinates(new ex.Vector(40, 40)).y,
                width: 32,
                height: 32,
                z: 1000 // Much higher z-index
            });
            this.moonSprite.graphics.use(new ex.Text({
                text: '🌙',
                font: new ex.Font({ size: 32, color: ex.Color.White })
            }));
            // Sun sprite
            this.sunSprite = new ex.Actor({
                x: game.screenToWorldCoordinates(new ex.Vector(40, 40)).x,
                y: game.screenToWorldCoordinates(new ex.Vector(40, 40)).y,
                width: 32,
                height: 32,
                z: 1000 // Much higher z-index
            });
            this.sunSprite.graphics.use(new ex.Text({
                text: '☀️',
                font: new ex.Font({ size: 32, color: ex.Color.Yellow })
            }));
            // Set initial visibility
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.moonSprite.graphics.opacity = isDarkMode ? 1 : 0;
            this.sunSprite.graphics.opacity = isDarkMode ? 0 : 1;
            // Add to UI layer instead of current scene
            game.scenes['ui'].add(this.moonSprite);
            game.scenes['ui'].add(this.sunSprite);
        }
        static applyTheme(theme) {
            this.currentTheme = theme;
            localStorage.setItem(this.THEME_KEY, theme);
            document.body.setAttribute('data-theme', theme);
            // Fade sprites
            const targetOpacity = 1;
            const duration = this.TRANSITION_DURATION;
            if (theme === Theme.DARK) {
                this.moonSprite.actions.fade(targetOpacity, duration);
                this.sunSprite.actions.fade(0, duration);
            }
            else {
                this.moonSprite.actions.fade(0, duration);
                this.sunSprite.actions.fade(targetOpacity, duration);
            }
            // Time-based color transition
            const targetColor = theme === Theme.DARK
                ? ex.Color.fromHex("#004266")
                : ex.Color.fromHex("#00a6ff");
            let startTime = performance.now();
            const updateColor = () => {
                const currentTime = performance.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.TRANSITION_DURATION, 1);
                // Cubic easing
                const eased = progress * progress * (3 - 2 * progress);
                if (progress < 1) {
                    requestAnimationFrame(updateColor);
                }
            };
            requestAnimationFrame(updateColor);
        }
    }
    phyxels.ThemeService = ThemeService;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    let ElementType;
    (function (ElementType) {
        ElementType[ElementType["SAND"] = 0] = "SAND";
        ElementType[ElementType["STONE"] = 1] = "STONE";
        ElementType[ElementType["LAVA"] = 2] = "LAVA";
        ElementType[ElementType["GLASS"] = 3] = "GLASS";
        ElementType[ElementType["WAMBO"] = 4] = "WAMBO";
    })(ElementType = phyxels.ElementType || (phyxels.ElementType = {}));
})(phyxels || (phyxels = {}));
/// <reference path="../actors/ElementType.ts"/>
var phyxels;
/// <reference path="../actors/ElementType.ts"/>
(function (phyxels) {
    class ElementSelector {
        static selector;
        static init() {
            let htmlElement = document.getElementById("elementSelector");
            if (htmlElement != null) {
                ElementSelector.selector = htmlElement;
                ElementSelector.setOptions();
                return;
            }
            console.error("Can not find the Element in the HTML Doc in " + this);
        }
        static get() {
            let selectionID = ElementSelector.selector.selectedIndex;
            let selectedElement = phyxels.ElementType[selectionID];
            if (selectedElement == "") {
                return 0;
            }
            return selectionID;
        }
        static setOptions() {
            let options = ElementSelector.selector.options;
            for (let i = 0; i < Object.keys(phyxels.ElementType).length / 2; i++) {
                let optionElement = document.createElement("option");
                optionElement.value = phyxels.ElementType[i];
                optionElement.text = phyxels.ElementType[i];
                options.add(optionElement, i);
            }
        }
    }
    phyxels.ElementSelector = ElementSelector;
})(phyxels || (phyxels = {}));
/// <reference path="ElementSelector.ts"/>
var phyxels;
/// <reference path="ElementSelector.ts"/>
(function (phyxels) {
    class UiLogic {
        static init() {
            phyxels.ElementSelector.init();
        }
    }
    phyxels.UiLogic = UiLogic;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class ColorFactory {
        static colors;
        static loadColors() {
            fetch('/src/configs/colors.json')
                .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load colors.json: ${response.statusText}`);
                }
                return response.json();
            })
                .then(data => {
                this.colors = data;
            })
                .catch(error => {
                console.error('Error loading colors:', error);
            });
        }
        static interpolateColor(minColor, maxColor, factor) {
            const min = ex.Color.fromHex(minColor);
            const max = ex.Color.fromHex(maxColor);
            const r = min.r + factor * (max.r - min.r);
            const g = min.g + factor * (max.g - min.g);
            const b = min.b + factor * (max.b - min.b);
            return new ex.Color(r, g, b);
        }
        static getRandomColorFrom(minColor, maxColor) {
            const factor = Math.random();
            return this.interpolateColor(minColor, maxColor, factor);
        }
        static getColorRangeFrom(elementType) {
            if (!this.colors) {
                throw new Error('Colors not loaded');
            }
            switch (elementType) {
                case phyxels.ElementType.LAVA:
                    return this.colors.lava;
                case phyxels.ElementType.SAND:
                    return this.colors.sand;
                case phyxels.ElementType.STONE:
                    return this.colors.stone;
                case phyxels.ElementType.GLASS:
                    return this.colors.glass;
                default:
                    throw new Error(`Color range for element type ${elementType} not found`);
            }
        }
        static getColor(elementType) {
            const colorRange = this.getColorRangeFrom(elementType);
            return this.getRandomColorFrom(colorRange.min, colorRange.max);
        }
    }
    phyxels.ColorFactory = ColorFactory;
})(phyxels || (phyxels = {}));
/// <reference path="configs/Config.ts"/>
/// <reference path="actors/elements/Sand.ts"/>
/// <reference path="actors/elements/Stone.ts"/>
/// <reference path="actors/elements/Lava.ts"/>
/// <reference path="scene/Sandbox.ts"/>
/// <reference path="input/MouseInput.ts"/>
/// <reference path="services/HttpService.ts"/>
/// <reference path="services/SaveService.ts"/>
/// <reference path="services/ElementService.ts"/>
/// <reference path="services/ThemeService.ts"/>
/// <reference path="uiLogic/UiLogic.ts"/>
/// <reference path="actors/elements/Factory/ColorFactory.ts"/>
var phyxels;
/// <reference path="configs/Config.ts"/>
/// <reference path="actors/elements/Sand.ts"/>
/// <reference path="actors/elements/Stone.ts"/>
/// <reference path="actors/elements/Lava.ts"/>
/// <reference path="scene/Sandbox.ts"/>
/// <reference path="input/MouseInput.ts"/>
/// <reference path="services/HttpService.ts"/>
/// <reference path="services/SaveService.ts"/>
/// <reference path="services/ElementService.ts"/>
/// <reference path="services/ThemeService.ts"/>
/// <reference path="uiLogic/UiLogic.ts"/>
/// <reference path="actors/elements/Factory/ColorFactory.ts"/>
(function (phyxels) {
    // Creating new game engine. Global accessible
    phyxels.game = new ex.Engine({
        height: phyxels.Config.canvas.height,
        width: phyxels.Config.canvas.width,
        backgroundColor: ex.Color.Transparent,
        canvasElementId: phyxels.Config.canvas.name,
        pixelArt: true,
        pixelRatio: phyxels.Config.grid.size,
        snapToPixel: true,
        physics: {
            solver: ex.SolverStrategy.Arcade,
            gravity: ex.vec(0, 9.8) // m/s2
        },
        fixedUpdateFps: 60,
        maxFps: 60,
        configurePerformanceCanvas2DFallback: {
            allow: false, // opt-out of the fallback
            showPlayerMessage: true, // opt-in to a player pop-up message
            threshold: { fps: 24, numberOfFrames: 100 } // configure the threshold to trigger the fallback
        }
    });
    phyxels.game.screen.resolution = {
        width: phyxels.Config.canvas.width / phyxels.Config.grid.size,
        height: phyxels.Config.canvas.height / phyxels.Config.grid.size
    };
    phyxels.game.screen.applyResolutionAndViewport();
    phyxels.game.addScene("Sandbox", new phyxels.Sandbox());
    phyxels.game.goToScene("Sandbox");
    phyxels.game.start();
    // Create a UI layer that renders above everything
    const uiLayer = new ex.Scene();
    phyxels.game.add('ui', uiLayer);
    phyxels.ColorFactory.loadColors();
    phyxels.MouseInput.init();
    phyxels.UiLogic.init();
    phyxels.ThemeService.init(phyxels.game);
    const httpService = new phyxels.HttpService(phyxels.Config.BACKEND_URL);
    const saveService = new phyxels.SaveService(httpService);
    const elementService = new phyxels.ElementService(saveService, phyxels.game);
    document.addEventListener('DOMContentLoaded', () => {
        const cloudContainer = document.querySelector('.cloud-container');
        const viewportHeight = window.innerHeight;
        const maxCloudY = viewportHeight - 231;
        const cloudAssets = [
            'var(--cloudsmall)',
            'var(--cloudmedium)',
            'var(--cloudlarge)'
        ];
        // Generate between 15-20 clouds
        const numberOfClouds = 15 + Math.floor(Math.random() * 6);
        for (let i = 0; i < numberOfClouds; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            // Distribute clouds vertically with some randomness
            const topPos = (maxCloudY * (i / numberOfClouds)) + (Math.random() * 50 - 25);
            cloud.style.top = `${Math.min(maxCloudY, Math.max(0, topPos))}px`;
            const asset = cloudAssets[Math.floor(Math.random() * cloudAssets.length)];
            cloud.style.backgroundImage = asset;
            // Slower clouds at higher altitudes, faster near ground
            const baseSpeed = 120 + Math.random() * 60;
            const heightFactor = 1 + (topPos / maxCloudY); // Higher clouds move slower
            const duration = baseSpeed * heightFactor;
            cloud.style.animationDuration = `${duration}s`;
            const delay = Math.random() * duration;
            cloud.style.animationDelay = `-${delay}s`;
            const width = 100 + Math.random() * 200;
            cloud.style.width = `${width}px`;
            const height = 50 + Math.random() * 100;
            cloud.style.height = `${height}px`;
            const opacity = 0.5 + Math.random() * 0.5;
            cloud.style.opacity = opacity.toString();
            cloudContainer.appendChild(cloud);
        }
        // Mountain generation
        const mountainContainer = document.querySelector('.mountain-container');
        function createMountain(type, position, scale, heightOffset) {
            const mountain = document.createElement('div');
            mountain.className = type;
            mountain.style.left = `${position}%`;
            mountain.style.transform = `scale(${scale})`;
            mountain.style.bottom = `${heightOffset}px`; // Add height variation
            return mountain;
        }
        function generateMountainGroup(startPosition) {
            const groupType = Math.random();
            const mountains = [];
            if (groupType < 0.33) {
                // One of each type
                mountains.push(createMountain('mountainsmall', startPosition, 0.8 + Math.random() * 0.4, Math.random() * 20), createMountain('mountainmedium', startPosition + 15, 0.8 + Math.random() * 0.4, Math.random() * 20), createMountain('mountainlarge', startPosition + 30, 0.8 + Math.random() * 0.4, Math.random() * 20));
            }
            else if (groupType < 0.66) {
                // Two small, one large
                mountains.push(createMountain('mountainsmall', startPosition, 0.8 + Math.random() * 0.4, Math.random() * 20), createMountain('mountainsmall', startPosition + 12, 0.8 + Math.random() * 0.4, Math.random() * 20), createMountain('mountainlarge', startPosition + 25, 0.8 + Math.random() * 0.4, Math.random() * 20));
            }
            else {
                // Two large, one medium
                mountains.push(createMountain('mountainlarge', startPosition, 0.8 + Math.random() * 0.4, Math.random() * 20), createMountain('mountainmedium', startPosition + 20, 0.8 + Math.random() * 0.4, Math.random() * 20), createMountain('mountainlarge', startPosition + 35, 0.8 + Math.random() * 0.4, Math.random() * 20));
            }
            return mountains;
        }
        function generateMountains() {
            mountainContainer.innerHTML = '';
            let position = 5;
            while (position < 85) {
                if (Math.random() < 0.6) { // 60% chance for a group
                    const mountains = generateMountainGroup(position);
                    mountains.forEach(mountain => mountainContainer.appendChild(mountain));
                    position += 45; // More space after a group
                }
                else {
                    // Single mountain
                    const type = ['mountainsmall', 'mountainmedium', 'mountainlarge'][Math.floor(Math.random() * 3)];
                    const mountain = createMountain(type, position, 0.8 + Math.random() * 0.4, Math.random() * 20);
                    mountainContainer.appendChild(mountain);
                    position += 20; // Less space after a single mountain
                }
                // Add some random spacing
                position += Math.random() * 10;
            }
        }
        generateMountains();
    });
    document.addEventListener("DOMContentLoaded", () => {
        const celestial = document.getElementsByClassName('celestial')[0];
        if (!celestial)
            return;
        // Adjusted start and end positions:
        const startX = 50; // 50px from the left edge
        const startY = 80; // 80px from the top
        const endX = window.innerWidth - 150; // End 150px from the right edge (so the moon isn't too far right)
        const endY = 80; // Same vertical position as the start
        // Adjust the control point for a higher parabolic arc:
        const controlX = window.innerWidth / 2; // horizontally centered
        const controlY = -200; // Negative value lifts the curve higher
        // Construct the SVG path string using these coordinates.
        const pathString = `M${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;
        // Set the offset-path style property for the celestial element.
        celestial.style.offsetPath = `path("${pathString}")`;
    });
    document.addEventListener('DOMContentLoaded', () => {
        const celestialDiv = document.getElementsByClassName('celestial')[0];
        let isThemeChanging = false;
        celestialDiv.addEventListener('click', () => {
            if (isThemeChanging)
                return;
            isThemeChanging = true;
            // Add animation based on current theme
            const currentTheme = document.body.getAttribute('data-theme');
            const animationName = currentTheme === 'dark' ? 'moveArcReverse' : 'moveArc';
            celestialDiv.style.animation = `${animationName} 1s linear forwards`;
            // Set the final offset-distance immediately after animation
            celestialDiv.style.offsetDistance = currentTheme === 'dark' ? '0%' : '100%';
            phyxels.ThemeService.toggleTheme();
            // Only reset the isThemeChanging flag, don't reset the animation
            setTimeout(() => {
                isThemeChanging = false;
            }, 1000);
        });
    });
    // Move the populateSaveSelector function outside the event listener
    async function populateSaveSelector() {
        const saveSelector = document.getElementById('saveSelector');
        if (!saveSelector)
            return;
        try {
            const saves = await elementService.loadAllSaves() || [];
            saveSelector.innerHTML = '';
            if (saves.length === 0) {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "No saves available";
                saveSelector.appendChild(option);
                return;
            }
            saves.forEach(save => {
                const option = document.createElement('option');
                option.value = save._id;
                option.textContent = save.name;
                saveSelector.appendChild(option);
            });
        }
        catch (error) {
            console.error('Failed to load saves:', error);
            if (saveSelector) {
                saveSelector.innerHTML = '<option value="">Error loading saves</option>';
            }
        }
    }
    // Initialize UI elements after DOM load
    document.addEventListener('DOMContentLoaded', async () => {
        // First populate the save selector
        await populateSaveSelector();
        // Then initialize all the UI elements
        const saveButton = document.getElementById('saveButton');
        const updateButton = document.getElementById('updateButton');
        const loadButton = document.getElementById('loadButton');
        const resetButton = document.getElementById('resetButton');
        const fileInput = document.getElementById('fileInput');
        const loadFileButton = document.getElementById('loadFileButton');
        const saveSelector = document.getElementById('saveSelector');
        const saveNameInput = document.getElementById('saveName');
        // Only attach event listeners if elements exist
        if (saveButton && updateButton && loadButton && resetButton && saveSelector && saveNameInput) {
            saveButton.addEventListener('click', async () => {
                const saveName = saveNameInput.value;
                await elementService.saveElements(saveName);
                await populateSaveSelector();
            });
            updateButton.addEventListener('click', async () => {
                const selectedSaveId = saveSelector.value;
                const saveName = saveNameInput.value;
                if (selectedSaveId) {
                    await elementService.updateElements(selectedSaveId, saveName);
                    await populateSaveSelector();
                }
                else {
                    alert('Please select a save to update.');
                }
            });
            loadButton.addEventListener('click', async () => {
                const selectedSaveId = saveSelector.value;
                if (selectedSaveId && selectedSaveId.trim() !== '') {
                    await elementService.loadElements(selectedSaveId);
                }
                else {
                    alert('Please select a save to load.');
                }
            });
            resetButton.addEventListener('click', () => {
                elementService.resetCanvas();
            });
        }
        if (loadFileButton && fileInput) {
            loadFileButton.addEventListener('click', () => {
                const file = fileInput.files?.[0];
                if (file) {
                    elementService.loadElementsFromFile(file);
                }
                else {
                    alert('Please select a file to load.');
                }
            });
        }
    });
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class CollisionManager {
        //list with all collision events to handle
        static collisionList = [];
        static frameRateMilliseconds = 1 / 15;
        static handle(scene) {
            let startTime = performance.now();
            for (let i = 0; i < this.collisionList.length; i++) {
                if (phyxels.game.currentFrameElapsedMs < CollisionManager.frameRateMilliseconds) {
                    return;
                }
                const [oldElement, newElementType] = this.collisionList[i];
                let newElement = phyxels.ElementFactory.create(newElementType, new ex.Vector(0, 0));
                if (newElement == null) {
                    console.warn(newElementType.toString() + " not found!, skipping");
                    continue;
                }
                newElement.pos = oldElement.pos.clone();
                newElement.angularVelocity = oldElement.angularVelocity;
                try {
                    oldElement.kill();
                }
                catch (error) {
                    console.warn(error);
                }
                this.collisionList.pop();
            }
        }
        static add(oldElement, newElement) {
            this.collisionList.push([oldElement, newElement]);
        }
    }
    phyxels.CollisionManager = CollisionManager;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class AggregateStateCollider extends ex.Actor {
        constructor() {
            super({
                name: "collider"
            });
            this.collider.useBoxCollider(1.2, 1.1);
        }
    }
    phyxels.AggregateStateCollider = AggregateStateCollider;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
(function (phyxels) {
    class GlassAggregateState extends phyxels.AggregateStateCollider {
        parentElement;
        onCollisionStart(self, other, side, contact) {
            if (this.parent == null) {
                return;
            }
            else {
                try {
                    this.parentElement = this.parent;
                }
                catch (error) {
                    console.error(error);
                    return;
                }
            }
            if (!(other.owner instanceof phyxels.Element)) {
                return;
            }
            if (this.parentElement.inCollisionHandlerList) {
                return;
            }
            //Object changes on hit. Priority according the list.
            let otherElement = other.owner;
            switch (otherElement.getType()) {
                case phyxels.ElementType.WAMBO:
                    phyxels.CollisionManager.add(this.parentElement, phyxels.ElementType.WAMBO);
                    this.parentElement.inCollisionHandlerList = true;
            }
        }
    }
    phyxels.GlassAggregateState = GlassAggregateState;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
(function (phyxels) {
    class LavaAggregateState extends phyxels.AggregateStateCollider {
        parentElement;
        onCollisionStart(self, other, side, contact) {
            if (this.parent == null) {
                return;
            }
            else {
                try {
                    this.parentElement = this.parent;
                }
                catch (error) {
                    console.error(error);
                    return;
                }
            }
            if (!(other.owner instanceof phyxels.Element)) {
                return;
            }
            if (this.parentElement.inCollisionHandlerList) {
                return;
            }
            //Object changes on hit. Priority according the list.
            let otherElement = other.owner;
            switch (otherElement.getType()) {
                case phyxels.ElementType.WAMBO:
                    phyxels.CollisionManager.add(this.parentElement, phyxels.ElementType.WAMBO);
                    this.parentElement.inCollisionHandlerList = true;
            }
        }
    }
    phyxels.LavaAggregateState = LavaAggregateState;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
(function (phyxels) {
    class SandAggregateState extends phyxels.AggregateStateCollider {
        parentElement;
        onCollisionStart(self, other, side, contact) {
            if (this.parent == null) {
                return;
            }
            else {
                try {
                    this.parentElement = this.parent;
                }
                catch (error) {
                    console.error(error);
                    return;
                }
            }
            if (!(other.owner instanceof phyxels.Element)) {
                return;
            }
            if (this.parentElement.inCollisionHandlerList) {
                return;
            }
            //Object changes on hit. Priority according the list.
            let otherElement = other.owner;
            switch (otherElement.getType()) {
                case phyxels.ElementType.WAMBO:
                    phyxels.CollisionManager.add(this.parentElement, phyxels.ElementType.WAMBO);
                    this.parentElement.inCollisionHandlerList = true;
                case phyxels.ElementType.LAVA:
                    phyxels.CollisionManager.add(this.parentElement, phyxels.ElementType.GLASS);
                    this.parentElement.inCollisionHandlerList = true;
            }
        }
    }
    phyxels.SandAggregateState = SandAggregateState;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
(function (phyxels) {
    class StoneAggregateState extends phyxels.AggregateStateCollider {
        parentElement;
        onCollisionStart(self, other, side, contact) {
            if (this.parent == null) {
                return;
            }
            else {
                try {
                    this.parentElement = this.parent;
                }
                catch (error) {
                    console.error(error);
                    return;
                }
            }
            if (!(other.owner instanceof phyxels.Element)) {
                return;
            }
            if (this.parentElement.inCollisionHandlerList) {
                return;
            }
            //Object changes on hit. Priority according the list.
            let otherElement = other.owner;
            switch (otherElement.getType()) {
                case phyxels.ElementType.WAMBO:
                    phyxels.CollisionManager.add(this.parentElement, phyxels.ElementType.WAMBO);
                    this.parentElement.inCollisionHandlerList = true;
            }
        }
    }
    phyxels.StoneAggregateState = StoneAggregateState;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
/// <reference path="AggregateStateCollider.ts"/>
(function (phyxels) {
    class WamboAggregateState extends phyxels.AggregateStateCollider {
    }
    phyxels.WamboAggregateState = WamboAggregateState;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
(function (phyxels) {
    class Glass extends phyxels.Element {
        constructor(pos) {
            super({
                name: "Glass",
                pos: pos,
                color: phyxels.ColorFactory.getColor(phyxels.ElementType.GLASS),
                collisionType: ex.CollisionType.Fixed
            });
            this.addChild(new phyxels.GlassAggregateState);
        }
        onCollisionStart(self, other, side, contact) {
        }
        onPreUpdate(engine, delta) {
        }
    }
    phyxels.Glass = Glass;
})(phyxels || (phyxels = {}));
/// <reference path="../Element.ts"/>
var phyxels;
/// <reference path="../Element.ts"/>
(function (phyxels) {
    class Wambo extends phyxels.Element {
        randomTick = 0;
        constructor(pos) {
            super({
                name: "Wambo",
                color: ex.Color.fromHex("#ea9999"),
                pos: pos,
                collisionType: ex.CollisionType.Active
            });
            this.randomTick = 500 * (Math.random() * 10);
            this.addChild(new phyxels.WamboAggregateState());
        }
        onCollisionStart(self, other, side, contact) {
        }
        onPreUpdate(engine, delta) {
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
    phyxels.Wambo = Wambo;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    phyxels.WAMBO_ASCII = `
                ───────────────▄████████▄────────
                ──────────────██▒▒▒▒▒▒▒▒██───────
                ─────────────██▒▒▒▒▒▒▒▒▒██───────
                ────────────██▒▒▒▒▒▒▒▒▒▒██───────
                ───────────██▒▒▒▒▒▒▒▒▒██▀────────
                ──────────██▒▒▒▒▒▒▒▒▒▒██─────────   
                ─────────██▒▒▒▒▒▒▒▒▒▒▒██─────────
                ────────██▒▒████▒████▒██─────────
                ────────██▒▒▒▒▒▒▒▒▒▒▒▒██─────────
                ────────██▒────▒▒────▒██─────────
                ────────██▒─██─▒▒─██─▒██─────────
                ────────██▒────▒▒────▒██─────────
                ────────██▒▒▒▒▒▒▒▒▒▒▒▒██─────────
                ───────██▒▒▒████████▒▒▒▒██───────
                ─────██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██─────
                ───██▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒██───
                ─██▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒██─
                █▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒█
                █▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒█
                █▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▒▒█
                ▀████▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒▒▒▒▒████▀
                ──█▌▌▌▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌▌▌███──
                ───█▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌█────
                ───█▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌█────
                ────▀█▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌▌██▀─────
                ─────█▌▌▌▌▌▌████████▌▌▌▌▌██──────
                ──────██▒▒██────────██▒▒██───────
                ──────▀████▀────────▀████▀───────
            `;
})(phyxels || (phyxels = {}));
var phyxels;
(function (phyxels) {
    class Loading {
    }
    phyxels.Loading = Loading;
})(phyxels || (phyxels = {}));
//# sourceMappingURL=game.js.map