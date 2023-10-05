import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AnnualPlanService } from 'src/app/services/annual-plan/annual-plan.service';
import { AuditScheduleService } from 'src/app/services/audit-schedule/audit-schedule.service';
import { TeamMemberService } from 'src/app/services/team-member-service/team-memeber.service';
import { AnnualPlanDTO } from 'src/app/views/models/annualPlan';
import { AuditScheduleDTO } from 'src/app/views/models/auditSchedule';
import { TeamMemberDTO } from 'src/app/views/models/team-member';
import { AssignMembersComponent } from './../assign-members/assign-members.component';

@Component({
  selector: 'newAuditSchedule',
  templateUrl: './newAuditSchedule.component.html',
  styleUrls: ['./newAuditSchedule.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class NewAuditScheduleComponent implements OnDestroy {
  public annualPlans: AnnualPlanDTO[] = [];

  assignMembersDialogRef: DynamicDialogRef;
  teamMembers: TeamMemberDTO[] = [];
  savedAssignmembers: TeamMemberDTO[] = [];


  public scheduleInfo: AuditScheduleDTO = new AuditScheduleDTO();

  private subscriptions: Subscription[] = [];
  public dropdownOptions = ['1', '2', '3', '4'];
  public selectedDropdown: string;

  update: boolean = false;
  newDiv: boolean = true;

  annualPlan: AnnualPlanDTO;
  auditSchedule: AuditScheduleDTO;

  constructor(
    private messageService: MessageService,
    private auditScheduleService: AuditScheduleService,
    private annualPlanService: AnnualPlanService,
    private teamMemeberService: TeamMemberService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    public dialogService: DialogService,
    private datePipe: DatePipe,
    private cdref: ChangeDetectorRef

  ) { }

  ngOnInit() {
    if (this.config.data?.annualPlan) {
      this.annualPlan = this.config.data.annualPlan;
    }
    if (this.config.data?.auditSchedule) {
      this.scheduleInfo = {
        ...this.config.data.auditSchedule,
        startOn: this.datePipe.transform(this.config.data.auditSchedule.startOn, 'MM/dd/yyyy'),
        endOn: this.datePipe.transform(this.config.data.auditSchedule.endOn, 'MM/dd/yyyy')
      };
      this.selectedDropdown = this.config.data.auditSchedule.quarter.toString();
      this.update = true;
      this.newDiv = false;
    }
  }

  submitAuditSchedule(auditableAreaForm: NgForm): void {
    if (this.update) {
      this.updateAuditSchedule(auditableAreaForm);
    } else {
      this.addAuditSchedule(auditableAreaForm);
    }
  }

  addAuditSchedule(addDivForm: NgForm): void {
    const auditSchedule: AuditScheduleDTO = addDivForm.value;
    auditSchedule.annualPlan = this.annualPlan;
    this.subscriptions.push(
      this.annualPlanService.addToSchedule(auditSchedule).subscribe(
        (response: any) => {
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
    this.ref.close();
  }

  updateAuditSchedule(updateDivForm: NgForm): void {
    const auditSchedule: AuditScheduleDTO = updateDivForm.value;
    auditSchedule.teamMembers =  this.savedAssignmembers;
    auditSchedule.id = this.scheduleInfo.id;
    console.log("kkkk",auditSchedule);
    
    this.subscriptions.push(
      this.teamMemeberService
        .addTeamMember(auditSchedule)
        .subscribe((response: any) => {
          this.messageService.clear();
          this.ref.close(response);
        })
    );
  }

  AssignMembers() {
    this.assignMembersDialogRef = this.dialogService.open(AssignMembersComponent, {
      header: 'Assign members and their roles',
      width: '60%',
      data: { scheduleInfo: this.scheduleInfo, savedAssignmembers: this.savedAssignmembers },
    });
    this.assignMembersDialogRef.onClose.subscribe((teamMembers) => {
      if (teamMembers) {
        this.savedAssignmembers = teamMembers;
        this.cdref.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  closeDialog(): void {
    this.ref.close();
  }
}
