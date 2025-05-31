import { Injectable, signal } from '@angular/core';

@Injectable()
export class TopicProviderService {

  private _topicId: number | null = null;
  get topicId(): number | null {
    return this._topicId;
  }

  set topicId(value: number | null) {
    this._topicId = value;
  }

  private _showAddComment = signal<boolean>(false);
  showAddComment = this._showAddComment.asReadonly();
  setShowAddComment(value: boolean): void {
    this._showAddComment.set(value);
  }

  constructor() { }
}
