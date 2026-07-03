import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerNavbar } from './manager-navbar';

describe('ManagerNavbar', () => {
  let component: ManagerNavbar;
  let fixture: ComponentFixture<ManagerNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
