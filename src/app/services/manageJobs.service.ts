// import { AccessSettings } from 'src/app/utils/access-settings';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { ProgramParams, SubmitParams, JobStatus, JobSchedule, progpramMap } from '@pages/Manege_Jobs/manage-jobs.modal';
import { AccessSettings } from '@/utils/access-settings';
import { ProgramDetails } from '@pages/Manege_Jobs/manage-jobs.modal';
// import { ProgramDetails } from 'src/app/manage-jobs/manage-jobs.modal';


@Injectable()
export class ManageJobsService {
  constructor(private http: HttpClient) { }
  getPrograms(progName: string, condition: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getProgramsList/' + progName + '/' + condition);
  }

  getProgramDetails(programId: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getProgramDetails/' + programId);
  }
  getJobDetails(jobId: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getJobDetails/' + jobId);
  }
  addProgram(prog: ProgramDetails) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'addProgram/', prog);
  }

  updateProgram(prog: ProgramDetails) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'updateProgram/', prog);
  }

  //See if you get program parameteres in getProgramdetails itself
  getProgramParameters(programId: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getProgramParameters/' + programId);
  }

  getProgramParametersForSubmit(programId: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getProgramParametersForSubmit/' + programId);
  }

  addProgramParameter(programParameter: ProgramParams) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'addProgramParameter/', programParameter);
  }

  deleteProgramParameters(programParameter: ProgramParams) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'deleteProgramParam/', programParameter);
  }

  updateProgramParameters(programParameter: ProgramParams) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'updateProgParam/', programParameter);
  }

  submitJob(params: SubmitParams) {
    const progpramMap = { progpramMap: params };
    console.log(progpramMap);
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'submitjob/', progpramMap);
  }

  scheduleJob(jobSchedule: JobSchedule) {

    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'scheduleJob/', jobSchedule);
  }

  getLookupValues(code: string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getLookupValues/' + code);
  }
  getStoredProcedures() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getAllProcedures/');
  }
  getStoredProceduresParameters(stroedprocedure : string) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getParametersForProcedure/' + stroedprocedure);
  }
  valdiateSQL(sql: string, type: string) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'validateInputSQL/', sql + '~' + type);
  }
  submitSQL(sql: string) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'submitInputSQL/', sql);
  }


  submitProcedure(params) {
    const progpramMap = { progpramMap: params };
    console.log(progpramMap);
 // var s:string=AccessSettings.JAVA_BACKEND_URL + 'submitProcedureParams/' ;
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'submitProcedureParams/', progpramMap );
  }

  viewJobStatus(jobStatus: JobStatus) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + 'viewJobStatus/', jobStatus);
  }

  errorHandler(error: HttpErrorResponse) {
    console.log('errorHandler', error.message);
    return Observable.throw(error.message || 'server Error');
  }
  getAllJobNames() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + 'getAllJobs');
  }

}
