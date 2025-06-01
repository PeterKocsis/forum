import { Component, computed, effect, inject, input } from '@angular/core';
import { ITopic } from '../../../interfaces/topic.interface';
import { CommentComponent } from '../comment/comment.component';
import { TopicsService } from '../../../services/topics.service';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { LoggedinUserProviderService } from '../../../services/loggedin-user-provider.service';
import { RolesService } from '../../../services/roles.service';
import { PermissionsService } from '../../../services/permissions.service';

@Component({
  selector: 'app-topic',
  imports: [CommentComponent, AddCommentComponent],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css',
})
export class TopicComponent {
  topic = input.required<ITopic>();
  topicsService = inject(TopicsService);
  loggedinUserProviderService = inject(LoggedinUserProviderService);
  user = this.loggedinUserProviderService.currentUser;
  permissionservice = inject(PermissionsService);
  roleService = inject(RolesService);
  showAddComment = false;

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
}
