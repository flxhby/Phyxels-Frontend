namespace phyxels {
    export class ColorFactory {
        private static colors: any;

        public static loadColors(): void {
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

        private static interpolateColor(minColor: string, maxColor: string, factor: number): ex.Color {
            const min = ex.Color.fromHex(minColor);
            const max = ex.Color.fromHex(maxColor);

            const r = min.r + factor * (max.r - min.r);
            const g = min.g + factor * (max.g - min.g);
            const b = min.b + factor * (max.b - min.b);

            return new ex.Color(r, g, b);
        }

        public static getRandomColorFrom(minColor: string, maxColor: string): ex.Color {
            const factor = Math.random();
            return this.interpolateColor(minColor, maxColor, factor);
        }

        public static getColorRangeFrom(elementType: ElementType): { min: string, max: string } {
            if (!this.colors) {
                throw new Error('Colors not loaded');
            }

            switch (elementType) {
                case ElementType.LAVA:
                    return this.colors.lava;
                case ElementType.SAND:
                    return this.colors.sand;
                case ElementType.STONE:
                    return this.colors.stone;
                case ElementType.GLASS:
                    return this.colors.glass;
                default:
                    throw new Error(`Color range for element type ${elementType} not found`);
            }
        }

        public static getColor(elementType: ElementType): ex.Color {
            const colorRange = this.getColorRangeFrom(elementType);
            return this.getRandomColorFrom(colorRange.min, colorRange.max);
        }
    }
}