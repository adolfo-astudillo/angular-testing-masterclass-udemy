import { waitForAsync, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';
import { HomeComponent } from './home.component';
import { CoursesService } from '../services/courses.service';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';


describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const getCoursesByCategory = (category: string) => setupCourses().filter(course => course.category == category);

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesService = TestBed.inject(CoursesService);
    });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(getCoursesByCategory('BEGINNER')));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
    const label = tabs[0].query(By.css('.mdc-tab__text-label'));
    expect(label.nativeElement.textContent).toBe('Beginners', "Tab is not 'Beginners'");
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(getCoursesByCategory('ADVANCED')));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
    const label = tabs[0].query(By.css('.mdc-tab__text-label'));
    expect(label.nativeElement.textContent).toBe('Advanced', "Tab is not 'Advanced'");
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
    const labelBeginner = tabs[0].query(By.css('.mdc-tab__text-label'));
    expect(labelBeginner.nativeElement.textContent).toBe('Beginners', "Tab is not 'Beginners'");
    const labelAdvanced = tabs[1].query(By.css('.mdc-tab__text-label'));
    expect(labelAdvanced.nativeElement.textContent).toBe('Advanced', "Tab is not 'Advanced'");
  });


  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    const courses = setupCourses();
    coursesService.findAllCourses.and.returnValue(of(courses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    click(tabs[1]);
    fixture.detectChanges();
    flush();
    const cardTitles = el.queryAll(By.css('.mat-mdc-tab-body-active mat-card-title'));
    const titles = cardTitles.map(cardTitle => cardTitle.nativeElement.textContent);
    const advancedCoursesDescriptions = Object.values(courses).filter(course => course.category == 'ADVANCED').map(course => course.titles.description);
    expect(titles).toEqual(advancedCoursesDescriptions);
  }));

  it("should display advanced courses when tab clicked - waitForAsync", waitForAsync(async () => {
    const courses = setupCourses();
    coursesService.findAllCourses.and.returnValue(of(courses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-mdc-tab'));
    click(tabs[1]);
    fixture.detectChanges();
    await fixture.whenStable();
    const cardTitles = el.queryAll(By.css('.mat-mdc-tab-body-active mat-card-title'));
    const titles = cardTitles.map(cardTitle => cardTitle.nativeElement.textContent);
    const advancedCoursesDescriptions = Object.values(courses).filter(course => course.category == 'ADVANCED').map(course => course.titles.description);
    expect(titles).toEqual(advancedCoursesDescriptions);
  }));
});


