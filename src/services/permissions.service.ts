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

  readonly permissions = [
    { roleName: 'Read Comments', permissionValue: 1 },
    { roleName: 'Add/Delete Comments', permissionValue: 2 },
    { roleName: 'Add/Delete Topics', permissionValue: 4 },
    { roleName: 'Delete Others Comments/Topics', permissionValue: 8 },
  ];

  constructor() {}

  canDeleteTopic(topic: ITopic) {
    return computed((): boolean => {
      const userRole = this.roleService.rolesData().find((role) => {
        return role.id === this.user()?.role;
      });
      if (userRole === undefined) return false;
      const hasRight = !!(userRole?.rights & 4); // Assuming 4 is the bitmask for delete rights
      const isAdmin = userRole.rights === 15;
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
      const hasRight = !!(userRole?.rights & 4); // Assuming 4 is the bitmask for add topic rights
      return hasRight;
    });
  }

  canComment() {
    return computed((): boolean => {
      const userRole = this.roleService.rolesData().find((role) => {
        return role.id === this.user()?.role;
      });
      if (userRole === undefined) return false;
      const hasRight = !!(userRole?.rights & 2); // Assuming 2 is the bitmask for comment rights
      return hasRight;
    });
  }

  canDeleteComment(comment: IComment) {
    return computed((): boolean => {
      const userRole = this.roleService.rolesData().find((role) => {
        return role.id === this.user()?.role;
      });
      if (userRole === undefined) return false;
      const hasRight = !!(userRole?.rights & 2); // Assuming 4 is the bitmask for delete rights
      const isAdmin = userRole.rights === 15;
      const isAuthor = comment.author.id === this.user()?.id;
      return isAdmin || (isAuthor && hasRight);
    });
  }
}
