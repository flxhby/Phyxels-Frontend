namespace phyxels {
    export class HttpService {
        private baseUrl: string;

        constructor(baseUrl: string) {
            this.baseUrl = baseUrl;
        }

        public async get(endpoint: string): Promise<any> {
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

        public async post(endpoint: string, data: any): Promise<any> {
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

        public async delete(endpoint: string): Promise<void> {
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
}