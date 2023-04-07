import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }
  test() {
    this.httpClient.get('http://localhost:3030/set-session?token=MUdDN8A6gKjS5yMzdJgJpB9ZLD6tnQkfq1KDOzBU6Jh', {withCredentials: true}).subscribe(ressult => {

    })
  }

}
