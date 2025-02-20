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

namespace phyxels {

    // Creating new game engine. Global accessible
    export const game = new ex.Engine({
        height: Config.canvas.height,
        width: Config.canvas.width,
        backgroundColor: ex.Color.Transparent,
        canvasElementId: Config.canvas.name,
        pixelArt: true,
        pixelRatio: Config.grid.size,
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
    game.screen.resolution = {
        width: Config.canvas.width / Config.grid.size,
        height: Config.canvas.height / Config.grid.size
    };
    game.screen.applyResolutionAndViewport();
    game.addScene("Sandbox", new Sandbox());
    game.goToScene("Sandbox");
    game.start();

    // Create a UI layer that renders above everything
    const uiLayer = new ex.Scene();
    game.add('ui', uiLayer);

    ColorFactory.loadColors();
    MouseInput.init();
    UiLogic.init();
    ThemeService.init(game);

    const httpService = new HttpService(Config.BACKEND_URL);
    const saveService = new SaveService(httpService);
    const elementService = new ElementService(saveService, game);

    document.addEventListener('DOMContentLoaded', () => {
        const cloudContainer = document.querySelector('.cloud-container') as HTMLElement;
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
        const mountainContainer = document.querySelector('.mountain-container') as HTMLElement;
        
        function createMountain(type: string, position: number, scale: number, heightOffset: number) {
            const mountain = document.createElement('div');
            mountain.className = type;
            mountain.style.left = `${position}%`;
            mountain.style.transform = `scale(${scale})`;
            mountain.style.bottom = `${heightOffset}px`; // Add height variation
            return mountain;
        }

        function generateMountainGroup(startPosition: number) {
            const groupType = Math.random();
            const mountains = [];
            
            if (groupType < 0.33) {
                // One of each type
                mountains.push(
                    createMountain('mountainsmall', startPosition, 0.8 + Math.random() * 0.4, Math.random() * 20),
                    createMountain('mountainmedium', startPosition + 15, 0.8 + Math.random() * 0.4, Math.random() * 20),
                    createMountain('mountainlarge', startPosition + 30, 0.8 + Math.random() * 0.4, Math.random() * 20)
                );
            } else if (groupType < 0.66) {
                // Two small, one large
                mountains.push(
                    createMountain('mountainsmall', startPosition, 0.8 + Math.random() * 0.4, Math.random() * 20),
                    createMountain('mountainsmall', startPosition + 12, 0.8 + Math.random() * 0.4, Math.random() * 20),
                    createMountain('mountainlarge', startPosition + 25, 0.8 + Math.random() * 0.4, Math.random() * 20)
                );
            } else {
                // Two large, one medium
                mountains.push(
                    createMountain('mountainlarge', startPosition, 0.8 + Math.random() * 0.4, Math.random() * 20),
                    createMountain('mountainmedium', startPosition + 20, 0.8 + Math.random() * 0.4, Math.random() * 20),
                    createMountain('mountainlarge', startPosition + 35, 0.8 + Math.random() * 0.4, Math.random() * 20)
                );
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
                } else {
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
      const celestial = (document.getElementsByClassName('celestial') as HTMLCollectionOf<HTMLElement>)[0];
      if (!celestial) return;
    
      // Adjusted start and end positions:
      const startX = 50;           // 50px from the left edge
      const startY = 80;           // 80px from the top
      const endX = window.innerWidth - 150;  // End 150px from the right edge (so the moon isn't too far right)
      const endY = 80;             // Same vertical position as the start
    
      // Adjust the control point for a higher parabolic arc:
      const controlX = window.innerWidth / 2; // horizontally centered
      const controlY = -200;       // Negative value lifts the curve higher
    
      // Construct the SVG path string using these coordinates.
      const pathString = `M${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;
    
      // Set the offset-path style property for the celestial element.
      celestial.style.offsetPath = `path("${pathString}")`;
    });

    document.addEventListener('DOMContentLoaded', () => {
        const celestialDiv = (document.getElementsByClassName('celestial') as HTMLCollectionOf<HTMLElement>)[0];
        let isThemeChanging = false;

        celestialDiv.addEventListener('click', () => {
            if (isThemeChanging) return;
            
            isThemeChanging = true;
            
            // Add animation based on current theme
            const currentTheme = document.body.getAttribute('data-theme');
            const animationName = currentTheme === 'dark' ? 'moveArcReverse' : 'moveArc';
            celestialDiv.style.animation = `${animationName} 1s linear forwards`;
            
            // Set the final offset-distance immediately after animation
            celestialDiv.style.offsetDistance = currentTheme === 'dark' ? '0%' : '100%';
            
            ThemeService.toggleTheme();
            
            // Only reset the isThemeChanging flag, don't reset the animation
            setTimeout(() => {
                isThemeChanging = false;
            }, 1000);
        });
    });

    // Move the populateSaveSelector function outside the event listener
    async function populateSaveSelector() {
        const saveSelector = document.getElementById('saveSelector') as HTMLSelectElement;
        if (!saveSelector) return;
        
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
                option.value = save._id!;
                option.textContent = save.name;
                saveSelector.appendChild(option);
            });
        } catch (error) {
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
                const saveName = (saveNameInput as HTMLInputElement).value;
                await elementService.saveElements(saveName);
                await populateSaveSelector();
            });

            updateButton.addEventListener('click', async () => {
                const selectedSaveId = (saveSelector as HTMLSelectElement).value;
                const saveName = (saveNameInput as HTMLInputElement).value;
                if (selectedSaveId) {
                    await elementService.updateElements(selectedSaveId, saveName);
                    await populateSaveSelector();
                } else {
                    alert('Please select a save to update.');
                }
            });

            loadButton.addEventListener('click', async () => {
                const selectedSaveId = (saveSelector as HTMLSelectElement).value;
                if (selectedSaveId && selectedSaveId.trim() !== '') {
                    await elementService.loadElements(selectedSaveId);
                } else {
                    alert('Please select a save to load.');
                }
            });

            resetButton.addEventListener('click', () => {
                elementService.resetCanvas();
            });
        }

        if (loadFileButton && fileInput) {
            loadFileButton.addEventListener('click', () => {
                const file = (fileInput as HTMLInputElement).files?.[0];
                if (file) {
                    elementService.loadElementsFromFile(file);
                } else {
                    alert('Please select a file to load.');
                }
            });
        }
    });
}