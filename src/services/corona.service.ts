import axios from 'axios';
import { CoronaResponse } from '../dto/corona-response.dto';

export class CoronaService {
  private apiUrl = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations'; // ?country_code=IT

  getCasesByCountry(countryCode: string) {
    return axios.get<CoronaResponse>(this.apiUrl, { params: { country_code: countryCode } });
  }
}
