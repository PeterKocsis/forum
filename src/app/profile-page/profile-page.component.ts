import { Component, effect, inject, input, signal } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
  user = input.required<IUser>();
  userDataChangeError = signal<string>('');
  userPasswordChangeError = signal<string>('');

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
      const modifiedUserData: IUser = {
        ...this.user(),
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
        .updateUserPassword(this.user().id, {
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
