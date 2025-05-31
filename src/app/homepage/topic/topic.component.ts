import { Component, computed, effect, inject, input } from '@angular/core';
import { ITopic } from '../../../interfaces/topic.interface';
import { CommentComponent } from '../comment/comment.component';
import { TopicsService } from '../../../services/topics.service';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { TopicProviderService } from './topic-provider.service';
import { LoggedinUserProviderService } from '../../../services/loggedin-user-provider.service';
import { RolesService } from '../../../services/roles.service';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
  selector: 'app-topic',
  imports: [CommentComponent, AddCommentComponent],
  templateUrl: './topic.component.html',
  providers: [TopicProviderService],
  styleUrl: './topic.component.css',
})
export class TopicComponent {
  topic = input.required<ITopic>();
  topicsService = inject(TopicsService);
  topicProviderService = inject(TopicProviderService);
  loggedinUserProviderService = inject(LoggedinUserProviderService);
  user = this.loggedinUserProviderService.currentUser;
  permissionservice = inject(PermissionsService);
  roleService = inject(RolesService);
  showAddComment = false;

  constructor() {
    effect(() => {
      this.topicProviderService.topicId = this.topic().id;
    });
  }

  onAddComment() {
    this.showAddComment = true;
  }
  onDeleteTopic() {
    if(this.permissionservice.canDeleteTopic(this.topic())()) {
      this.topicsService.deleteTopic(this.topic().id).subscribe({
        error: (error: Error) => {
          console.error('Error deleting topic:', error);
        },
      });
    }
  }

  // canDeleteTopic = computed((): boolean => {
  //   const userRole = this.roleService.rolesData().find((role) => {
  //     return role.id === this.user()?.role;
  //   })
  //   if(userRole === undefined) return false;
  //   const hasRight = !!(userRole?.rights & 4); // Assuming 4 is the bitmask for delete rights
  //   const isAdmin = userRole.rights === 15;
  //   const isAuthor = this.topic()?.author.id === this.user()?.id;
  //   return isAdmin || (hasRight && isAuthor);
  // });

  // canComment = computed((): boolean => {
  //   const userRole = this.roleService.rolesData().find((role) => {
  //     return role.id === this.user()?.role;
  //   });
  //   if (userRole === undefined) return false;
  //   const hasRight = !!(userRole?.rights & 2); // Assuming 2 is the bitmask for comment rights
  //   return hasRight;
  // });

  // canDeleteComment = computed((): boolean => {
  //   const userRole = this.roleService.rolesData().find((role) => {
  //     return role.id === this.user()?.role;
  //   });
  //   if (userRole === undefined) return false;
  //   const hasRight = !!(userRole?.rights & 2); // Assuming 4 is the bitmask for delete rights
  //   const isAdmin = userRole.rights === 15;
  //   const isAuthor = this.topic()?.author.id === this.user()?.id;
  //   return isAdmin || (isAuthor && hasRight);
  // });
}
