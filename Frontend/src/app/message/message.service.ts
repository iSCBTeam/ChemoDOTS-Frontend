import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

export interface PhpData {
  status: string;
  data : any;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http : HttpClient) {  }

  sendMessage(url : string, data : any) : Observable<PhpData> {
    url = environment.url + url;
    return this.http.post<PhpData>(url, data, { withCredentials: true});
  }
}

