import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTaskForm } from './manager-task-form';

describe('ManagerTaskForm', () => {
  let component: ManagerTaskForm;
  let fixture: ComponentFixture<ManagerTaskForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerTaskForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerTaskForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
