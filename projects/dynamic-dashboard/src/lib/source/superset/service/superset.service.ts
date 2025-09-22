import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

/** EmbedDashboard SDK import */
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { environment } from '../../environments/environment';
/** Import embedChart from esm */
// import { embedChart } from '@superset-ui/embedded-sdk/dist/esm';

@Injectable({
  providedIn: 'root'
})
export class SupersetService {

  private supersetUrl = environment.supersetBaseURL // Replace with your Superset instance URL
  private supersetApiUrl = `${this.supersetUrl}/api/v1/security`
  private dashboardId = "f57fc422-974c-4b6e-a473-38ec850ded24"

  constructor(private http: HttpClient) { }

  getToken() {
    //calling login to get access token
    const body = {
      "password": "embedding-admin",
      "provider": "db",
      "refresh": true,
      "username": "embedding-admin"
    };

    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.post(`${this.supersetApiUrl}/login`, body, { headers }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(error);
      }),
      switchMap((accessToken: any) => {
        const body = {
          "resources": [
            {
              "type": "dashboard",
              "id": this.dashboardId,
            }
          ],
          "rls":[],
          "user": {
            "username": "report-viewer",
            "first_name": "report-viewer",
            "last_name": "report-viewer",
          }
        };

        const acc = accessToken["access_token"];
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${acc}`,
        });

        return this.http.post<any>(`${this.supersetApiUrl}/guest_token/`, body, { headers });
      }));
  }




  embedDashboard(mountPoint: HTMLElement) {
    return new Observable((observer) => {
      this.getToken().subscribe(
        (token) => {
          embedDashboard({
            id: this.dashboardId,
            supersetDomain: this.supersetUrl,
            mountPoint: mountPoint,
            fetchGuestToken: () => token["token"],
            dashboardUiConfig: {
              hideTitle: true,
              hideChartControls: true,
              hideTab: true,
              filters: { visible: false, expanded: false },
              urlParams: { standalone: "1", show_filters: "0", show_native_filters: "0" }
            },
          });
          // @ts-ignore
          observer.next();
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }


  // /** Embed chart inside a given element */
  // embedChart(mountPoint: HTMLElement, chartId: string): Observable<void> {
  //   return new Observable((observer) => {
  //     this.getToken(chartId).subscribe({
  //       next: (token) => {
  //         embedChart({
  //           id: chartId,
  //           supersetDomain: this.supersetUrl,
  //           mountPoint,
  //           fetchGuestToken: () => token['token'],
  //           chartUiConfig: {
  //             hideTitle: true,
  //             hideControls: true,
  //             urlParams: { standalone: '1' }
  //           }
  //         });
  //         observer.next();
  //         observer.complete();
  //       },
  //       error: (err) => observer.error(err)
  //     });
  //   });
  // }

  private supersetApi = `${environment.supersetBaseURL}`;
  getSliceName(sliceId: number): Observable<any> {
    return this.http.get<any>(`${this.supersetApi}/api/v1/chart/${sliceId}`);
  }

  getAllCharts(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      const allCharts: any[] = [];
      let currentPage = 0;
      const pageSize = 100; // Max supported in most Superset versions

      const fetchPage = () => {
        const rison = `(page_size:${pageSize},page:${currentPage})`;
        // const params = new HttpParams().set('q', rison);


        const query = {
          columns: ["string"],
          filters: [{ col: "string", op: "string", value: 0 }],
          keys: ["list_columns"],
          order_column: "string",
          order_direction: "asc",
          page: 0,
          page_size: 100,
          select_columns: ["string"]
        };

        const headers = new HttpHeaders({
          'accept': 'application/json'
        });

        // Send q as query string
        let params = new HttpParams().set('q', JSON.stringify(query));

        this.http
          .get<any>(`${this.supersetApi}/api/v1/chart/`, { headers, params })
          .subscribe({
            next: (response) => {
              if (response?.result?.length) {
                allCharts.push(...response.result);
              }

              // If we got fewer than pageSize, we're done
              if (response.result.length < pageSize) {
                observer.next(allCharts);
                observer.complete();
              } else {
                currentPage++;
                fetchPage(); // Recursive call for next page
              }
            },
            error: (err) => {
              console.error('Error fetching charts', err);
              observer.error(err);
            }
          });
      };

      fetchPage();
    });
  }
}
