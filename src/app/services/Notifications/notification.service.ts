import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private hubConnection!: signalR.HubConnection;
  notifications: string[] = [];

  constructor(private http: HttpClient) { }

  startConnection = (userId:string) => {
    this.hubConnection=new signalR.HubConnectionBuilder()
    .withUrl(`https://localhost:7264/notificationHub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();

    this.hubConnection
    .start()
   .then(() => console.log('Connection started!'))
   .catch(err => console.log('Error while starting connection: ' + err))
  }

  getUnread(userId:string){
    return this.http.get<any[]>(`https://localhost:7264/api/notification/${userId}`);
  }

  markAsRead(id: number) {
    return this.http.post(`https://localhost:7264/api/notification/${id}/mark-read`, {});
  }
}
