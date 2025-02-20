namespace phyxels {
   export class Config {
      public static canvas: Canvas = { width: 800, height: 500, name: "game", color: "#141414" };
      public static grid: Grid = { size: 10 };
      public static readonly BACKEND_URL = 'http://localhost:8080';
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
}