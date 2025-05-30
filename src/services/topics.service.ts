import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ITopic } from '../interfaces/topic.interface';
import { catchError, map, Observable, pipe, tap, throwError } from 'rxjs';
import { IComment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class TopicsService {
  baseUrl = 'http://localhost:8888/api/topics';
  private http = inject(HttpClient);
  private topics = signal<ITopic[]>([]);
  topicsData = this.topics.asReadonly();

  constructor() {}

  getTopics(): Observable<ITopic[]> {
    return this.http.get<{ data: ITopic[] }>(this.baseUrl).pipe(
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

  getTopicsWithFlattenedComments = computed(() => {
    return this.topicsData().map((topic) => {
      const flattenedComments = this.walkComments(topic.comments, 0);
      return {
        ...topic,
        comments: flattenedComments,
      };
    });
  });

  walkComments(
    comments: IComment[],
    depth = 0
  ): { depth: number; comment: IComment }[] {
    const result: { depth: number; comment: IComment }[] = [];

    for (const comment of comments) {
      result.push({ depth, comment });

      if (comment.comments && comment.comments.length > 0) {
        result.push(...this.walkComments(comment.comments, depth + 1));
      }
    }

    return result;
  }
}
