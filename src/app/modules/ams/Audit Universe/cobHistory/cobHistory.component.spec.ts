import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponents } from './cobHistory.component';


describe('ChartComponents', () => {
  let component: ChartComponents;
  let fixture: ComponentFixture<ChartComponents>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponents]
    });
    fixture = TestBed.createComponent(ChartComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
