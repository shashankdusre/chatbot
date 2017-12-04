import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Message {
  constructor(public content:string,public sentBy:string){}
}

@Injectable()
export class ChatService {
  readonly token = environment.dialogflow.demoChat;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([])

  constructor() { }

  //Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }

  //Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg,'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
               .then(res => {
                 const speech = res.result.fulfillment.speech;
                 const demoMessage = new Message(speech,'demo');
                 this.update(demoMessage);
               })
  }
  
  // talk () {
  //   this.client.textRequest('who are you!')
  //      .then(res => console.log(res));
  // }
}