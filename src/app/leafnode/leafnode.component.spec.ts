import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafnodeComponent } from './leafnode.component';

describe('LeafnodeComponent', () => {
  let component: LeafnodeComponent;
  let fixture: ComponentFixture<LeafnodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeafnodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeafnodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
