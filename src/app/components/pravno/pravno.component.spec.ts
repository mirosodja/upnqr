import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PravnoComponent } from './pravno.component';

describe('PravnoComponent', () => {
  let component: PravnoComponent;
  let fixture: ComponentFixture<PravnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PravnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PravnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
