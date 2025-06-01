import { Component, computed, effect, inject, signal } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RolesService } from '../../services/roles.service';
import { TopicsService } from '../../services/topics.service';
import { LoggedinUserProviderService } from '../../services/loggedin-user-provider.service';
import { IComment } from '../../interfaces/comment.interface';
import { IAuthor } from '../../interfaces/author.interface';
import { PermissionsService } from '../../services/permissions.service';

function valuesAreEqual(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;
    }
    return { valuesAreNotEqual: true };
  };
}

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private topicsService = inject(TopicsService);
  private loggedinUserProviderService = inject(LoggedinUserProviderService);
  private permissionService = inject(PermissionsService);

  user = this.loggedinUserProviderService.currentUser;
  userDataChangeError = signal<string>('');
  userPasswordChangeError = signal<string>('');
  permissions = Object.values(this.permissionService.permissions);

  role = computed(() => {
    return this.rolesService
      .rolesData()
      .find((role) => role.id === this.user()?.role);
  });

  numberOfTopics = computed(() => {
    return this.topicsService
      .topicsData()
      .filter((topic) => topic.author.id === this.user()?.id).length;
  });

  numberOfComments = computed(() => {
    let count = 0;
    this.topicsService.topicsData().forEach((topic) => {
      topic.comments.forEach((comment) => {
        if (comment.author.id === this.user()?.id) {
          count++;
        }
        if (comment.comments && comment.comments.length > 0) {
          count += this.countNestedComments(comment.comments);
        }
      });
    });
    return count;
  });

  countNestedComments(comments: IComment[]): number {
    let count = 0;
    for (const comment of comments) {
      if (comment.author.id === this.user()?.id) {
        count++;
      }
      if (comment.comments && comment.comments.length > 0) {
        count += this.countNestedComments(comment.comments);
      }
    }
    return count;
  }

  // numberOfComments = computed(() => {
  //   let count = 0;
  //   this.topicsService.getTopicsWithFlattenedComments().forEach((topic) => {
  //     count += topic.comments.filter(
  //       (comment) => comment.comment.author.id === this.user()?.id
  //     ).length;
  //   });
  //   return count;
  // });

  hasPermission(permission: number): boolean {
    if (this.role() === undefined) return false;
    else {
      return !!(this.role()!.rights & permission);
    }
  }

  constructor() {
    effect(() => {
      this.userDataForm.controls.name.setValue(this.user()?.name ?? '');
      this.userDataForm.controls.email.setValue(this.user()?.email ?? '');
    });
  }

  get userNameIsInvalid() {
    return (
      this.userDataForm.controls.name.dirty &&
      this.userDataForm.controls.name.invalid &&
      this.userDataForm.controls.name.touched
    );
  }

  get emailIsInvalid() {
    return (
      this.userDataForm.controls.email.dirty &&
      this.userDataForm.controls.email.invalid &&
      this.userDataForm.controls.email.touched
    );
  }

  get passwordsIsInvalid() {
    return (
      this.changePasswordForm.dirty &&
      this.changePasswordForm.invalid &&
      this.changePasswordForm.touched
    );
  }

  userDataForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)],
      updateOn: 'change',
    }),
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      updateOn: 'change',
    }),
  });

  onUserDataChanges() {
    if (this.userDataForm.valid) {
      const modifiedUserData: IAuthor = {
        ...this.user()!,
        email: this.userDataForm.controls.email.value!,
        name: this.userDataForm.controls.name.value!,
      };
      this.usersService.updateUserData(modifiedUserData).subscribe({
        next: () => this.userDataChangeError.set(''),
        error: (error: Error) => {
          this.userDataChangeError.set(error.message);
        },
      });
    }
  }

  changePasswordForm = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(new RegExp('[0-9]')),
        Validators.pattern(new RegExp('[A-Z]')),
        Validators.pattern(new RegExp('[a-z]')),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(new RegExp('[0-9]')),
        Validators.pattern(new RegExp('[A-Z]')),
        Validators.pattern(new RegExp('[a-z]')),
      ]),
    },
    [valuesAreEqual('password', 'confirmPassword')]
  );

  onPasswordChange() {
    if (this.changePasswordForm.valid) {
      this.usersService
        .updateUserPassword(this.user()!.id, {
          password1: this.changePasswordForm.controls.password.value!,
          password2: this.changePasswordForm.controls.confirmPassword.value!,
        })
        .subscribe({
          next: () => {
            this.userPasswordChangeError.set('');
            this.changePasswordForm.reset();
          },
          error: (error: Error) =>
            this.userPasswordChangeError.set(error.message),
        });
    }
  }
}
