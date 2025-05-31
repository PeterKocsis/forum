import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TopicsService } from '../../../services/topics.service';
import { ITopic } from '../../../interfaces/topic.interface';
import { LoggedinUserProviderService } from '../../../services/loggedin-user-provider.service';

@Component({
  selector: 'app-add-topic',
  imports: [ReactiveFormsModule],
  templateUrl: './add-topic.component.html',
  styleUrl: './add-topic.component.css'
})
export class AddTopicComponent {
  private loggedinUserService = inject(LoggedinUserProviderService);
  author = this.loggedinUserService.currentUser;
  topicsService = inject(TopicsService);
  form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });

  onReset() {
    this.form.reset();
  }

  onCreateTopic() {
    if (this.form.invalid) {
      return;
    }
    const newTopic: ITopic = {
      id: 0,
      author: this.author()!,
      body: this.form.controls.description.value!,
      title: this.form.controls.title.value!,
      comments: [],
    };
    this.topicsService.addTopic(newTopic).subscribe({
      error: (error: Error) => {
        console.error('Error adding topic:', error);
      },
      complete: () => {
        this.form.reset();
      }
    });
  }
}
