import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockDetailsDialogComponent } from './block-details-dialog.component';

describe('BlockDetailsDialogComponent', () => {
  let component: BlockDetailsDialogComponent;
  let fixture: ComponentFixture<BlockDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
