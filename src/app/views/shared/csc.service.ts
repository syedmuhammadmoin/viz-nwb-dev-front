import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICountry } from './models/country';
import { IState } from './models/state';
import { ICity } from './models/city';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CscService {


  countriesList: ICountry[];
  statesList: IState[];
  citiesList: ICity[];

  constructor() { }

  getCountries(): Observable<ICountry[]> {
		this.countriesList = [
			{ 
        id:1,
        name: "America" 
      },
      { 
        id:2,
        name: "Pakistan" 
      },
      { 
        id:3,
        name: "U.K" 
      },
      { 
        id:4,
        name: "Australia" 
      },
		];

		return of(this.countriesList);
  }
  
  getStates(countryId:number): Observable<IState[]> {
		this.statesList = [
			{ 
        id:1,
        name: "Taxes",
        countryId:1
      },
      { 
        id:2,
        name: "Washington",
        countryId:1
      },
      { 
        id:3,
        name: "Sindh",
        countryId:2
      },
      { 
        id:4,
        name: "Punjab",
        countryId:2
      },
      { 
        id:5,
        name: "Scotland",
        countryId:3
      },
      { 
        id:6,
        name: "England",
        countryId:3
      },
      { 
        id:7,
        name: "Victoria",
        countryId:4
      },
      { 
        id:8,
        name: "New South Wales",
        countryId:4
      },
		];

		return of(this.statesList.filter(x => x.countryId === countryId));
  }
  
  getCities(stateId:number): Observable<ICity[]> {
		this.citiesList = [
			{ 
        id:1,
        name: "Taxes City",
        stateId:1
      },
      { 
        id:2,
        name: "New York",
        stateId:2
      },
      { 
        id:3,
        name: "Karachi",
        stateId:3
      },
      { 
        id:4,
        name: "Lahore",
        stateId:4
      },
      { 
        id:5,
        name: "Glasgow",
        stateId:5
      },
      { 
        id:6,
        name: "London",
        stateId:6
      },
      { 
        id:7,
        name: "Melbourne",
        stateId:7
      },
      { 
        id:8,
        name: "asd",
        stateId:7
      },
      { 
        id:9,
        name: "Sydney",
        stateId:8
      },
      { 
        id:10,
        name: "das",
        stateId:8
      },
      { 
        id:11,
        name: "Badin",
        stateId:3
      },
      { 
        id:12,
        name: "Shaheed Benazirabad",
        stateId:3
      },
      { 
        id:13,
        name: "Jacobabad",
        stateId:3
      },
      { 
        id:14,
        name: "IslamKot",
        stateId:3
      },
      { 
        id:15,
        name: "Kashmore",
        stateId:3
      },
      
      { 
        id:16,
        name: "Jamshoro",
        stateId:3
      },
      { 
        id:17,
        name: "Hyderabad",
        stateId:3
      },
      { 
        id:18,
        name: "Khairpur",
        stateId:3
      },
      { 
        id:19,
        name: "Kotri",
        stateId:3
      },
      { 
        id:20,
        name: "Matiari",
        stateId:3
      },
      { 
        id:21,
        name: "Mian Sahib",
        stateId:3
      },
      { 
        id:22,
        name: "Larkana",
        stateId:3
      },
      { 
        id:23,
        name: "Karachi",
        stateId:3
      },
      { 
        id:24,
        name: "Khairpur Mirs",
        stateId:3
      },
      { 
        id:25,
        name: "Hala",
        stateId:3
      },
      { 
        id:26,
        name: "Guddu Barrage",
        stateId:3
      },
      { 
        id:27,
        name: "Mithi",
        stateId:3
      },
      { 
        id:28,
        name: "Moro",
        stateId:3
      },
      { 
        id:29,
        name: "Naushahro Feroze",
        stateId:3
      },
      { 
        id:30,
        name: "Nagarparkar",
        stateId:3
      },
      { 
        id:31,
        name: "Nasirabad",
        stateId:3
      },
      { 
        id:32,
        name: "Qasimabad",
        stateId:3
      },
      { 
        id:33,
        name: "Ranipur",
        stateId:3
      },
      { 
        id:34,
        name: "Rohri",
        stateId:3
      },
      { 
        id:35,
        name: "Sakrand",
        stateId:3
      },
      { 
        id:36,
        name: "Sehwan Sharif",
        stateId:3
      },
      { 
        id:37,
        name: "Sijawal Junejo",
        stateId:3
      },
      { 
        id:38,
        name: "Sukkur",
        stateId:3
      },
      { 
        id:38,
        name: "Tando Adam Khan",
        stateId:3
      },
      { 
        id:38,
        name: "Tando Allahyar",
        stateId:3
      },
      { 
        id:38,
        name: "Tando Muhammad Khan",
        stateId:3
      },
      { 
        id:39,
        name: "Thatta",
        stateId:3
      },
      { 
        id:40,
        name: "Umerkot",
        stateId:3
      },
      { 
        id:41,
        name: "Warah",
        stateId:3
      }      
		];
		return of(this.citiesList.filter(x => x.stateId === stateId));
  }
}


