import { computed, inject, Injectable } from '@angular/core';
import { LoggedinUserProviderService } from './loggedin-user-provider.service';
import { RolesService } from './roles.service';
import { IComment } from '../interfaces/comment.interface';
import { ITopic } from '../interfaces/topic.interface';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private userService = inject(LoggedinUserProviderService);
  private roleService = inject(RolesService);
  user = this.userService.currentUser;

  readonly permissions = {
    readComments: { value: 1, name: 'Read Comments' },
    addDeleteComments: { value: 2, name: 'Add/Delete Comments' },
    addDeleteTopics: { value: 4, name: 'Add/Delete Topics' },
    deleteOthersCommentsTopics: {
      value: 8,
      name: 'Delete Others Comments/Topics',
    },
  };

  isAdmin(userRights: number): boolean {
    const adminRights = Object.values(this.permissions).reduce(
      (acc, perm) => acc | perm.value,
      0
    );
    return !!(userRights & adminRights)
  }

  constructor() {}

  canDeleteTopic(topic: ITopic) {
    return computed((): boolean => {
      const userRole = this.roleService.rolesData().find((role) => {
        return role.id === this.user()?.role;
      });
      if (userRole === undefined) return false;
      const hasRight = !!(userRole?.rights & this.permissions.addDeleteTopics.value); // Assuming 4 is the bitmask for delete rights
      const isAdmin = this.isAdmin(userRole.rights);
      const isAuthor = topic.author.id === this.user()?.id;
      return isAdmin || (hasRight && isAuthor);
    });
  }

  canAddTopic() {
    return computed((): boolean => {
      const userRole = this.roleService.rolesData().find((role) => {
        return role.id === this.user()?.role;
      });
      if (userRole === undefined) return false;
      const hasRight = !!(userRole?.rights & this.permissions.addDeleteTopics.value); // Assuming 4 is the bitmask for add topic rights
      return hasRight;
    });
  }

  canComment() {
    return computed((): boolean => {
      const userRole = this.roleService.rolesData().find((role) => {
        return role.id === this.user()?.role;
      });
      if (userRole === undefined) return false;
      const hasRight = !!(userRole?.rights & this.permissions.addDeleteComments.value); // Assuming 2 is the bitmask for comment rights
      return hasRight;
    });
  }

  canDeleteComment(comment: IComment) {
    return computed((): boolean => {
      const userRole = this.roleService.rolesData().find((role) => {
        return role.id === this.user()?.role;
      });
      if (userRole === undefined) return false;
      const hasRight = !!(userRole?.rights & this.permissions.addDeleteComments.value); // Assuming 4 is the bitmask for delete rights
      const isAdmin = this.isAdmin(userRole.rights);
      const isAuthor = comment.author.id === this.user()?.id;
      return isAdmin || (isAuthor && hasRight);
    });
  }
}
