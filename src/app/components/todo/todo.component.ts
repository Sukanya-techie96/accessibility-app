import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="container py-4 py-md-5" aria-labelledby="todo-heading">
      <div class="row g-4 g-lg-5 align-items-start">
        
        <!-- LEFT COLUMN: Add Task Form -->
        <div class="col-12 col-md-5">
          <h2 id="todo-heading" class="h3 fw-bold mb-4">Add a New Task</h2>
          
          <form [formGroup]="todoForm" (ngSubmit)="addTask()" novalidate>
            <div class="mb-3">
              <label for="task-title" class="form-label text-secondary small fw-semibold">
                Task Description <span class="text-danger" aria-hidden="true">*</span>
              </label>
              <input 
                id="task-title" 
                type="text" 
                class="form-control border-secondary-subtle" 
                [class.is-invalid]="isInvalid()"
                formControlName="title"
                placeholder="e.g. Frame new art prints"
                [attr.aria-invalid]="isInvalid()"
                [attr.aria-describedby]="isInvalid() ? 'task-error' : null" />
              @if (isInvalid()) {
                <div id="task-error" class="invalid-feedback fw-bold" role="alert">Task description cannot be empty.</div>
              }
            </div>

            <button type="submit" class="btn btn-dark px-4 fw-bold">
              Add Task
            </button>
          </form>
        </div>

        <!-- RIGHT COLUMN: Task List & Status -->
        <div class="col-12 col-md-7 ps-md-4 ps-lg-5">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="h3 fw-bold m-0">Your Tasks</h2>
            <span class="badge bg-secondary text-white fs-6 fw-normal px-3 py-2">
              {{ completedCount() }} / {{ todos().length }} Completed
            </span>
          </div>

          <div role="region" aria-live="polite" class="task-list">
            @for (todo of todos(); track todo.id) {
              <div class="card border-secondary-subtle mb-3 shadow-sm">
                <div class="card-body d-flex align-items-center justify-content-between p-3">
                  
                  <div class="form-check m-0 d-flex align-items-center gap-2">
                    <input 
                      type="checkbox" 
                      class="form-check-input border-secondary-subtle" 
                      [id]="'todo-' + todo.id"
                      [checked]="todo.completed" 
                      (change)="toggleTask(todo.id)" />
                    <label 
                      class="form-check-label text-dark cursor-pointer fw-semibold" 
                      [id]="'label-' + todo.id"
                      [for]="'todo-' + todo.id"
                      [class.text-decoration-line-through]="todo.completed"
                      [class.text-muted]="todo.completed">
                      {{ todo.title }}
                    </label>
                  </div>

                  <button 
                    type="button" 
                    class="btn btn-outline-danger btn-sm p-1 d-flex align-items-center justify-content-center"
                    [attr.aria-label]="'Delete task: ' + todo.title"
                    (click)="deleteTask(todo.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>

                </div>
              </div>
            } @empty {
              <div class="card border-secondary-subtle p-4 text-center">
                <p class="text-secondary m-0">No tasks remaining. Add your first task above!</p>
              </div>
            }
          </div>
        </div>

      </div>
    </section>
  `
})
export class TodoComponent {
  private fb = inject(FormBuilder);
  private announcer = inject(LiveAnnouncer);

  todoForm = this.fb.group({
    title: ['', [Validators.required]]
  });

  todos = signal<TodoItem[]>([
    { id: '1', title: 'Review Cyberpunk art submissions', completed: false },
    { id: '2', title: 'Prepare shipping for Neon Odyssey orders', completed: true }
  ]);

  completedCount() {
    return this.todos().filter(t => t.completed).length;
  }

  isInvalid(): boolean {
    const ctrl = this.todoForm.get('title');
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  addTask() {
    if (this.todoForm.valid) {
      const taskTitle = this.todoForm.value.title!.trim();
      const newTask: TodoItem = {
        id: Date.now().toString(),
        title: taskTitle,
        completed: false
      };
      this.todos.update(list => [newTask, ...list]);
      this.todoForm.reset();
      this.announcer.announce(`Added task: ${taskTitle}`, 'assertive');
    } else {
      this.todoForm.markAllAsTouched();
    }
  }

  toggleTask(id: string) {
    this.todos.update(list =>
      list.map(task => {
        if (task.id === id) {
          const updatedState = !task.completed;
          this.announcer.announce(`Marked ${task.title} as ${updatedState ? 'completed' : 'incomplete'}`, 'polite');
          return { ...task, completed: updatedState };
        }
        return task;
      })
    );
  }

  deleteTask(id: string) {
    const taskToDelete = this.todos().find(t => t.id === id);
    if (taskToDelete) {
      this.todos.update(list => list.filter(t => t.id !== id));
      this.announcer.announce(`Deleted task: ${taskToDelete.title}`, 'polite');
    }
  }
}   