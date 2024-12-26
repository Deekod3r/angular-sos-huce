import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Client, Message} from '@stomp/stompjs';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    private WEB_SOCKET_URL = `${environment.webSocketUrl}`;
    private stompClient!: Client;
    private messageSubject: Subject<Message> = new Subject<Message>();
    private topic: string = "/topic"

    constructor() {
        this.connect();
    }

    getMessages(): Observable<Message> {
        return this.messageSubject.asObservable();
    }

    active(): void {
        if (this.stompClient) {
            this.stompClient.activate();
        }
    }

    deactivate(): void {
        if (this.stompClient) {
            this.stompClient.deactivate();
        }
    }

    private connect(): void {
        const socket = new WebSocket(this.WEB_SOCKET_URL);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (msg: string) => {
            },
            reconnectDelay: 1000,
            heartbeatIncoming: 3000,
            heartbeatOutgoing: 3000
        });
        this.stompClient.onConnect = () => {
            this.stompClient.subscribe(this.topic, (message) => {
                this.messageSubject.next(message);
            });
        };
        this.stompClient.onWebSocketError = (error) => {
        };
        this.stompClient.onStompError = (frame) => {
        };
        this.active();
    }

}
