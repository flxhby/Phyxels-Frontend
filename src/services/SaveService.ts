namespace phyxels {
    export class SaveService {
        private httpService: HttpService;

        constructor(httpService: HttpService) {
            this.httpService = httpService;
        }

        public async saveGameState(saveState: SaveState): Promise<void> {
            await this.httpService.post('/api/v0/save', saveState);
        }

        public async updateGameState(id: string, saveState: SaveState): Promise<void> {
            await this.httpService.post(`/api/v0/save/${id}`, saveState);
        }

        public async loadGameState(id: string): Promise<SaveState> {
            if (!id) {
                throw new Error('Save ID is required');
            }
            return await this.httpService.get(`/api/v0/save/${id}`);
        }

        public async loadAllGameStates(): Promise<SaveState[]> {
            return await this.httpService.get('/api/v0/save');
        }

        public async deleteGameState(id: string): Promise<void> {
            await this.httpService.delete(`/api/v0/save/${id}`);
        }
    }
}