import axios from 'axios';


export class Http {
    private instance
    constructor(baseUrl: string, authKey: string) {
        this.instance = axios.create({
            baseURL: baseUrl,
            headers: { 'Authorization': authKey }
        });
    }

    get = (url: string, params?: any): Promise<any> => {
        return this.responceHandler(this.instance.get(url, { params: params}))
    }

    post = (url: string, payload: any): Promise<any> => {
        return this.responceHandler(this.instance.post(url, payload))
    }

    responceHandler = async (request: Promise<any>): Promise<any> => {
        try {
            const resp = await request
            return resp.data
        } catch (error) {
            console.error(`ERROR MESSAGE: ${error.message}`);
            return null
        }
    }
}