import axios, { AxiosResponse } from 'axios';
import { CoronaResponse } from '../dto/corona-response.dto';
import { Countries } from '../dto/countries.dto';

export class CoronaService {
  private apiUrl = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations'; // ?country_code=IT
  private apiUrl2 = 'https://pomber.github.io/covid19/timeseries.json';

  cachedCountries: AxiosResponse<Countries>;

  constructor() {
    this.setupCaching();
  }

  async setupCaching() {
    console.log('Started caching');
    await this.updateCountriesCache();
    console.log('Finished caching');

    // Caching
    setInterval(async () => {
      console.log('Started caching interval');
      await this.updateCountriesCache();
      console.log('Finished caching interval');
    }, 3 * 1000 * 60 * 60); // 3 hours
  }

  async updateCountriesCache() {
    try {
      const resp = await this.getAllCases();
      this.saveAllCases(resp);
    } catch (error) {
      console.log(error);
    }
  }

  getCasesByCountry(countryCode: string) {
    return axios.get<CoronaResponse>(this.apiUrl, { params: { country_code: countryCode } });
  }

  getAllCases(): Promise<AxiosResponse<Countries>> {
    return this.cachedCountries ? this.getStoredCases() : axios.get<Countries>(this.apiUrl2);
  }

  saveAllCases(cases: AxiosResponse<Countries>) {
    this.cachedCountries = cases;
  }

  getStoredCases(): Promise<AxiosResponse<Countries>> {
    return new Promise<AxiosResponse<Countries>>((res, rej) => res(this.cachedCountries));
  }
}
