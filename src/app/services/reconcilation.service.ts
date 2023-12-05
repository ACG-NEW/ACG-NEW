import { AccessSettings } from '@/utils/access-settings';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RandomQuery } from '@modules/modal/randomQuery.modal';
import { transctionClass } from '@modules/modal/transaction.modal';
import { Observable } from 'rxjs';
import { RunReportClass } from '../../app/modules/modal/runReport.modal';
@Injectable({
  providedIn: 'root'
})
export class ReconcilationService {

  constructor(private http: HttpClient) { }
  fileUpload(userId, formData) {
    //console.log(formData);
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + '/fileUpload/upload?userId=' + userId + '&type=PSP', formData, {
        reportProgress: true,
        observe: 'events'
      });
  }
  getObjectsList(userId, name) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + '/reports/getObjects?userId=' + userId + '&objectName=' + name);
  }
  getObjectsListFCC(name) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + '/objectRegistration/search?name=' + name);
  }
  // objectRegistration/search?name=FCC_Duplicate_Records
  getFccProcedure(body) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + '/objectRegistration/objectDetails', body);
  }
  // reports/getObjects/1331?objectName=FCC_Duplicate_Records
  // reports/getObjects/1331?objectName=

  fetchObjectDetails(body) {
    // //console.log(formData);
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + '/reports/getObjectDetails', body);
  }
  runReport(runRep: RunReportClass): Observable<RunReportClass[]> {
    // console.log(runRep);
    return this.http
      .post<RunReportClass[]>(AccessSettings.JAVA_BACKEND_URL + '/reports/runReport', runRep);
  }

  // getFCC(userId) {
  //   return this.http
  //     .get(AccessSettings.JAVA_BACKEND_URL + '/fcc/showFiles/' + userId);
  // }
  getFCC(userId) {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + '/fcc/showFiles?userId=' + userId);
  }
  processFCC(userId, body) {
    // console.log('from process'+ body);
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + '/fcc/processFiles?userId=' + userId, body);
  }
  deleteFCC(userId, body) {
    // console.log('from delete' + body);
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + '/fcc/processFiles?userId=' + userId, body);
  }
  getRandomMatchLOVS() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + '/randomMatch/getLovs');
  }

  reconPSPTransctions(reClS: RandomQuery): Observable<RandomQuery[]> {
    return this.http
      .post<RandomQuery[]>(AccessSettings.JAVA_BACKEND_URL + '/reconTransaction/pspTransactions', reClS);
  }
  reconEZETransctions(reClS: RandomQuery): Observable<RandomQuery[]> {
    return this.http
      .post<RandomQuery[]>(AccessSettings.JAVA_BACKEND_URL + '/reconTransaction/ezeTransactions', reClS);
  }

  getpspUnreconcileRecords(reClS: RandomQuery): Observable<RandomQuery[]> {
    return this.http
      .post<RandomQuery[]>(AccessSettings.JAVA_BACKEND_URL + '/reconTransaction/getPSPRecordsToUnreconcile', reClS);
  }


  getezeUnreconcileRecords(reClS: RandomQuery): Observable<RandomQuery[]> {
    return this.http
      .post<RandomQuery[]>(AccessSettings.JAVA_BACKEND_URL + '/reconTransaction/getEZERecordsToUnreconcile', reClS);
  }
  reconcileRecords(body) {
    return this.http
      .post<RandomQuery[]>(AccessSettings.JAVA_BACKEND_URL + '/reconTransaction/reconcileRecords', body);
  }
  unreconcileRecords(body) {
    return this.http
      .post<RandomQuery[]>(AccessSettings.JAVA_BACKEND_URL + '/reconTransaction/unreconcileRecords', body);
  }
  matchRecords(body) {
    return this.http
      .post<RandomQuery[]>(AccessSettings.JAVA_BACKEND_URL + '/reconTransaction/matchRecords', body);
  }
  undoMatching(body) {
    return this.http
      .post<RandomQuery[]>(AccessSettings.JAVA_BACKEND_URL + '/reconTransaction/undoMatching', body);
  }
  fetchComments(role, body) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + '/comments/findComments?role=' + role, body);
  }

  saveUpdateComments(role, body) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + '/comments/saveComments?role=' + role, body);
  }
  // deleteComments(role, body) {
  //   return this.http
  //     .post(AccessSettings.JAVA_BACKEND_URL + '/comments/deleteComments?role=' + role, body);
  // }


  
  getBatchId(batchId: string, pspSubAccId: string): Observable<[]> {
    return this.http.get<[]>(AccessSettings.JAVA_BACKEND_URL + '/createTransaction/getBatchId?pspSubAccId=' + pspSubAccId + '&batchId=' + batchId)
  }

  getTransaction(pspId: string, role: string, userId: string, headerId: string): Observable<[]> {
    return this.http.get<[]>(AccessSettings.JAVA_BACKEND_URL + '/createTransaction/getTransaction?pspId=' + pspId + '&role=' + role + '&userId=' + userId + '&headerId=' + headerId)
  }
  saveTransaction(transcls: transctionClass, userId): Observable<transctionClass[]> {
    return this.http
      .post<transctionClass[]>(AccessSettings.JAVA_BACKEND_URL + 'createTransaction/saveTransaction?userId=' + userId, transcls);
  }
  getTransactionList(pspId: string, role: string, userId: string, headerId: string): Observable<[]> {
    return this.http.get<[]>(AccessSettings.JAVA_BACKEND_URL + '/createTransaction/getTransaction?pspId=' + pspId + '&role=' + role + '&userId=' + userId + '&headerId=')
  }
  getSubaccounts(body) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + '/reports/getPspLOVDetails', body);
  }
  getAllList(body) {
    return this.http
      .post(AccessSettings.JAVA_BACKEND_URL + '/randomMatch/openDataWindow', body);
  }
  getProfileValue(profileName: string, levelName: string, levelValue: string): Observable<[]> {
    return this.http.get<[]>(AccessSettings.JAVA_BACKEND_URL + '/recon/getProfileValue?profileName=' + profileName + '&levelName=' + levelName + '&levelValue=' + levelValue)
  }
}
//comments/findComments?role=RESOLUTION USER FINANCE
// /recon/getProfileValue?profileName=NUM_OF_RECORDS_ON_RECON_SCREEN&levelName=Application&levelValue=Recon
