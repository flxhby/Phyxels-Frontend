namespace phyxels {
    export enum Theme {
        LIGHT = 'light',
        DARK = 'dark'
    }

    export class ThemeService {
        private static readonly THEME_KEY = 'theme';
        private static readonly TRANSITION_DURATION = 300; // ms
        private static currentTheme: Theme;
        private static moonSprite: ex.Actor;
        private static sunSprite: ex.Actor;

        public static init(game: ex.Engine): void {
            this.createThemeSprites(game);
            this.setInitialTheme();
            this.listenToSystemChanges();
        }

        public static toggleTheme(): void {
            const newTheme = this.currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
            this.applyTheme(newTheme);
        }

        private static setInitialTheme(): void {
            const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (prefersDark ? Theme.DARK : Theme.LIGHT);
            this.applyTheme(theme);
        }

        private static listenToSystemChanges(): void {
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', e => {
                    const theme = e.matches ? Theme.DARK : Theme.LIGHT;
                    this.applyTheme(theme);
                });
        }

        private static createThemeSprites(game: ex.Engine): void {
            // Moon sprite
            this.moonSprite = new ex.Actor({
                x: game.screenToWorldCoordinates(new ex.Vector(40,40)).x,
                y: game.screenToWorldCoordinates(new ex.Vector(40,40)).y,
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
                x: game.screenToWorldCoordinates(new ex.Vector(40,40)).x,
                y: game.screenToWorldCoordinates(new ex.Vector(40,40)).y,
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
            (game.scenes['ui'] as ex.Scene).add(this.moonSprite);
            (game.scenes['ui'] as ex.Scene).add(this.sunSprite);

        }

        private static applyTheme(theme: Theme): void {
            this.currentTheme = theme;
            localStorage.setItem(this.THEME_KEY, theme);
            document.body.setAttribute('data-theme', theme);

            // Fade sprites
            const targetOpacity = 1;
            const duration = this.TRANSITION_DURATION;

            if (theme === Theme.DARK) {
                this.moonSprite.actions.fade(targetOpacity, duration);
                this.sunSprite.actions.fade(0, duration);
            } else {
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
}