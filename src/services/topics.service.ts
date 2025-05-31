import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ITopic } from '../interfaces/topic.interface';
import { catchError, map, Observable, pipe, tap, throwError } from 'rxjs';
import { IComment } from '../interfaces/comment.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class TopicsService {
  baseUrlForAll = 'http://localhost:8888/api/topics';
  baseUrl = 'http://localhost:8888/api/topic';
  private http = inject(HttpClient);
  private topics = signal<ITopic[]>([]);
  topicsData = this.topics.asReadonly();

  constructor() {}

  addCommentToTopic(topicId: number, comment: IComment): Observable<IComment> {
    return this.http
      .post<{
        data: IComment;
        message: string;
        status: number;
      }>(`${this.baseUrl}/${topicId}/comment/add`, { body: comment.body, author: comment.author })
      .pipe(
        map((response) => response.data),
        tap((comment) => {
          const updatedTopics = this.topicsData().map((topic) => {
            if (topic.id === topicId) {
              return {
                ...topic,
                comments: [comment, ...topic.comments],
              };
            }
            return topic;
          });
          this.topics.set(updatedTopics);
        }),
        catchError((errorResponse) => {
          console.error('Error adding comment:', errorResponse);
          return throwError(
            () => new Error('Unable to add comment. Please try again.')
          );
        })
      );
  }

  getTopics(): Observable<ITopic[]> {
    return this.http.get<{ data: ITopic[] }>(this.baseUrlForAll).pipe(
      map((response) => response.data),
      tap((data) => {
        this.topics.set(data);
      }),
      catchError((errorResponse) => {
        console.error(errorResponse);
        return throwError(
          () => new Error('Unable to fetch topics data. Please try again.')
        );
      })
    );
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap((response) => {
        console.log('Topic deleted successfully:', response);
        const updatedTopics = this.topicsData().filter(
          (topic) => topic.id !== id
        );
        this.topics.set(updatedTopics);
      })
    );
  }
}
