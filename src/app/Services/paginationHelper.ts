import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../Models/Pagination";


export function getPaginatedResult<T>(url, params, http:HttpClient) {

  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

  //This goes to url header
  return http.get<T>(url, { observe: 'response', params }).pipe(

    /*Map response is the response from server => and response from server is divided here into 2 parts.
      1) actual response body that is membersDto[] array
      2) response header where we get actual Pagination info=>{"currentPage":1,"itemPerPage":10,"totalItems":14,"totalPages":2}
    */
    map(response => {
      paginatedResult.result = response.body;

      if (response.headers.get('Pagination') !== null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    })
  );
}

export function getPaginationHeader(pageNumber: number, pageSize: number) {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());

  return params;
}
