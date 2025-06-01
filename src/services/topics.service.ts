import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ITopic } from '../interfaces/topic.interface';
import { catchError, find, map, Observable, pipe, tap, throwError } from 'rxjs';
import { IComment } from '../interfaces/comment.interface';

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

  addTopic(newTopic: ITopic) {
    return this.http
      .post<{
        data: ITopic;
        message: string;
        status: number;
      }>(`${this.baseUrl}/add`, newTopic)
      .pipe(
        map((response) => response.data),
        tap((topic) => {
          this.topics.set([topic, ...this.topicsData()]);
        }),
        catchError((errorResponse) => {
          console.error('Error adding topic:', errorResponse);
          return throwError(
            () => new Error('Unable to add topic. Please try again.')
          );
        })
      );
  }

  addCommentToComment(
    topicId: number,
    parentCommentId: number,
    comment: IComment
  ) {
    return this.http
      .post<{
        data: IComment;
        message: string;
        status: number;
      }>(`${this.baseUrl}/${topicId}/comment/${parentCommentId}/add`, {
        body: comment.body,
        author: comment.author,
      })
      .pipe(
        map((response) => response.data),
        tap((comment) => {
          const updatedTopics = this.topicsData().map((topic) => {
            if (topic.id === topicId) {
              const parentComment = this.findCommentById(
                topic.comments,
                parentCommentId
              );
              if (parentComment) {
                parentComment.comments = [...parentComment.comments, comment];
              }
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

  addCommentToTopic(topicId: number, comment: IComment): Observable<IComment> {
    return this.http
      .post<{
        data: IComment;
        message: string;
        status: number;
      }>(`${this.baseUrl}/${topicId}/comment/add`, {
        body: comment.body,
        author: comment.author,
      })
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

  deleteComment(topicId: number, commentId: number): Observable<any> {
    return this.http
      .delete<{ message: string }>(
        `${this.baseUrl}/${topicId}/comment/${commentId}`
      )
      .pipe(
        tap((response) => {
          console.log('Comment deleted successfully:', response);
          const updatedTopics = this.topicsData().map((topic) => {
            if (topic.id === topicId) {
              const targetComment = this.findCommentById(
                topic.comments,
                commentId
              );
              if (targetComment) {
                targetComment.removed = true;
              }
            }
            return { ...topic };
          });
          this.topics.set(updatedTopics);
        })
      );
  }

  findCommentById(
    comments: IComment[],
    commentId: number
  ): IComment | undefined {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      const foundComment = this.findCommentById(comment.comments, commentId);
      if (foundComment) {
        return foundComment;
      }
    }
    return undefined;
  }
}
